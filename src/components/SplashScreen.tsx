import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

/*
 * Splash Screen — Random Entrance Animation
 * ──────────────────────────────────────────
 * Each visit shows a random entrance animation from 8 variants.
 * All variants share the same phase timeline and end with nVision logo.
 * Shows once per session · Tap/click/key to skip
 */

const SESSION_KEY = 'nvision_splash_seen';

interface Props {onComplete: () => void;}

/* ── Shared Logo Reveal (all variants end with this) ── */
const LogoReveal = ({ phase }: {phase: number;}) =>
<div data-ev-id="ev_450b3f1b26"
className="flex flex-col items-center transition-all"
style={{
  transitionDuration: '700ms',
  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  opacity: phase >= 3 ? 1 : 0,
  transform: phase >= 3 ? 'scale(1) translateY(0)' : 'scale(0.6) translateY(10px)'
}}>
    {/* nVision */}
    <div data-ev-id="ev_5340e1c7d7" dir="ltr" className="flex items-baseline justify-center select-none">
      <span data-ev-id="ev_944230c7b5"
    className="inline-block text-5xl sm:text-6xl md:text-7xl font-black"
    style={{ color: '#06b6d4', textShadow: '0 0 35px rgba(6,182,212,0.5), 0 0 70px rgba(6,182,212,0.2)' }}>
        n
      </span>
      {'Vision'.split('').map((letter, i) =>
    <span data-ev-id="ev_380ac3f0db"
    key={i}
    className="inline-block text-5xl sm:text-6xl md:text-7xl font-black"
    style={{
      color: 'rgba(255,255,255,0.93)',
      opacity: phase >= 3 ? 1 : 0,
      transform: phase >= 3 ? 'translateY(0)' : 'translateY(8px)',
      transition: `all 0.4s ease ${i * 60 + 100}ms`
    }}>
          {letter}
        </span>
    )}
    </div>
    {/* Glow line */}
    <div data-ev-id="ev_9d6d9368cd"
  className="h-[1.5px] mt-2 transition-all duration-700"
  style={{
    width: phase >= 3 ? 180 : 0,
    background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.5), rgba(168,85,247,0.5), transparent)',
    transitionDelay: '200ms'
  }} />
    {/* Digital AI */}
    <div data-ev-id="ev_77f0230f47"
  dir="ltr"
  className="flex items-center gap-3 mt-3 transition-all duration-600"
  style={{
    opacity: phase >= 4 ? 1 : 0,
    transform: phase >= 4 ? 'translateY(0)' : 'translateY(14px)'
  }}>
      <div data-ev-id="ev_1690c50861" className="h-px transition-all duration-600" style={{ width: phase >= 4 ? 40 : 0, background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.5))' }} />
      <span data-ev-id="ev_ec32401f38"
    className="text-lg sm:text-xl md:text-2xl font-semibold tracking-[0.25em]"
    style={{ background: 'linear-gradient(135deg, #a855f7, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Digital AI
      </span>
      <div data-ev-id="ev_73ad005578" className="h-px transition-all duration-600" style={{ width: phase >= 4 ? 40 : 0, background: 'linear-gradient(90deg, rgba(6,182,212,0.5), transparent)' }} />
    </div>
    {/* Tagline */}
    <p data-ev-id="ev_5337ce7d50"
  className="text-sm sm:text-base text-white/35 mt-3 transition-all duration-500"
  style={{ opacity: phase >= 5 ? 1 : 0, transform: phase >= 5 ? 'translateY(0)' : 'translateY(8px)' }}>
      העתיד מתחיל עכשיו
    </p>
  </div>;


/* ═══════════════════════════════════════════
 *  VARIANT 0 — Boot Sequence (ring loader)
 * ═══════════════════════════════════════════ */
const BootVariant = ({ phase }: {phase: number;}) => {
  const [progress, setProgress] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef(0);
  const STATUS = ['loading neural modules...', 'connecting AI engines...', 'syncing data...', 'initializing...', 'ready.'];
  const ringSize = 100;
  const strokeW = 3;
  const radius = (ringSize - strokeW) / 2;
  const circ = 2 * Math.PI * radius;

  useEffect(() => {
    if (phase < 2 || phase >= 3) return;
    startRef.current = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startRef.current) / 1100, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(e * 100));
      setStatusIdx(Math.min(Math.floor(e * STATUS.length), STATUS.length - 1));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  return (
    <div data-ev-id="ev_f7d1c04a7c" className="flex flex-col items-center transition-all duration-500"
    style={{
      opacity: phase >= 1 && phase < 3 ? 1 : 0,
      transform: phase >= 3 ? 'scale(1.5)' : phase >= 1 ? 'scale(1)' : 'scale(0.8)',
      position: phase >= 3 ? 'absolute' : 'relative',
      pointerEvents: phase >= 3 ? 'none' : 'auto'
    }}>
      <div data-ev-id="ev_3c2c3586ee" className="relative" style={{ width: ringSize, height: ringSize }}>
        <svg data-ev-id="ev_7e20303715" width={ringSize} height={ringSize} className="absolute inset-0 -rotate-90">
          <circle data-ev-id="ev_6d363a1e4e" cx={ringSize / 2} cy={ringSize / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeW} />
        </svg>
        <svg data-ev-id="ev_d2464f4f29" width={ringSize} height={ringSize} className="absolute inset-0 -rotate-90">
          <circle data-ev-id="ev_ef54d1dde5" cx={ringSize / 2} cy={ringSize / 2} r={radius} fill="none" stroke="url(#bootGrad)" strokeWidth={strokeW}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - progress / 100)} />
          <defs data-ev-id="ev_e18f1b0a05"><linearGradient data-ev-id="ev_d52f3def87" id="bootGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop data-ev-id="ev_55129d06d4" offset="0%" stopColor="#06b6d4" /><stop data-ev-id="ev_44536e2440" offset="100%" stopColor="#a855f7" />
          </linearGradient></defs>
        </svg>
        <div data-ev-id="ev_baa05f6b92" className="absolute inset-0 flex items-center justify-center">
          <span data-ev-id="ev_a1b71a78f5" className="text-xl font-bold tabular-nums" style={{ background: 'linear-gradient(135deg,#06b6d4,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {progress}%
          </span>
        </div>
      </div>
      <div data-ev-id="ev_eedc35c7d3" className="mt-4 h-5 flex items-center justify-center">
        <span data-ev-id="ev_d1ca489ce9" className="text-[11px] text-white/25 font-mono tracking-widest">{STATUS[statusIdx]}</span>
      </div>
    </div>);

};

/* ═══════════════════════════════════════════
 *  VARIANT 1 — Glitch Reveal
 * ═══════════════════════════════════════════ */
const GlitchVariant = ({ phase }: {phase: number;}) =>
<div data-ev-id="ev_f32809fc3c" className="flex flex-col items-center">
    <div data-ev-id="ev_4b83e7430f"
  className="transition-all duration-300"
  style={{
    opacity: phase >= 1 && phase < 3 ? 1 : 0,
    position: phase >= 3 ? 'absolute' : 'relative',
    pointerEvents: phase >= 3 ? 'none' : 'auto'
  }}>
      <div data-ev-id="ev_ec665da794" dir="ltr" className="relative select-none">
        {/* Glitch layers */}
        <span data-ev-id="ev_4811911f80" className="text-5xl sm:text-6xl md:text-7xl font-black text-white/90"
      style={{
        display: 'inline-block',
        animation: phase === 2 ? 'glitch-text 0.15s infinite' : 'none',
        textShadow: phase >= 2 ? '-2px 0 #06b6d4, 2px 0 #a855f7' : 'none'
      }}>
          nVision
        </span>
        {phase >= 2 &&
      <>
            <span data-ev-id="ev_b063b2eda2" className="absolute inset-0 text-5xl sm:text-6xl md:text-7xl font-black" style={{ color: '#06b6d4', clipPath: 'inset(20% 0 40% 0)', transform: 'translateX(-4px)', opacity: 0.7, animation: 'glitch-clip1 0.2s infinite' }}>nVision</span>
            <span data-ev-id="ev_e3285ab7d2" className="absolute inset-0 text-5xl sm:text-6xl md:text-7xl font-black" style={{ color: '#a855f7', clipPath: 'inset(60% 0 10% 0)', transform: 'translateX(4px)', opacity: 0.7, animation: 'glitch-clip2 0.2s infinite' }}>nVision</span>
          </>
      }
      </div>
      {/* Scanlines */}
      <div data-ev-id="ev_3ee3f0c8ee" className="absolute inset-0 pointer-events-none" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)', opacity: phase >= 1 ? 0.5 : 0 }} />
      <p data-ev-id="ev_f000c108e1" className="text-[10px] text-cyan-400/30 font-mono tracking-widest mt-4 text-center transition-opacity" style={{ opacity: phase >= 2 ? 1 : 0 }}>SIGNAL LOCKED...</p>
    </div>
  </div>;


/* ═══════════════════════════════════════════
 *  VARIANT 2 — Matrix Rain
 * ═══════════════════════════════════════════ */
const MatrixVariant = ({ phase }: {phase: number;}) => {
  const cols = useMemo(() =>
  Array.from({ length: 30 }, (_, i) => ({
    x: `${i / 30 * 100}%`,
    delay: `${Math.random() * 2}s`,
    dur: `${1.5 + Math.random() * 2}s`,
    chars: Array.from({ length: 8 }, () => 'アイウエオカキクケコ01AI'[Math.floor(Math.random() * 14)])
  })), []);
  return (
    <div data-ev-id="ev_ce58893656" className="absolute inset-0 overflow-hidden transition-opacity duration-500" style={{ opacity: phase >= 1 && phase < 3 ? 1 : 0 }}>
      {cols.map((col, i) =>
      <div data-ev-id="ev_367dd8ef2e" key={i} className="absolute top-0 text-[11px] font-mono leading-4 splash-matrix-col"
      style={{ left: col.x, animationDelay: col.delay, animationDuration: col.dur, color: i % 3 === 0 ? '#06b6d4' : '#22d3ee', opacity: 0.4 }}>
          {col.chars.map((c, j) => <div data-ev-id="ev_c8926ba288" key={j} style={{ opacity: j === 0 ? 1 : 0.3 + (1 - j / col.chars.length) * 0.5 }}>{c}</div>)}
        </div>
      )}
    </div>);

};

/* ═══════════════════════════════════════════
 *  VARIANT 3 — Plasma Burst
 * ═══════════════════════════════════════════ */
const PlasmaVariant = ({ phase }: {phase: number;}) =>
<div data-ev-id="ev_5ef8cc6a86" className="absolute inset-0 flex items-center justify-center" style={{ opacity: phase >= 1 && phase < 3 ? 1 : 0 }}>
    {/* Core orb */}
    <div data-ev-id="ev_d2c6fd41af" className="absolute rounded-full transition-all" style={{
    width: phase >= 2 ? 120 : 30, height: phase >= 2 ? 120 : 30,
    background: 'radial-gradient(circle, rgba(168,85,247,0.6) 0%, rgba(139,92,246,0.2) 40%, transparent 70%)',
    boxShadow: phase >= 2 ? '0 0 80px rgba(139,92,246,0.4), 0 0 160px rgba(6,182,212,0.2)' : '0 0 30px rgba(139,92,246,0.3)',
    transitionDuration: '800ms', transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)'
  }} />
    {/* Electric arcs */}
    {phase >= 2 && Array.from({ length: 6 }).map((_, i) =>
  <div data-ev-id="ev_ca67e8d93d" key={i} className="absolute splash-plasma-arc" style={{
    width: 2, height: 80 + i * 15,
    background: `linear-gradient(${i % 2 === 0 ? '#06b6d4' : '#a855f7'}, transparent)`,
    transform: `rotate(${i * 60}deg)`, transformOrigin: 'center bottom',
    opacity: 0.5, animationDelay: `${i * 100}ms`
  }} />
  )}
    {/* Pulse rings */}
    {[0, 1, 2].map((i) =>
  <div data-ev-id="ev_e0440d369f" key={i} className="absolute rounded-full splash-pulse-expand" style={{
    width: 60 + i * 40, height: 60 + i * 40,
    border: `1px solid ${i === 0 ? 'rgba(6,182,212,0.3)' : 'rgba(139,92,246,0.2)'}`,
    animationDelay: `${500 + i * 300}ms`, opacity: phase >= 2 ? 1 : 0
  }} />
  )}
    <p data-ev-id="ev_a2295cf65b" className="absolute mt-32 text-[10px] text-purple-400/30 font-mono tracking-widest transition-opacity" style={{ opacity: phase >= 2 ? 1 : 0 }}>ENERGY SURGE DETECTED</p>
  </div>;


/* ═══════════════════════════════════════════
 *  VARIANT 4 — Terminal Boot
 * ═══════════════════════════════════════════ */
const TerminalVariant = ({ phase }: {phase: number;}) => {
  const [lineIdx, setLineIdx] = useState(0);
  const lines = useMemo(() => [
  '> boot nvision.ai --mode=production',
  '[OK] Neural core loaded',
  '[OK] LLM engine connected',
  '[OK] Vision modules ready',
  '[OK] Interface compiled',
  '> status: ALL SYSTEMS ONLINE'],
  []);
  useEffect(() => {
    if (phase < 1 || phase >= 3) return;
    const timers = lines.map((_, i) => setTimeout(() => setLineIdx(i + 1), i * 250 + 200));
    return () => timers.forEach(clearTimeout);
  }, [phase, lines]);
  return (
    <div data-ev-id="ev_f1b01be256" className="transition-all duration-500" style={{ opacity: phase >= 1 && phase < 3 ? 1 : 0, position: phase >= 3 ? 'absolute' : 'relative', pointerEvents: phase >= 3 ? 'none' : 'auto' }}>
      <div data-ev-id="ev_47ba192a12" className="font-mono text-[11px] sm:text-xs text-left max-w-xs sm:max-w-sm space-y-1">
        {lines.slice(0, lineIdx).map((line, i) =>
        <div data-ev-id="ev_72336b1998" key={i} className="transition-opacity duration-200" style={{ color: line.startsWith('>') ? '#06b6d4' : line.includes('[OK]') ? '#22d3ee' : '#a855f7', opacity: 0.6 }}>
            {line}
          </div>
        )}
        {lineIdx < lines.length && lineIdx > 0 &&
        <span data-ev-id="ev_8cc6207336" className="inline-block w-2 h-3 bg-cyan-400/60" style={{ animation: 'blink-cursor 0.8s infinite' }} />
        }
      </div>
    </div>);

};

/* ═══════════════════════════════════════════
 *  VARIANT 5 — Shockwave
 * ═══════════════════════════════════════════ */
const ShockwaveVariant = ({ phase }: {phase: number;}) =>
<div data-ev-id="ev_1c82c5fe31" className="absolute inset-0 flex items-center justify-center" style={{ opacity: phase >= 1 && phase < 3 ? 1 : 0 }}>
    {/* Central dot */}
    <div data-ev-id="ev_f3dca8462d" className="absolute w-3 h-3 rounded-full transition-all duration-300" style={{
    background: 'rgba(6,182,212,0.8)',
    boxShadow: '0 0 20px rgba(6,182,212,0.6)',
    transform: phase >= 2 ? 'scale(0)' : 'scale(1)'
  }} />
    {/* Expanding shockwaves */}
    {phase >= 2 && [0, 1, 2, 3].map((i) =>
  <div data-ev-id="ev_351ee99993" key={i} className="absolute rounded-full splash-shockwave" style={{
    width: 10, height: 10,
    border: `2px solid ${i % 2 === 0 ? 'rgba(6,182,212,0.5)' : 'rgba(139,92,246,0.4)'}`,
    animationDelay: `${i * 200}ms`
  }} />
  )}
    {/* Radial lines */}
    {phase >= 2 && Array.from({ length: 12 }).map((_, i) =>
  <div data-ev-id="ev_97490236a8" key={i} className="absolute splash-radial-line" style={{
    width: 1, height: 60,
    background: `linear-gradient(transparent, ${i % 2 === 0 ? 'rgba(6,182,212,0.3)' : 'rgba(139,92,246,0.2)'}, transparent)`,
    transform: `rotate(${i * 30}deg)`, transformOrigin: 'center center',
    animationDelay: `${i * 50}ms`
  }} />
  )}
  </div>;


/* ═══════════════════════════════════════════
 *  VARIANT 6 — Particles Converge
 * ═══════════════════════════════════════════ */
const ParticlesVariant = ({ phase }: {phase: number;}) => {
  const particles = useMemo(() =>
  Array.from({ length: 40 }, (_, i) => {
    const angle = i / 40 * Math.PI * 2;
    const dist = 150 + Math.random() * 100;
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, delay: Math.random() * 800, color: i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#a855f7' : '#6366f1', size: 2 + Math.random() * 3 };
  }), []);
  return (
    <div data-ev-id="ev_49c5e4cf7b" className="absolute inset-0 flex items-center justify-center" style={{ opacity: phase >= 1 && phase < 3 ? 1 : 0 }}>
      {particles.map((p, i) =>
      <div data-ev-id="ev_7b04b3bb63" key={i} className="absolute rounded-full transition-all" style={{
        width: p.size, height: p.size, background: p.color,
        boxShadow: `0 0 6px ${p.color}`,
        transform: phase >= 2 ? 'translate(0,0) scale(0.5)' : `translate(${p.x}px,${p.y}px) scale(1)`,
        transitionDuration: `${800 + p.delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
        transitionDelay: `${p.delay * 0.5}ms`,
        opacity: phase >= 2 ? 0.3 : 0.8
      }} />
      )}
      {/* Center glow after converge */}
      <div data-ev-id="ev_6b73bee3dc" className="absolute w-16 h-16 rounded-full transition-all duration-500" style={{
        background: 'radial-gradient(circle, rgba(6,182,212,0.5) 0%, transparent 70%)',
        transform: phase >= 2 ? 'scale(3)' : 'scale(0)',
        opacity: phase >= 2 ? 1 : 0,
        transitionDelay: '600ms'
      }} />
    </div>);

};

/* ═══════════════════════════════════════════
 *  VARIANT 7 — Cinematic Beam
 * ═══════════════════════════════════════════ */
const CinematicVariant = ({ phase }: {phase: number;}) =>
<div data-ev-id="ev_7199c65397" className="absolute inset-0 overflow-hidden" style={{ opacity: phase >= 1 && phase < 3 ? 1 : 0 }}>
    {/* Vertical light beam */}
    <div data-ev-id="ev_f11aa53077" className="absolute top-0 left-1/2 -translate-x-1/2 transition-all" style={{
    width: phase >= 2 ? 3 : 1,
    height: '100%',
    background: 'linear-gradient(180deg, transparent 0%, rgba(6,182,212,0.6) 30%, rgba(255,255,255,0.8) 50%, rgba(168,85,247,0.6) 70%, transparent 100%)',
    boxShadow: phase >= 2 ? '0 0 40px rgba(6,182,212,0.4), 0 0 80px rgba(139,92,246,0.2)' : 'none',
    transitionDuration: '600ms',
    opacity: phase >= 2 ? 1 : 0.3
  }} />
    {/* Horizontal expansion */}
    <div data-ev-id="ev_4b6cd84c9d" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all" style={{
    width: phase >= 2 ? '80%' : 0, height: 2,
    background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.5), rgba(255,255,255,0.6), rgba(168,85,247,0.5), transparent)',
    transitionDuration: '800ms', transitionDelay: '400ms'
  }} />
    {/* Dust particles */}
    {phase >= 2 && Array.from({ length: 20 }).map((_, i) =>
  <div data-ev-id="ev_614f3965b2" key={i} className="absolute rounded-full splash-float" style={{
    width: 1.5, height: 1.5,
    left: `${20 + Math.random() * 60}%`, top: `${20 + Math.random() * 60}%`,
    background: i % 2 === 0 ? '#06b6d4' : '#a855f7',
    opacity: 0.3, animationDelay: `${i * 150}ms`
  }} />
  )}
  </div>;


/* ═══════════════════════════════════════════
 *  ALL VARIANTS
 * ═══════════════════════════════════════════ */
const VARIANTS = [
{ key: 'boot', Intro: BootVariant },
{ key: 'glitch', Intro: GlitchVariant },
{ key: 'matrix', Intro: MatrixVariant },
{ key: 'plasma', Intro: PlasmaVariant },
{ key: 'terminal', Intro: TerminalVariant },
{ key: 'shockwave', Intro: ShockwaveVariant },
{ key: 'particles', Intro: ParticlesVariant },
{ key: 'cinematic', Intro: CinematicVariant }];


/* ═══════════════════════════════════════════
 *  MAIN SPLASH SCREEN
 * ═══════════════════════════════════════════ */
export const SplashScreen = ({ onComplete }: Props) => {
  const [phase, setPhase] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  // Pick random variant once on mount
  const variantIdx = useMemo(() => Math.floor(Math.random() * VARIANTS.length), []);
  const { Intro } = VARIANTS[variantIdx];

  const alreadySeen = (() => {
    try {return sessionStorage.getItem(SESSION_KEY) === '1';}
    catch {return false;}
  })();

  const reducedMotion = typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const finish = useCallback(() => {
    if (gone) return;
    setExiting(true);
    try {sessionStorage.setItem(SESSION_KEY, '1');} catch {/* */}
    setTimeout(() => {setGone(true);onComplete();}, 600);
  }, [gone, onComplete]);

  // Skip if already seen or reduced motion
  useEffect(() => {
    if (alreadySeen || reducedMotion) {
      setGone(true);
      try {sessionStorage.setItem(SESSION_KEY, '1');} catch {/* */}
      onComplete();
    }
  }, [alreadySeen, reducedMotion, onComplete]);

  // Phase timeline
  useEffect(() => {
    if (alreadySeen || reducedMotion) return;
    const timers = [
    setTimeout(() => setPhase(1), 150),
    setTimeout(() => setPhase(2), 400),
    setTimeout(() => setPhase(3), 1600),
    setTimeout(() => setPhase(4), 2200),
    setTimeout(() => setPhase(5), 2700),
    setTimeout(() => finish(), 3400)];

    return () => timers.forEach(clearTimeout);
  }, [alreadySeen, reducedMotion, finish]);

  // Skip on click/tap/key
  useEffect(() => {
    if (alreadySeen || reducedMotion) return;
    const skip = () => finish();
    window.addEventListener('click', skip);
    window.addEventListener('keydown', skip);
    return () => {window.removeEventListener('click', skip);window.removeEventListener('keydown', skip);};
  }, [alreadySeen, reducedMotion, finish]);

  if (gone) return null;

  return (
    <div data-ev-id="ev_38a70c1a28"
    className={'fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden transition-all duration-600 ease-out ' + (
    exiting ? 'opacity-0 scale-110' : 'opacity-100 scale-100')}
    style={{ background: 'linear-gradient(160deg, #07080f 0%, #0a0b14 40%, #0d0a16 70%, #080c12 100%)' }}
    role="status" aria-label="nVision Digital AI">

      {/* Background grid */}
      <div data-ev-id="ev_6b8946f715" className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div data-ev-id="ev_cd0527021d" className="absolute inset-0 transition-opacity duration-1000" style={{
          opacity: phase >= 1 ? 0.03 : 0,
          backgroundImage: 'linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Ambient glow */}
      <div data-ev-id="ev_c011a56d5c" className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div data-ev-id="ev_1c042a9600" className="absolute rounded-full transition-all duration-[2000ms]" style={{
          width: phase >= 5 ? 500 : 200, height: phase >= 5 ? 500 : 200,
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, rgba(6,182,212,${phase >= 3 ? 0.12 : 0.05}) 0%, transparent 70%)`,
          opacity: phase >= 1 ? 1 : 0, filter: 'blur(40px)'
        }} />
      </div>

      {/* Floating particles */}
      <div data-ev-id="ev_b61a35f883" className="absolute inset-0" aria-hidden="true">
        {Array.from({ length: 16 }).map((_, i) =>
        <div data-ev-id="ev_7b80376b6b" key={i} className="absolute rounded-full splash-float" style={{
          width: 1.5 + Math.random() * 2.5, height: 1.5 + Math.random() * 2.5,
          left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%`,
          background: i % 2 === 0 ? '#06b6d4' : '#a855f7',
          opacity: phase >= 2 ? 0.25 + Math.random() * 0.3 : 0,
          animationDelay: `${i * 220}ms`, animationDuration: `${3000 + Math.random() * 3000}ms`
        }} />
        )}
      </div>

      {/* ═══ Main content ═══ */}
      <div data-ev-id="ev_c627208485" className="relative z-10 flex flex-col items-center">
        {/* Variant-specific intro animation */}
        <Intro phase={phase} />
        {/* Shared logo reveal */}
        <LogoReveal phase={phase} />
      </div>

      {/* Shockwave on logo reveal */}
      {phase >= 3 && phase < 6 &&
      <div data-ev-id="ev_a353dd7a68" className="absolute splash-pulse" style={{
        width: 80, height: 80, top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', borderRadius: '50%',
        border: '1.5px solid rgba(6,182,212,0.3)'
      }} aria-hidden="true" />
      }

      {/* Skip hint */}
      <div data-ev-id="ev_32fdcf9877" className={'absolute bottom-8 left-0 right-0 text-center transition-all duration-500 ' + (phase >= 1 ? 'opacity-100' : 'opacity-0')}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <span data-ev-id="ev_bf53366c0b" className="text-[11px] text-white/15 tracking-wider">הקש לדילוג</span>
      </div>
    </div>);

};