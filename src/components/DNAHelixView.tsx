import { useState, useEffect, useRef } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink, Dna, FlaskConical, Microscope } from 'lucide-react';

interface Props {sections: LinkSection[];visible: boolean;}
const CHROMO_COLORS = ['#22d3ee', '#a855f7', '#34d399', '#f472b6', '#fbbf24', '#60a5fa'];

/* Canvas DNA helix background */
const HelixCanvas = ({ w, h }: {w: number;h: number;}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useRef(0);
  const tick = useRef(0);

  useEffect(() => {
    const c = ref.current;if (!c) return;
    const ctx = c.getContext('2d');if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = w * dpr;c.height = h * dpr;ctx.scale(dpr, dpr);

    const draw = () => {
      tick.current += 0.012;
      const t = tick.current;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;

      // Draw double helix
      for (let y = -20; y < h + 20; y += 3) {
        const phase = y * 0.025 + t;
        const x1 = cx + Math.sin(phase) * 60;
        const x2 = cx + Math.sin(phase + Math.PI) * 60;
        const depth1 = (Math.cos(phase) + 1) / 2;
        const depth2 = (Math.cos(phase + Math.PI) + 1) / 2;

        // Backbone strands
        ctx.fillStyle = `rgba(0,229,255,${0.03 + depth1 * 0.04})`;
        ctx.beginPath();ctx.arc(x1, y, 1.5, 0, Math.PI * 2);ctx.fill();
        ctx.fillStyle = `rgba(168,85,247,${0.03 + depth2 * 0.04})`;
        ctx.beginPath();ctx.arc(x2, y, 1.5, 0, Math.PI * 2);ctx.fill();

        // Base pair rungs every ~20px
        if (y % 18 < 3) {
          const alpha = 0.02 + Math.sin(t + y * 0.1) * 0.01;
          ctx.strokeStyle = `rgba(52,211,153,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();ctx.moveTo(x1, y);ctx.lineTo(x2, y);ctx.stroke();
          // base pair dots
          const mx = (x1 + x2) / 2;
          ctx.fillStyle = `rgba(52,211,153,${alpha * 2})`;
          ctx.beginPath();ctx.arc(mx - 5, y, 1.5, 0, Math.PI * 2);ctx.fill();
          ctx.beginPath();ctx.arc(mx + 5, y, 1.5, 0, Math.PI * 2);ctx.fill();
        }
      }
      frame.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame.current);
  }, [w, h]);

  return <canvas data-ev-id="ev_5b372cc6ed" ref={ref} style={{ width: w, height: h }} className="absolute inset-0 pointer-events-none" aria-hidden="true" />;
};

const BasePairCard = ({ link, sIdx, delay, isActive, onHover

}: {link: LinkItem;sIdx: number;delay: number;isActive: boolean;onHover: (id: string | null) => void;}) => {
  const [show, setShow] = useState(false);
  const color = CHROMO_COLORS[sIdx % CHROMO_COLORS.length];
  useEffect(() => {const t = setTimeout(() => setShow(true), delay);return () => clearTimeout(t);}, [delay]);

  return (
    <a data-ev-id="ev_5f54879285" href={link.url} target="_blank" rel="noopener noreferrer"
    aria-label={`${link.title} — ${link.subtitle} (נפתח בחלון חדש)`}
    onMouseEnter={() => onHover(link.id)} onMouseLeave={() => onHover(null)}
    className={`block rounded-lg transition-all duration-400 group focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'} ${isActive ? 'scale-[1.03]' : 'hover:scale-[1.01]'}`}
    style={{ background: 'rgba(8,12,16,0.65)', border: `1px solid ${isActive ? color + '35' : color + '0a'}`, backdropFilter: 'blur(4px)', boxShadow: isActive ? `0 0 20px ${color}0a` : 'none' }}>
      <div data-ev-id="ev_f8fa9b045c" className="p-3">
        <div data-ev-id="ev_abc798bc33" className="flex items-center gap-2.5">
          {/* Double helix symbol */}
          <div data-ev-id="ev_2ea789da91" className="relative w-8 h-8 rounded flex items-center justify-center" style={{ background: `${color}0a`, border: `1px solid ${color}12` }}>
            <AnimatedIcon icon={link.icon} animation={link.animation} color={color} size={16} />
          </div>
          <div data-ev-id="ev_027e41e6cf" className="flex-1 min-w-0">
            <h3 data-ev-id="ev_950bae87db" className="text-[11px] font-bold truncate" style={{ color: color + 'cc' }}>{link.title}</h3>
            <p data-ev-id="ev_9c09fdb859" className="text-[9px] truncate text-white/60">{link.subtitle}</p>
          </div>
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity flex-shrink-0" style={{ color }} />
        </div>
        {/* Sequence readout */}
        <div data-ev-id="ev_64659ab94b" className="mt-2 flex items-center gap-0.5 overflow-hidden">
          {['A', 'T', 'G', 'C', 'A', 'G', 'T', 'C', 'A', 'T'].map((base, i) =>
          <span data-ev-id="ev_dbb2d2a091" key={i} className="text-[7px] font-mono font-bold" style={{
            color: base === 'A' ? '#22d3ee40' : base === 'T' ? '#a855f740' : base === 'G' ? '#34d39940' : '#f472b640'
          }}>{base}</span>
          )}
          <div data-ev-id="ev_db04aae067" className="flex-1" />
          <span data-ev-id="ev_d48f65f3b9" className="text-[7px] font-mono" style={{ color: color + '25' }}>
            {link.tag === 'free' ? 'OPEN' : link.tag === 'deal' ? 'EDITED' : 'WILD'}
          </span>
        </div>
      </div>
    </a>);

};

export const DNAHelixView = ({ sections, visible }: Props) => {
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
    <div data-ev-id="ev_2114e2274a" className={`transition-[opacity,transform] duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div data-ev-id="ev_98077a0aae" ref={containerRef} className="mx-auto max-w-5xl rounded-xl overflow-hidden border relative" style={{ background: 'linear-gradient(180deg, #040810 0%, #08101a 100%)', borderColor: 'rgba(0,229,255,0.06)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', minHeight: 560 }}>
        <HelixCanvas w={size.w} h={size.h} />

        {/* Header */}
        <div data-ev-id="ev_4a26adf9ed" className="relative z-10 flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'rgba(0,229,255,0.05)' }}>
          <div data-ev-id="ev_b7a51e3424" className="flex items-center gap-2.5">
            <Dna className="w-5 h-5 text-cyan-400/50" />
            <div data-ev-id="ev_1108131af2">
              <span data-ev-id="ev_429590d997" className="text-cyan-300/70 text-xs font-mono font-bold tracking-widest">DNA SEQUENCER</span>
              <span data-ev-id="ev_bf23c6be34" className="text-cyan-400/20 text-[9px] font-mono block">CRISPR GENOMICS LAB v3.0</span>
            </div>
          </div>
          <div data-ev-id="ev_a60125c7fe" className="flex items-center gap-4 text-[10px] font-mono text-cyan-400/25">
            <span data-ev-id="ev_3afe7f76fc" className="flex items-center gap-1"><FlaskConical className="w-3 h-3" /> SEQUENCING</span>
            <span data-ev-id="ev_b3032a5d19" className="flex items-center gap-1"><Microscope className="w-3 h-3" /> {total} BASE PAIRS</span>
          </div>
        </div>

        {/* Chromosomes */}
        <div data-ev-id="ev_8de7be5e28" className="relative z-10 p-5 space-y-6">
          {sections.map((section, sIdx) => {
            const color = CHROMO_COLORS[sIdx % CHROMO_COLORS.length];
            return (
              <div data-ev-id="ev_5f1fc13d3a" key={section.id}>
                <div data-ev-id="ev_5019a419ce" className="flex items-center gap-2 mb-3">
                  <div data-ev-id="ev_9d950673b5" className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-mono font-bold" style={{ color, backgroundColor: color + '15', border: `1px solid ${color}25` }}>
                    {sIdx + 1}
                  </div>
                  <span data-ev-id="ev_b26ef387a6" className="text-xs font-bold font-mono" style={{ color: color + 'aa' }}>{section.emoji} {section.title}</span>
                  <div data-ev-id="ev_d2f187862b" className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}12, transparent)` }} />
                  <span data-ev-id="ev_eb38440828" className="text-[9px] font-mono" style={{ color: color + '25' }}>CHR{sIdx + 1} • {section.links.length} genes</span>
                </div>
                <div data-ev-id="ev_334bc3139c" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {section.links.map((link, lIdx) =>
                  <BasePairCard key={link.id} link={link} sIdx={sIdx} delay={200 + sIdx * 80 + lIdx * 50} isActive={hovered === link.id} onHover={setHovered} />
                  )}
                </div>
              </div>);

          })}
        </div>

        {/* Footer */}
        <div data-ev-id="ev_5081682838" className="relative z-10 flex items-center justify-between px-5 py-2 border-t text-[9px] font-mono text-cyan-400/15" style={{ borderColor: 'rgba(0,229,255,0.04)' }}>
          <span data-ev-id="ev_f18a479fee">CHROMOSOMES: {sections.length}</span>
          <span data-ev-id="ev_b90febded9">GENOME: 100% MAPPED</span>
          <span data-ev-id="ev_057fd979c7">CRISPR LAB v3.0</span>
        </div>
      </div>
    </div>);

};

export default DNAHelixView;