import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
import '@/components/entranceEffects.css';

/* ═══ DemoShell — shared wrapper with replay + phase control ═══ */
interface DemoShellProps {
  children: (phase: number, elapsed: number) => React.ReactNode;
  duration: number;
  label: string;
}

const DemoShell = ({ children, duration, label }: DemoShellProps) => {
  const [key, setKey] = useState(0);
  const [phase, setPhase] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());
  const rafRef = useRef(0);

  const replay = useCallback(() => {
    setKey((k) => k + 1);
    setPhase(0);
    setElapsed(0);
    startRef.current = Date.now();
  }, []);

  useEffect(() => {
    startRef.current = Date.now();
    const tick = () => {
      const e = Date.now() - startRef.current;
      setElapsed(e);
      if (e > duration + 1500) {
        startRef.current = Date.now();
        setKey((k) => k + 1);
        setPhase(0);
        setElapsed(0);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [duration, key]);

  useEffect(() => {
    const timers = [
    setTimeout(() => setPhase(1), 200),
    setTimeout(() => setPhase(2), 700),
    setTimeout(() => setPhase(3), 1500),
    setTimeout(() => setPhase(4), 2400),
    setTimeout(() => setPhase(5), 3200),
    setTimeout(() => setPhase(6), 4000)];

    return () => timers.forEach(clearTimeout);
  }, [key]);

  return (
    <div data-ev-id="ev_39feb1be32" className="relative">
      <div data-ev-id="ev_9df194d2ed" key={key} className="entrance-demo">{children(phase, elapsed)}</div>
      <button data-ev-id="ev_f9a10dc746" onClick={replay} className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-colors" aria-label="הפעל מחדש">
        <RotateCcw className="w-3.5 h-3.5 text-white/50" />
      </button>
      <div data-ev-id="ev_0767648c71" className="absolute bottom-3 right-3 z-20 px-2 py-0.5 rounded text-[10px] text-white/20 bg-black/40 backdrop-blur-sm">{label}</div>
    </div>);

};

/* ═══ Shared Logo ═══ */
const NVisionLogo = ({ style, className = '' }: {style?: React.CSSProperties;className?: string;}) =>
<div data-ev-id="ev_6bf734bf67" dir="ltr" className={`flex flex-col items-center select-none ${className}`} style={style}>
    <div data-ev-id="ev_2a48ce2451">
      <span data-ev-id="ev_c09028843f" className="text-3xl sm:text-4xl font-black" style={{ color: '#06b6d4', textShadow: '0 0 25px rgba(6,182,212,0.5)' }}>n</span>
      <span data-ev-id="ev_cb32e63bc3" className="text-3xl sm:text-4xl font-black text-white/90">Vision</span>
    </div>
    <div data-ev-id="ev_1bd7685bc8" className="h-[1px] mt-1.5 w-28" style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.5), rgba(168,85,247,0.5), transparent)' }} />
    <span data-ev-id="ev_17090c5318" className="text-xs font-semibold tracking-[0.2em] mt-2" style={{ background: 'linear-gradient(135deg, #a855f7, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Digital AI</span>
  </div>;


/* ═════════════════════════════════════════════════
   1. BOOT SEQUENCE
   ═════════════════════════════════════════════════ */
export const BootSequenceDemo = () => {
  const streams = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    left: `${10 + i * 16}%`, delay: `${i * 0.3}s`, duration: `${2 + Math.random()}s`,
    chars: Array.from({ length: 8 }, () => Math.random().toString(16).charAt(2))
  })), []);

  const burstParticles = useMemo(() => Array.from({ length: 12 }, (_, i) => {
    const angle = i / 12 * Math.PI * 2;
    return { bx: `${Math.cos(angle) * 60}px`, by: `${Math.sin(angle) * 60}px`, delay: `${i * 0.03}s` };
  }), []);

  return (
    <DemoShell duration={4500} label="Boot Sequence">
      {(phase, elapsed) =>
      <div data-ev-id="ev_fb72210d93" className="absolute inset-0 flex flex-col items-center justify-center">
          <div data-ev-id="ev_0b8a934d46" className="absolute inset-0" style={{ opacity: phase >= 1 ? 0.04 : 0, backgroundImage: 'linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)', backgroundSize: '30px 30px', animation: phase >= 1 ? 'ent-hex-pulse 3s ease infinite' : 'none', transition: 'opacity 1s' }} />

          {phase >= 1 && phase < 4 && streams.map((s, i) =>
        <div data-ev-id="ev_9fc812b4d4" key={i} className="absolute top-0 bottom-0 font-mono text-[8px] text-cyan-500/20 overflow-hidden" style={{ left: s.left, width: '12px', animation: `ent-data-stream ${s.duration} linear ${s.delay} infinite` }}>
              {s.chars.map((c, j) => <div data-ev-id="ev_b80b4cbb04" key={j}>{c}</div>)}
            </div>
        )}

          <div data-ev-id="ev_ff48b2e58c" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-[2000ms]" style={{ width: phase >= 5 ? 350 : 120, height: phase >= 5 ? 350 : 120, background: `radial-gradient(circle, rgba(6,182,212,${phase >= 3 ? 0.15 : 0.05}) 0%, transparent 70%)`, opacity: phase >= 1 ? 1 : 0, filter: 'blur(30px)' }} />

          <div data-ev-id="ev_544ce399f3" className="flex flex-col items-center transition-all duration-500" style={{ opacity: phase >= 1 && phase < 3 ? 1 : 0, transform: phase >= 3 ? 'scale(2)' : 'scale(1)', position: phase >= 3 ? 'absolute' : 'relative', pointerEvents: 'none' }}>
            <svg data-ev-id="ev_195e3cb079" width="80" height="80" className="-rotate-90">
              <circle data-ev-id="ev_df5487b156" cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
              <circle data-ev-id="ev_178e94a487" cx="40" cy="40" r="36" fill="none" stroke="url(#entGrad)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="226" style={{ animation: phase >= 2 ? 'ent-ring-fill 1.2s ease-out forwards' : 'none', strokeDashoffset: 226 }} />
              <defs data-ev-id="ev_a63556d9e8"><linearGradient data-ev-id="ev_652c031835" id="entGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop data-ev-id="ev_2d1e9b4e3b" offset="0%" stopColor="#06b6d4" /><stop data-ev-id="ev_9390996698" offset="100%" stopColor="#a855f7" /></linearGradient></defs>
            </svg>
            <span data-ev-id="ev_adb2f4cbc5" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-mono font-bold text-cyan-400" style={{ animation: phase >= 2 ? 'ent-counter-glow 1.5s ease infinite' : 'none' }}>
              {phase >= 2 ? Math.min(100, Math.floor((elapsed - 700) / 10)) : 0}%
            </span>
            <span data-ev-id="ev_00d53279f0" className="text-[9px] text-white/20 font-mono mt-3 tracking-wider">initializing neural core...</span>
          </div>

          {phase === 3 && burstParticles.map((p, i) =>
        <div data-ev-id="ev_a9f92cedce" key={i} className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400" style={{ '--bx': p.bx, '--by': p.by, animation: `ent-particle-burst 0.6s ease-out ${p.delay} forwards` } as React.CSSProperties} />
        )}

          <div data-ev-id="ev_e384b309ef" className="flex flex-col items-center" style={{ opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? 'scale(1) translateY(0)' : 'scale(0.5) translateY(12px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
            <div data-ev-id="ev_bee4e2b97d" dir="ltr" className="flex items-baseline select-none">
              <span data-ev-id="ev_31cf124e4e" className="text-3xl sm:text-4xl font-black" style={{ color: '#06b6d4', textShadow: '0 0 30px rgba(6,182,212,0.6)' }}>n</span>
              {'Vision'.split('').map((l, i) => <span data-ev-id="ev_04633f9bae" key={i} className="text-3xl sm:text-4xl font-black text-white/90" style={{ opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? 'translateY(0)' : 'translateY(8px)', transition: `all 0.35s ease ${i * 60 + 100}ms` }}>{l}</span>)}
            </div>
            <div data-ev-id="ev_4b6fb121d5" className="h-[1px] mt-1.5" style={{ width: phase >= 3 ? 130 : 0, background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.6), rgba(168,85,247,0.6), transparent)', transition: 'width 0.8s 0.2s' }} />
            <div data-ev-id="ev_3023de2f17" dir="ltr" className="flex items-center gap-2 mt-2" style={{ opacity: phase >= 4 ? 1 : 0, transition: 'all 0.5s' }}>
              <span data-ev-id="ev_843b30c8aa" className="text-xs sm:text-sm font-semibold tracking-[0.2em]" style={{ background: 'linear-gradient(135deg, #a855f7, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Digital AI</span>
            </div>
          </div>

          {phase >= 3 && phase < 6 && <div data-ev-id="ev_ff478a6d0f" className="absolute top-1/2 left-1/2 rounded-full border border-cyan-500/30" style={{ width: 50, height: 50, animation: 'ent-shockwave-ring 0.8s ease-out forwards' }} />}
        </div>
      }
    </DemoShell>);

};

/* ═════════════════════════════════════════════════
   2. GLITCH REVEAL — Text emerges FROM the glitch with distortions
   ═════════════════════════════════════════════════ */
export const GlitchRevealDemo = () => {
  const LETTERS = ['n', 'V', 'i', 's', 'i', 'o', 'n'];

  const letterOffsets = useMemo(() => LETTERS.map(() => ({
    x: (Math.random() - 0.5) * 50,
    y: (Math.random() - 0.5) * 40,
    r: (Math.random() - 0.5) * 25,
    settleDelay: 300 + Math.random() * 500
  })), []);

  const glitchBlocks = useMemo(() => Array.from({ length: 8 }, () => ({
    top: `${Math.random() * 80 + 10}%`,
    left: `${Math.random() * 60}%`,
    width: `${20 + Math.random() * 40}%`,
    height: `${3 + Math.random() * 8}px`,
    delay: `${Math.random() * 1}s`,
    duration: `${0.2 + Math.random() * 0.4}s`,
    color: Math.random() > 0.5 ? 'rgba(255,0,100,0.15)' : 'rgba(0,255,200,0.12)'
  })), []);

  return (
    <DemoShell duration={5000} label="Glitch Reveal">
      {(phase) =>
      <div data-ev-id="ev_a5ef2dd05d" className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Screen corruption flashes */}
          <div data-ev-id="ev_fc9f9f03b4" className="absolute inset-0" style={{ background: 'rgba(255,0,100,0.03)', animation: phase >= 1 && phase < 4 ? 'ent-glitch-screen 2s linear infinite' : 'none' }} />

          {/* Glitch blocks — rectangular corruption */}
          {phase >= 1 && phase < 4 && glitchBlocks.map((b, i) =>
        <div data-ev-id="ev_8a5aa64ca0" key={i} className="absolute" style={{ top: b.top, left: b.left, width: b.width, height: b.height, background: b.color, animation: `ent-glitch-block ${b.duration} linear ${b.delay} infinite` }} />
        )}

          {/* Scanlines */}
          <div data-ev-id="ev_22b72e3f52" className="absolute inset-0 pointer-events-none" style={{ opacity: phase >= 1 && phase < 5 ? 0.06 : 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.04) 2px, rgba(255,255,255,0.04) 4px)', transition: 'opacity 0.5s' }} />

          {/* Letters emerging from glitch */}
          <div data-ev-id="ev_c07854ed0c" dir="ltr" className="relative flex items-baseline select-none" style={{ animation: phase >= 5 ? 'ent-glitch-idle 5s linear infinite' : 'none' }}>
            {LETTERS.map((letter, i) => {
            const off = letterOffsets[i];
            const isN = i === 0;
            const isSettling = phase >= 2 && phase < 4;
            const isSettled = phase >= 4;

            // RGB split amount decreases over phases
            const rgbOffset = phase < 3 ? 4 : phase < 4 ? 2 : phase < 5 ? 0.5 : 0;

            return (
              <span data-ev-id="ev_7378e042f3" key={i} className="relative inline-block text-3xl sm:text-4xl font-black" style={{
                color: isN ? '#06b6d4' : 'rgba(255,255,255,0.9)',
                textShadow: isN ? '0 0 20px rgba(6,182,212,0.5)' : 'none',
                opacity: phase < 2 ? 0 : 1,
                transform: isSettled ?
                'translate(0, 0) rotate(0deg)' :
                isSettling ?
                `translate(${off.x * 0.3}px, ${off.y * 0.3}px) rotate(${off.r * 0.3}deg)` :
                `translate(${off.x}px, ${off.y}px) rotate(${off.r}deg)`,
                transition: `all ${0.5 + i * 0.08}s cubic-bezier(0.16,1,0.3,1)`,
                transitionDelay: `${off.settleDelay}ms`
              }}>
                  {/* Chromatic aberration layers */}
                  {rgbOffset > 0 &&
                <>
                      <span data-ev-id="ev_b7f850c9bf" className="absolute inset-0 text-3xl sm:text-4xl font-black" style={{ color: '#ff00ff', opacity: 0.2 * (rgbOffset / 4), transform: `translate(${-rgbOffset}px, ${rgbOffset * 0.5}px)`, mixBlendMode: 'screen', pointerEvents: 'none' }}>{letter}</span>
                      <span data-ev-id="ev_013fcab454" className="absolute inset-0 text-3xl sm:text-4xl font-black" style={{ color: '#00ffff', opacity: 0.2 * (rgbOffset / 4), transform: `translate(${rgbOffset}px, ${-rgbOffset * 0.5}px)`, mixBlendMode: 'screen', pointerEvents: 'none' }}>{letter}</span>
                    </>
                }
                  {letter}
                </span>);

          })}
          </div>

          {/* Subtitle */}
          <div data-ev-id="ev_5946ea1866" className="mt-3 flex flex-col items-center" style={{ opacity: phase >= 4 ? 1 : 0, transition: 'opacity 0.6s' }}>
            <div data-ev-id="ev_11a142ee30" className="h-[1px] w-28 mb-2" style={{ background: 'linear-gradient(90deg, transparent, #ff006430, #00ffff30, transparent)' }} />
            <span data-ev-id="ev_9df45410ea" className="text-xs font-semibold tracking-[0.2em]" style={{ background: 'linear-gradient(90deg, #ff00ff, #00ffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Digital AI</span>
          </div>
        </div>
      }
    </DemoShell>);

};

/* ═════════════════════════════════════════════════
   3. CINEMATIC BEAM — Vertical beam of light reveals logo
   ═════════════════════════════════════════════════ */
export const CinematicWipeDemo = () => {
  const dustParticles = useMemo(() => Array.from({ length: 15 }, () => ({
    dx: `${(Math.random() - 0.5) * 150}px`, dy: `${(Math.random() - 0.5) * 80}px`,
    delay: `${1 + Math.random() * 2}s`, duration: `${2 + Math.random() * 2}s`, size: 1 + Math.random() * 2
  })), []);

  return (
    <DemoShell duration={5500} label="Cinematic Beam">
      {(phase) =>
      <div data-ev-id="ev_94a2c18524" className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Vertical light beam */}
          {phase >= 1 && phase < 5 &&
        <div data-ev-id="ev_b96cfcb164" className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-10" style={{
          width: phase >= 2 ? '40px' : '8px',
          background: 'linear-gradient(180deg, transparent 5%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.9) 70%, transparent 95%)',
          boxShadow: '0 0 40px 15px rgba(6,182,212,0.3), 0 0 80px 30px rgba(6,182,212,0.15), 0 0 120px 50px rgba(168,85,247,0.1)',
          filter: `blur(${phase >= 3 ? 8 : 2}px)`,
          opacity: phase >= 4 ? 0 : phase >= 3 ? 0.5 : 1,
          transition: 'all 0.8s ease'
        }} />
        }

          {/* Screen flash at beam peak */}
          <div data-ev-id="ev_337fe443b0" className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.15), transparent 70%)',
          opacity: phase === 2 ? 0.8 : 0,
          transition: 'opacity 0.4s'
        }} />

          {/* Ambient glow */}
          <div data-ev-id="ev_4f08937218" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] rounded-full blur-[70px]" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)', opacity: phase >= 3 ? 1 : 0, transition: 'opacity 1.5s' }} />

          {/* Dust particles */}
          {phase >= 3 && dustParticles.map((p, i) =>
        <div data-ev-id="ev_57857908d5" key={i} className="absolute top-1/2 left-1/2 rounded-full bg-white/40" style={{ width: p.size, height: p.size, '--dx': p.dx, '--dy': p.dy, animation: `ent-dust-float ${p.duration} ease ${p.delay} infinite` } as React.CSSProperties} />
        )}

          {/* Logo — hidden by beam brightness, revealed as it fades */}
          <NVisionLogo style={{
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'scale(1)' : 'scale(0.95)',
          filter: phase >= 4 ? 'blur(0)' : phase >= 3 ? 'blur(2px) brightness(1.5)' : 'blur(8px) brightness(2)',
          transition: 'all 1s cubic-bezier(0.16,1,0.3,1)'
        }} />
        </div>
      }
    </DemoShell>);

};

/* ═════════════════════════════════════════════════
   4. TERMINAL BOOT — More lines + loading bar + simultaneous reveal
   ═════════════════════════════════════════════════ */
const TERM_LINES = [
{ text: '> boot nVision AI Core v4.2.1', delay: 150 },
{ text: '> initializing subsystems...', delay: 400 },
{ text: '  ├─ language_model   ✓', delay: 650 },
{ text: '  ├─ vision_engine    ✓', delay: 850 },
{ text: '  ├─ reasoning_core   ✓', delay: 1000 },
{ text: '  ├─ quantum_bridge   ✓', delay: 1150 },
{ text: '  └─ neural_mesh      ✓', delay: 1300 },
{ text: '> memory: 12.4 TB allocated', delay: 1500 },
{ text: '> GPU cluster: 8× A100 ONLINE', delay: 1700 },
{ text: '> 847M parameters loaded', delay: 1900 },
{ text: '> initiating main sequence...', delay: 2100 }];


const LOAD_START = 2300;
const LOAD_DURATION = 1500;

export const TerminalBootDemo = () => {
  const matrixCols = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    left: `${5 + i * 10}%`, delay: `${Math.random() * 2}s`, duration: `${1.5 + Math.random() * 2}s`,
    chars: Array.from({ length: 5 }, () => String.fromCharCode(0x30A0 + Math.random() * 96))
  })), []);

  return (
    <DemoShell duration={5500} label="Terminal Boot">
      {(_, elapsed) => {
        const loadProgress = Math.max(0, Math.min(1, (elapsed - LOAD_START) / LOAD_DURATION));
        const pct = Math.floor(loadProgress * 100);
        const barFilled = Math.floor(loadProgress * 30);
        const barEmpty = 30 - barFilled;
        const barStr = '█'.repeat(barFilled) + '░'.repeat(barEmpty);
        const showLoad = elapsed > LOAD_START;
        const loadDone = loadProgress >= 1;

        return (
          <div data-ev-id="ev_4850957ee1" className="absolute inset-0 flex flex-col p-3 sm:p-5 font-mono text-[9px] sm:text-[11px]" style={{ color: '#22c55e' }}>
            {/* CRT scanlines */}
            <div data-ev-id="ev_c5b39c4690" className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(34,197,94,0.1) 1px, rgba(34,197,94,0.1) 2px)' }} />

            {/* Matrix rain bg */}
            {!loadDone && matrixCols.map((col, i) =>
            <div data-ev-id="ev_7e058d618d" key={i} className="absolute top-0 text-[7px] text-green-500/10 overflow-hidden" style={{ left: col.left, animation: `ent-matrix-fall ${col.duration} linear ${col.delay} infinite` }}>
                {col.chars.map((c, j) => <div data-ev-id="ev_d6384e7b40" key={j}>{c}</div>)}
              </div>
            )}

            {/* Terminal output */}
            <div data-ev-id="ev_6110ae61c9" className="relative z-10 space-y-0.5 flex-shrink-0">
              {TERM_LINES.map((line, i) =>
              <div data-ev-id="ev_90acd68ad1" key={i} style={{ opacity: elapsed > line.delay ? 1 : 0, transition: 'opacity 0.05s' }}>
                  <span data-ev-id="ev_b78eb5b4b4" style={{ animation: elapsed > line.delay ? 'ent-terminal-glow 2s ease infinite' : 'none' }}>{line.text}</span>
                </div>
              )}

              {/* Loading bar */}
              {showLoad &&
              <div data-ev-id="ev_d587c2b071" className="mt-1">
                  <span data-ev-id="ev_d30e7ddaf0" style={{ animation: 'ent-terminal-glow 1s ease infinite' }}>
                    {'>'} [{barStr}] {pct}%
                  </span>
                </div>
              }
            </div>

            {/* nVision reveals AS loading progresses */}
            <div data-ev-id="ev_79bec0e294" className="flex-1 flex flex-col items-center justify-center">
              <div data-ev-id="ev_fe4ae2f3d8" dir="ltr" className="select-none text-center" style={{
                opacity: loadProgress,
                filter: `blur(${(1 - loadProgress) * 8}px)`,
                transform: `scale(${0.8 + loadProgress * 0.2}) translateY(${(1 - loadProgress) * 12}px)`,
                transition: 'filter 0.1s'
              }}>
                <span data-ev-id="ev_f448a34849" className="text-2xl sm:text-3xl font-black" style={{ color: '#22c55e', textShadow: '0 0 20px rgba(34,197,94,0.5), 0 0 40px rgba(34,197,94,0.2), 0 0 60px rgba(34,197,94,0.1)' }}>nVision</span>
                <br data-ev-id="ev_8bb473d33b" />
                <span data-ev-id="ev_3300b2a44d" className="text-[9px] tracking-[0.3em]" style={{ color: '#22c55e', opacity: 0.6 }}>DIGITAL AI</span>
              </div>
            </div>

            {/* Cursor */}
            <div data-ev-id="ev_327e334105" className="relative z-10" style={{ opacity: !loadDone ? 1 : 0 }}>
              <span data-ev-id="ev_e1bccb68f9" className="inline-block w-2 h-3 bg-green-500" style={{ animation: 'ent-cursor-blink 0.8s step-end infinite' }} />
            </div>
          </div>);

      }}
    </DemoShell>);

};

/* ═════════════════════════════════════════════════
   5. HOLOGRAPHIC PROJECTION (unchanged)
   ═════════════════════════════════════════════════ */
export const HolographicDemo = () =>
<DemoShell duration={5000} label="Holographic Projection">
    {(phase) =>
  <div data-ev-id="ev_a182392d20" className="absolute inset-0 flex flex-col items-center justify-center">
        <div data-ev-id="ev_d4d3c165df" className="absolute bottom-[15%] left-1/2 -translate-x-1/2" style={{ width: 0, height: 0, borderLeft: '80px solid transparent', borderRight: '80px solid transparent', borderBottom: '120px solid rgba(6,182,212,0.04)', filter: 'blur(10px)', opacity: phase >= 1 ? 0.8 : 0, transition: 'opacity 0.8s' }} />

        <div data-ev-id="ev_5ea9b783f6" className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[55%] h-[3px] rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)', opacity: phase >= 1 ? 0.9 : 0, transition: 'opacity 0.5s', boxShadow: '0 0 25px rgba(6,182,212,0.4), 0 -10px 40px rgba(6,182,212,0.15)' }} />

        {phase >= 1 && phase < 5 && <div data-ev-id="ev_c739e0af7e" className="absolute left-[12%] right-[12%] h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.6), transparent)', animation: 'ent-holo-scan 2s ease-in-out forwards' }} />}

        <div data-ev-id="ev_12f29ebc62" className="absolute inset-0" style={{ opacity: phase >= 2 ? 0.05 : 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(6,182,212,0.15) 3px, rgba(6,182,212,0.15) 4px)', animation: phase >= 2 ? 'ent-holo-lines 0.5s linear infinite' : 'none', transition: 'opacity 0.5s' }} />

        {phase >= 2 && phase < 5 &&
    <>
            <div data-ev-id="ev_3ef2675c13" className="absolute left-0 right-0 h-[2px]" style={{ top: '30%', background: 'rgba(6,182,212,0.1)', animation: 'scanline 4s linear infinite' }} />
            <div data-ev-id="ev_c05443b2f5" className="absolute left-0 right-0 h-[1px]" style={{ top: '55%', background: 'rgba(168,85,247,0.08)', animation: 'scanline 6s linear infinite reverse' }} />
          </>
    }

        <div data-ev-id="ev_63b9529858" dir="ltr" className="flex flex-col items-center select-none" style={{ animation: phase >= 2 ? 'ent-holo-appear 2.5s ease-out forwards, ent-holo-jitter 0.1s linear infinite' : 'none', opacity: 0 }}>
          <div data-ev-id="ev_fcb939e495">
            <span data-ev-id="ev_7202d4d1d5" className="text-3xl sm:text-4xl font-black" style={{ color: 'rgba(6,182,212,0.9)', textShadow: '0 0 20px rgba(6,182,212,0.5), 0 2px 0 rgba(6,182,212,0.1)' }}>n</span>
            <span data-ev-id="ev_2c2ce53d0c" className="text-3xl sm:text-4xl font-black" style={{ color: 'rgba(255,255,255,0.75)', textShadow: '0 0 15px rgba(6,182,212,0.3), 0 2px 0 rgba(6,182,212,0.05)' }}>Vision</span>
          </div>
          <div data-ev-id="ev_ebe180ab64" className="h-[1px] mt-1.5 w-28" style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)' }} />
          <span data-ev-id="ev_9b80842e11" className="text-xs font-semibold tracking-[0.25em] mt-2" style={{ color: 'rgba(6,182,212,0.5)' }}>Digital AI</span>
        </div>

        <div data-ev-id="ev_8c2f0a1f13" className="absolute inset-0" style={{ background: 'rgba(6,182,212,0.02)', opacity: phase >= 2 ? 1 : 0 }} />
      </div>
  }
  </DemoShell>;


/* ═════════════════════════════════════════════════
   6. STILL LAKE — Stone dropped in calm water
   ═════════════════════════════════════════════════ */
export const ShockwaveDemo = () => {
  const ripples = useMemo(() => Array.from({ length: 7 }, (_, i) => ({
    delay: `${0.3 + i * 0.4}s`,
    size: 200 + i * 80,
    opacity: 0.35 - i * 0.04,
    duration: `${2.5 + i * 0.3}s`
  })), []);

  const splashDrops = useMemo(() => Array.from({ length: 5 }, (_, i) => {
    const angle = i / 5 * Math.PI + Math.PI; // upward semicircle
    return { sx: `${Math.cos(angle) * (10 + Math.random() * 15)}px`, sy: `${Math.sin(angle) * (15 + Math.random() * 20)}px`, delay: `${i * 0.03}s` };
  }), []);

  return (
    <DemoShell duration={5500} label="Still Lake">
      {(phase) =>
      <div data-ev-id="ev_2d8de9e8a2" className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Water surface line */}
          <div data-ev-id="ev_7733c4c70c" className="absolute top-1/2 left-[8%] right-[8%] h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.15), rgba(6,182,212,0.2), rgba(6,182,212,0.15), transparent)', animation: phase >= 1 ? 'ent-lake-surface 3s ease infinite' : 'none', opacity: phase >= 1 ? 0.2 : 0, transition: 'opacity 1s' }} />

          {/* Subtle water reflection below center */}
          <div data-ev-id="ev_d54f8be551" className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[60%] h-[30%] blur-[40px]" style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.05), transparent 70%)', opacity: phase >= 2 ? 1 : 0, transition: 'opacity 1s' }} />

          {/* Falling stone */}
          {phase >= 1 && phase < 3 &&
        <div data-ev-id="ev_48910e62b7" className="absolute left-1/2 w-2 h-2 rounded-full" style={{ background: 'white', boxShadow: '0 0 8px rgba(255,255,255,0.5)', animation: 'ent-stone-drop 0.6s ease-in forwards' }} />
        }

          {/* Small splash */}
          {phase >= 2 && phase < 4 && splashDrops.map((d, i) =>
        <div data-ev-id="ev_7063f686c1" key={i} className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-cyan-300/50" style={{ '--sx': d.sx, '--sy': d.sy, animation: `ent-splash-up 0.5s ease-out ${d.delay} forwards` } as React.CSSProperties} />
        )}

          {/* Concentric ripples */}
          {phase >= 2 && ripples.map((r, i) =>
        <div data-ev-id="ev_96bc2b6cb9" key={i} className="absolute top-1/2 left-1/2 rounded-full border border-cyan-400/30" style={{ width: r.size, height: r.size * 0.35, animation: `ent-ripple ${r.duration} ease-out ${r.delay} forwards`, opacity: 0 }} />
        )}

          {/* Logo rising from water */}
          <NVisionLogo style={{
          animation: phase >= 3 ? 'ent-logo-rise 1.8s cubic-bezier(0.16,1,0.3,1) forwards' : 'none',
          opacity: 0
        }} />
        </div>
      }
    </DemoShell>);

};

/* ═════════════════════════════════════════════════
   7. QUANTUM COLLAPSE — 80 particles + massive explosion
   ═════════════════════════════════════════════════ */
export const QuantumCollapseDemo = () => {
  const dots = useMemo(() => Array.from({ length: 80 }, (_, i) => ({
    qx: `${(Math.random() - 0.5) * 300}px`,
    qy: `${(Math.random() - 0.5) * 200}px`,
    delay: Math.random() * 0.8,
    color: ['#06b6d4', '#a855f7', '#818cf8', '#f0abfc'][i % 4],
    size: 1.5 + Math.random() * 3
  })), []);

  const explosionRings = useMemo(() => Array.from({ length: 5 }, (_, i) => ({
    delay: `${i * 0.12}s`,
    color: i % 2 === 0 ? 'rgba(6,182,212,0.4)' : 'rgba(168,85,247,0.3)'
  })), []);

  const debris = useMemo(() => Array.from({ length: 20 }, (_, i) => {
    const angle = i / 20 * Math.PI * 2;
    const dist = 40 + Math.random() * 80;
    return {
      dx: `${Math.cos(angle) * dist}px`, dy: `${Math.sin(angle) * dist}px`,
      size: 1 + Math.random() * 3,
      color: ['#06b6d4', '#a855f7', '#818cf8', '#ffffff'][i % 4],
      delay: `${i * 0.02}s`
    };
  }), []);

  return (
    <DemoShell duration={5500} label="Quantum Collapse">
      {(phase) =>
      <div data-ev-id="ev_58c4d71bfe" className="absolute inset-0 flex flex-col items-center justify-center" style={{ animation: phase === 3 ? 'ent-screen-shake 0.4s ease' : 'none' }}>
          {/* Converging particles */}
          {phase >= 1 && phase < 5 && dots.map((d, i) =>
        <div data-ev-id="ev_63e14bb184" key={i} className="absolute top-1/2 left-1/2 rounded-full" style={{
          width: d.size, height: d.size, background: d.color,
          boxShadow: `0 0 6px ${d.color}`,
          '--qx': d.qx, '--qy': d.qy,
          animation: `ent-quantum-dot 2s ease-in ${d.delay}s forwards`,
          opacity: 0
        } as React.CSSProperties} />
        )}

          {/* EXPLOSION: bright flash (double pulse) */}
          <div data-ev-id="ev_4d753fbb51" className="absolute inset-0" style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.25), rgba(6,182,212,0.1) 40%, transparent 60%)',
          animation: phase >= 3 ? 'ent-quantum-flash 1.5s ease forwards' : 'none',
          opacity: 0
        }} />

          {/* EXPLOSION: expanding rings */}
          {phase >= 3 && phase < 6 && explosionRings.map((r, i) =>
        <div data-ev-id="ev_4cb537521a" key={i} className="absolute top-1/2 left-1/2 rounded-full" style={{
          width: 30, height: 30,
          border: `1.5px solid ${r.color}`,
          animation: `ent-quantum-wave 1.2s ease-out ${r.delay} forwards`
        }} />
        )}

          {/* EXPLOSION: debris flying outward */}
          {phase >= 3 && phase < 5 && debris.map((d, i) =>
        <div data-ev-id="ev_68cc907d5b" key={i} className="absolute top-1/2 left-1/2 rounded-full" style={{
          width: d.size, height: d.size, background: d.color,
          '--dx': d.dx, '--dy': d.dy,
          animation: `ent-quantum-debris 0.7s ease-out ${d.delay} forwards`
        } as React.CSSProperties} />
        )}

          {/* Logo */}
          <NVisionLogo style={{ animation: phase >= 3 ? 'ent-quantum-reveal 1.8s cubic-bezier(0.16,1,0.3,1) forwards' : 'none', opacity: 0 }} />
        </div>
      }
    </DemoShell>);

};

/* ═════════════════════════════════════════════════
   8. ELEGANT FADE (unchanged)
   ═════════════════════════════════════════════════ */
export const ElegantFadeDemo = () => {
  const orbs = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    ox: `${(Math.random() - 0.5) * 180}px`, oy: `${(Math.random() - 0.5) * 100}px`,
    odx: `${(Math.random() - 0.5) * 40}px`, ody: `${-20 - Math.random() * 30}px`,
    delay: `${i * 0.5}s`, duration: `${3 + Math.random() * 2}s`,
    size: 3 + Math.random() * 5, color: i % 2 === 0 ? 'rgba(6,182,212,0.3)' : 'rgba(139,92,246,0.3)'
  })), []);

  return (
    <DemoShell duration={5500} label="Elegant Fade">
      {(phase) =>
      <div data-ev-id="ev_eb4cab1612" className="absolute inset-0 flex flex-col items-center justify-center">
          <div data-ev-id="ev_695e91e525" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[220px] rounded-full blur-[80px]" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)', opacity: phase >= 1 ? 1 : 0, animation: phase >= 1 ? 'ent-breath 4s ease infinite' : 'none', transition: 'opacity 2s' }} />

          {phase >= 1 && orbs.map((o, i) =>
        <div data-ev-id="ev_88c952ee98" key={i} className="absolute top-1/2 left-1/2 rounded-full" style={{ width: o.size, height: o.size, background: o.color, filter: 'blur(1px)', '--ox': o.ox, '--oy': o.oy, '--odx': o.odx, '--ody': o.ody, animation: `ent-orb-float ${o.duration} ease ${o.delay} infinite` } as React.CSSProperties} />
        )}

          <div data-ev-id="ev_eeb7ce9637" className="absolute top-[38%] left-[12%] right-[12%] h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.12), transparent)', opacity: phase >= 1 ? 1 : 0, transition: 'opacity 1.5s' }} />
          <div data-ev-id="ev_4e34cfce4a" className="absolute bottom-[38%] left-[12%] right-[12%] h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.12), transparent)', opacity: phase >= 1 ? 1 : 0, transition: 'opacity 1.5s 0.3s' }} />

          <div data-ev-id="ev_185b222964" dir="ltr" className="flex flex-col items-center select-none">
            <div data-ev-id="ev_404963175b">
              <span data-ev-id="ev_899707c632" className="text-3xl sm:text-5xl font-black" style={{ fontStyle: 'italic', color: '#06b6d4', textShadow: '0 0 35px rgba(6,182,212,0.3)', opacity: phase >= 2 ? 1 : 0, transition: 'opacity 1.5s ease 0.2s', display: 'inline-block' }}>n</span>
              {'Vision'.split('').map((l, i) =>
            <span data-ev-id="ev_5fdb34545e" key={i} className="text-3xl sm:text-5xl font-black" style={{ color: 'rgba(255,255,255,0.88)', opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? 'translateY(0)' : 'translateY(18px)', transition: `all 1.2s ease ${0.4 + i * 0.13}s`, display: 'inline-block' }}>{l}</span>
            )}
            </div>

            <div data-ev-id="ev_17f11a1015" className="flex items-center gap-3 mt-3">
              <div data-ev-id="ev_28c8a4479b" className="h-px" style={{ width: phase >= 3 ? 55 : 0, background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.35))', transition: 'width 1.2s ease 0.5s' }} />
              <div data-ev-id="ev_b3a54c40cf" className="flex gap-1.5">
                {[0.8, 1, 1.2].map((s, i) =>
              <div data-ev-id="ev_5f686f086a" key={i} className="rounded-full" style={{ width: `${s * 4}px`, height: `${s * 4}px`, background: i === 1 ? 'rgba(139,92,246,0.4)' : 'rgba(6,182,212,0.4)', opacity: phase >= 3 ? 1 : 0, transition: `opacity 0.5s ${0.8 + i * 0.2}s` }} />
              )}
              </div>
              <div data-ev-id="ev_16bb450ced" className="h-px" style={{ width: phase >= 3 ? 55 : 0, background: 'linear-gradient(90deg, rgba(6,182,212,0.35), transparent)', transition: 'width 1.2s ease 0.5s' }} />
            </div>

            <span data-ev-id="ev_24ce1a609c" className="text-xs tracking-[0.3em] mt-3" style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.7), rgba(6,182,212,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', opacity: phase >= 4 ? 1 : 0, transform: phase >= 4 ? 'translateY(0)' : 'translateY(8px)', transition: 'all 1s ease 0.3s' }}>Digital AI</span>
          </div>
        </div>
      }
    </DemoShell>);

};

/* ═════════════════════════════════════════════════
   9. MATRIX RAIN — Characters form nVision then transform
   ═════════════════════════════════════════════════ */

/** Slot-machine character: cycles through random katakana then settles on target */
const CyclingChar = ({ target, cycleStart, settleDuration }: {target: string;cycleStart: number;settleDuration: number;}) => {
  const [display, setDisplay] = useState(' ');
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    const startTimer = setTimeout(() => {
      interval = setInterval(() => {
        setDisplay(String.fromCharCode(0x30A0 + Math.random() * 96));
      }, 50);
    }, cycleStart);

    const settleTimer = setTimeout(() => {
      if (interval) clearInterval(interval);
      setDisplay(target);
      setSettled(true);
    }, cycleStart + settleDuration);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(settleTimer);
      if (interval) clearInterval(interval);
    };
  }, [target, cycleStart, settleDuration]);

  return (
    <span data-ev-id="ev_0c53b9ed14" className="inline-block text-2xl sm:text-3xl font-mono font-bold transition-all duration-300" style={{
      color: settled ? '#22c55e' : '#22c55e60',
      textShadow: settled ? '0 0 15px rgba(34,197,94,0.8), 0 0 30px rgba(34,197,94,0.3)' : '0 0 5px rgba(34,197,94,0.3)',
      transform: settled ? 'scale(1.1)' : 'scale(1)',
      minWidth: '0.7em',
      textAlign: 'center'
    }}>
      {display}
    </span>);

};

export const MatrixRainDemo = () => {
  const LETTERS = 'nVision';
  const columns = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    left: `${i * 5}%`, delay: `${Math.random() * 2}s`, duration: `${1 + Math.random() * 2}s`,
    chars: Array.from({ length: 12 }, () => String.fromCharCode(0x30A0 + Math.random() * 96))
  })), []);

  return (
    <DemoShell duration={6000} label="Matrix Rain">
      {(phase) =>
      <div data-ev-id="ev_cc7727744a" className="absolute inset-0 flex flex-col items-center justify-center" style={{ fontFamily: 'monospace' }}>
          {/* Rain columns */}
          {phase >= 1 && columns.map((col, i) =>
        <div data-ev-id="ev_a84f5777e4" key={i} className="absolute top-0 text-[10px] leading-tight overflow-hidden" style={{
          left: col.left, color: '#22c55e',
          opacity: phase >= 4 ? 0.03 : 0.35,
          transition: 'opacity 1s',
          animation: `ent-matrix-char-fall ${col.duration} linear ${col.delay} infinite`,
          '--mh': '300px'
        } as React.CSSProperties}>
              {col.chars.map((c, j) =>
          <div data-ev-id="ev_26a95668bc" key={j} style={{ opacity: j === 0 ? 1 : 0.3 + Math.random() * 0.5, textShadow: j === 0 ? '0 0 8px #22c55e' : 'none' }}>{c}</div>
          )}
            </div>
        )}

          {/* Green glow */}
          <div data-ev-id="ev_6908ce4241" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full blur-[60px]" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.1), transparent 70%)', opacity: phase >= 2 ? 1 : 0, transition: 'opacity 1s' }} />

          {/* Cycling characters forming "nVision" */}
          <div data-ev-id="ev_4f5cbf288c" dir="ltr" className="relative z-10 flex items-center gap-0" style={{ opacity: phase >= 2 ? 1 : 0, transition: 'opacity 0.5s' }}>
            {phase >= 2 && LETTERS.split('').map((letter, i) =>
          <CyclingChar key={i} target={letter} cycleStart={0} settleDuration={800 + i * 200} />
          )}
          </div>

          {/* Transform to styled logo */}
          <div data-ev-id="ev_ede6d9aafd" className="absolute flex flex-col items-center" style={{
          opacity: phase >= 5 ? 1 : 0,
          transition: 'opacity 0.8s'
        }}>
            <div data-ev-id="ev_a5af84441a" dir="ltr">
              <span data-ev-id="ev_218cb42e2e" className="text-3xl sm:text-4xl font-black" style={{ color: '#06b6d4', textShadow: '0 0 25px rgba(6,182,212,0.5)' }}>n</span>
              <span data-ev-id="ev_98535331d3" className="text-3xl sm:text-4xl font-black text-white/90">Vision</span>
            </div>
            <div data-ev-id="ev_5d2922f0d0" className="h-[1px] mt-1.5 w-28" style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.5), rgba(168,85,247,0.5), transparent)' }} />
            <span data-ev-id="ev_bf3fd7dece" className="text-xs font-semibold tracking-[0.2em] mt-2" style={{ background: 'linear-gradient(135deg, #a855f7, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Digital AI</span>
          </div>

          {/* Hide cycling chars when styled logo shows */}
          <div data-ev-id="ev_72cd4c509e" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ opacity: phase >= 5 ? 0 : 1, transition: 'opacity 0.6s', pointerEvents: 'none' }}>
            {/* This matches the cycling chars position */}
          </div>
        </div>
      }
    </DemoShell>);

};

/* ═════════════════════════════════════════════════
   10. PLASMA ARC — Electric arcs converge to form text
   ═════════════════════════════════════════════════ */
export const PlasmaArcDemo = () => {
  const arcs = useMemo(() => {
    const starts = [
    { x: 0, y: 20 }, { x: 200, y: 30 }, { x: 30, y: 0 }, { x: 170, y: 0 },
    { x: 0, y: 100 }, { x: 200, y: 90 }, { x: 60, y: 125 }, { x: 140, y: 125 }];

    return starts.map((start, i) => {
      const end = { x: 100, y: 62 };
      const segs = 6 + Math.floor(Math.random() * 3);
      let path = `M ${start.x} ${start.y}`;
      for (let j = 1; j < segs; j++) {
        const t = j / segs;
        const x = start.x + (end.x - start.x) * t + (Math.random() - 0.5) * 30;
        const y = start.y + (end.y - start.y) * t + (Math.random() - 0.5) * 20;
        path += ` L ${x} ${y}`;
      }
      path += ` L ${end.x} ${end.y}`;
      return { path, delay: i * 0.15, color: i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#a855f7' : '#818cf8' };
    });
  }, []);

  const sparks = useMemo(() => Array.from({ length: 12 }, (_, i) => {
    const angle = i / 12 * Math.PI * 2;
    return { spx: `${Math.cos(angle) * 25}px`, spy: `${Math.sin(angle) * 25}px`, delay: `${i * 0.03}s` };
  }), []);

  return (
    <DemoShell duration={5000} label="Plasma Arc">
      {(phase) =>
      <div data-ev-id="ev_2f917e93b8" className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Static noise bg */}
          <div data-ev-id="ev_df85905b1d" className="absolute inset-0" style={{ opacity: phase >= 1 && phase < 4 ? 0.03 : 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`, transition: 'opacity 0.5s' }} />

          {/* Lightning arcs SVG */}
          <svg data-ev-id="ev_f2beb404d0" className="absolute inset-0 w-full h-full" viewBox="0 0 200 125" preserveAspectRatio="xMidYMid">
            <defs data-ev-id="ev_99dcfb2dc7">
              <filter data-ev-id="ev_566de90d7a" id="arcGlow">
                <feGaussianBlur data-ev-id="ev_b378754cc1" stdDeviation="2" result="blur" />
                <feMerge data-ev-id="ev_fa697cc01c">
                  <feMergeNode data-ev-id="ev_791d6610df" in="blur" />
                  <feMergeNode data-ev-id="ev_9669bb2180" in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {phase >= 2 && arcs.map((arc, i) =>
          <path data-ev-id="ev_8f3412a3ff" key={i} d={arc.path} fill="none" stroke={arc.color} strokeWidth="1.5" strokeLinecap="round" filter="url(#arcGlow)" strokeDasharray="400" strokeDashoffset="400" style={{ animation: `ent-plasma-draw 0.6s ease-out ${arc.delay}s forwards` }} />
          )}
          </svg>

          {/* Center flash when arcs converge */}
          <div data-ev-id="ev_414ae6a77b" className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(6,182,212,0.2), transparent 50%)', animation: phase >= 3 ? 'ent-plasma-flash 1s ease forwards' : 'none', opacity: 0 }} />

          {/* Sparks at convergence point */}
          {phase >= 3 && phase < 5 && sparks.map((s, i) =>
        <div data-ev-id="ev_b2ba7c3612" key={i} className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-white" style={{ '--spx': s.spx, '--spy': s.spy, animation: `ent-spark 0.4s ease-out ${s.delay} forwards` } as React.CSSProperties} />
        )}

          {/* Logo with electric glow */}
          <NVisionLogo style={{
          opacity: phase >= 3 ? 1 : 0,
          filter: phase >= 3 && phase < 5 ? 'drop-shadow(0 0 8px rgba(6,182,212,0.5))' : 'none',
          transform: phase >= 3 ? 'scale(1)' : 'scale(0.9)',
          transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)'
        }} />

          {/* Residual arcs (subtle idle) */}
          {phase >= 4 &&
        <svg data-ev-id="ev_2f714668ec" className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 125" preserveAspectRatio="xMidYMid">
              {arcs.slice(0, 3).map((arc, i) =>
          <path data-ev-id="ev_80c320a18e" key={i} d={arc.path} fill="none" stroke={arc.color} strokeWidth="0.5" strokeLinecap="round" filter="url(#arcGlow)" style={{ animation: `ent-plasma-idle 2s ease ${i * 0.5}s infinite` }} />
          )}
            </svg>
        }
        </div>
      }
    </DemoShell>);

};

/* ═════════════════════════════════════════════════
   11. DIMENSIONAL RIFT — Crack in reality reveals the logo
   ═════════════════════════════════════════════════ */
export const DimensionalRiftDemo = () => {
  const riftParticles = useMemo(() => Array.from({ length: 16 }, (_, i) => {
    const angle = i / 16 * Math.PI * 2;
    return { rpx: `${Math.cos(angle) * 40}px`, rpy: `${Math.sin(angle) * 40}px`, delay: `${i * 0.05}s` };
  }), []);

  // Clip-path polygons for the crack widening
  const getClipPath = (phase: number): string => {
    if (phase < 2) return 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)';
    if (phase < 3) return 'polygon(49% 10%, 51% 5%, 52% 40%, 50.5% 55%, 51.5% 85%, 49% 95%, 48% 60%, 49.5% 40%)';
    if (phase < 4) return 'polygon(40% 0%, 58% 0%, 62% 35%, 56% 55%, 60% 80%, 58% 100%, 38% 100%, 42% 70%, 36% 50%, 40% 30%)';
    if (phase < 5) return 'polygon(15% 0%, 85% 0%, 90% 30%, 85% 50%, 90% 70%, 85% 100%, 15% 100%, 10% 70%, 15% 50%, 10% 30%)';
    return 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
  };

  return (
    <DemoShell duration={5500} label="Dimensional Rift">
      {(phase) =>
      <div data-ev-id="ev_56810d9afa" className="absolute inset-0 flex flex-col items-center justify-center" style={{ animation: phase >= 1 && phase < 3 ? 'ent-rift-shake 0.3s ease infinite' : 'none' }}>
          {/* Light leaking through the crack */}
          <div data-ev-id="ev_93bf824206" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[4px] h-[80%]" style={{
          background: 'linear-gradient(180deg, transparent 10%, rgba(255,255,255,0.9) 50%, transparent 90%)',
          boxShadow: '0 0 30px 10px rgba(6,182,212,0.4), 0 0 60px 20px rgba(168,85,247,0.2)',
          opacity: phase >= 2 && phase < 5 ? 0.8 : 0,
          transform: `scaleX(${phase >= 3 ? 8 : phase >= 2 ? 2 : 1})`,
          filter: `blur(${phase >= 3 ? 5 : 1}px)`,
          transition: 'all 0.6s ease'
        }} />

          {/* Content behind the rift (logo) */}
          <div data-ev-id="ev_69086161da" className="absolute inset-0 flex items-center justify-center" style={{
          clipPath: getClipPath(phase),
          transition: 'clip-path 0.8s cubic-bezier(0.16,1,0.3,1)'
        }}>
            {/* Bright background glow behind logo */}
            <div data-ev-id="ev_ee9115bdc2" className="absolute inset-0" style={{
            background: 'radial-gradient(circle at center, rgba(6,182,212,0.08), rgba(168,85,247,0.04) 50%, transparent 70%)',
            opacity: phase >= 2 ? 1 : 0
          }} />

            <NVisionLogo style={{
            filter: phase >= 4 ? 'none' : 'brightness(1.5)',
            transition: 'filter 0.5s'
          }} />
          </div>

          {/* Crack edge glow lines */}
          {phase >= 2 && phase < 5 &&
        <>
              <div data-ev-id="ev_8b729436c8" className="absolute top-[10%] bottom-[10%] left-1/2 -translate-x-[2px] w-[1px]" style={{ background: 'linear-gradient(180deg, transparent, rgba(6,182,212,0.6), transparent)', animation: 'ent-rift-line-glow 1s ease infinite', opacity: phase >= 4 ? 0 : 0.8, transition: 'opacity 0.5s' }} />
              <div data-ev-id="ev_03907198d4" className="absolute top-[10%] bottom-[10%] left-1/2 translate-x-[1px] w-[1px]" style={{ background: 'linear-gradient(180deg, transparent, rgba(168,85,247,0.5), transparent)', animation: 'ent-rift-line-glow 1s ease 0.3s infinite', opacity: phase >= 4 ? 0 : 0.6, transition: 'opacity 0.5s' }} />
            </>
        }

          {/* Particles escaping from the rift */}
          {phase >= 2 && phase < 4 && riftParticles.map((p, i) =>
        <div data-ev-id="ev_462f13b992" key={i} className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full" style={{
          background: i % 2 === 0 ? '#06b6d4' : '#a855f7',
          '--rpx': p.rpx, '--rpy': p.rpy,
          animation: `ent-rift-particle 0.8s ease-out ${p.delay} forwards`
        } as React.CSSProperties} />
        )}
        </div>
      }
    </DemoShell>);

};