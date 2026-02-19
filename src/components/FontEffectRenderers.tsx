import { useEffect, useState } from 'react';
import '@/components/fontEffects.css';

/* ═════ Shared helpers ═════ */
const MAIN_SIZE = 'clamp(3rem, 8vw, 5.5rem)';
const SUB_SIZE = 'clamp(0.75rem, 2vw, 1.1rem)';
const AI_SIZE = 'clamp(0.85rem, 2.2vw, 1.25rem)';

const Glow = ({ color, opacity = 0.25 }: {color: string;opacity?: number;}) =>
<div data-ev-id="ev_f9e89b584f"
className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] rounded-full blur-[80px] transition-opacity duration-500"
style={{ background: `radial-gradient(circle, ${color}44, transparent 70%)`, opacity }} />;



const Divider = ({ colors }: {colors: string;}) =>
<div data-ev-id="ev_9e0982edc4" className="h-[1.5px] mt-3 w-44" style={{ background: `linear-gradient(90deg, transparent, ${colors}, transparent)` }} />;


/* ═════ E: GLITCH ═════ */
export const GlitchPreview = () =>
<div data-ev-id="ev_a886f64273" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center overflow-hidden">
    <Glow color="#ff00ff" />
    <div data-ev-id="ev_67a4d0e783" dir="ltr" className="relative select-none">
      <div data-ev-id="ev_3be68cdb59" className="relative inline-block">
        <span data-ev-id="ev_b49c7b24f8" className="fx-glitch text-[clamp(3rem,8vw,5.5rem)] font-black leading-none" data-text="nVision" style={{ fontFamily: '"Orbitron", sans-serif', color: '#fff' }}>
          nVision
        </span>
        <div data-ev-id="ev_608fa3a443" className="fx-glitch-scanline" />
      </div>
    </div>
    <Divider colors="#ff00ff80, #00ffff80" />
    <div data-ev-id="ev_ecf587e256" dir="ltr" className="flex items-center gap-4 mt-4">
      <span data-ev-id="ev_2b5af6f937" className="fx-glitch text-[clamp(0.75rem,2vw,1.1rem)] font-medium tracking-[0.3em]" data-text="DIGITAL" style={{ fontFamily: '"Orbitron", sans-serif', color: '#c4b5fd' }}>DIGITAL</span>
      <span data-ev-id="ev_6ff29dc951" className="px-3 py-1 rounded-md border border-cyan-400/20 bg-cyan-400/5" style={{ fontFamily: '"Orbitron"', fontWeight: 900, fontSize: AI_SIZE, color: '#06b6d4', textShadow: '0 0 15px rgba(6,182,212,0.6), 0 0 30px rgba(255,0,255,0.2)' }}>AI</span>
    </div>
  </div>;


/* ═════ F: CHROME ═════ */
export const ChromePreview = () =>
<div data-ev-id="ev_1e79702693" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center">
    <Glow color="#ffffff" opacity={0.1} />
    <div data-ev-id="ev_a028fedc8b" dir="ltr" className="relative select-none">
      <span data-ev-id="ev_602a937b03" className="fx-chrome text-[clamp(3rem,8vw,5.5rem)] font-black leading-none" style={{ fontFamily: '"Orbitron", sans-serif' }}>nVision</span>
      <div data-ev-id="ev_c7c697db17" className="fx-chrome-reflection" />
    </div>
    <div data-ev-id="ev_1dec56f989" className="h-[2px] mt-3 w-48" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,200,220,0.4), rgba(255,255,255,0.6), rgba(200,200,220,0.4), transparent)' }} />
    <div data-ev-id="ev_ee32266503" dir="ltr" className="flex items-center gap-4 mt-4">
      <span data-ev-id="ev_e9336a8d7b" className="fx-chrome" style={{ fontFamily: '"Orbitron"', fontWeight: 500, fontSize: SUB_SIZE, letterSpacing: '0.35em' }}>DIGITAL</span>
      <span data-ev-id="ev_6f94389659" className="fx-chrome px-3 py-1 rounded-md border border-white/10" style={{ fontFamily: '"Orbitron"', fontWeight: 900, fontSize: AI_SIZE }}>AI</span>
    </div>
  </div>;


/* ═════ G: NEON ═════ */
export const NeonPreview = () =>
<div data-ev-id="ev_97c4621ed2" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center">
    <div data-ev-id="ev_09ecd1856c" className="fx-neon-tube" style={{ '--neon-color': '#06b6d4' } as React.CSSProperties} />
    <div data-ev-id="ev_9a511d105f" dir="ltr" className="relative select-none flex items-baseline">
      <span data-ev-id="ev_7b4cf379d2" className="fx-neon" style={{ fontFamily: '"Orbitron"', fontWeight: 900, fontSize: MAIN_SIZE, lineHeight: 1, '--neon-color': '#06b6d4' } as React.CSSProperties}>n</span>
      <span data-ev-id="ev_52596447ec" className="fx-neon" style={{ fontFamily: '"Orbitron"', fontWeight: 900, fontSize: MAIN_SIZE, lineHeight: 1, '--neon-color': '#a855f7' } as React.CSSProperties}>Vision</span>
    </div>
    <div data-ev-id="ev_5c8facf0e4" className="h-[2px] mt-3 w-44 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #06b6d4, #a855f7, transparent)', boxShadow: '0 0 10px #06b6d4, 0 0 20px rgba(168,85,247,0.3)' }} />
    <div data-ev-id="ev_6a8aa7c4af" dir="ltr" className="flex items-center gap-4 mt-4">
      <span data-ev-id="ev_5ce2162d9c" className="fx-neon" style={{ fontFamily: '"Orbitron"', fontWeight: 500, fontSize: SUB_SIZE, letterSpacing: '0.35em', '--neon-color': '#a855f7' } as React.CSSProperties}>DIGITAL</span>
      <span data-ev-id="ev_14707f9f81" className="fx-neon px-3 py-1 rounded-md" style={{ fontFamily: '"Orbitron"', fontWeight: 900, fontSize: AI_SIZE, '--neon-color': '#06b6d4', border: '1px solid rgba(6,182,212,0.3)', boxShadow: '0 0 10px rgba(6,182,212,0.3), inset 0 0 10px rgba(6,182,212,0.05)' } as React.CSSProperties}>AI</span>
    </div>
  </div>;


/* ═════ H: HOLOGRAPHIC ═════ */
export const HoloPreview = () =>
<div data-ev-id="ev_a78445a0db" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center overflow-hidden">
    <div data-ev-id="ev_2c04f8ff55" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] rounded-full blur-[80px] opacity-15" style={{ background: 'conic-gradient(from 0deg, #ff6ec7, #7873f5, #4adede, #6ef7a7, #f7e76e, #ff6ec7)' }} />
    <div data-ev-id="ev_e379e09821" className="fx-holo-overlay" />
    <div data-ev-id="ev_c0441715c6" dir="ltr" className="relative select-none">
      <span data-ev-id="ev_b50e2eec2e" className="fx-holo font-black leading-none" style={{ fontFamily: '"Orbitron"', fontSize: MAIN_SIZE }}>nVision</span>
    </div>
    <div data-ev-id="ev_1a578226f3" className="h-[2px] mt-3 w-44 rounded-full" style={{ background: 'linear-gradient(90deg, #ff6ec7, #7873f5, #4adede, #6ef7a7, #f7e76e)', opacity: 0.5 }} />
    <div data-ev-id="ev_249243ff6e" dir="ltr" className="flex items-center gap-4 mt-4">
      <span data-ev-id="ev_7f76851f91" className="fx-holo font-medium tracking-[0.35em]" style={{ fontFamily: '"Orbitron"', fontSize: SUB_SIZE }}>DIGITAL</span>
      <span data-ev-id="ev_701cbe12ff" className="fx-holo px-3 py-1 rounded-md border border-white/10 font-black" style={{ fontFamily: '"Orbitron"', fontSize: AI_SIZE }}>AI</span>
    </div>
  </div>;


/* ═════ I: OUTLINE TRACE ═════ */
export const TracePreview = () => {
  const [replay, setReplay] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setReplay((r) => r + 1), 7000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div data-ev-id="ev_9fe4f56ea5" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center">
      <Glow color="#06b6d4" />
      <svg data-ev-id="ev_45ce74f956" key={replay} className="fx-trace-svg" viewBox="0 0 600 120" style={{ width: '100%', maxWidth: 550, height: 'auto' }}>
        <text data-ev-id="ev_4415ca5c8c" x="50%" y="55" textAnchor="middle" fontSize="72">nVision</text>
        <text data-ev-id="ev_18170dab1f" className="trace-sub" x="38%" y="100" textAnchor="middle" fontSize="72">DIGITAL</text>
        <text data-ev-id="ev_5e9a6f3dd3" className="trace-sub" x="62%" y="100" textAnchor="middle" fontSize="72" style={{ stroke: '#06b6d4' }}>AI</text>
      </svg>
    </div>);

};

/* ═════ J: LIQUID GRADIENT ═════ */
export const LiquidPreview = () =>
<div data-ev-id="ev_119cc28e7a" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center overflow-hidden">
    <div data-ev-id="ev_6d09ca6698" className="fx-liquid-blob" style={{ top: '20%', left: '20%' }} />
    <div data-ev-id="ev_352888f632" className="fx-liquid-blob" style={{ top: '60%', right: '15%', animationDelay: '2s', background: 'radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)' }} />
    <div data-ev-id="ev_4c97e316f8" dir="ltr" className="relative select-none">
      <span data-ev-id="ev_4873c071f0" className="fx-liquid font-black leading-none" style={{ fontFamily: '"Orbitron"', fontSize: MAIN_SIZE }}>nVision</span>
    </div>
    <Divider colors="#8b5cf680, #06b6d480" />
    <div data-ev-id="ev_34260b1833" dir="ltr" className="flex items-center gap-4 mt-4">
      <span data-ev-id="ev_4c1c84287e" className="fx-liquid font-medium tracking-[0.35em]" style={{ fontFamily: '"Orbitron"', fontSize: SUB_SIZE }}>DIGITAL</span>
      <span data-ev-id="ev_59afcbdcbf" className="fx-liquid px-3 py-1 rounded-md border border-purple-400/15 font-black" style={{ fontFamily: '"Orbitron"', fontSize: AI_SIZE }}>AI</span>
    </div>
  </div>;


/* ══════════════════════════════════════════
   COMBO VARIATIONS (K–R)
   ══════════════════════════════════════════ */

/* ═════ K: CHROME SERIF — Playfair + warm gold chrome ═════ */
export const ChromeSerifPreview = () =>
<div data-ev-id="ev_f05812afb7" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center">
    <div data-ev-id="ev_c46ed0bff2" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[180px] rounded-full blur-[60px] opacity-15" style={{ background: 'radial-gradient(circle, rgba(212,169,78,0.3), transparent 70%)' }} />
    <div data-ev-id="ev_38b35c2ff5" dir="ltr" className="relative select-none flex items-baseline">
      <span data-ev-id="ev_c0be136da0" className="fx-chrome-warm leading-none" style={{ fontFamily: '"Playfair Display"', fontWeight: 900, fontStyle: 'italic', fontSize: MAIN_SIZE }}>n</span>
      <span data-ev-id="ev_21732d01be" className="fx-chrome-warm leading-none" style={{ fontFamily: '"Playfair Display"', fontWeight: 900, fontSize: MAIN_SIZE }}>Vision</span>
    </div>
    <div data-ev-id="ev_966d55e7b9" className="h-[2px] mt-3 w-48" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,169,78,0.4), rgba(245,230,200,0.6), rgba(212,169,78,0.4), transparent)' }} />
    <div data-ev-id="ev_bfa92b41d6" dir="ltr" className="flex items-center gap-4 mt-4">
      <span data-ev-id="ev_71a0606398" className="fx-chrome-warm font-medium tracking-[0.4em]" style={{ fontFamily: '"Orbitron"', fontSize: SUB_SIZE }}>DIGITAL</span>
      <span data-ev-id="ev_0788aad056" className="fx-chrome-warm px-4 py-1 rounded border" style={{ fontFamily: '"Playfair Display"', fontWeight: 900, fontStyle: 'italic', fontSize: AI_SIZE, borderColor: 'rgba(212,169,78,0.2)' }}>AI</span>
    </div>
  </div>;


/* ═════ L: HOLO CYBER — Syne + holographic shift ═════ */
export const HoloCyberPreview = () =>
<div data-ev-id="ev_e195662437" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center overflow-hidden">
    <div data-ev-id="ev_80e79e02c6" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[200px] rounded-full blur-[80px] opacity-20" style={{ background: 'conic-gradient(from 45deg, #06b6d4, #8b5cf6, #ec4899, #06b6d4)' }} />
    <div data-ev-id="ev_3a7429305a" dir="ltr" className="relative select-none flex items-baseline">
      <span data-ev-id="ev_ff8475ef3d" className="fx-holo-cyber leading-none" style={{ fontFamily: '"Syne"', fontWeight: 800, fontSize: MAIN_SIZE }}>n</span>
      <span data-ev-id="ev_adbe081482" className="fx-holo-cyber leading-none" style={{ fontFamily: '"Syne"', fontWeight: 700, fontSize: MAIN_SIZE }}>Vision</span>
    </div>
    <div data-ev-id="ev_35e22e7421" className="h-[2px] mt-3 w-48" style={{ background: 'linear-gradient(90deg, transparent, #06b6d480, #8b5cf680, #ec489980, transparent)' }} />
    <div data-ev-id="ev_016c582292" dir="ltr" className="flex items-center gap-4 mt-4">
      <span data-ev-id="ev_2699895542" className="fx-holo-cyber font-semibold tracking-[0.25em]" style={{ fontFamily: '"Unbounded"', fontSize: SUB_SIZE }}>DIGITAL</span>
      <span data-ev-id="ev_e522697ffd" className="fx-holo-cyber px-3 py-1 rounded-lg border border-cyan-400/15 font-bold" style={{ fontFamily: '"Unbounded"', fontSize: AI_SIZE }}>AI</span>
    </div>
  </div>;


/* ═════ M: LIQUID TRACE — SVG trace that fills with liquid gradient ═════ */
export const LiquidTracePreview = () => {
  const [replay, setReplay] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setReplay((r) => r + 1), 8000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div data-ev-id="ev_d08cf39deb" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center">
      <Glow color="#8b5cf6" />
      <svg data-ev-id="ev_4eb57bb339" key={replay} className="fx-trace-liquid" viewBox="0 0 600 120" style={{ width: '100%', maxWidth: 550, height: 'auto' }}>
        <defs data-ev-id="ev_1e3ef9037a">
          <linearGradient data-ev-id="ev_bd562f19e3" id="liquidStrokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop data-ev-id="ev_27a30e3777" offset="0%" stopColor="#06b6d4" />
            <stop data-ev-id="ev_16b0314ae0" offset="50%" stopColor="#8b5cf6" />
            <stop data-ev-id="ev_154fbfe6df" offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient data-ev-id="ev_d09539bc6b" id="liquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop data-ev-id="ev_00181e20b4" offset="0%" stopColor="#06b6d4">
              <animate data-ev-id="ev_cc3b489f5c" attributeName="stop-color" values="#06b6d4;#8b5cf6;#ec4899;#06b6d4" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop data-ev-id="ev_bdabade34a" offset="100%" stopColor="#8b5cf6">
              <animate data-ev-id="ev_460c0086d6" attributeName="stop-color" values="#8b5cf6;#ec4899;#06b6d4;#8b5cf6" dur="4s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
        <text data-ev-id="ev_912ae90c06" x="50%" y="55" textAnchor="middle" fontSize="72" style={{ fill: 'url(#liquidGrad)', stroke: 'url(#liquidStrokeGrad)', strokeWidth: 1.5, strokeDasharray: 2000, strokeDashoffset: 2000, animation: 'trace-liquid-draw 5s ease forwards' }}>nVision</text>
        <text data-ev-id="ev_9fe9652a21" x="38%" y="100" textAnchor="middle" fontSize="20" style={{ fontWeight: 500, fill: 'url(#liquidGrad)', stroke: 'url(#liquidStrokeGrad)', strokeWidth: 0.8, strokeDasharray: 2000, strokeDashoffset: 2000, animation: 'trace-liquid-draw 5s ease 0.3s forwards' }}>DIGITAL</text>
        <text data-ev-id="ev_f6ee1d9e42" x="62%" y="100" textAnchor="middle" fontSize="24" style={{ fontWeight: 900, fill: 'url(#liquidGrad)', stroke: '#06b6d4', strokeWidth: 1, strokeDasharray: 2000, strokeDashoffset: 2000, animation: 'trace-liquid-draw 5s ease 0.5s forwards' }}>AI</text>
      </svg>
    </div>);

};

/* ═════ N: GLITCH CHROME — Chrome base + periodic glitch ═════ */
export const GlitchChromePreview = () =>
<div data-ev-id="ev_522b778b1a" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center overflow-hidden">
    <Glow color="#06b6d4" />
    <div data-ev-id="ev_037fe1dfe8" dir="ltr" className="relative select-none">
      <span data-ev-id="ev_1530ae7ada" className="fx-glitch-chrome font-black leading-none" style={{ fontFamily: '"Orbitron"', fontSize: MAIN_SIZE }}>nVision</span>
    </div>
    <div data-ev-id="ev_595953cdc1" className="h-[2px] mt-3 w-48" style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.5), rgba(255,255,255,0.4), rgba(139,92,246,0.5), transparent)' }} />
    <div data-ev-id="ev_cfc006df22" dir="ltr" className="flex items-center gap-4 mt-4">
      <span data-ev-id="ev_bf315590e6" className="fx-glitch-chrome font-medium tracking-[0.3em]" style={{ fontFamily: '"Orbitron"', fontSize: SUB_SIZE }}>DIGITAL</span>
      <span data-ev-id="ev_843fb8bfec" className="fx-glitch-chrome px-3 py-1 rounded-md border border-cyan-400/15 font-black" style={{ fontFamily: '"Orbitron"', fontSize: AI_SIZE }}>AI</span>
    </div>
  </div>;


/* ═════ O: GLASS FROST — Frosted glass text card ═════ */
export const GlassFrostPreview = () =>
<div data-ev-id="ev_a126686583" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center">
    {/* Colorful blobs behind glass */}
    <div data-ev-id="ev_0133239d72" className="absolute w-32 h-32 rounded-full blur-[50px] opacity-40" style={{ top: '20%', left: '25%', background: '#06b6d4' }} />
    <div data-ev-id="ev_55e10b58cf" className="absolute w-28 h-28 rounded-full blur-[50px] opacity-30" style={{ top: '40%', right: '20%', background: '#8b5cf6' }} />
    <div data-ev-id="ev_cbfa00ef06" className="absolute w-20 h-20 rounded-full blur-[40px] opacity-25" style={{ bottom: '20%', left: '40%', background: '#ec4899' }} />

    <div data-ev-id="ev_1d1b783b99" className="fx-glass-wrap relative">
      <div data-ev-id="ev_33cda836f2" dir="ltr" className="relative select-none flex flex-col items-center gap-3">
        <span data-ev-id="ev_413ea80ab7" className="fx-glass-text font-black leading-none" style={{ fontFamily: '"Orbitron"', fontSize: MAIN_SIZE }}>nVision</span>
        <div data-ev-id="ev_1d335b2816" className="h-[1px] w-44" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />
        <div data-ev-id="ev_d7906ce818" className="flex items-center gap-3">
          <span data-ev-id="ev_1e846fbaa5" className="fx-glass-text font-medium tracking-[0.35em]" style={{ fontFamily: '"Orbitron"', fontSize: SUB_SIZE }}>DIGITAL</span>
          <span data-ev-id="ev_4adfea78f5" className="px-3 py-1 rounded-md border border-white/10 bg-white/5 fx-glass-text font-black" style={{ fontFamily: '"Orbitron"', fontSize: AI_SIZE }}>AI</span>
        </div>
      </div>
    </div>
  </div>;


/* ═════ P: AURORA BOREALIS — Northern lights flow ═════ */
export const AuroraPreview = () =>
<div data-ev-id="ev_f7b788bf39" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center overflow-hidden">
    <div data-ev-id="ev_8ef1d11a2e" className="fx-aurora-bg" />
    <div data-ev-id="ev_fe90a8cfb9" dir="ltr" className="relative select-none flex items-baseline">
      <span data-ev-id="ev_16e3e18ea4" className="fx-aurora font-black leading-none" style={{ fontFamily: '"Orbitron"', fontSize: MAIN_SIZE }}>nVision</span>
    </div>
    <div data-ev-id="ev_f17060dc32" className="h-[2px] mt-3 w-52 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #06b6d4, #4ade80, #8b5cf6, transparent)', opacity: 0.5 }} />
    <div data-ev-id="ev_65cb599627" dir="ltr" className="flex items-center gap-4 mt-4">
      <span data-ev-id="ev_2d768388f9" className="fx-aurora font-medium tracking-[0.35em]" style={{ fontFamily: '"Orbitron"', fontSize: SUB_SIZE }}>DIGITAL</span>
      <span data-ev-id="ev_dcfe62a376" className="fx-aurora px-3 py-1 rounded-md border border-emerald-400/15 font-black" style={{ fontFamily: '"Orbitron"', fontSize: AI_SIZE }}>AI</span>
    </div>
  </div>;


/* ═════ Q: ELECTRIC PULSE — Energy glow with arcs ═════ */
export const ElectricPreview = () =>
<div data-ev-id="ev_402dd1deef" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center">
    <Glow color="#06b6d4" opacity={0.2} />
    {/* Electric arcs */}
    <div data-ev-id="ev_7d56248266" className="fx-electric-arc" style={{ top: '30%', left: '15%', width: '20%', animationDelay: '0s' }} />
    <div data-ev-id="ev_f89d658a1f" className="fx-electric-arc" style={{ top: '60%', right: '10%', width: '25%', animationDelay: '1.2s' }} />
    <div data-ev-id="ev_040b981218" className="fx-electric-arc" style={{ top: '45%', left: '35%', width: '30%', animationDelay: '0.7s' }} />
    <div data-ev-id="ev_b138b00267" className="fx-electric-arc" style={{ bottom: '25%', left: '20%', width: '15%', animationDelay: '1.8s' }} />

    <div data-ev-id="ev_96ad0463cb" dir="ltr" className="relative select-none">
      <span data-ev-id="ev_f4c781ffd5" className="fx-electric font-black leading-none" style={{ fontFamily: '"Orbitron"', fontSize: MAIN_SIZE }}>nVision</span>
    </div>
    <div data-ev-id="ev_d29e5f4c56" className="h-[2px] mt-3 w-48 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.6), rgba(139,92,246,0.4), transparent)', boxShadow: '0 0 8px rgba(6,182,212,0.4)' }} />
    <div data-ev-id="ev_fb8cf11805" dir="ltr" className="flex items-center gap-4 mt-4">
      <span data-ev-id="ev_29ee6b6e1a" className="fx-electric font-medium tracking-[0.35em]" style={{ fontFamily: '"Orbitron"', fontSize: SUB_SIZE }}>DIGITAL</span>
      <span data-ev-id="ev_b386130272" className="fx-electric px-3 py-1 rounded-md border border-cyan-500/20 font-black" style={{ fontFamily: '"Orbitron"', fontSize: AI_SIZE, boxShadow: '0 0 15px rgba(6,182,212,0.2), inset 0 0 15px rgba(6,182,212,0.05)' }}>AI</span>
    </div>
  </div>;


/* ═════ R: PRISMATIC — Light refraction effect ═════ */
export const PrismaticPreview = () =>
<div data-ev-id="ev_75d34e5ebb" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center overflow-hidden">
    <Glow color="#a78bfa" />
    {/* Refraction lines */}
    <div data-ev-id="ev_00fe102d2e" className="fx-prism-line" style={{ left: '30%' }} />
    <div data-ev-id="ev_2ddc73073d" className="fx-prism-line" style={{ left: '60%', animationDelay: '3s' }} />

    <div data-ev-id="ev_a03ad20acd" dir="ltr" className="relative select-none">
      <span data-ev-id="ev_8004e58641" className="fx-prism font-black leading-none" style={{ fontFamily: '"Orbitron"', fontSize: MAIN_SIZE }}>nVision</span>
    </div>
    <div data-ev-id="ev_a7cad61bca" className="h-[2px] mt-3 w-52" style={{ background: 'linear-gradient(90deg, transparent, #06b6d4, #a78bfa, #fde68a, #fb923c, #a78bfa, #06b6d4, transparent)', opacity: 0.4 }} />
    <div data-ev-id="ev_64da5836e7" dir="ltr" className="flex items-center gap-4 mt-4">
      <span data-ev-id="ev_03be2ffa6b" className="fx-prism font-medium tracking-[0.35em]" style={{ fontFamily: '"Orbitron"', fontSize: SUB_SIZE }}>DIGITAL</span>
      <span data-ev-id="ev_6e73678a70" className="fx-prism px-3 py-1 rounded-md border border-purple-400/15 font-black" style={{ fontFamily: '"Orbitron"', fontSize: AI_SIZE }}>AI</span>
    </div>
  </div>;


/* ═════ Registry ═════ */
export const EFFECT_RENDERERS: Record<string, React.FC> = {
  E: GlitchPreview,
  F: ChromePreview,
  G: NeonPreview,
  H: HoloPreview,
  I: TracePreview,
  J: LiquidPreview,
  K: ChromeSerifPreview,
  L: HoloCyberPreview,
  M: LiquidTracePreview,
  N: GlitchChromePreview,
  O: GlassFrostPreview,
  P: AuroraPreview,
  Q: ElectricPreview,
  R: PrismaticPreview
};