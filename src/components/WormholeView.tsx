import { useState, useEffect, useRef } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink, Sparkles } from 'lucide-react';

interface Props {sections: LinkSection[];visible: boolean;}
const PORTAL_COLORS = ['#c084fc', '#60a5fa', '#f472b6', '#34d399', '#fbbf24', '#fb923c'];

const TunnelCanvas = ({ w, h }: {w: number;h: number;}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useRef(0);
  const tick = useRef(0);

  useEffect(() => {
    const c = ref.current;if (!c) return;
    const ctx = c.getContext('2d');if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = w * dpr;c.height = h * dpr;ctx.scale(dpr, dpr);
    const cx = w / 2;const cy = h / 2;

    const draw = () => {
      tick.current += 0.008;
      const t = tick.current;
      ctx.fillStyle = 'rgba(4,2,14,0.12)';
      ctx.fillRect(0, 0, w, h);

      // Concentric tunnel rings
      for (let r = 0; r < 12; r++) {
        const radius = (r * 40 + t * 80) % 480;
        if (radius < 5) continue;
        const alpha = Math.max(0, 0.08 - radius / 6000);
        const hue = (t * 30 + r * 30) % 360;
        ctx.strokeStyle = `hsla(${hue},70%,60%,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius, radius * 0.7, Math.sin(t + r * 0.3) * 0.15, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Streaming particles towards center
      for (let i = 0; i < 60; i++) {
        const angle = i / 60 * Math.PI * 2 + t * 0.5;
        const dist = (i * 37 + t * 200) % 350 + 20;
        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle) * dist * 0.7;
        const size = Math.max(0.3, (350 - dist) / 300);
        const alpha2 = Math.max(0, 0.15 - dist / 3000);
        const hue2 = (angle * 57 + t * 20) % 360;
        ctx.fillStyle = `hsla(${hue2},80%,70%,${alpha2})`;
        ctx.beginPath();ctx.arc(px, py, size, 0, Math.PI * 2);ctx.fill();
      }

      // Center glow
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50);
      cg.addColorStop(0, 'rgba(192,132,252,0.06)');
      cg.addColorStop(1, 'transparent');
      ctx.fillStyle = cg;
      ctx.beginPath();ctx.arc(cx, cy, 50, 0, Math.PI * 2);ctx.fill();

      frame.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame.current);
  }, [w, h]);

  return <canvas data-ev-id="ev_85075d6256" ref={ref} style={{ width: w, height: h }} className="absolute inset-0 pointer-events-none" aria-hidden="true" />;
};

const DimensionCard = ({ link, sIdx, delay, isActive, onHover

}: {link: LinkItem;sIdx: number;delay: number;isActive: boolean;onHover: (id: string | null) => void;}) => {
  const [show, setShow] = useState(false);
  const color = PORTAL_COLORS[sIdx % PORTAL_COLORS.length];
  useEffect(() => {const t = setTimeout(() => setShow(true), delay);return () => clearTimeout(t);}, [delay]);

  return (
    <a data-ev-id="ev_6a8639b89f" href={link.url} target="_blank" rel="noopener noreferrer"
    aria-label={`${link.title} — ${link.subtitle} (נפתח בחלון חדש)`}
    onMouseEnter={() => onHover(link.id)} onMouseLeave={() => onHover(null)}
    className={`block rounded-xl transition-all duration-500 group focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} ${isActive ? 'scale-[1.04]' : 'hover:scale-[1.01]'}`}
    style={{ background: 'rgba(10,6,22,0.7)', border: `1px solid ${isActive ? color + '30' : color + '0a'}`, backdropFilter: 'blur(8px)', boxShadow: isActive ? `0 0 24px ${color}10, inset 0 0 12px ${color}05` : 'none' }}>
      <div data-ev-id="ev_e87e72f9a4" className="p-3">
        <div data-ev-id="ev_b407b18a7a" className="flex items-center gap-2.5">
          <div data-ev-id="ev_6ab681c549" className="w-8 h-8 rounded-full flex items-center justify-center relative" style={{ background: `radial-gradient(circle, ${color}12, transparent)`, border: `1px solid ${color}18` }}>
            <AnimatedIcon icon={link.icon} animation={link.animation} color={color} size={16} />
            {/* Swirling ring */}
            <div data-ev-id="ev_29bb54961e" className="absolute inset-0 rounded-full" style={{ border: `1px dashed ${color}15`, animation: 'spin 8s linear infinite' }} />
          </div>
          <div data-ev-id="ev_70d0a69085" className="flex-1 min-w-0">
            <h3 data-ev-id="ev_06fb6109fd" className="text-[11px] font-bold truncate" style={{ color: color + 'cc' }}>{link.title}</h3>
            <p data-ev-id="ev_6de5d67212" className="text-[9px] truncate text-purple-200/15">{link.subtitle}</p>
          </div>
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity flex-shrink-0" style={{ color }} />
        </div>
        {/* Warp meter */}
        <div data-ev-id="ev_0c63203ee8" className="mt-2 flex items-center gap-2">
          <div data-ev-id="ev_4dd88ada68" className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: color + '08' }}>
            <div data-ev-id="ev_c276d5b8f4" className="h-full rounded-full" style={{ width: `${40 + link.id.charCodeAt(0) % 55}%`, background: `linear-gradient(90deg, ${color}40, ${color}10)` }} />
          </div>
          <span data-ev-id="ev_eddab394ae" className="text-[7px] font-mono" style={{ color: color + '25' }}>WARP {link.id.charCodeAt(0) % 9 + 1}</span>
        </div>
      </div>
    </a>);

};

export const WormholeView = ({ sections, visible }: Props) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [size, setSize] = useState({ w: 800, h: 560 });
  const containerRef = useRef<HTMLDivElement>(null);
  const total = sections.reduce((a, s) => a + s.links.length, 0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize((prev) => {
        const newW = r.width;
        const newH = Math.max(560, r.height);
        if (prev.w === newW && prev.h === newH) return prev;
        return { w: newW, h: newH };
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sections.length]);

  return (
    <div data-ev-id="ev_d6a6bc7052" className={`transition-[opacity,transform] duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div data-ev-id="ev_eddbe60e6d" ref={containerRef} className="mx-auto max-w-5xl rounded-xl overflow-hidden border relative" style={{ background: 'linear-gradient(180deg, #04020e 0%, #0a0618 100%)', borderColor: 'rgba(192,132,252,0.06)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', minHeight: 560 }}>
        <TunnelCanvas w={size.w} h={size.h} />

        {/* Header */}
        <div data-ev-id="ev_817a634dd7" className="relative z-10 flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'rgba(192,132,252,0.05)' }}>
          <div data-ev-id="ev_754aa359e9" className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-purple-400/50" />
            <div data-ev-id="ev_3f3c9e6b76">
              <span data-ev-id="ev_4224fbd894" className="text-purple-300/70 text-xs font-mono font-bold tracking-widest">WORMHOLE TRANSIT</span>
              <span data-ev-id="ev_187ba57935" className="text-purple-400/20 text-[9px] font-mono block">INTERDIMENSIONAL GATEWAY</span>
            </div>
          </div>
          <div data-ev-id="ev_f2c69b0aad" className="flex items-center gap-4 text-[10px] font-mono text-purple-400/25">
            <span data-ev-id="ev_5661592865">• STABLE</span>
            <span data-ev-id="ev_e470fa830f">{total} PORTALS</span>
          </div>
        </div>

        {/* Dimensions */}
        <div data-ev-id="ev_f0af67f98a" className="relative z-10 p-5 space-y-6">
          {sections.map((section, sIdx) => {
            const color = PORTAL_COLORS[sIdx % PORTAL_COLORS.length];
            return (
              <div data-ev-id="ev_e586640a61" key={section.id}>
                <div data-ev-id="ev_f36fe81f87" className="flex items-center gap-2 mb-3">
                  <div data-ev-id="ev_becb733ce2" className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: `radial-gradient(circle, ${color}15, ${color}05)`, border: `1px solid ${color}20` }}>
                    <span data-ev-id="ev_d1f8f373a1" className="text-[9px] font-bold" style={{ color }}>◉</span>
                  </div>
                  <span data-ev-id="ev_78cf495e14" className="text-xs font-mono font-bold" style={{ color: color + '90' }}>DIMENSION {sIdx + 1}: {section.emoji} {section.title}</span>
                  <div data-ev-id="ev_9442a1c4cd" className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}12, transparent)` }} />
                  <span data-ev-id="ev_3c3dc56a37" className="text-[9px] font-mono" style={{ color: color + '20' }}>{section.links.length} entities</span>
                </div>
                <div data-ev-id="ev_01eebec6b1" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {section.links.map((link, lIdx) =>
                  <DimensionCard key={link.id} link={link} sIdx={sIdx} delay={250 + sIdx * 100 + lIdx * 60} isActive={hovered === link.id} onHover={setHovered} />
                  )}
                </div>
              </div>);

          })}
        </div>

        {/* Footer */}
        <div data-ev-id="ev_9fec57e9e2" className="relative z-10 flex items-center justify-between px-5 py-2 border-t text-[9px] font-mono text-purple-400/15" style={{ borderColor: 'rgba(192,132,252,0.04)' }}>
          <span data-ev-id="ev_af7eb2ee2e">DIMENSIONS: {sections.length}</span>
          <span data-ev-id="ev_cda303e936">STABILITY: 99.7%</span>
          <span data-ev-id="ev_3609b91784">TRANSIT v∞</span>
        </div>
      </div>
    </div>);

};

export default WormholeView;