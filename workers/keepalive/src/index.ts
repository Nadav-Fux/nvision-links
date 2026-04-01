/**
 * nVision Keepalive Worker
 *
 * Prevents Supabase free-tier pause by performing real DB operations.
 * Runs every 2 hours (12 triggers/day). Uses KV to track state and
 * ensure each source type fires 2+ times per day with random spacing.
 *
 * Sources handled:
 *   1. heartbeat — INSERT analytics_events + UPDATE site_config + SELECT links
 *   2. image     — fetch random image URL, INSERT into analytics_events + SELECT
 */

interface Env {
  STATE: KVNamespace;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

interface SourceState {
  lastRun: number;   // epoch ms
  runCount: number;   // runs in current 24h window
  windowStart: number; // epoch ms of current 24h window
}

// ── Config ──────────────────────────────────────────────────────
const SOURCES = ['heartbeat', 'image'] as const;
type SourceType = typeof SOURCES[number];

// Must run if this many ms have passed since last run (safety net)
const MUST_RUN_AFTER_MS = 14 * 60 * 60 * 1000; // 14 hours
// Eligible to randomly run after this many ms
const ELIGIBLE_AFTER_MS = 8 * 60 * 60 * 1000;  // 8 hours
// Random chance when eligible (25%)
const RANDOM_CHANCE = 0.25;
// Minimum gap between ANY two sources
const MIN_GAP_BETWEEN_SOURCES_MS = 3 * 60 * 60 * 1000; // 3 hours

// ── Supabase helpers ────────────────────────────────────────────
async function supabasePost(env: Env, table: string, body: Record<string, unknown>) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, status: res.status };
}

async function supabasePatch(env: Env, table: string, query: string, body: Record<string, unknown>) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/${table}?${query}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, status: res.status };
}

async function supabaseGet(env: Env, table: string, query: string) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: {
      'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });
  return { ok: res.ok, status: res.status, data: await res.json() };
}

// ── Source actions ───────────────────────────────────────────────

/** Heartbeat: 2 writes + 1 search query */
async function doHeartbeat(env: Env): Promise<string> {
  const now = new Date().toISOString();

  // Write 1: INSERT analytics event
  const w1 = await supabasePost(env, 'analytics_events', {
    event_type: 'keepalive_heartbeat',
    event_target: 'cf-worker',
    page_path: `/keepalive/heartbeat/${Date.now()}`,
  });

  // Write 2: touch site_config updated_at
  const w2 = await supabasePatch(env, 'site_config', 'id=eq.1', {
    updated_at: now,
  });

  // Search: query links with a filter
  const q = await supabaseGet(env, 'links', 'select=id,title&is_visible=eq.true&limit=5&order=created_at.desc');

  return `heartbeat: w1=${w1.status} w2=${w2.status} q=${q.status}(${Array.isArray(q.data) ? q.data.length : 0} rows)`;
}

/** Image: fetch random image metadata, write to DB */
async function doImage(env: Env): Promise<string> {
  // Use picsum.photos for a random image (no API key needed)
  let imageUrl = `https://picsum.photos/seed/${Date.now()}/800/600`;
  let imageInfo = 'picsum-random';

  try {
    // Get the actual redirect URL (which contains the real image)
    const imgRes = await fetch(imageUrl, { redirect: 'manual' });
    if (imgRes.headers.has('location')) {
      imageUrl = imgRes.headers.get('location') || imageUrl;
    }
    imageInfo = `picsum-${imageUrl.split('/id/')[1]?.split('/')[0] || 'unknown'}`;
  } catch {
    // Fallback — still write something
  }

  // Write 1: INSERT image event
  const w1 = await supabasePost(env, 'analytics_events', {
    event_type: 'keepalive_image',
    event_target: imageUrl,
    page_path: `/keepalive/image/${imageInfo}`,
  });

  // Write 2: INSERT a second event with metadata
  const w2 = await supabasePost(env, 'analytics_events', {
    event_type: 'keepalive_image_meta',
    event_target: `cf-worker|${imageInfo}|${new Date().toISOString()}`,
    page_path: '/keepalive/image/meta',
  });

  // Search: query sections
  const q = await supabaseGet(env, 'sections', 'select=id,title&is_visible=eq.true');

  return `image: w1=${w1.status} w2=${w2.status} q=${q.status}(${Array.isArray(q.data) ? q.data.length : 0} rows)`;
}

// ── State management ────────────────────────────────────────────

async function getState(kv: KVNamespace, source: SourceType): Promise<SourceState> {
  const raw = await kv.get(`keepalive:${source}`, 'json');
  if (raw) return raw as SourceState;
  return { lastRun: 0, runCount: 0, windowStart: Date.now() };
}

async function setState(kv: KVNamespace, source: SourceType, state: SourceState) {
  await kv.put(`keepalive:${source}`, JSON.stringify(state));
}

async function getLastRunAnySource(kv: KVNamespace): Promise<number> {
  let latest = 0;
  for (const src of SOURCES) {
    const s = await getState(kv, src);
    if (s.lastRun > latest) latest = s.lastRun;
  }
  return latest;
}

// ── Scheduling logic ────────────────────────────────────────────

function shouldRun(state: SourceState, now: number): boolean {
  const elapsed = now - state.lastRun;

  // Never ran → must run
  if (state.lastRun === 0) return true;

  // Overdue → must run (safety net for 2/day guarantee)
  if (elapsed >= MUST_RUN_AFTER_MS) return true;

  // Eligible window → random chance
  if (elapsed >= ELIGIBLE_AFTER_MS) {
    const rand = crypto.getRandomValues(new Uint8Array(1))[0] / 255;
    return rand < RANDOM_CHANCE;
  }

  // Too soon → skip
  return false;
}

// ── Main handler ────────────────────────────────────────────────

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    const now = Date.now();
    const results: string[] = [];

    // Check minimum gap between any sources
    const lastAnyRun = await getLastRunAnySource(env.STATE);
    if (lastAnyRun > 0 && (now - lastAnyRun) < MIN_GAP_BETWEEN_SOURCES_MS) {
      // Too close to another source's run — but still check MUST_RUN safety net
      let mustRunAny = false;
      for (const src of SOURCES) {
        const state = await getState(env.STATE, src);
        if (state.lastRun === 0 || (now - state.lastRun) >= MUST_RUN_AFTER_MS) {
          mustRunAny = true;
          break;
        }
      }
      if (!mustRunAny) {
        console.log(`[keepalive] Skipping — last run was ${Math.round((now - lastAnyRun) / 60000)}min ago (min gap: ${MIN_GAP_BETWEEN_SOURCES_MS / 60000}min)`);
        return;
      }
    }

    // Shuffle sources so we don't always check heartbeat first
    const shuffled = [...SOURCES].sort(() => crypto.getRandomValues(new Uint8Array(1))[0] - 128);

    for (const source of shuffled) {
      const state = await getState(env.STATE, source);

      // Reset 24h window if needed
      if (now - state.windowStart > 24 * 60 * 60 * 1000) {
        state.runCount = 0;
        state.windowStart = now;
      }

      if (!shouldRun(state, now)) {
        results.push(`${source}: skipped (last run ${Math.round((now - state.lastRun) / 60000)}min ago)`);
        continue;
      }

      try {
        let result: string;
        if (source === 'heartbeat') {
          result = await doHeartbeat(env);
        } else {
          result = await doImage(env);
        }

        state.lastRun = now;
        state.runCount++;
        await setState(env.STATE, source, state);
        results.push(`${source}: OK — ${result}`);

        // Only run one source per trigger to maintain spacing
        break;
      } catch (err) {
        results.push(`${source}: ERROR — ${err}`);
      }
    }

    console.log(`[keepalive] ${new Date().toISOString()} | ${results.join(' | ')}`);
  },

  // HTTP endpoint for manual trigger / health check
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/status') {
      const states: Record<string, unknown> = {};
      for (const src of SOURCES) {
        const s = await getState(env.STATE, src);
        states[src] = {
          lastRun: s.lastRun ? new Date(s.lastRun).toISOString() : 'never',
          minutesAgo: s.lastRun ? Math.round((Date.now() - s.lastRun) / 60000) : null,
          runCount24h: s.runCount,
        };
      }
      return Response.json({ ok: true, sources: states, now: new Date().toISOString() });
    }

    if (url.pathname === '/trigger' && request.method === 'POST') {
      const source = url.searchParams.get('source') as SourceType || 'heartbeat';
      try {
        let result: string;
        if (source === 'heartbeat') {
          result = await doHeartbeat(env);
        } else {
          result = await doImage(env);
        }

        const state = await getState(env.STATE, source);
        state.lastRun = Date.now();
        state.runCount++;
        await setState(env.STATE, source, state);

        return Response.json({ ok: true, source, result });
      } catch (err) {
        return Response.json({ ok: false, error: String(err) }, { status: 500 });
      }
    }

    return new Response('nVision Keepalive Worker\n\nGET /status — check state\nPOST /trigger?source=heartbeat|image — manual trigger\n', { status: 200 });
  },
};
