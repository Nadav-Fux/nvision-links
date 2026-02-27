import { supabase } from '@/integrations/supabase/client';

const SESSION_KEY = 'nvision_admin_session';
const SESSION_TS_KEY = 'nvision_admin_ts';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const SESSION_WARNING_MS = 2 * 60 * 1000; // warn when 2 minutes remain

// ===== Supabase connection details =====
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

/** Hashes a UTF-8 string with SHA-256 using the Web Crypto API. */
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ===== Session management =====
/**
 * Returns the stored SHA-256 password hash if the session is still valid.
 * Refreshes the session timestamp on each access (activity-based timeout).
 */
export function getAdminPassword(): string | null {
  const hash = sessionStorage.getItem(SESSION_KEY);
  const ts = sessionStorage.getItem(SESSION_TS_KEY);

  if (!hash || !ts) return null;

  // Check timeout
  if (Date.now() - parseInt(ts, 10) > SESSION_TIMEOUT_MS) {
    clearAdminSession();
    return null;
  }

  // Refresh timestamp on each access
  sessionStorage.setItem(SESSION_TS_KEY, String(Date.now()));
  return hash;
}

/** Hashes and stores the admin password in sessionStorage, marking session start time. */
export async function setAdminPassword(pw: string) {
  const hash = await sha256(pw);
  sessionStorage.setItem(SESSION_KEY, hash);
  sessionStorage.setItem(SESSION_TS_KEY, String(Date.now()));
}

/** Removes admin session data from sessionStorage — effectively logs out. */
export function clearAdminSession() {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_TS_KEY);
}

/** Returns true if a valid (non-expired) admin session is active. */
export function isAdminLoggedIn(): boolean {
  return !!getAdminPassword();
}

/** Returns milliseconds remaining before session expires, or 0 if expired/not logged in. */
export function getSessionRemainingMs(): number {
  const ts = sessionStorage.getItem(SESSION_TS_KEY);
  if (!ts) return 0;
  const elapsed = Date.now() - parseInt(ts, 10);
  return Math.max(0, SESSION_TIMEOUT_MS - elapsed);
}

export { SESSION_WARNING_MS };

/**
 * Internal helper that POSTs an action to the admin-api Edge Function.
 * Passes the SHA-256 password hash in x-admin-password header for auth.
 * Throws on network or application errors.
 */
async function callAdmin(body: Record<string, unknown>) {
  const passwordHash = getAdminPassword();
  if (!passwordHash || !supabase) throw new Error('Not authenticated');

  const url = `${SUPABASE_URL}/functions/v1/admin-api`;
  const anonKey = SUPABASE_ANON_KEY;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${anonKey}`,
      'x-admin-password': passwordHash,
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Request failed');
  return json;
}

// ===== Verify =====
/** Result returned by verifyPassword. */
export interface VerifyResult {
  success: boolean;
  totp_required?: boolean;
  totp_active?: boolean;
}

/**
 * Verifies the admin password (and optional TOTP code) against the Edge Function.
 * Retries once on network failure to handle Supabase cold starts.
 * Throws TIMEOUT or NETWORK_ERROR if all retries fail.
 */
export async function verifyPassword(pw: string, totpCode?: string): Promise<VerifyResult> {
  if (!supabase) return { success: false };
  const url = `${SUPABASE_URL}/functions/v1/admin-api`;
  const anonKey = SUPABASE_ANON_KEY;

  const hash = await sha256(pw);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${anonKey}`,
    'x-admin-password': hash,
  };

  if (totpCode) {
    headers['x-admin-totp'] = totpCode;
  }

  // Retry logic for network failures (cold start / mobile flakiness)
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'verify', totp_code: totpCode || '' }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const json = await res.json();

      // Check totp_required FIRST — server returns 200 with totp_required: true
      if (json.totp_required) {
        return { success: false, totp_required: true };
      }

      if (res.ok && json.success !== false) {
        return { success: true, totp_active: json.totp_active };
      }

      // TOTP invalid
      if (json.totp_invalid) {
        return { success: false, totp_required: true };
      }

      // 403 = wrong password or wrong code — don't retry
      if (res.status === 403) {
        return { success: false };
      }

      // 429 = rate limited
      if (res.status === 429) {
        throw new Error('TOO_MANY_ATTEMPTS');
      }

      return { success: false };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      // Don't retry on known non-network errors
      if (lastError.message === 'TOO_MANY_ATTEMPTS') throw lastError;
      // On first attempt, wait and retry (cold start)
      if (attempt === 0) {
        await new Promise(r => setTimeout(r, 1500));
        continue;
      }
    }
  }

  // All retries exhausted
  if (lastError?.name === 'AbortError') {
    throw new Error('TIMEOUT');
  }
  throw new Error('NETWORK_ERROR');
}

// ===== Config =====
/** Updates top-level site_config fields (title, description, theme, etc.). */
export const updateConfig = (data: Record<string, unknown>) =>
  callAdmin({ action: 'update_config', data });

// ===== Sections =====
export const createSection = (data: { title: string; emoji: string }) =>
  callAdmin({ action: 'create_section', data });

export const updateSection = (id: string, data: Record<string, unknown>) =>
  callAdmin({ action: 'update_section', id, data });

export const deleteSection = (id: string) =>
  callAdmin({ action: 'delete_section', id });

export const reorderSections = (items: { id: string; sort_order: number }[]) =>
  callAdmin({ action: 'reorder_sections', data: items });

// ===== Links =====
export const createLink = (data: Record<string, unknown>) =>
  callAdmin({ action: 'create_link', data });

export const updateLink = (id: string, data: Record<string, unknown>) =>
  callAdmin({ action: 'update_link', id, data });

export const deleteLink = (id: string) =>
  callAdmin({ action: 'delete_link', id });

export const reorderLinks = (items: { id: string; sort_order: number }[]) =>
  callAdmin({ action: 'reorder_links', data: items });

// ===== AI Agent =====
interface AgentAction { tool: string; args: Record<string, unknown>; result: { success: boolean; data?: unknown; error?: string } }

/**
 * Sends a conversation history to the admin-agent Edge Function.
 * The function can execute DB actions and returns a natural-language reply.
 * Times out after 45 seconds to account for multi-step AI workflows.
 */
export async function callAgent(messages: { role: string; content: string }[]): Promise<{ reply: string; actions: AgentAction[]; _routing?: { tier: string; reason: string; classifierModel: string; executionModel: string } }> {
  const password = getAdminPassword();
  if (!password || !supabase) throw new Error('Not authenticated');

  const url = `${SUPABASE_URL}/functions/v1/admin-agent`;
  const anonKey = SUPABASE_ANON_KEY;

  // 45s client-side timeout — edge function should respond within ~30s max
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
        'x-admin-password': password,
      },
      body: JSON.stringify({ messages }),
      signal: controller.signal,
    });

    clearTimeout(timer);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Agent request failed');
    return json;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'שגיאת רשת';
    throw new Error(message);
  }
}

// ===== Audit Log =====
export const fetchAuditLog = (limit: number = 50) =>
  callAdmin({ action: 'fetch_audit_log', data: { limit } });

// ===== Analytics =====
/** Aggregated analytics data returned by fetchAnalytics. */
export interface AnalyticsData {
  summary: {
    totalPageViews: number;
    totalClicks: number;
    totalViewSwitches: number;
    totalEvents: number;
  };
  daily: Array<{
    date: string;
    page_views: number;
    clicks: number;
    view_switches: number;
  }>;
  topLinks: Array<{ name: string; count: number }>;
  topViews: Array<{ name: string; count: number }>;
  hourly: number[];
}

export const fetchAnalytics = (from?: string, to?: string): Promise<AnalyticsData> =>
  callAdmin({ action: 'fetch_analytics', data: { from, to } });

// ===== Link Stats (per-link click counts) =====
export const fetchLinkStats = (): Promise<Record<string, number>> =>
  callAdmin({ action: 'fetch_link_stats' });

// ===== Link Health Check =====
/** HTTP health check result for a single link. */
export interface LinkCheckResult {
  id: string;
  title: string;
  url: string;
  status: number;
  ok: boolean;
  error?: string;
}
export const checkLinks = (): Promise<LinkCheckResult[]> =>
  callAdmin({ action: 'check_links' });

// ===== Duplicate =====
export const duplicateSection = (id: string) =>
  callAdmin({ action: 'duplicate_section', id });

export const duplicateLink = (id: string) =>
  callAdmin({ action: 'duplicate_link', id });

// ===== Bulk Operations =====
export const bulkDeleteLinks = (ids: string[]) =>
  callAdmin({ action: 'bulk_delete_links', data: { ids } });

export const bulkToggleLinks = (ids: string[], is_visible: boolean) =>
  callAdmin({ action: 'bulk_toggle_links', data: { ids, is_visible } });

// ===== Smart Import =====
/** A link candidate produced by the AI parser during smart import. */
export interface ParsedLink {
  title: string;
  url: string;
  subtitle: string;
  suggested_section: string;
  icon_name: string;
  color: string;
}

/** Result of parsing free-form text into link candidates. */
export interface ParseResult {
  links: ParsedLink[];
  summary: string;
}

/** Per-link import results returned after committing parsed links to the DB. */
export interface ImportResult {
  results: { title: string; success: boolean; error?: string }[];
  summary: string;
}

/** Internal helper for smart-import Edge Function calls — same auth pattern as callAdmin. */
async function callSmartImport(body: Record<string, unknown>) {
  const passwordHash = getAdminPassword();
  if (!passwordHash || !supabase) throw new Error('Not authenticated');

  const url = `${SUPABASE_URL}/functions/v1/smart-import`;
  const anonKey = SUPABASE_ANON_KEY;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${anonKey}`,
      'x-admin-password': passwordHash,
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Smart import request failed');
  return json;
}

/** Sends free-form text to the AI parser and returns structured link candidates. */
export const parseLinksFromText = (text: string): Promise<ParseResult> =>
  callSmartImport({ action: 'parse', text });

/**
 * Commits a list of parsed links to the database.
 * @param sectionMapping - optional override from suggested_section → actual section ID
 */
export const importParsedLinks = (
  links: ParsedLink[],
  sectionMapping?: Record<string, string>
): Promise<ImportResult> =>
  callSmartImport({ action: 'import', links, sectionMapping });
