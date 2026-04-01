import { createClient } from 'npm:@supabase/supabase-js@2.47.3';
import { TOTP } from 'npm:otpauth@9.3.5';

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
// Best model for JSON extraction: fast (431ms), very high quality, direct answers
// Benchmark: "Paris." ✅ Perfect — no rambling, no thinking tags
// Fallback: qwen/qwen3-235b-a22b (556ms, thinker) if 405b unavailable
const MODEL = 'meta/llama-3.1-405b-instruct';
const FALLBACK_MODEL = 'qwen/qwen3-235b-a22b';

// ===== CORS =====
const ALLOWED_ORIGINS = [
  'https://links.74111147.xyz',
  'https://nvision.me',
  'https://nvision-links.pages.dev',
  'http://localhost:3000',
  'http://localhost:5173',
];

function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  return false;
}

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowed = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-admin-password, x-totp-code, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ===== Types =====
interface NvidiaMessage {
  role: string;
  content: string;
}

interface NvidiaResponse {
  choices?: Array<{ message?: { content?: string } }>;
}

interface ParsedLink {
  url?: string;
  title?: string;
  subtitle?: string;
  suggested_section?: string;
  icon_name?: string;
  color?: string;
}

// ===== NVIDIA API call =====
async function callNvidia(messages: NvidiaMessage[], apiKey: string, model: string = MODEL): Promise<NvidiaResponse> {
  const res = await fetch(NVIDIA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 4096,
      temperature: 0.1,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`NVIDIA API error (${model}):`, res.status, errText);
    // If primary model fails, try fallback
    if (model === MODEL && FALLBACK_MODEL) {
      console.info(`Falling back to ${FALLBACK_MODEL}`);
      return callNvidia(messages, apiKey, FALLBACK_MODEL);
    }
    throw new Error(`NVIDIA API error ${res.status}: ${errText}`);
  }

  return res.json();
}

// ===== System prompt for extraction =====
const EXTRACTION_PROMPT = `You are a link extraction assistant for a Hebrew AI community website.

Your job: Parse the user's input text (which may be pasted from Google Docs, spreadsheets, plain text lists, HTML, or raw CSV/TSV) and extract all links/resources found.

For each link found, extract:
- "title": A short descriptive title (in Hebrew if the content is Hebrew, otherwise keep original language)
- "url": The full URL (must start with http:// or https://). If a URL is incomplete, try to fix it.
- "subtitle": A short subtitle/description (1 line, in Hebrew preferred)
- "suggested_section": Suggest a category name in Hebrew that this link belongs to (e.g., "כלי AI", "קהילות", "לימוד", "חדשות", "כלים גרפיים", "מוזיקה ואודיו", "וידאו", "פיתוח", "צ'אטבוטים")
- "icon_name": Suggest a Lucide icon name from this list: Globe, Code, Bot, Wand2, Image, Video, Mic, BrainCircuit, Send, Users, MessageCircle, Radio, BookOpen, GraduationCap, PenTool, Rocket, Sparkles, Lightbulb, Star, Zap, Eye, Music, Camera, FileText, Newspaper, Headphones, Gamepad2, Target, Cpu, Database, Terminal, Smartphone, Youtube, Github, Palette
- "color": Suggest a hex color that fits the brand/category

Rules:
1. ONLY extract items that have a valid URL. Skip items without URLs.
2. If the input is a CSV/TSV, parse columns intelligently (the first column with URLs is the URL, the first text column is the title, etc.)
3. If the input is free-form text with embedded links, extract each link separately.
4. Deduplicate: if the same URL appears multiple times, keep only the first occurrence.
5. Return valid JSON ONLY. No markdown, no explanation, no extra text.

Respond with this exact JSON structure:
{
  "links": [
    {
      "title": "...",
      "url": "https://...",
      "subtitle": "...",
      "suggested_section": "...",
      "icon_name": "...",
      "color": "#..."
    }
  ],
  "summary": "Short Hebrew summary of what was found, e.g. 'נמצאו 12 קישורים ב-3 קטגוריות'"
}`;

console.info('smart-import started');

// Rate limiter (same pattern as admin-api)
const failedAttempts = new Map<string, { count: number; resetAt: number }>();
function getClientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         req.headers.get('cf-connecting-ip') || 'unknown';
}
function isRateLimited(ip: string): boolean {
  const entry = failedAttempts.get(ip);
  if (!entry) return false;
  if (Date.now() > entry.resetAt) { failedAttempts.delete(ip); return false; }
  return entry.count >= 5;
}
function recordFailure(ip: string): void {
  const entry = failedAttempts.get(ip);
  if (entry && Date.now() < entry.resetAt) { entry.count++; }
  else { failedAttempts.set(ip, { count: 1, resetAt: Date.now() + 5 * 60 * 1000 }); }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  const clientIp = getClientIp(req);

  try {
    // Rate limit check
    if (isRateLimited(clientIp)) {
      return new Response(JSON.stringify({ error: 'Too many attempts. Try again in 5 minutes.' }),
        { status: 429, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } });
    }

    // Auth check
    const providedHash = req.headers.get('x-admin-password');
    const expectedPw = Deno.env.get('ADMIN_PASSWORD');
    if (!expectedPw || !providedHash) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }
    const expectedHash = await sha256(expectedPw);
    if (providedHash !== expectedHash) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    // ═══════ TOTP verification ═══════
    {
      const totpSupabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      );
      const { data: totpRow } = await totpSupabase
        .from('admin_totp')
        .select('*')
        .limit(1)
        .single();

      if (totpRow?.is_active === true) {
        const totpCode = req.headers.get('x-totp-code') || '';
        if (!totpCode) {
          return new Response(JSON.stringify({ error: 'TOTP code required', totp_required: true }), {
            status: 403, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
          });
        }

        const totp = new TOTP({
          issuer: 'nVision Digital AI',
          label: 'nVision Admin',
          algorithm: 'SHA1',
          digits: 6,
          period: 30,
          secret: totpRow.secret,
        });
        const delta = totp.validate({ token: totpCode, window: 1 });

        if (delta === null) {
          // Check backup codes
          const backupCodes: string[] = totpRow.backup_codes || [];
          const codeIndex = backupCodes.indexOf(totpCode);
          if (codeIndex === -1) {
            recordFailure(clientIp);
            return new Response(JSON.stringify({ error: 'Invalid TOTP code', totp_invalid: true }), {
              status: 403, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
            });
          }
          // Consume backup code
          backupCodes.splice(codeIndex, 1);
          await totpSupabase
            .from('admin_totp')
            .update({ backup_codes: backupCodes, updated_at: new Date().toISOString() })
            .eq('id', totpRow.id);
        }
      }
    }

    const nvidiaKey = Deno.env.get('NVIDIA_API_KEY') || Deno.env.get('NVIDIA');
    if (!nvidiaKey) {
      return new Response(JSON.stringify({ error: 'NVIDIA API key not configured' }), {
        status: 500,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { action, text, links: linksToImport, sectionMapping } = body;

    // ════════════ ACTION: parse ════════════
    // Receives raw text, returns parsed links for preview
    if (action === 'parse') {
      if (!text || typeof text !== 'string' || text.trim().length < 5) {
        return new Response(JSON.stringify({ error: 'Text too short to parse' }), {
          status: 400,
          headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        });
      }

      const messages = [
        { role: 'system', content: EXTRACTION_PROMPT },
        { role: 'user', content: text.slice(0, 15000) }, // Limit input size
      ];

      const response = await callNvidia(messages, nvidiaKey);
      const content = response.choices?.[0]?.message?.content || '{}';

      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch {
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse AI response as JSON');
        }
      }

      // Validate each link has required fields
      const validLinks = (parsed.links || []).filter(
        (l: ParsedLink) => l.url && l.title && /^https?:\/\//i.test(l.url)
      );

      return new Response(JSON.stringify({
        links: validLinks,
        summary: parsed.summary || `נמצאו ${validLinks.length} קישורים`,
      }), {
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    // ════════════ ACTION: import ════════════
    // Receives confirmed links + section mapping, inserts into DB
    if (action === 'import') {
      if (!linksToImport || !Array.isArray(linksToImport) || linksToImport.length === 0) {
        return new Response(JSON.stringify({ error: 'No links to import' }), {
          status: 400,
          headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        });
      }

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      );

      // sectionMapping: { "suggested_section_name": "actual_section_id" }
      // If a section doesn't exist, create it
      const mapping: Record<string, string> = sectionMapping || {};
      const sectionsToCreate = new Set<string>();

      for (const link of linksToImport) {
        const sec = link.suggested_section || 'כללי';
        if (!mapping[sec]) {
          sectionsToCreate.add(sec);
        }
      }

      // Create missing sections
      if (sectionsToCreate.size > 0) {
        const { data: existingSections } = await supabase.from('sections').select('id, title').order('sort_order');
        const existingMap: Record<string, string> = {};
        for (const s of existingSections || []) {
          existingMap[s.title] = s.id;
        }

        const maxOrder = await supabase.from('sections').select('sort_order').order('sort_order', { ascending: false }).limit(1);
        let nextOrder = (maxOrder.data?.[0]?.sort_order ?? 0) + 1;

        for (const secName of sectionsToCreate) {
          // Check if section already exists by name
          if (existingMap[secName]) {
            mapping[secName] = existingMap[secName];
          } else {
            // Create new section
            const emoji = getEmojiForSection(secName);
            const { data: newSec, error } = await supabase.from('sections').insert({
              title: secName,
              emoji,
              sort_order: nextOrder++,
            }).select().single();

            if (error) {
              console.error('Failed to create section:', secName, error);
              continue;
            }
            mapping[secName] = newSec.id;
          }
        }
      }

      // Insert links
      const results: { title: string; success: boolean; error?: string }[] = [];

      for (const link of linksToImport) {
        const sectionName = link.suggested_section || 'כללי';
        const sectionId = mapping[sectionName];
        if (!sectionId) {
          results.push({ title: link.title, success: false, error: 'No section found' });
          continue;
        }

        // Skip links without valid http(s) URLs
        if (!/^https?:\/\//i.test((link.url || '').trim())) continue;

        // Get next sort order for this section
        const maxLinkOrder = await supabase.from('links').select('sort_order').eq('section_id', sectionId).order('sort_order', { ascending: false }).limit(1);
        const nextLinkOrder = (maxLinkOrder.data?.[0]?.sort_order ?? 0) + 1;

        const { error } = await supabase.from('links').insert({
          section_id: sectionId,
          title: link.title,
          subtitle: link.subtitle || '',
          description: link.subtitle || '',
          url: link.url,
          icon_name: link.icon_name || 'Globe',
          color: link.color || '#06b6d4',
          animation: 'float',
          sort_order: nextLinkOrder,
        });

        if (error) {
          console.error('Failed to insert link:', link.title, error);
          results.push({ title: link.title, success: false, error: error.message });
        } else {
          results.push({ title: link.title, success: true });
        }
      }

      // Audit log
      const successCount = results.filter((r) => r.success).length;
      await supabase.from('audit_log').insert({
        action: 'smart_import',
        entity_type: 'links',
        details: {
          total: linksToImport.length,
          imported: successCount,
          failed: linksToImport.length - successCount,
        },
        ip_address: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
      });

      return new Response(JSON.stringify({
        results,
        summary: `יובאו ${successCount} מתוך ${linksToImport.length} קישורים בהצלחה`,
      }), {
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action. Use "parse" or "import".' }), {
      status: 400,
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });

  } catch (err: unknown) {
    console.error('Smart import error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      },
    );
  }
});

// ===== Helper: suggest emoji for section name =====
function getEmojiForSection(name: string): string {
  const lower = name.toLowerCase();
  const map: Record<string, string> = {
    'כלי ai': '🤖',
    'כלים': '🛠️',
    'צ\'אטבוטים': '💬',
    'קהילות': '👥',
    'לימוד': '📚',
    'חדשות': '📰',
    'גרפי': '🎨',
    'מוזיקה': '🎵',
    'אודיו': '🎧',
    'וידאו': '🎬',
    'פיתוח': '💻',
    'תמונות': '📷',
    'כתיבה': '✍️',
    'עסקים': '💼',
    'שיווק': '📈',
    'משחקים': '🎮',
    'חינוך': '🎓',
    'מחקר': '🔬',
    'אבטחה': '🔒',
    'כללי': '📌',
  };

  for (const [key, emoji] of Object.entries(map)) {
    if (lower.includes(key)) return emoji;
  }
  return '📌';
}
