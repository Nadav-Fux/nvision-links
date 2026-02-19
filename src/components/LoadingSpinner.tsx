import { useEffect, useState } from 'react';

interface LoadingSpinnerProps {
  fullPage?: boolean;
  text?: string;
}

/* ── Hex grid cell — pure CSS neural node ── */
const NeuralNode = ({ x, y, delay, size }: {x: string;y: string;delay: number;size: number;}) =>
<div data-ev-id="ev_36ff631d9a"
className="absolute rounded-full loading-node"
style={{
  left: x,
  top: y,
  width: size,
  height: size,
  animationDelay: `${delay}ms`
}}
aria-hidden="true" />;



/* ── Connection line between nodes ── */
const NeuralLine = ({ x1, y1, x2, y2, delay }: {x1: string;y1: string;x2: string;y2: string;delay: number;}) =>
<svg data-ev-id="ev_0c4e9aae5f" className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }} aria-hidden="true">
    <line data-ev-id="ev_9015cecd12"
  x1={x1} y1={y1} x2={x2} y2={y2}
  className="loading-line"
  style={{ animationDelay: `${delay}ms` }} />

  </svg>;


/**
 * Branded loading screen for nVision Digital AI.
 * fullPage = immersive dark screen with neural animation.
 * inline = compact spinner.
 */
export const LoadingSpinner = ({ fullPage, text = 'טוען...' }: LoadingSpinnerProps) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!fullPage) return;
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 600);
    const t3 = setTimeout(() => setPhase(3), 1000);
    return () => {clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
  }, [fullPage]);

  if (fullPage) {
    return (
      <div data-ev-id="ev_219b309074"
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center gap-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0a0a14 0%, #0d0d1a 30%, #0f0a1a 60%, #0a0f14 100%)'
      }}
      role="status">

        {/* Ambient glow */}
        <div data-ev-id="ev_9f64be9b00" className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div data-ev-id="ev_5a61a180df"
          className="absolute rounded-full transition-opacity duration-[2000ms]"
          style={{
            width: 400, height: 400,
            top: '40%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
            opacity: phase >= 1 ? 1 : 0,
            filter: 'blur(80px)'
          }} />

          <div data-ev-id="ev_d4ca2e1386"
          className="absolute rounded-full transition-opacity duration-[2000ms]"
          style={{
            width: 300, height: 300,
            top: '50%', left: '45%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)',
            opacity: phase >= 2 ? 1 : 0,
            filter: 'blur(60px)'
          }} />

        </div>

        {/* Neural network mini-visualization */}
        <div data-ev-id="ev_3b6b4ba613"
        className={`relative w-48 h-48 sm:w-56 sm:h-56 transition-[opacity,transform] duration-1000 ${
        phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`
        }
        aria-hidden="true">

          {/* Connection lines */}
          <NeuralLine x1="50%" y1="20%" x2="25%" y2="50%" delay={300} />
          <NeuralLine x1="50%" y1="20%" x2="75%" y2="50%" delay={500} />
          <NeuralLine x1="25%" y1="50%" x2="50%" y2="80%" delay={700} />
          <NeuralLine x1="75%" y1="50%" x2="50%" y2="80%" delay={900} />
          <NeuralLine x1="25%" y1="50%" x2="75%" y2="50%" delay={600} />
          <NeuralLine x1="15%" y1="30%" x2="50%" y2="20%" delay={400} />
          <NeuralLine x1="85%" y1="30%" x2="50%" y2="20%" delay={450} />
          <NeuralLine x1="15%" y1="70%" x2="25%" y2="50%" delay={800} />
          <NeuralLine x1="85%" y1="70%" x2="75%" y2="50%" delay={850} />

          {/* Nodes */}
          <NeuralNode x="47%" y="15%" delay={200} size={12} />
          <NeuralNode x="22%" y="45%" delay={400} size={10} />
          <NeuralNode x="72%" y="45%" delay={500} size={10} />
          <NeuralNode x="47%" y="75%" delay={700} size={12} />
          <NeuralNode x="12%" y="25%" delay={300} size={7} />
          <NeuralNode x="82%" y="25%" delay={350} size={7} />
          <NeuralNode x="12%" y="65%" delay={600} size={7} />
          <NeuralNode x="82%" y="65%" delay={650} size={7} />

          {/* Center brain pulse */}
          <div data-ev-id="ev_22f1ab5443"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 loading-brain-pulse">

            <div data-ev-id="ev_f259cb0725" className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400/30 to-purple-500/30 loading-brain-glow" />
          </div>
        </div>

        {/* Brand */}
        <div data-ev-id="ev_60650049f0"
        className={`flex flex-col items-center gap-2 transition-[opacity,transform] duration-700 ${
        phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`
        }>

          <div data-ev-id="ev_cee8c28bfa" className="flex items-baseline gap-0">
            <span data-ev-id="ev_39f6e2a0a5"
            className="text-2xl sm:text-3xl font-black"
            style={{
              color: '#06b6d4',
              textShadow: '0 0 20px rgba(6,182,212,0.3)'
            }}>

              n
            </span>
            <span data-ev-id="ev_d977b8cc5d" className="text-2xl sm:text-3xl font-black text-white/90">
              Vision
            </span>
          </div>
          <span data-ev-id="ev_1a91836ee8"
          className="text-xs sm:text-sm font-semibold tracking-[0.15em]"
          style={{
            background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>

            Digital AI
          </span>
        </div>

        {/* Loading bar + text */}
        <div data-ev-id="ev_795f43cf88"
        className={`flex flex-col items-center gap-3 transition-[opacity,transform] duration-700 ${
        phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`
        }>

          {/* Progress bar */}
          <div data-ev-id="ev_a430435dcb" className="w-40 sm:w-48 h-[2px] rounded-full bg-white/[0.06] overflow-hidden">
            <div data-ev-id="ev_6730c7f482" className="h-full rounded-full loading-progress" />
          </div>
          <p data-ev-id="ev_8a0595b9ef" className="text-white/35 text-xs">{text}</p>
        </div>

        <span data-ev-id="ev_faacb0ba0c" className="sr-only">{text}</span>
      </div>);

  }

  /* ── Inline spinner ── */
  return (
    <div data-ev-id="ev_a3c1983ce6" className="flex flex-col items-center justify-center py-20 gap-4" role="status">
      <div data-ev-id="ev_14f62e7e9c" className="relative">
        <div data-ev-id="ev_7b24c18a9f" className="w-10 h-10 rounded-full border-2 border-white/[0.06]" />
        <div data-ev-id="ev_5a19406edd" className="absolute inset-0 w-10 h-10 rounded-full border-2 border-transparent border-t-primary loading-spin" />
        <div data-ev-id="ev_70e38fe277" className="absolute inset-1.5 w-7 h-7 rounded-full border-2 border-transparent border-b-accent/50 loading-spin-reverse" />
      </div>
      <p data-ev-id="ev_6708b2b1e0" className="text-white/40 text-sm">{text}</p>
      <span data-ev-id="ev_c4e45f6d7d" className="sr-only">{text}</span>
    </div>);

};