import { useState, useEffect, useRef } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink, Satellite, Signal, Wifi, Radio } from 'lucide-react';

interface Props {sections: LinkSection[];visible: boolean;}
const ORBIT_COLORS = ['#38bdf8', '#f472b6', '#facc15', '#34d399', '#a78bfa', '#fb923c'];

/* Canvas: Earth with orbits */
const SpaceCanvas = ({ w, h }: {w: number;h: number;}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useRef(0);
  const tick = useRef(0);

  useEffect(() => {
    const c = ref.current;if (!c) return;
    const ctx = c.getContext('2d');if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = w * dpr;c.height = h * dpr;ctx.scale(dpr, dpr);

    const draw = () => {
      tick.current += 0.004;
      const t = tick.current;
      ctx.clearRect(0, 0, w, h);

      // Stars
      for (let i = 0; i < 80; i++) {
        const sx = (i * 97.3 + 13) % w;
        const sy = (i * 59.7 + 29) % h;
        const flicker = 0.15 + Math.sin(t * 2 + i) * 0.1;
        ctx.fillStyle = `rgba(255,255,255,${flicker})`;
        ctx.fillRect(sx, sy, 1, 1);
      }

      // Earth (partial circle, bottom-left)
      const ex = w * 0.12;const ey = h * 0.85;
      const grad = ctx.createRadialGradient(ex, ey, 30, ex, ey, 160);
      grad.addColorStop(0, 'rgba(30,80,200,0.12)');
      grad.addColorStop(0.5, 'rgba(10,40,100,0.06)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();ctx.arc(ex, ey, 160, 0, Math.PI * 2);ctx.fill();

      // Atmosphere glow
      const atm = ctx.createRadialGradient(ex, ey, 140, ex, ey, 175);
      atm.addColorStop(0, 'rgba(56,189,248,0.03)');
      atm.addColorStop(1, 'transparent');
      ctx.fillStyle = atm;
      ctx.beginPath();ctx.arc(ex, ey, 175, 0, Math.PI * 2);ctx.fill();

      // Orbit paths
      for (let o = 0; o < 4; o++) {
        const or_ = 200 + o * 60;
        ctx.strokeStyle = `rgba(56,189,248,${0.025 - o * 0.005})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.ellipse(ex, ey, or_, or_ * 0.4, -0.4, 0, Math.PI * 2);
        ctx.stroke();

        // Satellite dot on orbit
        const a = t * (0.3 + o * 0.15) + o * 1.5;
        const sx2 = ex + Math.cos(a) * or_;
        const sy2 = ey + Math.sin(a) * or_ * 0.4;
        ctx.fillStyle = ORBIT_COLORS[o] + '30';
        ctx.beginPath();ctx.arc(sx2, sy2, 2.5, 0, Math.PI * 2);ctx.fill();
      }

      frame.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame.current);
  }, [w, h]);

  return <canvas data-ev-id="ev_5d7b2a6704" ref={ref} style={{ width: w, height: h }} className="absolute inset-0 pointer-events-none" aria-hidden="true" />;
};

const SatCard = ({ link, sIdx, delay, isActive, onHover

}: {link: LinkItem;sIdx: number;delay: number;isActive: boolean;onHover: (id: string | null) => void;}) => {
  const [show, setShow] = useState(false);
  const color = ORBIT_COLORS[sIdx % ORBIT_COLORS.length];
  const signal = 30 + link.id.charCodeAt(0) % 70;
  useEffect(() => {const t = setTimeout(() => setShow(true), delay);return () => clearTimeout(t);}, [delay]);

  return (
    <a data-ev-id="ev_4f3b1b945e" href={link.url} target="_blank" rel="noopener noreferrer"
    aria-label={`${link.title} — ${link.subtitle} (נפתח בחלון חדש)`}
    onMouseEnter={() => onHover(link.id)} onMouseLeave={() => onHover(null)}
    className={`block rounded-lg transition-all duration-400 group focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'} ${isActive ? 'scale-[1.03]' : 'hover:scale-[1.01]'}`}
    style={{ background: 'rgba(6,12,24,0.7)', border: `1px solid ${isActive ? color + '30' : color + '0a'}`, backdropFilter: 'blur(6px)', boxShadow: isActive ? `0 0 18px ${color}0c` : 'none' }}>
      <div data-ev-id="ev_1a0d83f082" className="p-3">
        <div data-ev-id="ev_530da6ec11" className="flex items-center gap-2.5">
          <div data-ev-id="ev_e8ebbf605f" className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${color}0c`, border: `1px solid ${color}14` }}>
            <AnimatedIcon icon={link.icon} animation={link.animation} color={color} size={16} />
          </div>
          <div data-ev-id="ev_efbbdd088c" className="flex-1 min-w-0">
            <h3 data-ev-id="ev_c1a1c1c796" className="text-[11px] font-bold truncate" style={{ color: color + 'cc' }}>{link.title}</h3>
            <p data-ev-id="ev_3dc701de3f" className="text-[9px] truncate text-blue-200/15">{link.subtitle}</p>
          </div>
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity flex-shrink-0" style={{ color }} />
        </div>
        {/* Signal / telemetry */}
        <div data-ev-id="ev_0c337db5f0" className="mt-2 flex items-center gap-2">
          <div data-ev-id="ev_12b96e6275" className="flex items-end gap-0.5">
            {[0, 1, 2, 3, 4].map((i) =>
            <div data-ev-id="ev_d143b56647" key={i} className="rounded-sm" style={{ width: 2, height: 3 + i * 2, backgroundColor: i < Math.floor(signal / 20) ? color + '50' : color + '10' }} />
            )}
          </div>
          <span data-ev-id="ev_4a0725e1e7" className="text-[7px] font-mono" style={{ color: color + '30' }}>SIG {signal}%</span>
          <div data-ev-id="ev_fcf7d92013" className="flex-1" />
          <span data-ev-id="ev_c7785cc50c" className="text-[7px] font-mono" style={{ color: color + '20' }}>ALT {200 + sIdx * 100}km</span>
        </div>
      </div>
    </a>);

};

export const SatelliteView = ({ sections, visible }: Props) => {
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
    <div data-ev-id="ev_ced3a34baf" className={`transition-[opacity,transform] duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div data-ev-id="ev_da8ab142ee" ref={containerRef} className="mx-auto max-w-5xl rounded-xl overflow-hidden border relative" style={{ background: 'linear-gradient(180deg, #020818 0%, #060c1a 100%)', borderColor: 'rgba(56,189,248,0.06)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', minHeight: 560 }}>
        <SpaceCanvas w={size.w} h={size.h} />

        {/* Header */}
        <div data-ev-id="ev_b0acffca2f" className="relative z-10 flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'rgba(56,189,248,0.05)' }}>
          <div data-ev-id="ev_4801b65a89" className="flex items-center gap-2.5">
            <Satellite className="w-5 h-5 text-sky-400/50" />
            <div data-ev-id="ev_ae4de16ebb">
              <span data-ev-id="ev_bc7597afe5" className="text-sky-300/70 text-xs font-mono font-bold tracking-widest">SATELLITE COMMAND</span>
              <span data-ev-id="ev_9bf1baacde" className="text-sky-400/20 text-[9px] font-mono block">GROUND STATION • MISSION CONTROL</span>
            </div>
          </div>
          <div data-ev-id="ev_dec60add6b" className="flex items-center gap-4 text-[10px] font-mono text-sky-400/25">
            <span data-ev-id="ev_106048cd23" className="flex items-center gap-1"><Signal className="w-3 h-3" /> TRACKING</span>
            <span data-ev-id="ev_b3cf1c40d6" className="flex items-center gap-1"><Radio className="w-3 h-3" /> {total} SATS</span>
          </div>
        </div>

        {/* Orbital groups */}
        <div data-ev-id="ev_71ccff18e6" className="relative z-10 p-5 space-y-6">
          {sections.map((section, sIdx) => {
            const color = ORBIT_COLORS[sIdx % ORBIT_COLORS.length];
            return (
              <div data-ev-id="ev_b5dff47e41" key={section.id}>
                <div data-ev-id="ev_c0ed2daa4f" className="flex items-center gap-2 mb-3">
                  <Wifi className="w-3.5 h-3.5" style={{ color: color + '50' }} />
                  <span data-ev-id="ev_b98e55dfe8" className="text-xs font-mono font-bold" style={{ color: color + '90' }}>ORBIT {sIdx + 1}: {section.emoji} {section.title}</span>
                  <div data-ev-id="ev_74440550e1" className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}10, transparent)` }} />
                  <span data-ev-id="ev_d0d259ad1d" className="text-[9px] font-mono" style={{ color: color + '20' }}>{section.links.length} satellites</span>
                </div>
                <div data-ev-id="ev_6fd02aef1a" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {section.links.map((link, lIdx) =>
                  <SatCard key={link.id} link={link} sIdx={sIdx} delay={200 + sIdx * 90 + lIdx * 50} isActive={hovered === link.id} onHover={setHovered} />
                  )}
                </div>
              </div>);

          })}
        </div>

        {/* Footer */}
        <div data-ev-id="ev_2f39b4cbf4" className="relative z-10 flex items-center justify-between px-5 py-2 border-t text-[9px] font-mono text-sky-400/15" style={{ borderColor: 'rgba(56,189,248,0.04)' }}>
          <span data-ev-id="ev_db8a0c5eab">ORBITS: {sections.length}</span>
          <span data-ev-id="ev_5773dfd958">UPLINK: NOMINAL</span>
          <span data-ev-id="ev_98b3fb66f1">GROUND CTRL v4.2</span>
        </div>
      </div>
    </div>);

};

export default SatelliteView;