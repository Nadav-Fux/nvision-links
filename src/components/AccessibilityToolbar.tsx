import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Accessibility, X, ZoomIn, ZoomOut, Contrast, Palette, Link2, Type,
  MousePointer, Pause, RotateCcw, Heading, Focus, Eye, AlignRight,
  AlignCenter, AlignLeft, ScanLine, Minus, Plus, Sparkles } from
'lucide-react';

/* =====================================================
   TYPES & CONSTANTS
   ===================================================== */
const STORAGE_KEY = 'nvision_a11y_v2';

interface A11yState {
  fontSize: number; // 0-4
  highContrast: boolean;
  grayscale: boolean;
  invertColors: boolean;
  colorBlind: '' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  highlightLinks: boolean;
  highlightHeadings: boolean;
  pauseAnimations: boolean;
  bigCursor: boolean;
  largeFocus: boolean;
  readableFont: boolean;
  letterSpacing: number; // 0-4
  lineHeight: number; // 0-4
  wordSpacing: number; // 0-4
  textAlign: '' | 'left' | 'center' | 'right';
  readingGuide: boolean;
}

const DEFAULTS: A11yState = {
  fontSize: 0, highContrast: false, grayscale: false, invertColors: false,
  colorBlind: '', highlightLinks: false, highlightHeadings: false,
  pauseAnimations: false, bigCursor: false, largeFocus: false,
  readableFont: false, letterSpacing: 0, lineHeight: 0, wordSpacing: 0,
  textAlign: '', readingGuide: false
};

const FONT_CLASSES = ['', 'a11y-font-large', 'a11y-font-xlarge', 'a11y-font-xxlarge', 'a11y-font-xxlarge'];
const FONT_LABELS = ['100%', '125%', '150%', '175%', '200%'];
const LETTER_VALS = ['0em', '0.05em', '0.1em', '0.15em', '0.2em'];
const LINE_VALS = ['normal', '1.6', '1.8', '2', '2.4'];
const WORD_VALS = ['0em', '0.1em', '0.2em', '0.35em', '0.5em'];

/* =====================================================
   PERSIST
   ===================================================== */
function load(): A11yState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {return { ...DEFAULTS };}
}
function save(s: A11yState) {
  try {localStorage.setItem(STORAGE_KEY, JSON.stringify(s));} catch {/* noop */}
}

/* =====================================================
   APPLY TO <html>
   Important: filters are COMBINED into one string
   so that contrast + grayscale + invert all work together.
   ===================================================== */
function applyAll(s: A11yState) {
  const cl = document.documentElement.classList;
  const root = document.documentElement.style;

  // --- Font size
  FONT_CLASSES.forEach((c) => c && cl.remove(c));
  if (s.fontSize > 0 && s.fontSize < FONT_CLASSES.length) cl.add(FONT_CLASSES[s.fontSize]);

  // --- Combined filter (prevents overwrite)
  const filters: string[] = [];
  if (s.highContrast) filters.push('contrast(1.5)');
  if (s.grayscale) filters.push('grayscale(100%)');
  if (s.invertColors) filters.push('invert(100%) hue-rotate(180deg)');
  if (s.colorBlind) filters.push(`url(#a11y-${s.colorBlind})`);
  root.setProperty('--a11y-root-filter', filters.length ? filters.join(' ') : 'none');

  // --- Toggle classes
  cl.toggle('a11y-filters-active', filters.length > 0);
  cl.toggle('a11y-invert', s.invertColors);
  cl.toggle('a11y-highlight-links', s.highlightLinks);
  cl.toggle('a11y-highlight-headings', s.highlightHeadings);
  cl.toggle('a11y-pause-animations', s.pauseAnimations);
  cl.toggle('a11y-big-cursor', s.bigCursor);
  cl.toggle('a11y-large-focus', s.largeFocus);
  cl.toggle('a11y-readable-font', s.readableFont);
  cl.toggle('a11y-reading-guide-active', s.readingGuide);

  // --- Spacing
  const hasSpacing = s.letterSpacing > 0 || s.lineHeight > 0 || s.wordSpacing > 0;
  cl.toggle('a11y-spacing-active', hasSpacing);
  root.setProperty('--a11y-letter-spacing', LETTER_VALS[s.letterSpacing] || '0em');
  root.setProperty('--a11y-line-height', LINE_VALS[s.lineHeight] || 'normal');
  root.setProperty('--a11y-word-spacing', WORD_VALS[s.wordSpacing] || '0em');

  // --- Text align
  ['a11y-text-left', 'a11y-text-center', 'a11y-text-right'].forEach((c) => cl.remove(c));
  if (s.textAlign) cl.add('a11y-text-' + s.textAlign);
}

/* =====================================================
   COMPONENT
   ===================================================== */
export const AccessibilityToolbar = () => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<A11yState>(() => load());
  const panelRef = useRef<HTMLDivElement>(null);

  // Apply on every change
  useEffect(() => {applyAll(state);save(state);}, [state]);

  // Reading guide - mouse follow
  useEffect(() => {
    if (!state.readingGuide) return;
    const guide = document.getElementById('a11y-reading-guide');
    if (!guide) return;
    const handler = (e: MouseEvent) => {guide.style.top = e.clientY + 'px';};
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, [state.readingGuide]);

  // Keyboard: Escape closes, Alt+A toggles
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) setOpen(false);
      if (e.altKey && e.key.toLowerCase() === 'a') {e.preventDefault();setOpen((o) => !o);}
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  // Focus trap
  useEffect(() => {
    if (!open || !panelRef.current) return;
    const panel = panelRef.current;
    const focusable = panel.querySelectorAll<HTMLElement>(
      'button, input, a, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) focusable[0].focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !focusable.length) return;
      const first = focusable[0],last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {e.preventDefault();last.focus();} else
      if (!e.shiftKey && document.activeElement === last) {e.preventDefault();first.focus();}
    };
    panel.addEventListener('keydown', trap);
    return () => panel.removeEventListener('keydown', trap);
  }, [open]);

  const set = useCallback((partial: Partial<A11yState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const reset = useCallback(() => setState({ ...DEFAULTS }), []);
  const isDefault = JSON.stringify(state) === JSON.stringify(DEFAULTS);

  const activeCount = Object.entries(state).filter(([k, v]) => {
    if (['fontSize', 'letterSpacing', 'lineHeight', 'wordSpacing'].includes(k)) return v as number > 0;
    if (k === 'colorBlind' || k === 'textAlign') return v !== '';
    return v === true;
  }).length;

  return (
    <>
      {/* SVG color-blind filters */}
      <svg data-ev-id="ev_1a415c7b5b" className="absolute w-0 h-0" aria-hidden="true">
        <defs data-ev-id="ev_8b0a91ab08">
          <filter data-ev-id="ev_a6189b3ea2" id="a11y-protanopia"><feColorMatrix data-ev-id="ev_4a634cd734" type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0" /></filter>
          <filter data-ev-id="ev_59938c5edd" id="a11y-deuteranopia"><feColorMatrix data-ev-id="ev_2792c62024" type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0" /></filter>
          <filter data-ev-id="ev_5069ae68de" id="a11y-tritanopia"><feColorMatrix data-ev-id="ev_99d50b7c62" type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0" /></filter>
        </defs>
      </svg>

      {/* Reading guide line */}
      <div data-ev-id="ev_e34efc25d6" id="a11y-reading-guide" />

      {/* ── FAB trigger ── */}
      <button data-ev-id="ev_30ec961c42"
      onClick={() => setOpen(!open)}
      aria-label={open ? 'סגור סרגל נגישות' : 'פתח סרגל נגישות (Alt+A)'}
      aria-expanded={open}
      aria-controls="a11y-panel"
      className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[9998] group"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>

        <span data-ev-id="ev_3f20d97470" className={
        'relative flex items-center justify-center w-14 h-14 rounded-2xl ' +
        'bg-[#0d0d1a]/90 backdrop-blur-md ' +
        'border border-[#06b6d4]/30 ' +
        'shadow-[0_0_24px_rgba(6,182,212,0.2)] ' +
        'hover:shadow-[0_0_32px_rgba(6,182,212,0.4)] ' +
        'hover:border-[#06b6d4]/60 hover:scale-110 ' +
        'transition-all duration-300 ' +
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'
        }>
          <Accessibility className="w-6 h-6 text-[#06b6d4]" aria-hidden="true" />
          {activeCount > 0 &&
          <span data-ev-id="ev_2794361884" className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-[#a855f7] text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(168,85,247,0.5)]">
              {activeCount}
            </span>
          }
        </span>
      </button>

      {/* ── Overlay ── */}
      {open &&
      <div data-ev-id="ev_9362201f6d"
      className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-[3px]"
      onClick={() => setOpen(false)}
      aria-hidden="true" />

      }

      {/* ── Panel ── */}
      <aside data-ev-id="ev_764fe87262"
      ref={panelRef}
      id="a11y-panel"
      role="dialog"
      aria-label="הגדרות נגישות"
      aria-modal="true"
      dir="rtl"
      className={
      'fixed top-0 right-0 z-[9999] w-[370px] max-w-[92vw] h-screen ' +
      'bg-[#0d0d1a]/95 backdrop-blur-xl ' +
      'border-l border-white/[0.08] ' +
      'shadow-[-8px_0_40px_rgba(0,0,0,0.6)] ' +
      'transition-transform duration-300 ease-out overflow-hidden ' +
      'flex flex-col ' + (
      open ? 'translate-x-0' : 'translate-x-full')
      }>

        {/* ── Header ── */}
        <div data-ev-id="ev_b733c8901e" className="flex-shrink-0 px-5 py-4 flex items-center justify-between border-b border-white/[0.06]">
          <div data-ev-id="ev_0ca38b6b1f" className="flex items-center gap-3">
            <div data-ev-id="ev_c7ead44f19" className="w-9 h-9 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/20 flex items-center justify-center">
              <Accessibility className="w-5 h-5 text-[#06b6d4]" aria-hidden="true" />
            </div>
            <div data-ev-id="ev_a60b6cefec">
              <h2 data-ev-id="ev_9a4f00f0de" className="text-sm font-bold text-white/90 leading-tight">{"הגדרות נגישות"}</h2>
              <p data-ev-id="ev_9bc9da74b7" className="text-[10px] text-white/35 mt-0.5">{"התאמה אישית לאתר"}</p>
            </div>
          </div>
          <button data-ev-id="ev_8e95e2f701"
          onClick={() => setOpen(false)}
          aria-label="סגור"
          className="w-10 h-10 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4]">

            <X className="w-4 h-4 text-white/50" aria-hidden="true" />
          </button>
        </div>

        {/* ── Scrollable Content ── */}
        <div data-ev-id="ev_877f6a6ef1" className="flex-1 overflow-y-auto px-4 py-4 space-y-5 a11y-panel-scroll">

          {/* ═══ FONT SIZE ═══ */}
          <Section icon={<Type className="w-3.5 h-3.5" />} title={"גודל טקסט"}>
            <div data-ev-id="ev_9ba99a3231" className="flex items-center gap-3 rounded-xl p-3 bg-white/[0.03] border border-white/[0.06]">
              <StepBtn
                icon={<Minus className="w-4 h-4" />}
                label="הקטן"
                onClick={() => set({ fontSize: Math.max(0, state.fontSize - 1) })}
                disabled={state.fontSize === 0} />

              <div data-ev-id="ev_4f195cf34a" className="flex-1 text-center">
                <span data-ev-id="ev_1b688d31c1" className="text-2xl font-black text-[#06b6d4] tabular-nums">{FONT_LABELS[state.fontSize]}</span>
              </div>
              <StepBtn
                icon={<Plus className="w-4 h-4" />}
                label="הגדל"
                onClick={() => set({ fontSize: Math.min(4, state.fontSize + 1) })}
                disabled={state.fontSize === 4} />

            </div>
          </Section>

          {/* ═══ CONTRAST & COLORS ═══ */}
          <Section icon={<Contrast className="w-3.5 h-3.5" />} title={"ניגודיות וצבעים"}>
            <div data-ev-id="ev_7f22abc80b" className="grid grid-cols-3 gap-2">
              <Card icon={<Contrast className="w-5 h-5" />} label={"ניגודיות\nגבוהה"} active={state.highContrast} onClick={() => set({ highContrast: !state.highContrast })} />
              <Card icon={<Palette className="w-5 h-5" />} label={"שחור\nלבן"} active={state.grayscale} onClick={() => set({ grayscale: !state.grayscale })} />
              <Card icon={<Eye className="w-5 h-5" />} label={"היפוך\nצבעים"} active={state.invertColors} onClick={() => set({ invertColors: !state.invertColors })} />
            </div>
          </Section>

          {/* ═══ COLOR BLIND ═══ */}
          <Section icon={<Sparkles className="w-3.5 h-3.5" />} title={"עיוורון צבעים"}>
            <div data-ev-id="ev_7aff2c2ce9" className="grid grid-cols-3 gap-2">
              <Card label={"אדום\nירוק"} active={state.colorBlind === 'protanopia'} onClick={() => set({ colorBlind: state.colorBlind === 'protanopia' ? '' : 'protanopia' })} accent="#ef4444" />
              <Card label={"ירוק\nאדום"} active={state.colorBlind === 'deuteranopia'} onClick={() => set({ colorBlind: state.colorBlind === 'deuteranopia' ? '' : 'deuteranopia' })} accent="#22c55e" />
              <Card label={"כחול\nצהוב"} active={state.colorBlind === 'tritanopia'} onClick={() => set({ colorBlind: state.colorBlind === 'tritanopia' ? '' : 'tritanopia' })} accent="#3b82f6" />
            </div>
          </Section>

          {/* ═══ SPACING ═══ */}
          <Section icon={<AlignRight className="w-3.5 h-3.5" />} title={"רווחים"}>
            <div data-ev-id="ev_8a7c79626f" className="space-y-2">
              <Slider label={"שורות"} value={state.lineHeight} max={4} display={LINE_VALS[state.lineHeight]} onChange={(v) => set({ lineHeight: v })} />
              <Slider label={"אותיות"} value={state.letterSpacing} max={4} display={LETTER_VALS[state.letterSpacing]} onChange={(v) => set({ letterSpacing: v })} />
              <Slider label={"מילים"} value={state.wordSpacing} max={4} display={WORD_VALS[state.wordSpacing]} onChange={(v) => set({ wordSpacing: v })} />
            </div>
          </Section>

          {/* ═══ HIGHLIGHTS ═══ */}
          <Section icon={<Link2 className="w-3.5 h-3.5" />} title={"הדגשות"}>
            <div data-ev-id="ev_7a275fa342" className="grid grid-cols-2 gap-2">
              <Card icon={<Link2 className="w-5 h-5" />} label={"הדגש\nקישורים"} active={state.highlightLinks} onClick={() => set({ highlightLinks: !state.highlightLinks })} />
              <Card icon={<Heading className="w-5 h-5" />} label={"הדגש\nכותרות"} active={state.highlightHeadings} onClick={() => set({ highlightHeadings: !state.highlightHeadings })} />
            </div>
          </Section>

          {/* ═══ TOOLS ═══ */}
          <Section icon={<MousePointer className="w-3.5 h-3.5" />} title={"כלי עזר"}>
            <div data-ev-id="ev_3731eb7b12" className="grid grid-cols-3 gap-2">
              <Card icon={<MousePointer className="w-5 h-5" />} label={"סמן\nגדול"} active={state.bigCursor} onClick={() => set({ bigCursor: !state.bigCursor })} />
              <Card icon={<Focus className="w-5 h-5" />} label={"פוקוס\nמודגש"} active={state.largeFocus} onClick={() => set({ largeFocus: !state.largeFocus })} />
              <Card icon={<Pause className="w-5 h-5" />} label={"עצור\nאנימציות"} active={state.pauseAnimations} onClick={() => set({ pauseAnimations: !state.pauseAnimations })} />
              <Card icon={<Type className="w-5 h-5" />} label={"גופן\nקריא"} active={state.readableFont} onClick={() => set({ readableFont: !state.readableFont })} />
              <Card icon={<ScanLine className="w-5 h-5" />} label={"קו\nקריאה"} active={state.readingGuide} onClick={() => set({ readingGuide: !state.readingGuide })} />
            </div>
          </Section>

          {/* ═══ TEXT ALIGN ═══ */}
          <Section icon={<AlignCenter className="w-3.5 h-3.5" />} title={"יישור טקסט"}>
            <div data-ev-id="ev_6bf44b6838" className="grid grid-cols-3 gap-2">
              <Card icon={<AlignRight className="w-5 h-5" />} label={"ימין"} active={state.textAlign === 'right'} onClick={() => set({ textAlign: state.textAlign === 'right' ? '' : 'right' })} />
              <Card icon={<AlignCenter className="w-5 h-5" />} label={"מרכז"} active={state.textAlign === 'center'} onClick={() => set({ textAlign: state.textAlign === 'center' ? '' : 'center' })} />
              <Card icon={<AlignLeft className="w-5 h-5" />} label={"שמאל"} active={state.textAlign === 'left'} onClick={() => set({ textAlign: state.textAlign === 'left' ? '' : 'left' })} />
            </div>
          </Section>

          {/* ═══ SHORTCUTS ═══ */}
          <div data-ev-id="ev_d5642217f1" className="rounded-xl p-3 bg-white/[0.02] border border-white/[0.05]">
            <p data-ev-id="ev_dd10923b2e" className="text-[10px] font-bold text-white/40 mb-2">{"קיצורי מקלדת"}</p>
            <div data-ev-id="ev_18802781ba" className="space-y-1.5">
              <div data-ev-id="ev_844789734e" className="flex justify-between items-center">
                <span data-ev-id="ev_94e109a6cc" className="text-[11px] text-white/40">{"פתיחה / סגירה"}</span>
                <kbd data-ev-id="ev_99f56aa7e2" className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.06] text-white/40 border border-white/[0.08]">Alt + A</kbd>
              </div>
              <div data-ev-id="ev_05d1f6244c" className="flex justify-between items-center">
                <span data-ev-id="ev_5f87caf090" className="text-[11px] text-white/40">{"סגירה מהירה"}</span>
                <kbd data-ev-id="ev_d0028a6e65" className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.06] text-white/40 border border-white/[0.08]">Escape</kbd>
              </div>
            </div>
          </div>

          {/* ═══ RESET ═══ */}
          <button data-ev-id="ev_16e6fc0877"
          onClick={reset}
          disabled={isDefault}
          className={
          'w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 ' +
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ' + (
          isDefault ?
          'bg-white/[0.03] text-white/15 cursor-not-allowed border border-white/[0.04]' :
          'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 hover:border-red-500/50 active:scale-[0.98]')
          }>

            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            {"אפס את כל ההגדרות"}
          </button>

          {/* Statement link */}
          <div data-ev-id="ev_350223613c" className="text-center pb-4">
            <a data-ev-id="ev_400eb4706e"
            href="/accessibility"
            className="inline-flex items-center gap-1.5 text-[#06b6d4]/70 text-xs underline underline-offset-4 hover:text-[#06b6d4] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] rounded">

              {"הצהרת נגישות"}
            </a>
          </div>
        </div>
      </aside>
    </>
  );

};

/* =====================================================
   SUB-COMPONENTS
   ===================================================== */

const Section = ({ icon, title, children }: {icon: React.ReactNode;title: string;children: React.ReactNode;}) =>
<div data-ev-id="ev_6c0d60d707">
    <div data-ev-id="ev_c7452e9b3d" className="flex items-center gap-2 mb-2.5">
      <span data-ev-id="ev_1e89809b51" className="text-[#06b6d4]" aria-hidden="true">{icon}</span>
      <h3 data-ev-id="ev_0490725d88" className="text-xs font-bold text-white/60 tracking-wide">{title}</h3>
      <div data-ev-id="ev_e7d40d2a7e" className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.06]" aria-hidden="true" />
    </div>
    {children}
  </div>;


interface CardProps {
  icon?: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  accent?: string;
}
const Card = ({ icon, label, active, onClick, accent }: CardProps) => {
  const lines = label.split('\n');
  const activeColor = accent || '#06b6d4';
  return (
    <button data-ev-id="ev_08bb60ccde"
    onClick={onClick}
    aria-pressed={active}
    className={
    'relative flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl border transition-all duration-200 ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] focus-visible:ring-offset-1 focus-visible:ring-offset-transparent ' + (
    active ?
    'border-[color:var(--card-accent)]/40 bg-[color:var(--card-accent)]/10' :
    'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12]')
    }
    style={{ '--card-accent': activeColor } as React.CSSProperties}>

      {/* Active glow dot */}
      {active &&
      <span data-ev-id="ev_bf578d2d3f"
      className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full"
      style={{ backgroundColor: activeColor, boxShadow: `0 0 6px ${activeColor}` }}
      aria-hidden="true" />

      }
      {icon &&
      <span data-ev-id="ev_777a8e523b"
      aria-hidden="true"
      className="transition-colors"
      style={{ color: active ? activeColor : 'rgba(255,255,255,0.45)' }}>

          {icon}
        </span>
      }
      {lines.map((line, i) =>
      <span data-ev-id="ev_be9ae52f4f"
      key={i}
      className="text-[10px] font-semibold leading-tight"
      style={{ color: active ? activeColor : 'rgba(255,255,255,0.5)' }}>

          {line}
        </span>
      )}
    </button>);

};

const StepBtn = ({ icon, label, onClick, disabled

}: {icon: React.ReactNode;label: string;onClick: () => void;disabled: boolean;}) =>
<button data-ev-id="ev_8c055b257d"
onClick={onClick}
disabled={disabled}
aria-label={label}
className={
'w-10 h-10 rounded-xl border flex items-center justify-center transition-all ' +
'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] ' + (
disabled ?
'border-white/[0.04] text-white/15 cursor-not-allowed' :
'border-white/[0.1] text-white/60 bg-white/[0.03] hover:bg-white/[0.08] hover:border-[#06b6d4]/40 hover:text-[#06b6d4] active:scale-95')
}>

    {icon}
  </button>;


const Slider = ({ label, value, max, display, onChange

}: {label: string;value: number;max: number;display: string;onChange: (v: number) => void;}) =>
<div data-ev-id="ev_4a79f3a90d" className="flex items-center gap-3 rounded-lg p-2.5 bg-white/[0.02] border border-white/[0.05]">
    <label data-ev-id="ev_0505fc1686" className="text-[10px] text-white/40 font-semibold w-[52px] flex-shrink-0">{label}</label>
    <input data-ev-id="ev_99fe42cae1"
  type="range"
  min={0}
  max={max}
  step={1}
  value={value}
  onChange={(e) => onChange(Number(e.target.value))}
  aria-label={label}
  className={
  'flex-1 h-1 rounded-full appearance-none cursor-pointer bg-white/10 ' +
  '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 ' +
  '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#06b6d4] ' +
  '[&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(6,182,212,0.4)] [&::-webkit-slider-thumb]:cursor-pointer ' +
  '[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125 ' +
  '[&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full ' +
  '[&::-moz-range-thumb]:bg-[#06b6d4] [&::-moz-range-thumb]:border-0 ' +
  'focus:outline-none focus-visible:ring-1 focus-visible:ring-[#06b6d4]'
  } />

    <span data-ev-id="ev_ac4af60ce7" className="text-[10px] font-bold text-[#06b6d4] w-11 text-center tabular-nums">{display}</span>
  </div>;

export default AccessibilityToolbar;