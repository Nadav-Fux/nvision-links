import { createClient, SupabaseClient } from 'npm:@supabase/supabase-js@2.47.3';

// ══════════════════════════════════════════════════════════════
// MULTI-PROVIDER SMART ROUTING
// Preflight classifies question → routes to fast OR deep model
// ══════════════════════════════════════════════════════════════

// Provider endpoints
const PROVIDERS = {
  nvidia: { url: 'https://integrate.api.nvidia.com/v1/chat/completions' },
  groq:   { url: 'https://api.groq.com/openai/v1/chat/completions' },
} as const;

// Model tiers — Groq primary (proven fast+reliable), NVIDIA for heavy lifting
const MODELS = {
  // ── Preflight classifier (no tools, just JSON classification) ──
  preflight: [
    { provider: 'groq',   id: 'llama-3.3-70b-versatile',                  latency: 133,  secret: 'GROQ' },
    { provider: 'nvidia', id: 'abacusai/dracarys-llama-3.1-70b-instruct', latency: 308,  secret: 'NVIDIA' },
  ],
  // ── Fast / simple tasks (with tool calling) ──
  // Groq proven reliable for tool calling. NVIDIA 405b as fallback.
  fast: [
    { provider: 'groq',   id: 'llama-3.3-70b-versatile',                  latency: 133,  secret: 'GROQ' },
    { provider: 'nvidia', id: 'meta/llama-3.1-405b-instruct',             latency: 431,  secret: 'NVIDIA' },
    { provider: 'nvidia', id: 'abacusai/dracarys-llama-3.1-70b-instruct', latency: 308,  secret: 'NVIDIA' },
  ],
  // ── Deep reasoning tasks (with tool calling) ──
  // qwen3 proven fast (2-4s) and reliable with tools
  deep: [
    { provider: 'nvidia', id: 'qwen/qwen3-235b-a22b',                     latency: 556,  secret: 'NVIDIA' },
    { provider: 'nvidia', id: 'moonshotai/kimi-k2-instruct',              latency: 305,  secret: 'NVIDIA' },
    { provider: 'groq',   id: 'llama-3.3-70b-versatile',                  latency: 133,  secret: 'GROQ' },
  ],
} as const;

type Tier = 'simple' | 'deep';

// ═══════════ CORS ═══════════
const ALLOWED_ORIGINS = [
  'https://nvision.digital',
  'http://localhost:3000',
  'http://localhost:5173',
];

function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.preview\.sticklight\.com$/.test(origin)) return true;
  return false;
}

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowed = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-admin-password, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ═══════════ API Key Resolution ═══════════
function getKey(secretName: string): string | null {
  // Try exact name, then common variants
  return Deno.env.get(secretName)
    || Deno.env.get(`${secretName}_API_KEY`)
    || null;
}

// ═══════════ Generic LLM Call ═══════════
interface LLMMessage {
  role: string;
  content?: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

interface LLMTool {
  type: string;
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

interface LLMResponseFormat {
  type: string;
  [key: string]: unknown;
}

interface LLMChoice {
  message: {
    content?: string;
    tool_calls?: ToolCall[];
  };
}

interface LLMResponse {
  choices?: LLMChoice[];
}

interface ToolCall {
  id: string;
  function: {
    name: string;
    arguments: string;
  };
}

interface CallOptions {
  provider: string;
  model: string;
  apiKey: string;
  messages: LLMMessage[];
  tools?: LLMTool[];
  toolChoice?: string;
  maxTokens?: number;
  temperature?: number;
  responseFormat?: LLMResponseFormat;
  timeoutMs?: number;
}

async function callLLM(opts: CallOptions): Promise<LLMResponse> {
  const endpoint = PROVIDERS[opts.provider as keyof typeof PROVIDERS]?.url;
  if (!endpoint) throw new Error(`Unknown provider: ${opts.provider}`);

  const body: Record<string, unknown> = {
    model: opts.model,
    messages: opts.messages,
    max_tokens: opts.maxTokens || 2048,
    temperature: opts.temperature ?? 0.3,
  };
  if (opts.tools) {
    body.tools = opts.tools;
    body.tool_choice = opts.toolChoice || 'auto';
  }
  if (opts.responseFormat) {
    body.response_format = opts.responseFormat;
  }

  // ── Timeout via AbortController ──
  const controller = new AbortController();
  const timeout = opts.timeoutMs || 15000; // 15s default
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${opts.apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`${opts.provider}/${opts.model} error ${res.status}: ${errText.slice(0, 200)}`);
    }

    return res.json();
  } catch (err: unknown) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(`${opts.provider}/${opts.model} timed out after ${timeout}ms`);
    }
    throw err;
  }
}

// ═══════════ Call with fallback chain ═══════════
// failedModels tracks models that failed in this request — skip them on retry rounds
async function callWithFallback(
  tier: typeof MODELS[keyof typeof MODELS],
  messages: LLMMessage[],
  options: { tools?: LLMTool[]; toolChoice?: string; maxTokens?: number; temperature?: number; responseFormat?: LLMResponseFormat; timeoutMs?: number } = {},
  failedModels: Set<string> = new Set()
): Promise<{ response: LLMResponse; modelUsed: string }> {
  const errors: string[] = [];

  for (const model of tier) {
    // Skip models that already failed in this request
    if (failedModels.has(model.id)) {
      console.info(`[Skip] ${model.id} — failed earlier this request`);
      continue;
    }

    const apiKey = getKey(model.secret);
    if (!apiKey) {
      errors.push(`${model.id}: no API key (${model.secret})`);
      continue;
    }

    try {
      console.info(`[Trying] ${model.id} (${model.provider}, ~${model.latency}ms, timeout: ${options.timeoutMs || 15000}ms)`);
      const start = Date.now();

      const response = await callLLM({
        provider: model.provider,
        model: model.id,
        apiKey,
        messages,
        ...options,
      });

      console.info(`[Success] ${model.id} responded in ${Date.now() - start}ms`);
      return { response, modelUsed: model.id };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[Failed] ${model.id}: ${message.slice(0, 150)}`);
      errors.push(`${model.id}: ${message.slice(0, 100)}`);
      failedModels.add(model.id);  // Remember this failure
    }
  }

  throw new Error(`All models failed: ${errors.join(' | ')}`);
}

// ═══════════ Preflight Classifier ═══════════
const PREFLIGHT_PROMPT = `You are a question classifier for an admin AI agent.
Classify the user's LAST message into one of two tiers.

Rules:
- "simple": Listing data, viewing config, simple factual questions, short answers, status checks.
  Examples: "הצג סקציות", "כמה קישורים יש?", "מה הכותרת של האתר?", "תראה לי את ההגדרות"
- "deep": Creating, updating, deleting content, reorganization, analysis, suggestions, complex multi-step tasks, creative tasks.
  Examples: "צור סקציה חדשה", "מחק את הקישור", "ארגן מחדש", "תציע שיפורים", "שנה את הצבעים"

Respond ONLY with valid JSON:
{"tier": "simple" | "deep", "reason": "one sentence in Hebrew"}`;

async function classifyQuestion(userMessages: LLMMessage[]): Promise<{ tier: Tier; reason: string; modelUsed: string }> {
  const lastMessage = userMessages[userMessages.length - 1]?.content || '';

  // Quick heuristics — skip AI call for obvious cases
  const simplePatterns = /^(הצג|תראה|רשימ|כמה|מה |מהם|מהן|הראה|סטטוס|status|list|show|count)/i;
  const deepPatterns = /(צור|מחק|עדכן|שנה|הוסף|ארגן|תציע|שפר|העבר|create|delete|update|add|change|move|suggest|improve)/i;

  if (simplePatterns.test(lastMessage) && !deepPatterns.test(lastMessage)) {
    return { tier: 'simple', reason: 'זיהוי מהיר: שאילתת צפייה/רשימה', modelUsed: 'heuristic' };
  }
  if (deepPatterns.test(lastMessage)) {
    return { tier: 'deep', reason: 'זיהוי מהיר: פעולת יצירה/עדכון/מחיקה', modelUsed: 'heuristic' };
  }

  // AI-based classification for ambiguous questions
  try {
    const { response, modelUsed } = await callWithFallback(MODELS.preflight, [
      { role: 'system', content: PREFLIGHT_PROMPT },
      { role: 'user', content: lastMessage.slice(0, 500) },
    ], { maxTokens: 80, temperature: 0 });

    const content = response.choices?.[0]?.message?.content || '';
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      return {
        tier: parsed.tier === 'deep' ? 'deep' : 'simple',
        reason: parsed.reason || '',
        modelUsed,
      };
    }
  } catch (err) {
    console.warn('Preflight classification failed, defaulting to deep:', err);
  }

  // Default to deep (safer — won't miss tool calls)
  return { tier: 'deep', reason: 'ברירת מחדל: לא הצלחתי לסווג', modelUsed: 'default' };
}

// ═══════════ Tool Definitions ═══════════
const tools = [
  {
    type: 'function',
    function: {
      name: 'fetch_url_info',
      description: 'Fetch metadata from a URL: title, description, favicon/logo, og:image. ALWAYS call this before create_link to get accurate info and favicon.',
      parameters: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'The URL to fetch info from (https://...)' },
        },
        required: ['url'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_sections',
      description: 'List all sections (categories) on the site with their IDs, titles, emojis, sort order, and visibility status.',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_section',
      description: 'Create a new section/category on the site.',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Section title in Hebrew' },
          emoji: { type: 'string', description: 'Emoji icon for the section' },
        },
        required: ['title', 'emoji'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_section',
      description: 'Update an existing section by ID. Can change title, emoji, visibility, or sort order.',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Section UUID' },
          title: { type: 'string', description: 'New title' },
          emoji: { type: 'string', description: 'New emoji' },
          is_visible: { type: 'boolean', description: 'Show/hide section' },
          sort_order: { type: 'number', description: 'Sort order (lower = first)' },
        },
        required: ['id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'delete_section',
      description: 'Delete a section and all its links. This is destructive and cannot be undone!',
      parameters: {
        type: 'object',
        properties: { id: { type: 'string', description: 'Section UUID to delete' } },
        required: ['id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_links',
      description: 'List all links, optionally filtered by section ID.',
      parameters: {
        type: 'object',
        properties: { section_id: { type: 'string', description: 'Optional: filter by section UUID' } },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_link',
      description: 'Create a new link in a section. ALWAYS call fetch_url_info first to get the favicon and description.',
      parameters: {
        type: 'object',
        properties: {
          section_id: { type: 'string', description: 'Section UUID to add link to' },
          title: { type: 'string', description: 'Link title in Hebrew' },
          subtitle: { type: 'string', description: 'Short subtitle in Hebrew' },
          description: { type: 'string', description: 'Hebrew description (2-3 sentences about the tool)' },
          url: { type: 'string', description: 'Full URL (https://...)' },
          favicon_url: { type: 'string', description: 'Favicon/logo URL from fetch_url_info' },
          icon_name: { type: 'string', description: 'Lucide icon name (e.g., Globe, Code, Bot, Wand2, Image, Video, Mic, BrainCircuit, Send, Users, MessageCircle, Radio, BookOpen, GraduationCap, PenTool, Facebook, Rocket, Sparkles, Lightbulb, Star, Heart, Zap, Shield, Eye, Camera, Newspaper)' },
          color: { type: 'string', description: 'Hex color (e.g., #06b6d4)' },
          animation: { type: 'string', enum: ['bounce', 'wiggle', 'pulse-grow', 'spin-slow', 'float', 'swing', 'rubber', 'flash', 'tilt', 'breathe'], description: 'Icon hover animation' },
        },
        required: ['section_id', 'title', 'url'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_link',
      description: 'Update an existing link by ID. Can change any field.',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Link UUID' },
          title: { type: 'string' }, subtitle: { type: 'string' },
          description: { type: 'string' }, url: { type: 'string' },
          favicon_url: { type: 'string', description: 'Favicon/logo URL' },
          icon_name: { type: 'string' }, color: { type: 'string' },
          animation: { type: 'string', enum: ['bounce', 'wiggle', 'pulse-grow', 'spin-slow', 'float', 'swing', 'rubber', 'flash', 'tilt', 'breathe'] },
          is_visible: { type: 'boolean' }, sort_order: { type: 'number' },
          section_id: { type: 'string', description: 'Move link to different section' },
        },
        required: ['id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'delete_link',
      description: 'Delete a link by ID. Cannot be undone.',
      parameters: {
        type: 'object',
        properties: { id: { type: 'string', description: 'Link UUID to delete' } },
        required: ['id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_site_config',
      description: 'Get the current site configuration (title, description, default view mode).',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_site_config',
      description: 'Update site configuration. Can change title, description, or default view mode (1-17).',
      parameters: {
        type: 'object',
        properties: {
          site_title: { type: 'string' },
          site_description: { type: 'string' },
          default_view: { type: 'number', description: 'Default view mode 1-17: 1=Grid, 2=Stack, 3=Flow, 4=Orbit, 5=Deck, 6=Neural, 7=Terminal, 8=Chat, 9=IDE, 10=Phone, 11=Control, 12=Stars, 13=Circuit, 14=RPG, 15=Atoms, 16=Table, 17=Ocean' },
        },
        required: [],
      },
    },
  },
];

// ═══════════ Tool Executors ═══════════
interface ToolResult { success: boolean; data?: unknown; error?: string }

async function executeTool(supabase: SupabaseClient, name: string, args: Record<string, unknown>): Promise<ToolResult> {
  try {
    switch (name) {
      case 'fetch_url_info': {
        try {
          const url = args.url;
          const domain = new URL(url).hostname;

          // Fetch page HTML with timeout
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 8000);
          let html = '';
          try {
            const res = await fetch(url, {
              signal: controller.signal,
              headers: { 'User-Agent': 'Mozilla/5.0 (compatible; nVisionBot/1.0)' },
            });
            html = await res.text();
          } catch { html = ''; }
          clearTimeout(timer);

          // Parse metadata from HTML
          const getMetaContent = (name: string): string => {
            const patterns = [
              new RegExp(`<meta[^>]+(?:property|name)=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'),
              new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${name}["']`, 'i'),
            ];
            for (const p of patterns) {
              const m = html.match(p);
              if (m?.[1]) return m[1];
            }
            return '';
          };

          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          const title = getMetaContent('og:title') || titleMatch?.[1]?.trim() || '';
          const description = getMetaContent('og:description') || getMetaContent('description') || '';
          const ogImage = getMetaContent('og:image') || '';

          // Find favicon: try apple-touch-icon, then favicon link, then Google API
          let favicon = '';
          const appleIcon = html.match(/<link[^>]+rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/i);
          const iconLink = html.match(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i);
          const iconLink2 = html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut )?icon["']/i);

          if (appleIcon?.[1]) {
            favicon = appleIcon[1];
          } else if (iconLink?.[1]) {
            favicon = iconLink[1];
          } else if (iconLink2?.[1]) {
            favicon = iconLink2[1];
          }

          // Make relative URLs absolute
          if (favicon && !favicon.startsWith('http')) {
            favicon = new URL(favicon, url).href;
          }
          if (ogImage && !ogImage.startsWith('http')) {
            // skip relative og:images
          }

          // Fallback to Google favicon service
          if (!favicon) {
            favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
          }

          return {
            success: true,
            data: { title, description, favicon, ogImage, domain },
          };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          return { success: false, error: `Could not fetch URL: ${message}` };
        }
      }
      case 'list_sections': {
        const { data, error } = await supabase.from('sections').select('*').order('sort_order');
        if (error) throw error;
        return { success: true, data };
      }
      case 'create_section': {
        const maxOrder = await supabase.from('sections').select('sort_order').order('sort_order', { ascending: false }).limit(1);
        const nextOrder = (maxOrder.data?.[0]?.sort_order ?? 0) + 1;
        const { data, error } = await supabase.from('sections').insert({
          title: args.title, emoji: args.emoji || '📌', sort_order: nextOrder,
        }).select().single();
        if (error) throw error;
        return { success: true, data };
      }
      case 'update_section': {
        const { id, ...updates } = args;
        updates.updated_at = new Date().toISOString();
        const { data, error } = await supabase.from('sections').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return { success: true, data };
      }
      case 'delete_section': {
        await supabase.from('links').delete().eq('section_id', args.id);
        const { error } = await supabase.from('sections').delete().eq('id', args.id);
        if (error) throw error;
        return { success: true, data: { deleted: args.id } };
      }
      case 'list_links': {
        let query = supabase.from('links').select('*').order('sort_order');
        if (args.section_id) query = query.eq('section_id', args.section_id);
        const { data, error } = await query;
        if (error) throw error;
        return { success: true, data };
      }
      case 'create_link': {
        const maxOrder = await supabase.from('links').select('sort_order').eq('section_id', args.section_id).order('sort_order', { ascending: false }).limit(1);
        const nextOrder = (maxOrder.data?.[0]?.sort_order ?? 0) + 1;
        const { data, error } = await supabase.from('links').insert({
          section_id: args.section_id, title: args.title,
          subtitle: args.subtitle || '', description: args.description || '',
          url: args.url, icon_name: args.icon_name || 'Globe',
          color: args.color || '#06b6d4', animation: args.animation || 'float',
          favicon_url: args.favicon_url || '',
          sort_order: nextOrder,
        }).select().single();
        if (error) throw error;
        return { success: true, data };
      }
      case 'update_link': {
        const { id, ...updates } = args;
        updates.updated_at = new Date().toISOString();
        const { data, error } = await supabase.from('links').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return { success: true, data };
      }
      case 'delete_link': {
        const { error } = await supabase.from('links').delete().eq('id', args.id);
        if (error) throw error;
        return { success: true, data: { deleted: args.id } };
      }
      case 'get_site_config': {
        const { data, error } = await supabase.from('site_config').select('*').single();
        if (error) throw error;
        return { success: true, data };
      }
      case 'update_site_config': {
        const updates = { ...args, updated_at: new Date().toISOString() };
        const { data, error } = await supabase.from('site_config').update(updates).eq('id', 1).select().single();
        if (error) throw error;
        return { success: true, data };
      }
      default:
        return { success: false, error: `Unknown tool: ${name}` };
    }
  } catch (err: unknown) {
    console.error(`Tool ${name} failed:`, err);
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

// ═══════════ System Prompt ═══════════
const SYSTEM_PROMPT = `You are the AI admin agent for the nVision Digital AI website — a Hebrew-language community hub for AI tools, groups, and resources.

You can perform real actions on the site by calling tools. Available actions:
- **fetch_url_info** — Fetch metadata (title, description, favicon) from a URL
- List, create, update, delete **sections** (categories)
- List, create, update, delete **links** (items in sections)
- View and update **site configuration** (title, description, default view)

IMPORTANT RULES:
1. Always respond in **Hebrew**.
2. Before deleting anything, confirm with the user first — describe what will be deleted.
3. **BEFORE creating a link, ALWAYS call fetch_url_info first** to get the favicon URL and site description. Then use that info to:
   - Set the favicon_url from the fetched favicon
   - Write a short Hebrew description (2-3 sentences) explaining what the tool/site does
   - Write a Hebrew subtitle (3-5 words summary)
   - Choose an appropriate icon and color based on the site's purpose
4. ALL text fields (title, subtitle, description) must be in **Hebrew only**.
5. When listing data, format it in a clear, readable way.
6. If you need to perform multiple actions, do them one at a time and report progress.
7. Be helpful, concise, and proactive — suggest improvements when appropriate.
8. Available icon names: Globe, Code, Bot, Wand2, Image, Video, Mic, BrainCircuit, Send, Users, MessageCircle, Radio, BookOpen, GraduationCap, PenTool, Facebook, Linkedin, Star, Heart, Zap, Shield, Eye, Music, Camera, FileText, Newspaper, Headphones, Gamepad2, Rocket, Sparkles, Lightbulb, Target, Award, TrendingUp, DollarSign, ShoppingCart, MapPin, Phone, Mail, Instagram, Twitter, Youtube, Github, Twitch, Hash, Clapperboard, Tv, Palette, Cpu, Database, Terminal, Smartphone.
9. Available animations: bounce, wiggle, pulse-grow, spin-slow, float, swing, rubber, flash, tilt, breathe.
10. Available view modes (1-17): 1=Grid, 2=Stack, 3=Flow, 4=Orbit, 5=Deck, 6=Neural, 7=Terminal, 8=Chat, 9=IDE, 10=Phone, 11=Control, 12=Stars, 13=Circuit, 14=RPG, 15=Atoms, 16=Table, 17=Ocean.
11. When you perform an action, briefly describe what you did so the user can see the change.
`;

// ═══════════ Main Handler ═══════════
console.info('admin-agent v2 (smart-routing) started');

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  try {
    // Auth check
    const providedHash = req.headers.get('x-admin-password');
    const expectedPw = Deno.env.get('ADMIN_PASSWORD');
    if (!expectedPw || !providedHash) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }
    const expectedHash = await sha256(expectedPw);
    if (providedHash !== expectedHash) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    // Verify at least NVIDIA key exists
    const nvidiaKey = getKey('NVIDIA');
    if (!nvidiaKey) {
      return new Response(JSON.stringify({ error: 'No AI provider API keys configured (need at least NVIDIA)' }), {
        status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    // Init Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { messages: userMessages } = await req.json();

    // Audit helper
    const logAudit = (action: string, entityType?: string, entityId?: string, details?: Record<string, unknown>) => {
      supabase.from('audit_log').insert({
        action, entity_type: entityType || null, entity_id: entityId || null,
        details: details || {},
        ip_address: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
      }).then(() => {});
    };

    // ═══════ STEP 1: PREFLIGHT — classify the question ═══════
    const classification = await classifyQuestion(userMessages);
    const tier = classification.tier;
    const modelTier = tier === 'simple' ? MODELS.fast : MODELS.deep;

    console.info(`[Routing] Tier: ${tier} | Reason: ${classification.reason} | Classifier: ${classification.modelUsed}`);

    // ═══════ STEP 2: Call chosen model tier with tools ═══════
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...userMessages,
    ];

    // Fast tier: 12s timeout, Deep tier: 15s timeout (qwen3 responds in 2-4s)
    const timeoutMs = tier === 'simple' ? 12000 : 15000;

    // Track failed models across rounds — don't retry dead models
    const failedModels = new Set<string>();

    let { response, modelUsed } = await callWithFallback(modelTier, messages, {
      tools,
      toolChoice: 'auto',
      maxTokens: 2048,
      temperature: 0.3,
      timeoutMs,
    }, failedModels);

    let assistantMessage = response.choices?.[0]?.message;
    const executedActions: { tool: string; args: Record<string, unknown>; result: ToolResult }[] = [];

    console.info(`[Model] Using: ${modelUsed} (tier: ${tier})`);

    // ═══════ STEP 3: Tool call loop (max 5 rounds) ═══════
    let rounds = 0;
    while (assistantMessage?.tool_calls && rounds < 5) {
      rounds++;
      messages.push(assistantMessage);

      for (const tc of assistantMessage.tool_calls) {
        const fnName = tc.function.name;
        let fnArgs: Record<string, unknown> = {};
        try { fnArgs = JSON.parse(tc.function.arguments || '{}'); } catch { fnArgs = {}; }

        console.info(`[Tool] ${fnName}`, fnArgs);
        const result = await executeTool(supabase, fnName, fnArgs);

        // Log tool results for debugging
        if (result.success) {
          const count = Array.isArray(result.data) ? result.data.length : 1;
          console.info(`[Tool Result] ${fnName}: OK (${count} items)`);
        } else {
          console.warn(`[Tool Result] ${fnName}: ERROR — ${result.error}`);
        }

        executedActions.push({ tool: fnName, args: fnArgs, result });
        messages.push({ role: 'tool', tool_call_id: tc.id, content: JSON.stringify(result) });
      }

      // Continue with same model tier — failedModels carries over
      const next = await callWithFallback(modelTier, messages, {
        tools, toolChoice: 'auto', maxTokens: 2048, temperature: 0.3, timeoutMs,
      }, failedModels);
      response = next.response;
      modelUsed = next.modelUsed;
      assistantMessage = response.choices?.[0]?.message;
    }

    const reply = assistantMessage?.content || 'לא הצלחתי לעבד את הבקשה.';

    return new Response(
      JSON.stringify({
        reply,
        actions: executedActions,
        _routing: { tier, reason: classification.reason, classifierModel: classification.modelUsed, executionModel: modelUsed },
      }),
      { headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } },
    );
  } catch (err: unknown) {
    console.error('Agent error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } },
    );
  }
});
