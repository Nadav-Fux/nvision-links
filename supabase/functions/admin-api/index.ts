import { createClient } from 'npm:@supabase/supabase-js@2.49.1';
import { TOTP } from 'npm:otpauth@9.3.5';

// ===== Local types for Supabase query results =====
interface AnalyticsEvent {
  event_type: string;
  event_target: string | null;
  page_path: string;
  created_at: string;
}

interface ClickEvent {
  event_target: string | null;
}

interface LinkRow {
  id: string;
  title: string;
  url: string;
}

interface FullLinkRow {
  section_id: string;
  title: string;
  url: string;
  description: string | null;
  subtitle: string | null;
  icon_name: string | null;
  color: string | null;
  animation: string | null;
  is_visible: boolean;
  sort_order: number;
}

// ===== Dynamic CORS — allow production domain + local dev + sandbox preview =====
const ALLOWED_ORIGINS = [
  'https://nvision.digital',
  'http://localhost:3000',
  'http://localhost:5173',
];

function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Allow sandbox preview domains (*.preview.sticklight.com)
  if (/^https:\/\/[a-z0-9-]+\.preview\.sticklight\.com$/.test(origin)) return true;
  return false;
}

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowed = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-admin-password, x-admin-totp, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

// ===== SHA-256 helper (matches client-side implementation) =====
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ===== Basic in-memory rate limiter =====
const failedAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_FAILURES = 5;
const LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes

function getClientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         req.headers.get('cf-connecting-ip') ||
         'unknown';
}

function isRateLimited(ip: string): boolean {
  const entry = failedAttempts.get(ip);
  if (!entry) return false;
  if (Date.now() > entry.resetAt) {
    failedAttempts.delete(ip);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

function recordFailure(ip: string): void {
  const entry = failedAttempts.get(ip);
  if (entry && Date.now() < entry.resetAt) {
    entry.count++;
  } else {
    failedAttempts.set(ip, { count: 1, resetAt: Date.now() + LOCKOUT_MS });
  }
}

function clearFailures(ip: string): void {
  failedAttempts.delete(ip);
}

// ===== TOTP Helpers =====
function createTotpInstance(secret: string, label: string = 'nVision Admin'): InstanceType<typeof TOTP> {
  return new TOTP({
    issuer: 'nVision Digital AI',
    label,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret,
  });
}

function generateTotpSecret(): string {
  // Generate 20 random bytes, base32-encode for TOTP
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let result = '';
  let bits = 0;
  let value = 0;
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      result += alphabet[(value >>> bits) & 31];
    }
  }
  if (bits > 0) {
    result += alphabet[(value << (5 - bits)) & 31];
  }
  return result;
}

function generateBackupCodes(count: number = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    const num = ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0;
    codes.push(String(num % 100000000).padStart(8, '0'));
  }
  return codes;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  const clientIp = getClientIp(req);

  try {
    // Rate limit check
    if (isRateLimited(clientIp)) {
      return new Response(
        JSON.stringify({ error: 'Too many failed attempts. Try again in 5 minutes.' }),
        { status: 429, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    // Verify admin password (now accepts SHA-256 hash from client)
    const adminPassword = Deno.env.get('ADMIN_PASSWORD');
    const providedHash = req.headers.get('x-admin-password');

    if (!adminPassword || !providedHash) {
      return new Response(
        JSON.stringify({ error: 'Missing password' }),
        { status: 401, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    // Hash the server-side password and compare with client-sent hash
    const serverHash = await sha256(adminPassword);

    if (providedHash !== serverHash) {
      recordFailure(clientIp);
      return new Response(
        JSON.stringify({ error: 'Invalid password' }),
        { status: 403, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    // Password correct — clear any failure records
    clearFailures(clientIp);

    // Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const body = await req.json();
    const { action, table, data, id } = body;

    // TOTP code from client (for login verification)
    const totpCode = body.totp_code || req.headers.get('x-admin-totp') || '';

    // Audit log helper — fire-and-forget (non-blocking)
    const logAudit = (a: string, entityType?: string, entityId?: string, details?: Record<string, unknown>) => {
      supabase.from('audit_log').insert({
        action: a,
        entity_type: entityType || null,
        entity_id: entityId || null,
        details: details || {},
        ip_address: clientIp,
      }).then(() => {});
    };

    let result;

    switch (action) {
      // ========== VERIFY PASSWORD ==========
      case 'verify': {
        // Check if TOTP is active
        const { data: totpRow } = await supabase
          .from('admin_totp')
          .select('*')
          .limit(1)
          .single();

        const totpActive = totpRow?.is_active === true;

        if (totpActive) {
          // TOTP is required — check if code was provided
          if (!totpCode) {
            return new Response(
              JSON.stringify({ success: false, totp_required: true }),
              { headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
            );
          }

          // Verify the TOTP code
          const totp = createTotpInstance(totpRow.secret);
          const delta = totp.validate({ token: totpCode, window: 1 });

          if (delta === null) {
            // Check backup codes
            const backupCodes: string[] = totpRow.backup_codes || [];
            const codeIndex = backupCodes.indexOf(totpCode);

            if (codeIndex === -1) {
              recordFailure(clientIp);
              return new Response(
                JSON.stringify({ error: 'קוד אימות שגוי', totp_invalid: true }),
                { status: 403, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
              );
            }

            // Backup code used — remove it
            backupCodes.splice(codeIndex, 1);
            await supabase
              .from('admin_totp')
              .update({ backup_codes: backupCodes, updated_at: new Date().toISOString() })
              .eq('id', totpRow.id);

            logAudit('totp_backup_code_used', 'admin_totp', totpRow.id, { remaining: backupCodes.length });
          }
        }

        logAudit('admin_login');
        return new Response(
          JSON.stringify({ success: true, totp_active: totpActive }),
          { headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
        );
      }

      // ========== TOTP: GET STATUS ==========
      case 'totp_status': {
        const { data: totpRow } = await supabase
          .from('admin_totp')
          .select('is_active, created_at, backup_codes')
          .limit(1)
          .single();

        result = {
          is_active: totpRow?.is_active ?? false,
          created_at: totpRow?.created_at ?? null,
          backup_codes_remaining: totpRow?.backup_codes?.length ?? 0,
        };
        break;
      }

      // ========== TOTP: BEGIN SETUP — generate secret & URI ==========
      case 'totp_setup': {
        const secret = generateTotpSecret();
        const totp = createTotpInstance(secret);
        const uri = totp.toString(); // otpauth:// URI

        // Store secret (not yet active)
        const { error: upsertErr } = await supabase
          .from('admin_totp')
          .upsert({
            id: data?.existing_id || undefined,
            secret,
            label: 'nVision Admin',
            is_active: false,
            backup_codes: [],
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });

        if (upsertErr) {
          // If singleton constraint — delete old and insert new
          await supabase.from('admin_totp').delete().neq('id', '00000000-0000-0000-0000-000000000000');
          const { error: insertErr } = await supabase
            .from('admin_totp')
            .insert({ secret, label: 'nVision Admin', is_active: false, backup_codes: [] });
          if (insertErr) throw insertErr;
        }

        logAudit('totp_setup_started', 'admin_totp');
        result = { secret, uri };
        break;
      }

      // ========== TOTP: ACTIVATE — verify first code & activate ==========
      case 'totp_activate': {
        const verifyCode = data?.code;
        if (!verifyCode) throw new Error('Missing verification code');

        const { data: totpRow, error: fetchErr } = await supabase
          .from('admin_totp')
          .select('*')
          .limit(1)
          .single();

        if (fetchErr || !totpRow) throw new Error('TOTP not set up yet');
        if (totpRow.is_active) throw new Error('TOTP already active');

        const totp = createTotpInstance(totpRow.secret);
        const delta = totp.validate({ token: verifyCode, window: 1 });

        if (delta === null) {
          return new Response(
            JSON.stringify({ error: 'הקוד שגוי — ודאו שסרקתם את ה-QR ונסו שוב' }),
            { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
          );
        }

        // Generate backup codes
        const backupCodes = generateBackupCodes(8);

        // Activate
        const { error: activateErr } = await supabase
          .from('admin_totp')
          .update({
            is_active: true,
            backup_codes: backupCodes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', totpRow.id);

        if (activateErr) throw activateErr;

        logAudit('totp_activated', 'admin_totp', totpRow.id);
        result = { success: true, backup_codes: backupCodes };
        break;
      }

      // ========== TOTP: DISABLE ==========
      case 'totp_disable': {
        const disableCode = data?.code;
        if (!disableCode) throw new Error('Missing verification code');

        const { data: totpRow, error: fetchErr } = await supabase
          .from('admin_totp')
          .select('*')
          .limit(1)
          .single();

        if (fetchErr || !totpRow || !totpRow.is_active) {
          throw new Error('TOTP is not active');
        }

        // Must verify with current code to disable
        const totp = createTotpInstance(totpRow.secret);
        const delta = totp.validate({ token: disableCode, window: 1 });

        if (delta === null) {
          return new Response(
            JSON.stringify({ error: 'קוד שגוי — יש להזין קוד נוכחי כדי לבטל 2FA' }),
            { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
          );
        }

        await supabase.from('admin_totp').delete().eq('id', totpRow.id);
        logAudit('totp_disabled', 'admin_totp', totpRow.id);
        result = { success: true };
        break;
      }

      // ========== FETCH AUDIT LOG ==========
      case 'fetch_audit_log': {
        const limit = data?.limit || 50;
        const { data: logs, error } = await supabase
          .from('audit_log')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);
        if (error) throw error;
        result = logs;
        break;
      }

      // ========== CONFIG ==========
      case 'update_config': {
        const { error } = await supabase
          .from('site_config')
          .update(data)
          .eq('id', 1);
        if (error) throw error;
        logAudit('update_config', 'site_config', '1', data);
        result = { success: true };
        break;
      }

      // ========== SECTIONS ==========
      case 'create_section': {
        const { data: maxRow } = await supabase
          .from('sections')
          .select('sort_order')
          .order('sort_order', { ascending: false })
          .limit(1)
          .single();
        const nextOrder = (maxRow?.sort_order ?? 0) + 1;

        const { data: newSection, error } = await supabase
          .from('sections')
          .insert({ ...data, sort_order: nextOrder })
          .select()
          .single();
        if (error) throw error;
        logAudit('create_section', 'sections', newSection?.id, data);
        result = newSection;
        break;
      }

      case 'update_section': {
        const { error } = await supabase
          .from('sections')
          .update(data)
          .eq('id', id);
        if (error) throw error;
        logAudit('update_section', 'sections', id, data);
        result = { success: true };
        break;
      }

      case 'delete_section': {
        const { error } = await supabase
          .from('sections')
          .delete()
          .eq('id', id);
        if (error) throw error;
        logAudit('delete_section', 'sections', id);
        result = { success: true };
        break;
      }

      case 'reorder_sections': {
        // data = [{ id, sort_order }, ...]
        for (const item of data) {
          const { error } = await supabase
            .from('sections')
            .update({ sort_order: item.sort_order })
            .eq('id', item.id);
          if (error) throw error;
        }
        logAudit('reorder_sections', 'sections', null, { count: data.length });
        result = { success: true };
        break;
      }

      // ========== LINKS ==========
      case 'create_link': {
        const { data: maxRow } = await supabase
          .from('links')
          .select('sort_order')
          .eq('section_id', data.section_id)
          .order('sort_order', { ascending: false })
          .limit(1)
          .single();
        const nextOrder = (maxRow?.sort_order ?? 0) + 1;

        const { data: newLink, error } = await supabase
          .from('links')
          .insert({ ...data, sort_order: nextOrder })
          .select()
          .single();
        if (error) throw error;
        logAudit('create_link', 'links', newLink?.id, { title: data.title });
        result = newLink;
        break;
      }

      case 'update_link': {
        const { error } = await supabase
          .from('links')
          .update(data)
          .eq('id', id);
        if (error) throw error;
        logAudit('update_link', 'links', id, data);
        result = { success: true };
        break;
      }

      case 'delete_link': {
        const { error } = await supabase
          .from('links')
          .delete()
          .eq('id', id);
        if (error) throw error;
        logAudit('delete_link', 'links', id);
        result = { success: true };
        break;
      }

      case 'reorder_links': {
        for (const item of data) {
          const { error } = await supabase
            .from('links')
            .update({ sort_order: item.sort_order })
            .eq('id', item.id);
          if (error) throw error;
        }
        logAudit('reorder_links', 'links', null, { count: data.length });
        result = { success: true };
        break;
      }

      // ========== ANALYTICS ==========
      case 'fetch_analytics': {
        const from = data?.from || new Date(Date.now() - 30 * 86400000).toISOString();
        const to = data?.to || new Date().toISOString();

        // 1) Raw events in range
        const { data: events, error: evErr } = await supabase
          .from('analytics_events')
          .select('event_type, event_target, page_path, created_at')
          .gte('created_at', from)
          .lte('created_at', to)
          .order('created_at', { ascending: true });
        if (evErr) throw evErr;

        // 2) Aggregate on the server side
        const totalPageViews = events.filter((e: AnalyticsEvent) => e.event_type === 'page_view').length;
        const totalClicks = events.filter((e: AnalyticsEvent) => e.event_type === 'link_click').length;
        const totalViewSwitches = events.filter((e: AnalyticsEvent) => e.event_type === 'view_switch').length;

        // Daily breakdown
        const dailyMap = new Map<string, { page_views: number; clicks: number; view_switches: number }>();
        for (const ev of events as AnalyticsEvent[]) {
          const day = ev.created_at.slice(0, 10); // YYYY-MM-DD
          if (!dailyMap.has(day)) dailyMap.set(day, { page_views: 0, clicks: 0, view_switches: 0 });
          const entry = dailyMap.get(day)!;
          if (ev.event_type === 'page_view') entry.page_views++;
          else if (ev.event_type === 'link_click') entry.clicks++;
          else if (ev.event_type === 'view_switch') entry.view_switches++;
        }
        const daily = Array.from(dailyMap.entries())
          .map(([date, counts]) => ({ date, ...counts }))
          .sort((a, b) => a.date.localeCompare(b.date));

        // Top clicked links
        const clickMap = new Map<string, number>();
        for (const ev of events as AnalyticsEvent[]) {
          if (ev.event_type === 'link_click' && ev.event_target) {
            clickMap.set(ev.event_target, (clickMap.get(ev.event_target) || 0) + 1);
          }
        }
        const topLinks = Array.from(clickMap.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 20);

        // Top views (view_switch)
        const viewMap = new Map<string, number>();
        for (const ev of events as AnalyticsEvent[]) {
          if (ev.event_type === 'view_switch' && ev.event_target) {
            viewMap.set(ev.event_target, (viewMap.get(ev.event_target) || 0) + 1);
          }
        }
        const topViews = Array.from(viewMap.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        // Hourly heatmap (0-23)
        const hourly = new Array(24).fill(0);
        for (const ev of events as AnalyticsEvent[]) {
          const hour = new Date(ev.created_at).getHours();
          hourly[hour]++;
        }

        result = {
          summary: { totalPageViews, totalClicks, totalViewSwitches, totalEvents: events.length },
          daily,
          topLinks,
          topViews,
          hourly,
        };
        break;
      }

      // ========== LINK CLICK STATS (per-link) ==========
      case 'fetch_link_stats': {
        const { data: clicks, error: csErr } = await supabase
          .from('analytics_events')
          .select('event_target')
          .eq('event_type', 'link_click');
        if (csErr) throw csErr;
        const map: Record<string, number> = {};
        for (const c of clicks as ClickEvent[]) {
          if (c.event_target) map[c.event_target] = (map[c.event_target] || 0) + 1;
        }
        result = map;
        break;
      }

      // ========== CHECK LINKS (health check) ==========
      case 'check_links': {
        const { data: allLinks, error: lErr } = await supabase
          .from('links')
          .select('id, title, url')
          .eq('is_visible', true);
        if (lErr) throw lErr;

        const results: Array<{ id: string; title: string; url: string; status: number; ok: boolean; error?: string }> = [];
        for (const link of allLinks as LinkRow[]) {
          try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 8000);
            const res = await fetch(link.url, {
              method: 'HEAD',
              signal: controller.signal,
              redirect: 'follow',
              headers: { 'User-Agent': 'nVision-LinkChecker/1.0' },
            });
            clearTimeout(timeout);
            results.push({ id: link.id, title: link.title, url: link.url, status: res.status, ok: res.ok });
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Timeout/unreachable';
            results.push({ id: link.id, title: link.title, url: link.url, status: 0, ok: false, error: message });
          }
        }
        logAudit('check_links', 'links', null, { checked: results.length });
        result = results;
        break;
      }

      // ========== DUPLICATE SECTION ==========
      case 'duplicate_section': {
        const { data: src, error: srcErr } = await supabase
          .from('sections')
          .select('*')
          .eq('id', id)
          .single();
        if (srcErr) throw srcErr;

        const { data: maxRow } = await supabase
          .from('sections')
          .select('sort_order')
          .order('sort_order', { ascending: false })
          .limit(1)
          .single();
        const nextOrder = (maxRow?.sort_order ?? 0) + 1;

        const { data: newSec, error: newErr } = await supabase
          .from('sections')
          .insert({ title: src.title + ' (עותק)', emoji: src.emoji, sort_order: nextOrder, is_visible: src.is_visible })
          .select()
          .single();
        if (newErr) throw newErr;

        // Duplicate links inside the section
        const { data: srcLinks } = await supabase
          .from('links')
          .select('*')
          .eq('section_id', id)
          .order('sort_order');
        if (srcLinks && srcLinks.length > 0) {
          const newLinks = srcLinks.map((l: FullLinkRow, i: number) => ({
            section_id: newSec.id,
            title: l.title,
            url: l.url,
            description: l.description,
            subtitle: l.subtitle,
            icon_name: l.icon_name,
            color: l.color,
            animation: l.animation,
            is_visible: l.is_visible,
            sort_order: i + 1,
          }));
          await supabase.from('links').insert(newLinks);
        }
        logAudit('duplicate_section', 'sections', newSec.id, { source_id: id });
        result = newSec;
        break;
      }

      // ========== DUPLICATE LINK ==========
      case 'duplicate_link': {
        const { data: srcLink, error: slErr } = await supabase
          .from('links')
          .select('*')
          .eq('id', id)
          .single();
        if (slErr) throw slErr;

        const { data: maxLinkRow } = await supabase
          .from('links')
          .select('sort_order')
          .eq('section_id', srcLink.section_id)
          .order('sort_order', { ascending: false })
          .limit(1)
          .single();
        const nextLinkOrder = (maxLinkRow?.sort_order ?? 0) + 1;

        const { data: newLink, error: nlErr } = await supabase
          .from('links')
          .insert({
            section_id: srcLink.section_id,
            title: srcLink.title + ' (עותק)',
            url: srcLink.url,
            description: srcLink.description,
            subtitle: srcLink.subtitle,
            icon_name: srcLink.icon_name,
            color: srcLink.color,
            animation: srcLink.animation,
            is_visible: srcLink.is_visible,
            sort_order: nextLinkOrder,
          })
          .select()
          .single();
        if (nlErr) throw nlErr;
        logAudit('duplicate_link', 'links', newLink.id, { source_id: id });
        result = newLink;
        break;
      }

      // ========== BULK DELETE LINKS ==========
      case 'bulk_delete_links': {
        const ids = data?.ids;
        if (!Array.isArray(ids) || ids.length === 0) throw new Error('No IDs provided');
        const { error: bdErr } = await supabase
          .from('links')
          .delete()
          .in('id', ids);
        if (bdErr) throw bdErr;
        logAudit('bulk_delete_links', 'links', null, { count: ids.length });
        result = { success: true, deleted: ids.length };
        break;
      }

      // ========== BULK TOGGLE VISIBILITY ==========
      case 'bulk_toggle_links': {
        const { ids: toggleIds, is_visible: vis } = data || {};
        if (!Array.isArray(toggleIds) || toggleIds.length === 0) throw new Error('No IDs provided');
        const { error: btErr } = await supabase
          .from('links')
          .update({ is_visible: vis })
          .in('id', toggleIds);
        if (btErr) throw btErr;
        logAudit('bulk_toggle_links', 'links', null, { count: toggleIds.length, is_visible: vis });
        result = { success: true, updated: toggleIds.length };
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Admin API error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal error' }),
      { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  }
});
