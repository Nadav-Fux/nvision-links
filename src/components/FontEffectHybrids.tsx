import { useState, useEffect } from 'react';
import '@/components/fontEffects.css';

/* ═══════════════════════════════════════════════
 *  K-R: Hybrid / Advanced Font Effect Previews
 * ═══════════════════════════════════════════════ */

/* ── K: Chrome + Playfair Display (Luxury Premium) ── */
export const ChromeSerifPreview = () =>
<div data-ev-id="ev_d82c4fd23e" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center">
    <div data-ev-id="ev_19e6f02aed" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[180px] rounded-full blur-[60px] opacity-10"
  style={{ background: 'radial-gradient(circle, #ffffff44, transparent 70%)' }} />
    <div data-ev-id="ev_9070cff2f1" dir="ltr" className="relative select-none flex items-baseline">
      <span data-ev-id="ev_898712d676"
    className="fx-chrome leading-none"
    style={{ fontFamily: '"Playfair Display", serif', fontWeight: 900, fontStyle: 'italic', fontSize: 'clamp(3rem,8vw,5.5rem)' }}>
      n</span>
      <span data-ev-id="ev_481d84bd24"
    className="fx-chrome leading-none"
    style={{ fontFamily: '"Playfair Display", serif', fontWeight: 900, fontSize: 'clamp(3rem,8vw,5.5rem)' }}>
      Vision</span>
      <div data-ev-id="ev_50ae26644a" className="fx-chrome-reflection" />
    </div>
    <div data-ev-id="ev_6ed850a637" className="h-[2px] mt-3 w-52" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,200,220,0.3), rgba(255,255,255,0.5), rgba(200,200,220,0.3), transparent)' }} />
    <div data-ev-id="ev_3a0812e59f" dir="ltr" className="flex items-center gap-4 mt-4">
      <span data-ev-id="ev_ef940f4c7d" className="fx-chrome text-[clamp(0.75rem,2vw,1.1rem)] tracking-[0.4em]" style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 500 }}>DIGITAL</span>
      <span data-ev-id="ev_af20da15d2" className="px-4 py-1.5 rounded-lg border border-white/10 bg-white/[0.02]"
    style={{ fontFamily: '"Playfair Display", serif', fontWeight: 900, fontStyle: 'italic', fontSize: 'clamp(0.9rem,2.2vw,1.3rem)', color: '#d4d4d8', textShadow: '0 0 15px rgba(255,255,255,0.2)' }}>
        AI
      </span>
    </div>
  </div>;


/* ── L: Holographic + Syne (Future Iridescent) ── */
export const HoloSynePreview = () =>
<div data-ev-id="ev_91b3fbce87" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center overflow-hidden">
    <div data-ev-id="ev_24662aad84" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] rounded-full blur-[80px] opacity-15"
  style={{ background: 'conic-gradient(from 0deg, #ff6ec7, #7873f5, #4adede, #6ef7a7, #f7e76e, #ff6ec7)' }} />
    <div data-ev-id="ev_6278e02d16" className="fx-holo-overlay" />
    <div data-ev-id="ev_26c0514c97" dir="ltr" className="relative select-none flex items-baseline">
      <span data-ev-id="ev_f61693578e" className="fx-holo leading-none" style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 'clamp(3rem,8vw,5.5rem)' }}>n</span>
      <span data-ev-id="ev_8cd902a753" className="fx-holo leading-none" style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 'clamp(3rem,8vw,5.5rem)' }}>Vision</span>
    </div>
    <div data-ev-id="ev_cf64197222" className="h-[2px] mt-3 w-44 rounded-full" style={{ background: 'linear-gradient(90deg, #ff6ec7, #7873f5, #4adede, #6ef7a7, #f7e76e)', opacity: 0.5 }} />
    <div data-ev-id="ev_5e40782997" dir="ltr" className="flex items-center gap-4 mt-4">
      <span data-ev-id="ev_36b558b1ba" className="fx-holo text-[clamp(0.75rem,2vw,1.1rem)] tracking-[0.25em]" style={{ fontFamily: '"Unbounded", sans-serif', fontWeight: 600 }}>DIGITAL</span>
      <span data-ev-id="ev_c8e3629870" className="fx-holo px-3 py-1 rounded-md border border-white/10 text-[clamp(0.85rem,2.2vw,1.25rem)]" style={{ fontFamily: '"Unbounded", sans-serif', fontWeight: 800 }}>AI</span>
    </div>
  </div>;


/* ── M: Liquid Trace (SVG draws then fills with flowing color) ── */
export const LiquidTracePreview = () => {
  const [replay, setReplay] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setReplay((r) => r + 1), 8000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div data-ev-id="ev_0f90e15e92" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center">
      <div data-ev-id="ev_63a6699dea" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] rounded-full blur-[80px] opacity-20"
      style={{ background: 'radial-gradient(circle, #8b5cf644, #06b6d422, transparent 70%)' }} />
      <svg data-ev-id="ev_2c9d03aa8f" key={replay} className="fx-trace-liquid" viewBox="0 0 600 120" style={{ width: '100%', maxWidth: 550, height: 'auto' }}>
        <defs data-ev-id="ev_455c90e3ce">
          <linearGradient data-ev-id="ev_0e4c2ae2e8" id="liquidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop data-ev-id="ev_1759276e3b" offset="0%" stopColor="#06b6d4">
              <animate data-ev-id="ev_63efcb3051" attributeName="stop-color" values="#06b6d4;#8b5cf6;#ec4899;#06b6d4" dur="5s" repeatCount="indefinite" />
            </stop>
            <stop data-ev-id="ev_1bc33fe6f5" offset="50%" stopColor="#8b5cf6">
              <animate data-ev-id="ev_67ebba0cef" attributeName="stop-color" values="#8b5cf6;#ec4899;#06b6d4;#8b5cf6" dur="5s" repeatCount="indefinite" />
            </stop>
            <stop data-ev-id="ev_57ffb3a6b5" offset="100%" stopColor="#ec4899">
              <animate data-ev-id="ev_0102c05731" attributeName="stop-color" values="#ec4899;#06b6d4;#8b5cf6;#ec4899" dur="5s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
        <text data-ev-id="ev_d692ea2412" x="50%" y="55" textAnchor="middle" fontSize="72">nVision</text>
        <text data-ev-id="ev_f60b9a89bd" className="trace-sub" x="38%" y="100" textAnchor="middle" fontSize="72">DIGITAL</text>
        <text data-ev-id="ev_05bf196f76" className="trace-sub" x="62%" y="100" textAnchor="middle" fontSize="72" style={{ stroke: '#06b6d4' }}>AI</text>
      </svg>
    </div>);

};

/* ── N: Corrupted Chrome (Glitch + Metal) ── */
export const CorruptedChromePreview = () =>
<div data-ev-id="ev_eb1a84d714" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center overflow-hidden">
    <div data-ev-id="ev_2cab3070ac" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[180px] rounded-full blur-[60px] opacity-10"
  style={{ background: 'radial-gradient(circle, #ff006633, #ffffff22, transparent 70%)' }} />
    <div data-ev-id="ev_df8daa5fa6" dir="ltr" className="relative select-none">
      <span data-ev-id="ev_bccf0fe71b"
    className="fx-corrupt-chrome relative inline-block text-[clamp(3rem,8vw,5.5rem)] leading-none"
    data-text="nVision"
    style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 900 }}>
      nVision</span>
    </div>
    <div data-ev-id="ev_81ed335ba3" className="h-[2px] mt-3 w-44" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), rgba(255,0,100,0.2), rgba(255,255,255,0.3), transparent)' }} />
    <div data-ev-id="ev_22298c04ed" dir="ltr" className="flex items-center gap-4 mt-4">
      <span data-ev-id="ev_c1726c7293" className="fx-corrupt-chrome relative text-[clamp(0.75rem,2vw,1.1rem)] tracking-[0.3em]" data-text="DIGITAL" style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 500 }}>DIGITAL</span>
      <span data-ev-id="ev_89d461fd84" className="fx-corrupt-chrome relative px-3 py-1 rounded-md border border-white/10 text-[clamp(0.85rem,2.2vw,1.25rem)]" data-text="AI" style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 900 }}>AI</span>
    </div>
  </div>;


/* ── O: Elegant Hologram (Cormorant Garamond + pastel holo) ── */
export const ElegantHoloPreview = () =>
<div data-ev-id="ev_b2e8d72009" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center overflow-hidden">
    <div data-ev-id="ev_ab2894ea7d" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[220px] rounded-full blur-[80px] opacity-15"
  style={{ background: 'radial-gradient(circle, #e0c3fc44, #8ec5fc33, transparent 70%)' }} />
    <div data-ev-id="ev_10c8324dc0" dir="ltr" className="relative select-none flex items-baseline">
      <span data-ev-id="ev_0447f8f76a" className="fx-elegant-holo leading-none" style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, fontStyle: 'italic', fontSize: 'clamp(3.5rem,9vw,6rem)' }}>n</span>
      <span data-ev-id="ev_9caa1a3361" className="fx-elegant-holo leading-none" style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 600, fontStyle: 'italic', fontSize: 'clamp(3.5rem,9vw,6rem)' }}>Vision</span>
    </div>
    <div data-ev-id="ev_1ebf8da38d" className="h-[1px] mt-3 w-52" style={{ background: 'linear-gradient(90deg, transparent, #e0c3fc60, #8ec5fc60, transparent)' }} />
    <div data-ev-id="ev_0f666a754b" dir="ltr" className="flex items-center gap-4 mt-4">
      <span data-ev-id="ev_b99f5977cb" className="fx-elegant-holo text-[clamp(0.75rem,2vw,1.1rem)] tracking-[0.4em]" style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 400 }}>DIGITAL</span>
      <span data-ev-id="ev_0b2c979d44" className="fx-elegant-holo px-3 py-1 rounded-md border border-white/5 text-[clamp(0.9rem,2.2vw,1.3rem)]" style={{ fontFamily: '"Italiana", serif', fontWeight: 400 }}>AI</span>
    </div>
  </div>;


/* ── P: Fluid Future (Unbounded + flowing gradient) ── */
export const FluidFuturePreview = () =>
<div data-ev-id="ev_775740ebbf" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center overflow-hidden">
    <div data-ev-id="ev_b9e0917673" className="absolute top-1/3 left-1/4 w-[200px] h-[200px] rounded-full blur-[60px] opacity-10"
  style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }} />
    <div data-ev-id="ev_ed04c69a46" className="absolute bottom-1/3 right-1/4 w-[180px] h-[180px] rounded-full blur-[60px] opacity-10"
  style={{ background: 'radial-gradient(circle, #ec4899, transparent 70%)' }} />
    <div data-ev-id="ev_8bc290d6f1" dir="ltr" className="relative select-none flex items-baseline">
      <span data-ev-id="ev_b0ad7d1a28" className="fx-fluid leading-none" style={{ fontFamily: '"Unbounded", sans-serif', fontWeight: 800, fontSize: 'clamp(2.8rem,7.5vw,5rem)' }}>n</span>
      <span data-ev-id="ev_af01ea5092" className="fx-fluid leading-none" style={{ fontFamily: '"Unbounded", sans-serif', fontWeight: 700, fontSize: 'clamp(2.8rem,7.5vw,5rem)' }}>Vision</span>
    </div>
    <div data-ev-id="ev_d4ad30a547" className="h-[2px] mt-3 w-44 fx-fluid rounded-full" style={{ WebkitTextFillColor: 'unset', backgroundClip: 'unset', WebkitBackgroundClip: 'unset' }} />
    <div data-ev-id="ev_7b1ce93cda" dir="ltr" className="flex items-center gap-4 mt-4">
      <span data-ev-id="ev_4954adf781" className="fx-fluid text-[clamp(0.75rem,2vw,1.1rem)] tracking-[0.2em]" style={{ fontFamily: '"Unbounded", sans-serif', fontWeight: 500 }}>DIGITAL</span>
      <span data-ev-id="ev_9157309ca2" className="fx-fluid px-3 py-1 rounded-lg border border-purple-400/10 text-[clamp(0.85rem,2.2vw,1.25rem)]" style={{ fontFamily: '"Unbounded", sans-serif', fontWeight: 800 }}>AI</span>
    </div>
  </div>;


/* ── Q: Frosted Glass (Glassmorphism) ── */
export const FrostedGlassPreview = () =>
<div data-ev-id="ev_3de9a513d9" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center">
    {/* Background blobs for the glass to refract */}
    <div data-ev-id="ev_f1f715039f" className="absolute top-[30%] left-[20%] w-[150px] h-[150px] rounded-full blur-[40px] opacity-40"
  style={{ background: '#06b6d4' }} />
    <div data-ev-id="ev_5e2282cf0e" className="absolute top-[40%] right-[25%] w-[120px] h-[120px] rounded-full blur-[40px] opacity-30"
  style={{ background: '#8b5cf6' }} />
    <div data-ev-id="ev_ad01384a1f" className="absolute bottom-[30%] left-[40%] w-[100px] h-[100px] rounded-full blur-[40px] opacity-25"
  style={{ background: '#ec4899' }} />

    <div data-ev-id="ev_886b317d6a" className="fx-frosted-wrap relative z-10">
      <div data-ev-id="ev_b5df65475b" dir="ltr" className="relative select-none flex items-baseline justify-center">
        <span data-ev-id="ev_a54eb9812f" className="fx-frosted-text leading-none" style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 900, fontSize: 'clamp(2.5rem,7vw,4.5rem)', color: 'rgba(6,182,212,0.9)', textShadow: '0 0 30px rgba(6,182,212,0.3)' }}>n</span>
        <span data-ev-id="ev_76119b8bd8" className="fx-frosted-text leading-none" style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 800, fontSize: 'clamp(2.5rem,7vw,4.5rem)' }}>Vision</span>
      </div>
      <div data-ev-id="ev_a001d7fb73" className="flex items-center justify-center gap-4 mt-3">
        <div data-ev-id="ev_21ab0ad544" className="h-px flex-1 max-w-[50px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15))' }} />
        <span data-ev-id="ev_8be11b375c" dir="ltr" className="fx-frosted-text text-[clamp(0.7rem,1.8vw,1rem)] tracking-[0.35em]" style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}>DIGITAL AI</span>
        <div data-ev-id="ev_e4a5bfeb8e" className="h-px flex-1 max-w-[50px]" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.15), transparent)' }} />
      </div>
    </div>
  </div>;


/* ── R: Electric Plasma ── */
export const ElectricPlasmaPreview = () =>
<div data-ev-id="ev_a757bd8798" className="relative px-6 py-10 sm:py-14 flex flex-col items-center justify-center overflow-hidden">
    <div data-ev-id="ev_5e2ac5a4c2" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] rounded-full blur-[80px] opacity-15"
  style={{ background: 'radial-gradient(circle, #8b5cf644, #06b6d433, transparent 70%)' }} />

    <div data-ev-id="ev_8c1ecdd355" dir="ltr" className="relative select-none">
      {/* Plasma arcs */}
      <div data-ev-id="ev_c21c9c5b26" className="fx-plasma-arc" style={{ top: '15%' }} />
      <div data-ev-id="ev_d3b212b268" className="fx-plasma-arc" />
      <div data-ev-id="ev_28e6b0f917" className="fx-plasma-arc" />

      <span data-ev-id="ev_3d8ae7e910" className="fx-plasma text-[clamp(3rem,8vw,5.5rem)] leading-none inline-block" style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 900 }}>nVision</span>
    </div>
    <div data-ev-id="ev_c3461950e7" className="h-[2px] mt-3 w-48 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #06b6d4, #8b5cf6, #06b6d4, transparent)', boxShadow: '0 0 15px rgba(6,182,212,0.4), 0 0 30px rgba(139,92,246,0.2)' }} />
    <div data-ev-id="ev_c8a3ddc866" dir="ltr" className="flex items-center gap-4 mt-4">
      <span data-ev-id="ev_be841a0927" className="fx-plasma text-[clamp(0.75rem,2vw,1.1rem)] tracking-[0.35em]" style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 500 }}>DIGITAL</span>
      <span data-ev-id="ev_babe365fb8" className="fx-plasma px-3 py-1 rounded-md text-[clamp(0.85rem,2.2vw,1.25rem)]" style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 900, border: '1px solid rgba(139,92,246,0.25)', boxShadow: '0 0 15px rgba(139,92,246,0.2), inset 0 0 10px rgba(6,182,212,0.05)' }}>AI</span>
    </div>
  </div>;