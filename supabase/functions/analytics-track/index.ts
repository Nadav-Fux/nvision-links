import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

// ===== CORS — open for public analytics tracking =====
// This endpoint only accepts anonymous +1 inserts (no reads, no auth, rate limited)
// Safe to accept any origin
function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

// ===== Allowed event types — whitelist only =====
const ALLOWED_EVENT_TYPES = ['page_view', 'link_click', 'view_switch'];

// ===== Simple in-memory rate limiter (per-origin, not per-user) =====
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_WINDOW = 100; // 100 events per 60 seconds per origin
const WINDOW_MS = 60_000;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(key);
  if (!entry || now > entry.resetAt) {
    requestCounts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

Deno.serve(async (req: Request) => {
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  // Only POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Rate limit by origin
    const origin = req.headers.get('origin') || 'unknown';
    if (isRateLimited(origin)) {
      return new Response(
        JSON.stringify({ error: 'Rate limited' }),
        { status: 429, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { event_type, event_target, page_path } = body;

    // Validate event_type
    if (!event_type || !ALLOWED_EVENT_TYPES.includes(event_type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid event_type' }),
        { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize inputs — truncate to reasonable lengths
    const safeTarget = typeof event_target === 'string' ? event_target.slice(0, 500) : '';
    const safePath = typeof page_path === 'string' ? page_path.slice(0, 200) : '/';

    // Use service role to bypass RLS for insert (RLS allows anon insert, but service role is safer)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { error } = await supabase.from('analytics_events').insert({
      event_type,
      event_target: safeTarget,
      page_path: safePath,
    });

    if (error) {
      console.error('Analytics insert error:', error.message);
      return new Response(
        JSON.stringify({ error: 'Failed to record event' }),
        { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Analytics error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal error' }),
      { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  }
});
