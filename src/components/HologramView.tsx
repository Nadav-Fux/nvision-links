import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink, Radar, Crosshair, Navigation, Shield, Zap } from 'lucide-react';

interface HologramViewProps {
  sections: LinkSection[];
  visible: boolean;
}

const HUD_COLORS = ['#00f0ff', '#a855f7', '#22d3ee', '#f472b6', '#34d399', '#fbbf24'];

/* ════ Particle grid background canvas ════ */
const ParticleGrid = ({ width, height }: {width: number;height: number;}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const tickRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Grid points
    const cols = Math.floor(width / 40);
    const rows = Math.floor(height / 40);

    const draw = () => {
      tickRef.current += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Perspective grid
      const horizon = height * 0.35;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
      ctx.lineWidth = 0.5;

      // Horizontal lines with perspective
      for (let i = 0; i < 20; i++) {
        const t = i / 20;
        const y = horizon + t * t * (height - horizon);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Vertical lines converging to center
      const cx = width / 2;
      for (let i = -10; i <= 10; i++) {
        const spread = i / 10 * width * 0.8;
        ctx.beginPath();
        ctx.moveTo(cx, horizon);
        ctx.lineTo(cx + spread, height);
        ctx.stroke();
      }

      // Floating particles
      for (let i = 0; i < 40; i++) {
        const px = (i * 73 + tickRef.current * 20) % width;
        const py = (i * 41 + Math.sin(tickRef.current + i) * 30) % height;
        const alpha = 0.1 + Math.sin(tickRef.current * 2 + i) * 0.08;
        ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [width, height]);

  return (
    <canvas data-ev-id="ev_01871a6fb4"
    ref={canvasRef}
    style={{ width, height }}
    className="absolute inset-0 pointer-events-none" />);


};

/* ════ Holographic card ════ */
const HoloCard = ({
  link, sIdx, delay, mouseX, mouseY, containerW, containerH, onHover, isHovered










}: {link: LinkItem;sIdx: number;delay: number;mouseX: number;mouseY: number;containerW: number;containerH: number;onHover: (id: string | null) => void;isHovered: boolean;}) => {
  const [show, setShow] = useState(false);
  const color = HUD_COLORS[sIdx % HUD_COLORS.length];

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  // Parallax based on mouse
  const px = containerW ? (mouseX / containerW - 0.5) * 8 : 0;
  const py = containerH ? (mouseY / containerH - 0.5) * 5 : 0;

  return (
    <a data-ev-id="ev_26eb241cf4"
    href={link.url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${link.title} — ${link.subtitle} (נפתח בחלון חדש)`}
    className={`block rounded-lg overflow-hidden transition-all duration-500 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
    show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${
    isHovered ? 'scale-[1.04] z-10' : 'hover:scale-[1.02]'}`}
    style={{
      background: `linear-gradient(135deg, ${color}08 0%, rgba(0,240,255,0.02) 50%, ${color}05 100%)`,
      border: `1px solid ${isHovered ? color + '40' : color + '12'}`,
      backdropFilter: 'blur(8px)',
      boxShadow: isHovered ?
      `0 0 30px ${color}15, inset 0 0 30px ${color}05, 0 10px 30px rgba(0,0,0,0.3)` :
      `0 0 15px ${color}05, 0 5px 15px rgba(0,0,0,0.2)`,
      transform: show ? `perspective(800px) rotateY(${px * 0.3}deg) rotateX(${-py * 0.3}deg) translateY(0)` : 'translateY(16px)'
    }}
    onMouseEnter={() => onHover(link.id)}
    onMouseLeave={() => onHover(null)}>

      {/* Scan line effect */}
      <div data-ev-id="ev_5784a0dacf"
      className="absolute inset-0 pointer-events-none opacity-[0.03]"
      style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.15) 2px, rgba(0,240,255,0.15) 3px)'
      }} />


      {/* Top glow line */}
      <div data-ev-id="ev_1430a3da06"
      className="absolute top-0 left-[10%] right-[10%] h-px"
      style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />


      <div data-ev-id="ev_765fd73f19" className="relative p-3.5">
        {/* Header */}
        <div data-ev-id="ev_9af03cf912" className="flex items-center gap-2.5 mb-2">
          <div data-ev-id="ev_52245de2cd"
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{
            background: `${color}10`,
            border: `1px solid ${color}20`,
            boxShadow: `0 0 12px ${color}10`
          }}>

            <AnimatedIcon icon={link.icon} animation={link.animation} color={color} size={18} />
          </div>
          <div data-ev-id="ev_e4707fe5a4" className="flex-1 min-w-0">
            <h3 data-ev-id="ev_08bf0cfa66" className="text-[12px] font-bold truncate" style={{ color: color + 'cc' }}>
              {link.title}
            </h3>
            <p data-ev-id="ev_b0e77b2588" className="text-[9px] font-mono truncate" style={{ color: color + '40' }}>
              {link.subtitle}
            </p>
          </div>
          <ExternalLink
            className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity flex-shrink-0"
            style={{ color }} />

        </div>

        {/* Data readout */}
        <div data-ev-id="ev_0c7358eaa8" className="flex items-center gap-2 text-[8px] font-mono" style={{ color: color + '35' }}>
          <span data-ev-id="ev_623d1ef68b" className="flex items-center gap-0.5">
            <Crosshair className="w-2.5 h-2.5" />
            LOCKED
          </span>
          <span data-ev-id="ev_f5a2edb81c">•</span>
          <span data-ev-id="ev_b007baf6fe">{link.tag === 'free' ? 'FREE ACCESS' : link.tag === 'deal' ? 'DEAL ACTIVE' : 'STANDARD'}</span>
          <div data-ev-id="ev_e721d55ffb"
          className="flex-1 h-px mr-auto"
          style={{ background: `linear-gradient(90deg, ${color}15, transparent)` }} />

        </div>
      </div>
    </a>);

};

/* ══════════════════════════════════════════════
 *  Hologram / HUD View
 * ══════════════════════════════════════════════ */
export const HologramView = ({ sections, visible }: HologramViewProps) => {
  const [revealed, setRevealed] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const [scanY, setScanY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 800, h: 600 });

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setRevealed(true), 250);
      return () => clearTimeout(t);
    }
  }, [visible]);

  // Container size
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        setContainerSize({ w: r.width, h: r.height });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Scan line
  useEffect(() => {
    if (!revealed) return;
    const t = setInterval(() => setScanY((p) => (p + 0.4) % 100), 30);
    return () => clearInterval(t);
  }, [revealed]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
    setMouseY(e.clientY - rect.top);
  }, []);

  const totalLinks = sections.reduce((a, s) => a + s.links.length, 0);
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  return (
    <div data-ev-id="ev_2254b2b373"
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      <div data-ev-id="ev_a9d701e077"
      ref={containerRef}
      className="mx-auto max-w-5xl rounded-xl overflow-hidden border relative"
      style={{
        background: 'linear-gradient(180deg, #050510 0%, #0a0a18 40%, #080814 100%)',
        borderColor: 'rgba(0,240,255,0.08)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 60px rgba(0,240,255,0.02)',
        minHeight: 560
      }}
      onMouseMove={handleMouseMove}>

        {/* Particle grid background */}
        <ParticleGrid width={containerSize.w} height={560} />

        {/* Scan line */}
        <div data-ev-id="ev_dd568a7a3e"
        className="absolute left-0 right-0 h-12 pointer-events-none z-20"
        style={{
          top: `${scanY}%`,
          background: 'linear-gradient(180deg, transparent, rgba(0,240,255,0.03), transparent)'
        }} />


        {/* ─── HUD Header ─── */}
        <div data-ev-id="ev_4341f58f9f" className="relative z-10 flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'rgba(0,240,255,0.06)' }}>
          <div data-ev-id="ev_e62e61f968" className="flex items-center gap-3">
            <div data-ev-id="ev_18d294a5e2" className="relative">
              <Shield className="w-5 h-5 text-cyan-400/60" />
              <div data-ev-id="ev_1439ae41d2" className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <div data-ev-id="ev_f805d8d948">
              <span data-ev-id="ev_d174c6b2cb" className="text-cyan-300/80 text-xs font-mono font-bold tracking-[0.2em]">nVISION HUD</span>
              <span data-ev-id="ev_b3afd987ad" className="text-cyan-400/20 text-[9px] font-mono block">HOLOGRAPHIC INTERFACE v3.0</span>
            </div>
          </div>
          <div data-ev-id="ev_c1cce6e4bb" className="flex items-center gap-5 text-[10px] font-mono text-cyan-400/30">
            <span data-ev-id="ev_55254d7614" className="flex items-center gap-1"><Radar className="w-3 h-3" /> SCAN: ACTIVE</span>
            <span data-ev-id="ev_0ef903fe82" className="flex items-center gap-1"><Navigation className="w-3 h-3" /> NAV: ONLINE</span>
            <span data-ev-id="ev_8086a42d60" className="text-cyan-400/50">{timeStr}</span>
          </div>
        </div>

        {/* ─── Layer filter ─── */}
        <div data-ev-id="ev_eb16146e6a" className="relative z-10 flex items-center gap-1.5 px-5 py-2 border-b overflow-x-auto scrollbar-hide" style={{ borderColor: 'rgba(0,240,255,0.04)' }}>
          <button data-ev-id="ev_8ec608255e"
          onClick={() => setActiveLayer(null)}
          className={`px-3 py-1 rounded text-[10px] font-mono transition-all flex-shrink-0 ${
          activeLayer === null ?
          'text-cyan-300 border border-cyan-400/30 bg-cyan-400/[0.08]' :
          'text-cyan-400/25 hover:text-cyan-400/50 border border-transparent'}`
          }>

            ALL LAYERS
          </button>
          {sections.map((section, sIdx) => {
            const color = HUD_COLORS[sIdx % HUD_COLORS.length];
            return (
              <button data-ev-id="ev_5df119ac45"
              key={section.id}
              onClick={() => setActiveLayer(activeLayer === sIdx ? null : sIdx)}
              className={`px-3 py-1 rounded text-[10px] font-mono transition-all flex-shrink-0 flex items-center gap-1.5 ${
              activeLayer === sIdx ?
              'text-white/80 border' :
              'text-white/20 hover:text-white/40 border border-transparent'}`
              }
              style={{
                borderColor: activeLayer === sIdx ? color + '40' : undefined,
                backgroundColor: activeLayer === sIdx ? color + '10' : undefined
              }}>

                <span data-ev-id="ev_132c36f396" className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}40` }} />
                {section.title}
              </button>);

          })}
        </div>

        {/* ─── Content: Holo cards ─── */}
        <div data-ev-id="ev_5a2f677daf" className="relative z-10 p-5 space-y-6">
          {sections.map((section, sIdx) => {
            if (activeLayer !== null && activeLayer !== sIdx) return null;
            const color = HUD_COLORS[sIdx % HUD_COLORS.length];

            return (
              <div data-ev-id="ev_c1ebfaf3de" key={section.id}>
                {/* Section header */}
                <div data-ev-id="ev_f23909b657" className="flex items-center gap-2.5 mb-3">
                  <div data-ev-id="ev_850fa619c8" className="w-1 h-5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}40` }} />
                  <span data-ev-id="ev_6579c235ef" className="text-sm font-bold font-mono" style={{ color: color + 'aa' }}>
                    {section.emoji} {section.title}
                  </span>
                  <div data-ev-id="ev_39efce12f4" className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}15, transparent)` }} />
                  <span data-ev-id="ev_f3efefd152" className="text-[9px] font-mono" style={{ color: color + '30' }}>
                    [{section.links.length} NODES]
                  </span>
                </div>

                {/* Cards grid */}
                <div data-ev-id="ev_4bb365e9cd" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {section.links.map((link, lIdx) =>
                  <HoloCard
                    key={link.id}
                    link={link}
                    sIdx={sIdx}
                    delay={300 + sIdx * 100 + lIdx * 60}
                    mouseX={mouseX}
                    mouseY={mouseY}
                    containerW={containerSize.w}
                    containerH={560}
                    onHover={setHoveredId}
                    isHovered={hoveredId === link.id} />

                  )}
                </div>
              </div>);

          })}
        </div>

        {/* ─── HUD Corner elements ─── */}
        <div data-ev-id="ev_6a91c8aee8" className="absolute top-14 left-4 z-10 text-[8px] font-mono text-cyan-400/15 leading-relaxed pointer-events-none">
          <div data-ev-id="ev_d5e681e5a1">SYS: OPERATIONAL</div>
          <div data-ev-id="ev_78c70b9cfb">CPU: 23%</div>
          <div data-ev-id="ev_23dcd5910e">MEM: 4.2GB</div>
          <div data-ev-id="ev_d71f52cfc4">NET: 1.2Gbps</div>
        </div>

        <div data-ev-id="ev_d050961f4e" className="absolute top-14 right-4 z-10 pointer-events-none">
          {/* Mini radar */}
          <svg data-ev-id="ev_0f7f29fc1f" width="50" height="50" className="opacity-20">
            <circle data-ev-id="ev_c92725c96a" cx="25" cy="25" r="20" fill="none" stroke="#00f0ff" strokeWidth="0.5" />
            <circle data-ev-id="ev_611ebb843f" cx="25" cy="25" r="12" fill="none" stroke="#00f0ff" strokeWidth="0.3" />
            <circle data-ev-id="ev_949cf07f40" cx="25" cy="25" r="4" fill="none" stroke="#00f0ff" strokeWidth="0.3" />
            <line data-ev-id="ev_8ce7164ca7" x1="25" y1="5" x2="25" y2="45" stroke="#00f0ff" strokeWidth="0.2" />
            <line data-ev-id="ev_7469cd0f0a" x1="5" y1="25" x2="45" y2="25" stroke="#00f0ff" strokeWidth="0.2" />
            <circle data-ev-id="ev_c4a0340aee" cx="30" cy="18" r="1.5" fill="#00f0ff" opacity="0.4" />
            <circle data-ev-id="ev_fae41cf58f" cx="20" cy="28" r="1" fill="#00f0ff" opacity="0.3" />
          </svg>
        </div>

        {/* ─── Bottom HUD bar ─── */}
        <div data-ev-id="ev_ad4006a7ec"
        className="relative z-10 flex items-center justify-between px-5 py-2 border-t"
        style={{ borderColor: 'rgba(0,240,255,0.06)' }}>

          <div data-ev-id="ev_32c301ad45" className="flex items-center gap-3 text-[9px] font-mono text-cyan-400/25">
            <span data-ev-id="ev_b5665e773f" className="flex items-center gap-1"><Zap className="w-3 h-3" /> PWR: 100%</span>
            <span data-ev-id="ev_a265bc9d7b">NODES: {totalLinks}</span>
            <span data-ev-id="ev_0cafd0dc2f">LAYERS: {sections.length}</span>
          </div>
          <div data-ev-id="ev_bf71882d81" className="flex items-center gap-2">
            {sections.map((_, sIdx) =>
            <div data-ev-id="ev_131054c470"
            key={sIdx}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: HUD_COLORS[sIdx % HUD_COLORS.length],
              boxShadow: `0 0 4px ${HUD_COLORS[sIdx % HUD_COLORS.length]}40`,
              opacity: activeLayer === null || activeLayer === sIdx ? 0.6 : 0.1
            }} />

            )}
          </div>
          <span data-ev-id="ev_638bd82acc" className="text-[9px] font-mono text-cyan-400/20">nVision HUD v3.0</span>
        </div>
      </div>
    </div>);

};

export default HologramView;