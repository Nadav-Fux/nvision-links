import { useState, useEffect } from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import '@/components/fontEffects.css';
import {
  ChromeSerifPreview,
  HoloSynePreview,
  LiquidTracePreview,
  CorruptedChromePreview,
  ElegantHoloPreview,
  FluidFuturePreview,
  FrostedGlassPreview,
  ElectricPlasmaPreview } from
'@/components/FontEffectHybrids';

/* ═══ Types ═══ */
interface OptionDef {
  id: string;
  label: string;
  labelHe: string;
  description: string;
  category: 'font' | 'effect' | 'hybrid';
  tags: string[];
}

/* ═══ Font style data for A-D ═══ */
const FONT_STYLES: Record<string, {
  nFont: string;visionFont: string;digitalFont: string;aiFont: string;
  nWeight: number;visionWeight: number;digitalWeight: number;aiWeight: number;
  nStyle?: string;visionStyle?: string;
  nColor: string;visionColor: string;digitalColor: string;aiColor: string;
  nShadow: string;aiShadow: string;digitalSpacing: string;
}> = {
  A: {
    nFont: '"Playfair Display"', visionFont: '"Orbitron"', digitalFont: '"Orbitron"', aiFont: '"Playfair Display"',
    nWeight: 900, visionWeight: 800, digitalWeight: 500, aiWeight: 900, nStyle: 'italic',
    nColor: '#22d3ee', visionColor: '#f0f0f5', digitalColor: '#a78bfa', aiColor: '#22d3ee',
    nShadow: '0 0 40px rgba(6,182,212,0.6), 0 0 80px rgba(6,182,212,0.2)',
    aiShadow: '0 0 25px rgba(6,182,212,0.5)', digitalSpacing: '0.35em'
  },
  B: {
    nFont: '"Syne"', visionFont: '"Syne"', digitalFont: '"Unbounded"', aiFont: '"Unbounded"',
    nWeight: 800, visionWeight: 700, digitalWeight: 600, aiWeight: 800,
    nColor: '#22d3ee', visionColor: '#f0f0f5', digitalColor: '#c4b5fd', aiColor: '#06b6d4',
    nShadow: '0 0 35px rgba(6,182,212,0.5), 0 2px 0 rgba(6,182,212,0.3)',
    aiShadow: '0 0 20px rgba(6,182,212,0.6)', digitalSpacing: '0.25em'
  },
  C: {
    nFont: '"Cormorant Garamond"', visionFont: '"Cormorant Garamond"', digitalFont: '"Orbitron"', aiFont: '"Italiana"',
    nWeight: 700, visionWeight: 600, digitalWeight: 500, aiWeight: 400,
    nStyle: 'italic', visionStyle: 'italic',
    nColor: '#22d3ee', visionColor: '#e8e4f0', digitalColor: '#a78bfa', aiColor: '#67e8f9',
    nShadow: '0 0 50px rgba(6,182,212,0.5), 0 0 100px rgba(139,92,246,0.15)',
    aiShadow: '0 0 20px rgba(103,232,249,0.4)', digitalSpacing: '0.4em'
  },
  D: {
    nFont: '"Chakra Petch"', visionFont: '"Chakra Petch"', digitalFont: '"Rajdhani"', aiFont: '"Rajdhani"',
    nWeight: 700, visionWeight: 600, digitalWeight: 600, aiWeight: 700,
    nColor: '#22d3ee', visionColor: '#e4e8ee', digitalColor: '#94a3b8', aiColor: '#06b6d4',
    nShadow: '0 0 30px rgba(6,182,212,0.5)',
    aiShadow: '0 0 15px rgba(6,182,212,0.5)', digitalSpacing: '0.5em'
  }
};

/* ═══ All Options ═══ */
const ALL_OPTIONS: OptionDef[] = [
// Pure effects
{ id: 'E', label: 'Glitch Cyberpunk', labelHe: 'גליץ\' סייברפאנק', description: 'RGB split עם רעש דיגיטלי, קווי סריקה וקפיצות אקראיות', category: 'effect', tags: ['Glitch', 'RGB Split', 'Scanlines'] },
{ id: 'F', label: 'Chrome Metallic', labelHe: 'כרום מטלי', description: 'טקסט מתכתי עם השתקפות אור נעות — לוגו יוקרה', category: 'effect', tags: ['Chrome', 'Metallic', 'Sweep'] },
{ id: 'H', label: 'Holographic', labelHe: 'הולוגרפי', description: 'צבעים משתנים כמו מדבקה הולוגרפית — קושר את העין', category: 'effect', tags: ['Holographic', 'Iridescent', 'Rainbow'] },
{ id: 'I', label: 'Outline Trace', labelHe: 'ציור קו מתגלה', description: 'הטקסט מצייר את עצמו בקו מתגלה ומתמלא — טכנולוגי מרשים', category: 'effect', tags: ['SVG', 'Outline', 'Trace'] },
{ id: 'J', label: 'Liquid Gradient', labelHe: 'גרדיאנט נוזלי', description: 'גרדיאנט מתנועע בין ציאן, סגול, רוז וכתום', category: 'effect', tags: ['Gradient', 'Liquid', 'Flowing'] },
// Hybrids
{ id: 'K', label: 'Chrome + Playfair', labelHe: 'כרום יוקרתי', description: 'פונט סריף מפואר (Playfair) עם אפקט מתכתי כרום — הכי יוקרתי שיש', category: 'hybrid', tags: ['Chrome', 'Playfair Display', 'Luxury'] },
{ id: 'L', label: 'Holographic + Syne', labelHe: 'הולו עתידני', description: 'פונט Syne הייחודי עם צבעי הולוגרם משתנים — עתידני ומרשים', category: 'hybrid', tags: ['Syne', 'Holographic', 'Iridescent'] },
{ id: 'M', label: 'Liquid Trace', labelHe: 'ציור נוזלי', description: 'SVG מצייר את הטקסט בקו ואחר כך מתמלא בגרדיאנט זורם — טכנולוגי וחכם', category: 'hybrid', tags: ['SVG Trace', 'Liquid Fill', 'Animated'] },
{ id: 'N', label: 'Corrupted Chrome', labelHe: 'כרום משובש', description: 'אפקט מתכתי עם גליץ\' מתקתק — כאילו ה-AI לוקח שליטה על הטקסט', category: 'hybrid', tags: ['Chrome', 'Glitch', 'Corrupted'] },
{ id: 'O', label: 'Elegant Hologram', labelHe: 'הולוגרם אלגנטי', description: 'Cormorant Garamond איטלקי עם צבעי פסטל רכים — אלגנטיות עתידנית', category: 'hybrid', tags: ['Cormorant', 'Pastel Holo', 'Elegant'] },
{ id: 'P', label: 'Fluid Future', labelHe: 'עתיד נוזלי', description: 'פונט Unbounded העתידני עם גרדיאנט צבעוני זורם — מודרני ונקי', category: 'hybrid', tags: ['Unbounded', 'Fluid', 'Gradient'] },
{ id: 'Q', label: 'Frosted Glass', labelHe: 'זכוכית מטושטשת', description: 'גלאסמורפיזם עם טשטוש והשתקפות — מרגיש כמו אפליקציית יוקרה', category: 'hybrid', tags: ['Glass', 'Blur', 'Shimmer'] },
{ id: 'R', label: 'Electric Plasma', labelHe: 'פלזמה חשמלית', description: 'זוהר אנרגטי פועם עם קשתות חשמל — כאילו הטקסט חי עם אנרגיה', category: 'hybrid', tags: ['Plasma', 'Electric', 'Energy'] },
// Fonts
{ id: 'A', label: 'Premium Serif Mix', labelHe: 'אלגנטי + טכנולוגי', description: 'Playfair Display + Orbitron — יוקרה ותחכום', category: 'font', tags: ['Playfair Display', 'Orbitron'] },
{ id: 'B', label: 'Cyberpunk Display', labelHe: 'עתידני ייחודי', description: 'Syne + Unbounded — אופי אמנותי חזק', category: 'font', tags: ['Syne', 'Unbounded'] },
{ id: 'C', label: 'Calligraphic Accent', labelHe: 'קליגרפי-טכנולוגי', description: 'Cormorant Garamond Italic — אלגנטיות ורכות', category: 'font', tags: ['Cormorant Garamond', 'Italiana'] },
{ id: 'D', label: 'Stencil / Military Tech', labelHe: 'סטנסיל טכני', description: 'Chakra Petch + Rajdhani — טכני-צבאי', category: 'font', tags: ['Chakra Petch', 'Rajdhani'] }];


/* ═══ Neon sub-component (for G) ═══ */
const NeonText = ({ text, color, size }: {text: string;color: string;size: string;}) =>
<span data-ev-id="ev_ae24367fad" className="fx-neon" style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 900, fontSize: size, lineHeight: 1, '--neon-color': color } as React.CSSProperties}>{text}</span>;


/* ═══ Outline Trace SVG (for I) ═══ */
const TraceSVG = ({ replay }: {replay: number;}) =>
<svg data-ev-id="ev_3b1e71ac4f" key={replay} className="fx-trace-svg" viewBox="0 0 600 120" style={{ width: '100%', maxWidth: 550, height: 'auto' }}>
    <text data-ev-id="ev_5f9fa5539d" x="50%" y="55" textAnchor="middle" fontSize="72">nVision</text>
    <text data-ev-id="ev_909c31348e" className="trace-sub" x="38%" y="100" textAnchor="middle" fontSize="72">DIGITAL</text>
    <text data-ev-id="ev_bca3307dfd" className="trace-sub" x="62%" y="100" textAnchor="middle" fontSize="72" style={{ stroke: '#06b6d4' }}>AI</text>
  </svg>;


/* ═══ Effect Renderers (E-J originals) ═══ */
const GlitchPreview = () =>
<div data-ev-id="ev_ea3f05ab1f" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center overflow-hidden">
    <div data-ev-id="ev_e82187ee11" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] rounded-full blur-[80px] opacity-25" style={{ background: 'radial-gradient(circle, #ff00ff33, #00ffff22, transparent 70%)' }} />
    <div data-ev-id="ev_8e20d19531" dir="ltr" className="relative select-none">
      <div data-ev-id="ev_4c3a7e24e1" className="relative inline-block">
        <span data-ev-id="ev_8a61ef16aa" className="fx-glitch text-[clamp(3rem,8vw,5.5rem)] font-black leading-none" data-text="nVision" style={{ fontFamily: '"Orbitron", sans-serif', color: '#fff' }}>nVision</span>
        <div data-ev-id="ev_59777315d6" className="fx-glitch-scanline" />
      </div>
    </div>
    <div data-ev-id="ev_1da831e603" className="h-[1.5px] mt-3 w-36" style={{ background: 'linear-gradient(90deg, transparent, #ff00ff80, #00ffff80, transparent)' }} />
    <div data-ev-id="ev_3765802c17" dir="ltr" className="flex items-center gap-4 mt-4">
      <span data-ev-id="ev_14173eb51e" className="fx-glitch text-[clamp(0.75rem,2vw,1.1rem)] font-medium tracking-[0.3em]" data-text="DIGITAL" style={{ fontFamily: '"Orbitron", sans-serif', color: '#c4b5fd' }}>DIGITAL</span>
      <span data-ev-id="ev_0ea7b5e347" className="px-3 py-1 rounded-md border border-cyan-400/20 bg-cyan-400/5 text-[clamp(0.85rem,2.2vw,1.25rem)] font-black" style={{ fontFamily: '"Orbitron", sans-serif', color: '#06b6d4', textShadow: '0 0 15px rgba(6,182,212,0.6), 0 0 30px rgba(255,0,255,0.2)' }}>AI</span>
    </div>
  </div>;


const ChromePreview = () =>
<div data-ev-id="ev_63ae9701df" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center">
    <div data-ev-id="ev_1d1819f06b" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[180px] rounded-full blur-[60px] opacity-10" style={{ background: 'radial-gradient(circle, #ffffff44, transparent 70%)' }} />
    <div data-ev-id="ev_f2af108d98" dir="ltr" className="relative select-none">
      <span data-ev-id="ev_92c9d18876" className="fx-chrome text-[clamp(3rem,8vw,5.5rem)] font-black leading-none" style={{ fontFamily: '"Orbitron", sans-serif' }}>nVision</span>
      <div data-ev-id="ev_fa2b44aeaf" className="fx-chrome-reflection" />
    </div>
    <div data-ev-id="ev_6a90965dc4" className="h-[2px] mt-3 w-48" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,200,220,0.4), rgba(255,255,255,0.6), rgba(200,200,220,0.4), transparent)' }} />
    <div data-ev-id="ev_f86fdd8713" dir="ltr" className="flex items-center gap-4 mt-4">
      <span data-ev-id="ev_5c4e28d0f2" className="fx-chrome text-[clamp(0.75rem,2vw,1.1rem)] font-medium tracking-[0.35em]" style={{ fontFamily: '"Orbitron", sans-serif' }}>DIGITAL</span>
      <span data-ev-id="ev_4b436c33e7" className="fx-chrome px-3 py-1 rounded-md border border-white/10 text-[clamp(0.85rem,2.2vw,1.25rem)] font-black" style={{ fontFamily: '"Orbitron", sans-serif' }}>AI</span>
    </div>
  </div>;


const HoloPreview = () =>
<div data-ev-id="ev_89bfe31b2f" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center overflow-hidden">
    <div data-ev-id="ev_b6a7366c9b" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] rounded-full blur-[80px] opacity-15" style={{ background: 'conic-gradient(from 0deg, #ff6ec7, #7873f5, #4adede, #6ef7a7, #f7e76e, #ff6ec7)' }} />
    <div data-ev-id="ev_4c27fc4f19" className="fx-holo-overlay" />
    <div data-ev-id="ev_adb66d177f" dir="ltr" className="relative select-none"><span data-ev-id="ev_64991f6903" className="fx-holo text-[clamp(3rem,8vw,5.5rem)] font-black leading-none" style={{ fontFamily: '"Orbitron", sans-serif' }}>nVision</span></div>
    <div data-ev-id="ev_72fdf9140a" className="h-[2px] mt-3 w-44 rounded-full" style={{ background: 'linear-gradient(90deg, #ff6ec7, #7873f5, #4adede, #6ef7a7, #f7e76e)', opacity: 0.5 }} />
    <div data-ev-id="ev_0ebda85202" dir="ltr" className="flex items-center gap-4 mt-4">
      <span data-ev-id="ev_c07fa4036f" className="fx-holo text-[clamp(0.75rem,2vw,1.1rem)] font-medium tracking-[0.35em]" style={{ fontFamily: '"Orbitron", sans-serif' }}>DIGITAL</span>
      <span data-ev-id="ev_1c0f51a74b" className="fx-holo px-3 py-1 rounded-md border border-white/10 text-[clamp(0.85rem,2.2vw,1.25rem)] font-black" style={{ fontFamily: '"Orbitron", sans-serif' }}>AI</span>
    </div>
  </div>;


const TracePreview = () => {
  const [replay, setReplay] = useState(0);
  useEffect(() => {const iv = setInterval(() => setReplay((r) => r + 1), 7000);return () => clearInterval(iv);}, []);
  return (
    <div data-ev-id="ev_335a97c649" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center">
      <div data-ev-id="ev_6848dd6715" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] rounded-full blur-[80px] opacity-15" style={{ background: 'radial-gradient(circle, #06b6d444, transparent 70%)' }} />
      <TraceSVG replay={replay} />
    </div>);

};

const LiquidPreview = () =>
<div data-ev-id="ev_ef24724cc3" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center overflow-hidden">
    <div data-ev-id="ev_c7b31fe1da" className="absolute top-[30%] left-[25%] w-[200px] h-[200px] rounded-full blur-[60px] opacity-10" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)' }} />
    <div data-ev-id="ev_1129e01689" dir="ltr" className="relative select-none"><span data-ev-id="ev_bc5df9b8c7" className="fx-liquid text-[clamp(3rem,8vw,5.5rem)] font-black leading-none" style={{ fontFamily: '"Orbitron", sans-serif' }}>nVision</span></div>
    <div data-ev-id="ev_f8c1c295fa" className="h-[2px] mt-3 w-44 rounded-full fx-liquid" style={{ WebkitTextFillColor: 'unset', backgroundClip: 'unset', WebkitBackgroundClip: 'unset' }} />
    <div data-ev-id="ev_2cc04e78da" dir="ltr" className="flex items-center gap-4 mt-4">
      <span data-ev-id="ev_48ebe5780c" className="fx-liquid text-[clamp(0.75rem,2vw,1.1rem)] font-medium tracking-[0.35em]" style={{ fontFamily: '"Orbitron", sans-serif' }}>DIGITAL</span>
      <span data-ev-id="ev_2757ffa982" className="fx-liquid px-3 py-1 rounded-md border border-purple-400/15 text-[clamp(0.85rem,2.2vw,1.25rem)] font-black" style={{ fontFamily: '"Orbitron", sans-serif' }}>AI</span>
    </div>
  </div>;


/* ═══ Master renderer map ═══ */
const RENDERERS: Record<string, React.FC> = {
  E: GlitchPreview,
  F: ChromePreview,
  H: HoloPreview,
  I: TracePreview,
  J: LiquidPreview,
  K: ChromeSerifPreview,
  L: HoloSynePreview,
  M: LiquidTracePreview,
  N: CorruptedChromePreview,
  O: ElegantHoloPreview,
  P: FluidFuturePreview,
  Q: FrostedGlassPreview,
  R: ElectricPlasmaPreview
};

/* ═══ Font card renderer (A-D) ═══ */
const FontCard = ({ id, isActive }: {id: string;isActive: boolean;}) => {
  const s = FONT_STYLES[id];
  if (!s) return null;
  return (
    <div data-ev-id="ev_3a57041b23" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center">
      <div data-ev-id="ev_593aae2d52" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] rounded-full blur-[80px] transition-opacity duration-500" style={{ background: `radial-gradient(circle, ${s.nColor}33, transparent 70%)`, opacity: isActive ? 0.4 : 0.15 }} />
      <div data-ev-id="ev_7d8777465c" dir="ltr" className="relative flex items-baseline justify-center select-none">
        <span data-ev-id="ev_0913507f6b" style={{ fontFamily: s.nFont, fontWeight: s.nWeight, fontStyle: s.nStyle || 'normal', fontSize: 'clamp(3rem, 8vw, 5.5rem)', color: s.nColor, textShadow: s.nShadow, lineHeight: 1 }}>n</span>
        <span data-ev-id="ev_c6f026d8ac" style={{ fontFamily: s.visionFont, fontWeight: s.visionWeight, fontStyle: s.visionStyle || 'normal', fontSize: 'clamp(3rem, 8vw, 5.5rem)', color: s.visionColor, lineHeight: 1 }}>Vision</span>
      </div>
      <div data-ev-id="ev_ef683ad0db" className="h-[1.5px] mt-3 transition-all duration-700" style={{ width: isActive ? 200 : 140, background: `linear-gradient(90deg, transparent, ${s.nColor}80, ${s.digitalColor}80, transparent)` }} />
      <div data-ev-id="ev_41e8ef4d99" dir="ltr" className="flex items-center gap-4 mt-4">
        <div data-ev-id="ev_ad51791a14" className="h-px transition-all" style={{ width: isActive ? 45 : 30, background: `linear-gradient(90deg, transparent, ${s.digitalColor}60)` }} />
        <span data-ev-id="ev_6a2ccc1509" style={{ fontFamily: s.digitalFont, fontWeight: s.digitalWeight, fontSize: 'clamp(0.75rem, 2vw, 1.1rem)', color: s.digitalColor, letterSpacing: s.digitalSpacing, lineHeight: 1 }}>DIGITAL</span>
        <div data-ev-id="ev_906b98b3fe" className="h-px w-4" style={{ background: `linear-gradient(90deg, ${s.digitalColor}40, ${s.aiColor}40)` }} />
        <span data-ev-id="ev_710c0d1546" className="px-3 py-1 rounded-md border" style={{ fontFamily: s.aiFont, fontWeight: s.aiWeight, fontSize: 'clamp(0.85rem, 2.2vw, 1.25rem)', color: s.aiColor, textShadow: s.aiShadow, borderColor: `${s.aiColor}25`, background: `${s.aiColor}08`, lineHeight: 1.2 }}>AI</span>
        <div data-ev-id="ev_f0187161a0" className="h-px transition-all" style={{ width: isActive ? 45 : 30, background: `linear-gradient(90deg, ${s.aiColor}60, transparent)` }} />
      </div>
    </div>);

};

/* ═══ Category config ═══ */
const CATEGORY_META = {
  hybrid: { emoji: '🔥', label: 'שילובים מיוחדים', lineColor: 'from-transparent via-orange-500/20 to-transparent', tagBg: 'bg-orange-500/[0.06]', tagText: 'text-orange-300/40', tagBorder: 'border-orange-500/10' },
  effect: { emoji: '✨', label: 'אפקטים', lineColor: 'from-transparent via-purple-500/20 to-transparent', tagBg: 'bg-purple-500/[0.06]', tagText: 'text-purple-300/40', tagBorder: 'border-purple-500/10' },
  font: { emoji: '🅰️', label: 'שילובי פונטים', lineColor: 'from-transparent via-cyan-500/20 to-transparent', tagBg: 'bg-cyan-500/[0.04]', tagText: 'text-cyan-300/40', tagBorder: 'border-cyan-500/10' }
} as const;

/* ═══════════════════ MAIN PAGE ═══════════════════ */
const FontPreview = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'font' | 'effect' | 'hybrid'>('all');

  const filtered = filter === 'all' ? ALL_OPTIONS : ALL_OPTIONS.filter((o) => o.category === filter);
  const cats: Array<'hybrid' | 'effect' | 'font'> = filter === 'all' ? ['hybrid', 'effect', 'font'] : [filter as 'hybrid' | 'effect' | 'font'];

  return (
    <div data-ev-id="ev_0f9860f77c" dir="rtl" className="min-h-screen relative" style={{ background: 'linear-gradient(160deg, #0a0a14 0%, #0d0d1a 30%, #0f0a1a 60%, #0a0f14 100%)' }}>
      {/* Header */}
      <div data-ev-id="ev_b2fe8070c8" className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 bg-black/40">
        <div data-ev-id="ev_3583e8b7aa" className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div data-ev-id="ev_df60e0989e" className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm">
              <ArrowRight className="w-4 h-4" />חזרה
            </Link>
            <div data-ev-id="ev_ceeeaa6955" className="w-px h-5 bg-white/10" />
            <h1 data-ev-id="ev_075097e3e1" className="text-white/90 text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              בחירת טיפוגרפיה ואפקטים
            </h1>
          </div>
          <div data-ev-id="ev_5e106f9464" className="flex items-center gap-2">
            <Link to="/animation-preview" className="px-2.5 py-1 text-[11px] text-purple-400/60 hover:text-purple-300 border border-purple-500/10 hover:border-purple-500/25 rounded-md transition-colors">🎬 אנימציות לוגו</Link>
            <Link to="/entrance-preview" className="px-2.5 py-1 text-[11px] text-emerald-400/60 hover:text-emerald-300 border border-emerald-500/10 hover:border-emerald-500/25 rounded-md transition-colors">🚀 אנימציות כניסה</Link>
            {selected &&
            <div data-ev-id="ev_8fba93ddeb" className="flex items-center gap-2 text-emerald-400 text-sm mr-2">
                <Check className="w-4 h-4" />נבחר: {selected}
              </div>
            }
          </div>
        </div>
      </div>

      <div data-ev-id="ev_1f4c9580eb" className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Filter tabs */}
        <div data-ev-id="ev_d85a5eb838" className="flex flex-wrap items-center justify-center gap-2 mb-2">
          {(['all', 'hybrid', 'effect', 'font'] as const).map((f) => {
            const counts = { all: ALL_OPTIONS.length, hybrid: ALL_OPTIONS.filter((o) => o.category === 'hybrid').length, effect: ALL_OPTIONS.filter((o) => o.category === 'effect').length, font: ALL_OPTIONS.filter((o) => o.category === 'font').length };
            const labels = { all: `הכל (${counts.all})`, hybrid: `🔥 שילובים (${counts.hybrid})`, effect: `✨ אפקטים (${counts.effect})`, font: `🅰️ פונטים (${counts.font})` };
            return (
              <button data-ev-id="ev_fbacacb72e" key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${filter === f ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'text-white/30 hover:text-white/60 border border-transparent hover:border-white/10'}`}>
                {labels[f]}
              </button>);

          })}
        </div>

        <p data-ev-id="ev_2460067d5e" className="text-white/40 text-center text-sm mb-6">לחץ על האופציה שהכי מדברת אליך — אפשר גם לשלב פונט + אפקט</p>

        {cats.map((cat) => {
          const items = filtered.filter((o) => o.category === cat);
          if (items.length === 0) return null;
          const meta = CATEGORY_META[cat];

          return (
            <div data-ev-id="ev_95f4fff118" key={cat}>
              {/* Category header */}
              <div data-ev-id="ev_58f7893b7c" className="mb-4 mt-6">
                <h2 data-ev-id="ev_c539d41ea6" className="text-white/20 text-xs tracking-widest font-medium flex items-center gap-2">
                  <span data-ev-id="ev_4d86ead61e" className={`h-px flex-1 bg-gradient-to-r ${meta.lineColor}`} />
                  <span data-ev-id="ev_192d04731b">{meta.emoji} {meta.label}</span>
                  <span data-ev-id="ev_87fac877d2" className={`h-px flex-1 bg-gradient-to-r ${meta.lineColor}`} />
                </h2>
              </div>

              {/* Cards */}
              <div data-ev-id="ev_ba5b380b74" className="space-y-5">
                {items.map((opt) => {
                  const isSelected = selected === opt.id;
                  const isHovered = hoveredId === opt.id;
                  const Renderer = RENDERERS[opt.id];

                  return (
                    <button data-ev-id="ev_9cfa76d526"
                    key={opt.id}
                    onClick={() => setSelected(opt.id)}
                    onMouseEnter={() => setHoveredId(opt.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`w-full text-right rounded-2xl border-2 transition-all duration-500 overflow-hidden group cursor-pointer ${
                    isSelected ? 'border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.15)]' :
                    isHovered ? 'border-white/15 shadow-[0_0_20px_rgba(255,255,255,0.03)]' :
                    'border-white/[0.06]'}`
                    }
                    style={{ background: isSelected ? 'linear-gradient(135deg, rgba(6,182,212,0.06) 0%, rgba(139,92,246,0.04) 100%)' : 'linear-gradient(135deg, rgba(255,255,255,0.015) 0%, rgba(255,255,255,0.005) 100%)' }}>

                      {/* Header */}
                      <div data-ev-id="ev_2627b36ccf" className="flex items-center justify-between px-6 pt-5 pb-2">
                        <div data-ev-id="ev_972a7d13de" className="flex items-center gap-3">
                          <span data-ev-id="ev_538e6f8262" className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${isSelected ? 'bg-cyan-500 text-black' : 'bg-white/[0.06] text-white/50 group-hover:bg-white/10 group-hover:text-white/70'}`}>{opt.id}</span>
                          <div data-ev-id="ev_246bc1b129">
                            <span data-ev-id="ev_1500b8ebfe" className="text-white/90 font-semibold text-base">{opt.label}</span>
                            <span data-ev-id="ev_7b9eaac062" className="text-white/30 text-sm mr-3">— {opt.labelHe}</span>
                          </div>
                        </div>
                        {isSelected &&
                        <div data-ev-id="ev_ac0c220e17" className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                            <Check className="w-3.5 h-3.5 text-cyan-400" /><span data-ev-id="ev_0a78462f79" className="text-cyan-400 text-xs font-medium">נבחר</span>
                          </div>
                        }
                      </div>

                      {/* Preview */}
                      {Renderer ? <Renderer /> : <FontCard id={opt.id} isActive={isHovered || isSelected} />}

                      {/* Footer */}
                      <div data-ev-id="ev_a9f7610a1e" className="px-6 pb-5">
                        <p data-ev-id="ev_6ddeca7040" className="text-white/35 text-sm leading-relaxed">{opt.description}</p>
                        <div data-ev-id="ev_4f084aad43" className="flex flex-wrap gap-2 mt-3">
                          {opt.tags.map((tag, i) =>
                          <span data-ev-id="ev_e1d776ae73" key={i} className={`px-2 py-0.5 rounded text-[10px] ${meta.tagBg} ${meta.tagText} border ${meta.tagBorder}`}>{tag}</span>
                          )}
                        </div>
                      </div>
                    </button>);

                })}
              </div>
            </div>);

        })}

        {/* Current */}
        <div data-ev-id="ev_19bce768a5" className="mt-12 pt-8 border-t border-white/[0.06]">
          <h2 data-ev-id="ev_28cb32861a" className="text-white/40 text-center text-sm mb-8">📌 להשוואה — המצב הנוכחי (Orbitron פשוט)</h2>
          <div data-ev-id="ev_6d2986e5ee" className="rounded-xl border border-white/[0.04] p-10 flex flex-col items-center" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.01), rgba(255,255,255,0.003))' }}>
            <div data-ev-id="ev_77f427289b" dir="ltr" className="flex items-baseline">
              <span data-ev-id="ev_7f6cad5a16" style={{ fontFamily: '"Orbitron"', fontWeight: 900, fontSize: 'clamp(3rem,8vw,5.5rem)', color: '#22d3ee', textShadow: '0 0 35px rgba(6,182,212,0.5)', lineHeight: 1 }}>n</span>
              <span data-ev-id="ev_397efd1c46" style={{ fontFamily: '"Orbitron"', fontWeight: 900, fontSize: 'clamp(3rem,8vw,5.5rem)', color: '#f0f0f5', lineHeight: 1 }}>Vision</span>
            </div>
            <div data-ev-id="ev_c3bfac0021" className="h-[1.5px] mt-3" style={{ width: 140, background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.5), rgba(168,85,247,0.5), transparent)' }} />
            <div data-ev-id="ev_80c5e6328d" dir="ltr" className="flex items-center gap-4 mt-4">
              <span data-ev-id="ev_e83990fefe" style={{ fontFamily: '"Orbitron"', fontWeight: 500, fontSize: 'clamp(0.75rem,2vw,1.1rem)', color: '#a78bfa', letterSpacing: '0.3em' }}>DIGITAL</span>
              <span data-ev-id="ev_c8350133f3" className="px-3 py-1 rounded-md border" style={{ fontFamily: '"Orbitron"', fontWeight: 900, fontSize: 'clamp(0.85rem,2.2vw,1.25rem)', color: '#06b6d4', textShadow: '0 0 15px rgba(6,182,212,0.5)', borderColor: 'rgba(6,182,212,0.15)', background: 'rgba(6,182,212,0.05)' }}>AI</span>
            </div>
            <p data-ev-id="ev_41f6bd2cdc" className="text-white/20 text-xs mt-6">← המצב הנוכחי</p>
          </div>
        </div>

        <div data-ev-id="ev_17947fd4fe" className="text-center py-10">
          <p data-ev-id="ev_7adf59e245" className="text-white/25 text-xs">💡 אפשר לשלב פונט (A-D) + אפקט (E-J) + שילוב מוכן (K-R)</p>
        </div>
      </div>
    </div>);

};

export default FontPreview;