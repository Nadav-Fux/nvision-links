import {
  MessageCircle,
  Radio,
  Send,
  Users,
  GraduationCap,
  Bot,
  Wand2,
  Image,
  Video,
  Mic,
  Code,
  PenTool,
  Globe,
  BrainCircuit,
  Facebook,
  Sparkles,
  Zap,
  Heart,
  Blocks,
  Terminal,
  Box,
  Laptop,
  FileCode,
  GitBranch,
  SquareCode,
  Unlock,
  Rocket,
  Cpu,
  Moon,
  Gauge,
  Server,
  Search,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { CommunityIcon } from '@/components/icons/CommunityIcon';
import { CodeIcon } from '@/components/icons/CodeIcon';
import { BrainIcon } from '@/components/icons/BrainIcon';
import { MediaIcon } from '@/components/icons/MediaIcon';

/**
 * CSS animation names for link card icons on hover.
 * Keyframes are defined in accessibility.css and applied via inline style.
 */
export type IconAnimation =
  | 'bounce'
  | 'wiggle'
  | 'pulse-grow'
  | 'spin-slow'
  | 'float'
  | 'swing'
  | 'rubber'
  | 'flash'
  | 'tilt'
  | 'breathe'
  | 'jello'
  | 'flip'
  | 'heartbeat'
  | 'shake'
  | 'tada'
  | 'pendulum'
  | 'morph'
  | 'orbit-spin'
  | 'glitch-icon'
  | 'zoom-pulse';

/** Pricing / availability tag shown as a small badge on the card */
export type LinkTag =
  | 'free'
  | 'freemium'
  | 'deal'
  | 'new'
  | 'popular'
  | 'recommended'
  | 'coming-soon'
  | 'beta'
  | 'premium'
  | 'open-source'
  | 'israeli';

/**
 * A single link entry as consumed by view components.
 * Bridges between the raw DB row shape and the UI — icon is already resolved.
 */
export interface LinkItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  icon: LucideIcon;
  /** Accent color used for glow effects and icon tinting. */
  color: string;
  animation: IconAnimation;
  faviconUrl?: string;
  affiliateBenefit?: string;
  /** Pricing badge: free = חינם לגמרי, freemium = שימוש מוגבל בחינם, deal = מבצע שווה */
  tag?: LinkTag;
}

/**
 * Static section with its child links. Used as the fallback data source
 * when Supabase is unavailable or returns insufficient content.
 */
export interface LinkSection {
  id: string;
  title: string;
  emoji: ReactNode;
  links: LinkItem[];
}

// ═══════════════════════════════════════════════
//  SECTION 1: קהילות וקבוצות
// ═══════════════════════════════════════════════

const communityLinks: LinkItem[] = [
  {
    id: 'telegram-channel',
    title: 'ערוץ הטלגרם',
    subtitle: 'אוגר את כל מה ששלחתי עד היום, ומתעדכן כל הזמן',
    description: 'ערוץ העדכונים המרכזי בטלגרם — מאמרים, חדשות, סקירות כלים וכל מה שקורה בעולם ה-AI. מומלץ בחום להיכנס, להירשם ולקרוא גם פוסטים קודמים',
    url: 'https://t.me/nvison',
    icon: Send,
    color: '#0088cc',
    animation: 'tilt',
  },
  {
    id: 'telegram-discuss',
    title: 'קבוצת דיונים בטלגרם',
    subtitle: 'דיונים, שאלות ושיתוף ידע על AI וקודינג',
    description: 'קבוצת הדיונים בטלגרם — המקום לדבר על Vibe Coding, כלי AI לפיתוח, לשאול שאלות ולשתף פרויקטים',
    url: 'https://t.me/claudecodeisrael',
    icon: Code,
    color: '#0088cc',
    animation: 'float',
  },
  {
    id: 'whatsapp-channel',
    title: 'חדשות ועדכונים 24/7',
    subtitle: 'למי שמעדיף לקבל התראות כל פעם שיש משהו חדש',
    description: 'ערוץ וואטסאפ רשמי — עדכונים מהירים, טיפים קצרים וחדשות ישירות לנייד. כל פעם שיש משהו חדש - תקבלו התראה',
    url: 'https://tinyurl.com/nVisionNews',
    icon: Radio,
    color: '#25D366',
    animation: 'pulse-grow',
  },
  {
    id: 'whatsapp-discuss',
    title: 'קבוצת הדיונים בוואטסאפ',
    subtitle: 'למי שרוצה לדבר, לשאול שאלות ולהתייעץ',
    description: 'הקבוצה המרכזית של הקהילה בוואטסאפ — המקום לדבר, לשאול שאלות, לענות ולשתף ידע עם כולם',
    url: 'https://tinyurl.com/nVisionTalk',
    icon: MessageCircle,
    color: '#25D366',
    animation: 'wiggle',
  },
  {
    id: 'openclaw-facebook',
    title: 'OpenClaw ישראל',
    subtitle: 'קבוצת הפייסבוק של OpenClaw ישראל',
    description: 'קהילת הפייסבוק הישראלית של OpenClaw — דיונים, שיתוף פרויקטים ו-AI בקוד פתוח',
    url: 'https://www.facebook.com/groups/openclawisrael',
    icon: Users,
    color: '#1877F2',
    animation: 'wiggle',
  },
  {
    id: 'whatsapp-articles',
    title: 'מאמרים ומדריכים',
    subtitle: 'למי שירצה להעמיק יותר וללמוד',
    description: 'קבוצת וואטסאפ למדריכים מפורטים צעד אחר צעד, מאמרים מעמיקים וסקירות כלים — למי שרוצה ללמוד ולהעמיק',
    url: 'https://tinyurl.com/nVisionArticle',
    icon: GraduationCap,
    color: '#25D366',
    animation: 'swing',
  },
  {
    id: 'chatgpt-group',
    title: 'קבוצת שיחה עם ChatGPT',
    subtitle: 'אפשר לדבר, לשאול ולהתייעץ — כולל עם הצ\'אט עצמו',
    description: 'קבוצה ייעודית לפרומפטים, שאלות, התייעצויות וטיפים — כולל בוט ChatGPT פעיל שאפשר לדבר איתו ישירות',
    url: 'https://chatgpt.com/gg/v/692763efa21c819bafef988fe78a515f?token=Ioy3-FsH2176SNceKDKClA',
    icon: Bot,
    color: '#10a37f',
    animation: 'bounce',
  },
  {
    id: 'facebook',
    title: 'דף הפייסבוק',
    subtitle: 'העמוד הרשמי שלנו בפייסבוק',
    description: 'עדכונים, פוסטים, סרטונים ותוכן בלעדי בעמוד הפייסבוק שלנו',
    url: 'https://www.facebook.com/profile.php?id=61579221691260',
    icon: Facebook,
    color: '#1877F2',
    animation: 'pulse-grow',
  },
  {
    id: 'about-site',
    title: 'על האתר',
    subtitle: 'בקרוב — עמוד מידע על הפרויקט',
    description: 'בקרוב יהיה כאן עמוד מידע מלא על הפרויקט, הצוות והחזון מאחורי nVision Digital AI',
    url: 'https://nvision.me',
    icon: Globe,
    color: '#94a3b8',
    animation: 'breathe',
  },
];

// ═══════════════════════════════════════════════
//  SECTION 2: כלי Vibe Coding
// ═══════════════════════════════════════════════

const vibeCodingLinks: LinkItem[] = [
  // ── Affiliate tools first (top of both columns) ──
  {
    id: 'v0',
    title: 'v0',
    subtitle: 'בניית ממשקים ואתרים עם AI מבית Vercel',
    description: 'כותבים מה שרוצים ו-AI מייצר קוד React מוכן — דפים, קומפוננטות ואפליקציות שלמות. מהכלים הפופולריים בעולם',
    url: 'https://v0.app/ref/WTT4J9',
    icon: Sparkles,
    color: '#a78bfa',
    animation: 'breathe',
    affiliateBenefit: '5$ חינם כל חודש + 5$ בונוס הצטרפות · הכפלה בחודש הראשון ברכישה',
    tag: 'freemium',
  },
  {
    id: 'bolt',
    title: 'Bolt',
    subtitle: 'סביבת פיתוח Full-Stack שלמה בדפדפן',
    description: 'מתארים מה רוצים ו-AI בונה את כל האפליקציה כולל Frontend, Backend ו-Deploy — הכל בדפדפן',
    url: 'https://bolt.new/?rid=h61yhc',
    icon: Zap,
    color: '#f59e0b',
    animation: 'flash',
    affiliateBenefit: '200,000 טוקנים נוספים בחינם',
    tag: 'freemium',
  },
  {
    id: 'lovable',
    title: 'Lovable',
    subtitle: 'מרעיון לאפליקציה עובדת בדקות',
    description: 'פלטפורמה שהופכת תיאור טקסטואלי לאפליקציה מלאה — כולל עיצוב, קוד ו-Deploy אוטומטי',
    url: 'https://lovable.dev/invite/1R8U3C9',
    icon: Heart,
    color: '#ec4899',
    animation: 'pulse-grow',
    affiliateBenefit: '10 קרדיטים נוספים בחינם',
    tag: 'freemium',
  },
  {
    id: 'base44',
    title: 'Base44',
    subtitle: 'פלטפורמת Vibe Coding ישראלית 🇮🇱',
    description: 'בונים אפליקציות מלאות מתיאור בעברית — מוצר ישראלי שמבין עברית מהיום הראשון',
    url: 'https://app.base44.com/register?ref=0CXOOO1Q3818AE1Z',
    icon: Blocks,
    color: '#10b981',
    animation: 'bounce',
    affiliateBenefit: '10 קרדיטים נוספים בחינם',
    tag: 'freemium',
  },
  {
    id: 'ampcode',
    title: 'AmpCode',
    subtitle: 'כלי Vibe Coding בחינם מבית Google',
    description: 'עורך קוד AI של גוגל — מקבלים 10$ ביום חינם של מודלים מתקדמים. בלי כרטיס אשראי',
    url: 'https://ampcode.com',
    icon: Laptop,
    color: '#4285F4',
    animation: 'float',
    affiliateBenefit: '10$ ביום חינם למודל המתקדם',
    tag: 'free',
  },
  {
    id: 'replit',
    title: 'Replit',
    subtitle: 'כתיבת קוד והרצה ישירות בדפדפן',
    description: 'סביבת פיתוח בענן עם AI Agent — כותבים, מריצים ומשתפים קוד בלי להתקין כלום',
    url: 'https://replit.com/refer/NadavFux',
    icon: Terminal,
    color: '#f26207',
    animation: 'rubber',
    tag: 'freemium',
  },
  // ── Non-affiliate tools (bottom of both columns) ──
  {
    id: 'cursor',
    title: 'Cursor',
    subtitle: 'עורך הקוד עם AI הפופולרי בעולם',
    description: 'עורך קוד מבוסס VS Code עם AI מובנה — מבין את כל הפרויקט ועוזר בכתיבה, תיקון ורפקטור',
    url: 'https://cursor.sh',
    icon: Code,
    color: '#3b82f6',
    animation: 'tilt',
    tag: 'freemium',
  },
  {
    id: 'cline',
    title: 'Cline',
    subtitle: 'AI Agent אוטונומי בתוך VS Code',
    description: 'תוסף שמריץ Agent בתוך VS Code — כותב, מתקן ומריץ קוד בצורה עצמאית. מהפופולים ביותר',
    url: 'https://cline.bot',
    icon: GitBranch,
    color: '#22c55e',
    animation: 'swing',
    tag: 'free',
  },
  {
    id: 'roo-code',
    title: 'Roo Code',
    subtitle: 'עוד AI Agent חזק ל-VS Code',
    description: 'Agent מתקדם שעובד על הפרויקט שלכם בצורה עצמאית — חלופה מעולה ל-Cline עם הבנה עמוקה של הקוד',
    url: 'https://roocode.com',
    icon: SquareCode,
    color: '#8b5cf6',
    animation: 'wiggle',
    tag: 'free',
  },
  {
    id: 'kilo-code',
    title: 'Kilo Code',
    subtitle: 'תוסף AI קל ומהיר לעורך הקוד',
    description: 'תוסף VS Code שמביא AI ישירות לעורך — כתיבה, תיקון ושיפור קוד. קל משקל ויעיל',
    url: 'https://kilo.ai',
    icon: FileCode,
    color: '#ef4444',
    animation: 'tilt',
    tag: 'free',
  },
  {
    id: 'blackbox',
    title: 'Blackbox AI',
    subtitle: 'חיפוש קוד וכתיבה עם AI',
    description: 'כלי AI שמוצא פתרונות קוד, כותב פונקציות ועוזר באוטומציה של משימות פיתוח',
    url: 'https://www.blackbox.ai',
    icon: Box,
    color: '#6366f1',
    animation: 'rubber',
    tag: 'freemium',
  },
  {
    id: 'opencode',
    title: 'OpenCode',
    subtitle: 'מודלי AI לקוד — בחינם לגמרי',
    description: 'גישה חינמית למודלי AI לכתיבת קוד — בלי תשלום, בלי הגבלות. מושלם להתנסות',
    url: 'https://opencode.ai',
    icon: Unlock,
    color: '#14b8a6',
    animation: 'breathe',
    tag: 'free',
  },
  {
    id: 'warp',
    title: 'Warp',
    subtitle: 'טרמינל מודרני עם AI מובנה',
    description: 'טרמינל חכם — השלמה אוטומטית, הסבר פקודות ועבודה מהירה יותר בשורת הפקודה',
    url: 'https://www.warp.dev',
    icon: Rocket,
    color: '#06b6d4',
    animation: 'float',
    tag: 'freemium',
  },
];

// ═══════════════════════════════════════════════
//  SECTION 3: מודלים ותשתיות
//  (LLM models, API providers, infrastructure)
// ═══════════════════════════════════════════════

const modelsAndInfraLinks: LinkItem[] = [
  // ── Affiliate / paid — top of both columns ──
  {
    id: 'servitro',
    title: 'Servitro — שרת VPS',
    subtitle: 'שרת וירטואלי ב-20$ לשנה!!! משתלם מאוד',
    description: '4GB RAM, 25GB דיסק קשיח — מושלם להרצת בוטים, פרויקטים ושירותי AI. מחיר מטורף!!!',
    url: 'https://my.servitro.com/aff.php?aff=147',
    icon: Server,
    color: '#0ea5e9',
    animation: 'pulse-grow',
    affiliateBenefit: 'שרת VPS: 4GB RAM + 25GB דיסק ב-20$ לשנה בלבד!!!',
    tag: 'deal',
  },
  {
    id: 'z-ai',
    title: 'Z.AI — GLM 5',
    subtitle: 'מודל SOTA חזק בטירוף, במחיר הכי משתלם בעולם',
    description: 'מנוי מ-3$ לחודש (מומלץ שנתי). ביצועים ברמת הטופ של השוק במחיר שבור',
    url: 'https://z.ai/subscribe?ic=33UPISZK5N',
    icon: BrainCircuit,
    color: '#ef4444',
    animation: 'breathe',
    affiliateBenefit: '50% הנחה בשנה הראשונה + 10% נוסף דרך הקישור',
    tag: 'deal',
  },
  {
    id: 'kimi',
    title: 'Kimi K2.5',
    subtitle: 'מודל חזק עם יכולות גרפיות גבוהות',
    description: 'מודל AI של Moonshot — ביצועים מרשימים ביצירת תמונות, ניתוח ויזואלי וקוד. חודש ראשון ב-0.99$!',
    url: 'https://www.kimi.com/kimiplus/sale?activity_enter_method=h5_share&invitation_code=JXBFZ2',
    icon: Moon,
    color: '#a78bfa',
    animation: 'pulse-grow',
    affiliateBenefit: 'חודש ראשון ב-0.99$ בלבד',
    tag: 'deal',
  },
  // ── Major LLM chat models ──
  {
    id: 'chatgpt',
    title: 'ChatGPT',
    subtitle: 'הצ\'אטבוט המוביל בעולם מבית OpenAI',
    description: 'שיחות, כתיבה, קוד, ניתוח תמונות ועוד — המודל שהתחיל את מהפכת ה-AI',
    url: 'https://chat.openai.com',
    icon: Bot,
    color: '#10a37f',
    animation: 'breathe',
    tag: 'freemium',
  },
  {
    id: 'claude',
    title: 'Claude AI',
    subtitle: 'עוזר AI מתקדם של Anthropic',
    description: 'מצטיין בניתוח מסמכים ארוכים, כתיבה יצירתית, קוד ומשימות מורכבות. מהמודלים החזקים ביותר',
    url: 'https://claude.ai',
    icon: Wand2,
    color: '#d4a574',
    animation: 'breathe',
    tag: 'freemium',
  },
  {
    id: 'perplexity',
    title: 'Perplexity AI',
    subtitle: 'מנוע חיפוש AI חכם עם מקורות',
    description: 'תשובות מדויקות עם מקורות מאומתים — החלופה החכמה לגוגל. חיפוש שמבין מה רוצים',
    url: 'https://perplexity.ai',
    icon: Search,
    color: '#22d3ee',
    animation: 'spin-slow',
    tag: 'freemium',
  },
  {
    id: 'grok',
    title: 'Grok',
    subtitle: 'מודל AI חזק של xAI (אילון מאסק)',
    description: 'צ\'אטבוט עם גישה למידע בזמן אמת מ-X (טוויטר). חינם דרך X, עם אפשרות ל-API',
    url: 'https://x.ai',
    icon: Zap,
    color: '#1d9bf0',
    animation: 'flash',
    tag: 'free',
  },
  {
    id: 'qwen',
    title: 'Qwen',
    subtitle: 'מודל AI חזק בקוד פתוח מבית Alibaba',
    description: 'סדרת מודלים סינית מובילה — ביצועים גבוהים בקוד, טקסט ומולטי-מודאלי. חינם ב-API נדיב',
    url: 'https://chat.qwen.ai',
    icon: Globe,
    color: '#6366f1',
    animation: 'bounce',
    tag: 'free',
  },
  // ── Free / budget models ──
  {
    id: 'groq',
    title: 'Groq',
    subtitle: 'Llama 4, Llama 3.3, Gemma 2 ועוד — חינם לגמרי',
    description: 'הסקה מהירה במיוחד עם מכסות מתחדשות מדי יום. מודלים מובילים בחינם מוחלט',
    url: 'https://groq.com',
    icon: Gauge,
    color: '#f97316',
    animation: 'flash',
    tag: 'free',
  },
  {
    id: 'cerebras',
    title: 'Cerebras',
    subtitle: 'Llama 3.3 70B, Llama 3.1 8B ועוד — חינם (VPN רק להרשמה)',
    description: 'מודלים מתקדמים בחינם עם מכסות מתחדשות ומהירות תגובה מטורפת. דורש VPN רק בשלב ההרשמה — אחרי זה עובד בלי',
    url: 'https://www.cerebras.ai',
    icon: Cpu,
    color: '#3b82f6',
    animation: 'spin-slow',
    tag: 'free',
  },
  {
    id: 'minimax',
    title: 'MiniMax 2.5',
    subtitle: 'מודל סיני חזק — 2-3$ לחודש במכסות נדיבות',
    description: 'מודל AI רב-תכליתי במחיר נגיש — קוד, טקסט, תמונות ווידאו. יחס איכות-מחיר מעולה',
    url: 'https://platform.minimax.io/subscribe/coding-plan',
    icon: Cpu,
    color: '#f97316',
    animation: 'pulse-grow',
    tag: 'deal',
  },
];

// ═══════════════════════════════════════════════
//  SECTION — גרפיקה, וידאו ואודיו (merged into models-media)
// ═══════════════════════════════════════════════

const mediaLinks: LinkItem[] = [
  {
    id: 'midjourney',
    title: 'Midjourney',
    subtitle: 'יצירת תמונות ואומנות דיגיטלית עם AI',
    description: 'הכלי המוביל ליצירת תמונות מרהיבות מטקסט — איכות ויזואלית ברמה הגבוהה ביותר',
    url: 'https://midjourney.com',
    icon: Image,
    color: '#ff6b6b',
    animation: 'breathe',
    tag: 'freemium',
  },
  {
    id: 'runway',
    title: 'Runway ML',
    subtitle: 'יצירת ועריכת וידאו עם AI',
    description: 'מטקסט לסרטון — עריכת וידאו חכמה, אפקטים ויצירת תוכן ויזואלי מתקדם',
    url: 'https://runwayml.com',
    icon: Video,
    color: '#8b5cf6',
    animation: 'float',
    tag: 'freemium',
  },
  {
    id: 'elevenlabs',
    title: 'ElevenLabs',
    subtitle: 'יצירת קול ודיבור מלאכותי',
    description: 'טכנולוגיית הקול המתקדמת ביותר — שכפול קול, דיבור טבעי ודאבינג אוטומטי',
    url: 'https://try.elevenlabs.io/x9bnmsimn5g2',
    icon: Mic,
    color: '#06b6d4',
    animation: 'pulse-grow',
    tag: 'freemium',
  },
  {
    id: 'canva-ai',
    title: 'Canva AI',
    subtitle: 'עיצוב גרפי חכם לכל אחד',
    description: 'כלי עיצוב עם AI מתקדם — תמונות, מצגות, פוסטים וסרטונים בלי ידע בעיצוב',
    url: 'https://canva.com',
    icon: PenTool,
    color: '#7c3aed',
    animation: 'float',
    tag: 'freemium',
  },
];

// ═══════════════════════════════════════════════
//  STATIC SECTIONS — used by Index.tsx
// ═══════════════════════════════════════════════

export const staticSections: LinkSection[] = [
  {
    id: 'community',
    title: 'קהילות וקבוצות',
    emoji: <CommunityIcon size={22} />,
    links: communityLinks,
  },
  {
    id: 'vibe-coding',
    title: 'כלי Vibe Coding',
    emoji: <CodeIcon size={22} />,
    links: vibeCodingLinks,
  },
  {
    id: 'models-infra',
    title: 'מודלים ותשתיות',
    emoji: <BrainIcon size={22} />,
    links: modelsAndInfraLinks,
  },
  {
    id: 'media',
    title: 'גרפיקה, וידאו ואודיו',
    emoji: <MediaIcon size={22} />,
    links: mediaLinks,
  },
];
