import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink, Activity, Brain, Scan, Radio } from 'lucide-react';

interface BrainMRIViewProps {
  sections: LinkSection[];
  visible: boolean;
}

const REGION_COLORS = ['#00e5ff', '#e040fb', '#69f0ae', '#ffd740', '#ff5252', '#40c4ff'];

/* ══════ Brain cross-section Canvas ══════ */
const BrainCanvas = ({ width, height }: {width: number;height: number;}) => {
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

    const cx = width / 2;
    const cy = height / 2;
    const brainR = Math.min(width, height) * 0.38;

    const draw = () => {
      tickRef.current += 0.008;
      const t = tickRef.current;
      ctx.clearRect(0, 0, width, height);

      // MRI scan line sweep
      const scanAngle = t * 0.7 % (Math.PI * 2);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, brainR + 20, scanAngle - 0.15, scanAngle + 0.15);
      ctx.closePath();
      const scanGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, brainR + 20);
      scanGrad.addColorStop(0, 'rgba(0,229,255,0)');
      scanGrad.addColorStop(0.7, 'rgba(0,229,255,0.06)');
      scanGrad.addColorStop(1, 'rgba(0,229,255,0.02)');
      ctx.fillStyle = scanGrad;
      ctx.fill();
      ctx.restore();

      // Brain outline (simplified cross-section)
      ctx.save();
      ctx.strokeStyle = 'rgba(0,229,255,0.12)';
      ctx.lineWidth = 1;

      // Outer brain shape — elongated ellipse
      ctx.beginPath();
      ctx.ellipse(cx, cy, brainR, brainR * 0.85, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Inner structures — corpus callosum-ish
      ctx.strokeStyle = 'rgba(0,229,255,0.06)';
      ctx.beginPath();
      ctx.ellipse(cx, cy - brainR * 0.1, brainR * 0.6, brainR * 0.25, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Ventricles
      ctx.beginPath();
      ctx.ellipse(cx - brainR * 0.15, cy + brainR * 0.05, brainR * 0.12, brainR * 0.2, -0.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx + brainR * 0.15, cy + brainR * 0.05, brainR * 0.12, brainR * 0.2, 0.2, 0, Math.PI * 2);
      ctx.stroke();

      // Brain stem
      ctx.beginPath();
      ctx.moveTo(cx - brainR * 0.08, cy + brainR * 0.75);
      ctx.quadraticCurveTo(cx, cy + brainR * 1.05, cx + brainR * 0.08, cy + brainR * 0.75);
      ctx.stroke();

      // Cerebellum
      ctx.beginPath();
      ctx.ellipse(cx, cy + brainR * 0.65, brainR * 0.3, brainR * 0.15, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Sulci lines
      for (let i = 0; i < 8; i++) {
        const angle = i / 8 * Math.PI * 2 + t * 0.02;
        const r1 = brainR * 0.55;
        const r2 = brainR * 0.92;
        ctx.strokeStyle = `rgba(0,229,255,${0.03 + Math.sin(t + i) * 0.01})`;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1 * 0.85);
        ctx.quadraticCurveTo(
          cx + Math.cos(angle + 0.2) * (r1 + r2) / 2,
          cy + Math.sin(angle + 0.2) * (r1 + r2) / 2 * 0.85,
          cx + Math.cos(angle) * r2,
          cy + Math.sin(angle) * r2 * 0.85
        );
        ctx.stroke();
      }
      ctx.restore();

      // Activity hotspots (random-looking but deterministic)
      for (let i = 0; i < 12; i++) {
        const a = i * 2.399 + t * 0.1;
        const r = brainR * (0.2 + i * 0.618 % 1 * 0.6);
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r * 0.85;
        const pulse = Math.sin(t * 3 + i * 1.5) * 0.5 + 0.5;
        const color = REGION_COLORS[i % REGION_COLORS.length];
        const alpha = 0.04 + pulse * 0.06;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, 15 + pulse * 8);
        grad.addColorStop(0, color.replace(')', `,${alpha * 3})`.replace('rgb', 'rgba')));
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        // Simple hex→rgba
        ctx.fillStyle = `rgba(${parseInt(color.slice(1, 3), 16)},${parseInt(color.slice(3, 5), 16)},${parseInt(color.slice(5, 7), 16)},${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 10 + pulse * 6, 0, Math.PI * 2);
        ctx.fill();

        // Bright center
        ctx.fillStyle = `rgba(${parseInt(color.slice(1, 3), 16)},${parseInt(color.slice(3, 5), 16)},${parseInt(color.slice(5, 7), 16)},${alpha * 2.5})`;
        ctx.beginPath();
        ctx.arc(x, y, 2 + pulse * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Grid overlay (MRI grid)
      ctx.strokeStyle = 'rgba(0,229,255,0.015)';
      ctx.lineWidth = 0.5;
      const step = 20;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [width, height]);

  return (
    <canvas data-ev-id="ev_710001fb00"
    ref={canvasRef}
    style={{ width, height }}
    className="absolute inset-0 pointer-events-none"
    aria-hidden="true" />);


};

/* ══════ Hotspot Card ══════ */
const HotspotCard = ({
  link, sIdx, delay, isActive, onSelect






}: {link: LinkItem;sIdx: number;delay: number;isActive: boolean;onSelect: (id: string | null) => void;}) => {
  const [show, setShow] = useState(false);
  const color = REGION_COLORS[sIdx % REGION_COLORS.length];

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <a data-ev-id="ev_aee9e5d8c1"
    href={link.url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${link.title} — ${link.subtitle} (נפתח בחלון חדש)`}
    className={`block rounded-md overflow-hidden transition-all duration-400 group focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none ${
    show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'} ${
    isActive ? 'scale-[1.03] z-10' : 'hover:scale-[1.01]'}`}
    style={{
      background: isActive ?
      `linear-gradient(135deg, ${color}12 0%, rgba(10,10,20,0.6) 100%)` :
      'rgba(10,10,20,0.4)',
      border: `1px solid ${isActive ? color + '35' : 'rgba(0,229,255,0.06)'}`,
      boxShadow: isActive ? `0 0 20px ${color}10, inset 0 0 20px ${color}05` : 'none'
    }}
    onMouseEnter={() => onSelect(link.id)}
    onMouseLeave={() => onSelect(null)}>

      <div data-ev-id="ev_8f0db44ad0" className="relative p-3">
        {/* Activity indicator */}
        <div data-ev-id="ev_9ecfd9d134"
        className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}60` }} />


        <div data-ev-id="ev_067726aad7" className="flex items-center gap-2.5">
          <div data-ev-id="ev_83ba9596d7"
          className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
          style={{
            background: `${color}10`,
            border: `1px solid ${color}18`
          }}>

            <AnimatedIcon icon={link.icon} animation={link.animation} color={color} size={16} />
          </div>
          <div data-ev-id="ev_7aa96f0eae" className="flex-1 min-w-0">
            <h3 data-ev-id="ev_ba09636e81" className="text-[11px] font-semibold truncate" style={{ color: color + 'cc' }}>
              {link.title}
            </h3>
            <p data-ev-id="ev_6dfeb9b97b" className="text-[9px] truncate" style={{ color: 'rgba(0,229,255,0.3)' }}>
              {link.subtitle}
            </p>
          </div>
          <ExternalLink
            className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity flex-shrink-0"
            style={{ color }} />

        </div>

        {/* Mini activity bar */}
        <div data-ev-id="ev_6bd4eaecf4" className="mt-2 flex items-center gap-1">
          {[...Array(8)].map((_, i) =>
          <div data-ev-id="ev_679b64ec9b"
          key={i}
          className="flex-1 rounded-full"
          style={{
            height: 2,
            backgroundColor: color,
            opacity: 0.08 + Math.sin(Date.now() / 600 + i + sIdx) * 0.06
          }} />

          )}
        </div>
      </div>
    </a>);

};

/* ══════════════════════════════════════════════
 *  Brain MRI View
 * ══════════════════════════════════════════════ */
export const BrainMRIView = ({ sections, visible }: BrainMRIViewProps) => {
  const [revealed, setRevealed] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 800, h: 560 });

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setRevealed(true), 200);
      return () => clearTimeout(t);
    }
  }, [visible]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setContainerSize(prev => {
        const newW = r.width;
        const newH = Math.max(r.height, 560);
        if (prev.w === newW && prev.h === newH) return prev;
        return { w: newW, h: newH };
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sections.length]);

  const totalLinks = sections.reduce((a, s) => a + s.links.length, 0);

  return (
    <div data-ev-id="ev_aa138797ce"
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      <div data-ev-id="ev_8c22f6d47d"
      ref={containerRef}
      className="mx-auto max-w-5xl rounded-xl overflow-hidden border relative"
      style={{
        background: 'linear-gradient(180deg, #040408 0%, #080812 50%, #050510 100%)',
        borderColor: 'rgba(0,229,255,0.06)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,229,255,0.02)',
        minHeight: 560
      }}>

        {/* Brain canvas background */}
        <BrainCanvas width={containerSize.w} height={containerSize.h} />

        {/* ─── Header ─── */}
        <div data-ev-id="ev_f404aeab3b"
        className="relative z-10 flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: 'rgba(0,229,255,0.05)' }}>

          <div data-ev-id="ev_918d2dbef8" className="flex items-center gap-2.5">
            <div data-ev-id="ev_b0bb308b3c" className="relative">
              <Brain className="w-5 h-5 text-cyan-400/60" />
              <div data-ev-id="ev_1823e51eaf" className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <div data-ev-id="ev_ffea65a0ce">
              <span data-ev-id="ev_537f629987" className="text-cyan-300/70 text-xs font-mono font-bold tracking-[0.15em]">NEURAL SCAN</span>
              <span data-ev-id="ev_d9280472cc" className="text-cyan-400/20 text-[9px] font-mono block">fMRI IMAGING SUITE v2.4</span>
            </div>
          </div>
          <div data-ev-id="ev_adcc31794d" className="flex items-center gap-4 text-[10px] font-mono text-cyan-400/25">
            <span data-ev-id="ev_1af560206c" className="flex items-center gap-1"><Scan className="w-3 h-3" /> SCANNING</span>
            <span data-ev-id="ev_5f58fd76c3" className="flex items-center gap-1"><Activity className="w-3 h-3" /> {totalLinks} HOTSPOTS</span>
            <span data-ev-id="ev_6bc7cdb300" className="flex items-center gap-1"><Radio className="w-3 h-3" /> LIVE</span>
          </div>
        </div>

        {/* ─── Region filter ─── */}
        <div data-ev-id="ev_40f99c8794"
        className="relative z-10 flex items-center gap-1.5 px-5 py-2 border-b overflow-x-auto scrollbar-hide"
        style={{ borderColor: 'rgba(0,229,255,0.04)' }}>

          <button data-ev-id="ev_a7c4618a89"
          onClick={() => setActiveRegion(null)}
          className={`px-3 py-1 rounded text-[10px] font-mono transition-all flex-shrink-0 ${
          activeRegion === null ?
          'text-cyan-300 border border-cyan-400/30 bg-cyan-400/[0.06]' :
          'text-cyan-400/25 hover:text-cyan-400/50 border border-transparent'}`
          }>

            ALL REGIONS
          </button>
          {sections.map((section, sIdx) => {
            const color = REGION_COLORS[sIdx % REGION_COLORS.length];
            const isActive = activeRegion === sIdx;
            return (
              <button data-ev-id="ev_3c7db61e25"
              key={section.id}
              onClick={() => setActiveRegion(isActive ? null : sIdx)}
              className={`px-3 py-1 rounded text-[10px] font-mono transition-all flex-shrink-0 flex items-center gap-1.5 ${
              isActive ?
              'text-white/80 border' :
              'text-white/20 hover:text-white/40 border border-transparent'}`
              }
              style={{
                borderColor: isActive ? color + '40' : undefined,
                backgroundColor: isActive ? color + '10' : undefined
              }}>

                <span data-ev-id="ev_a39196a7ae"
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color, boxShadow: `0 0 4px ${color}40` }} />

                {section.title}
              </button>);

          })}
        </div>

        {/* ─── Content grid ─── */}
        <div data-ev-id="ev_e74ef24b16" className="relative z-10 p-5 space-y-5">
          {sections.map((section, sIdx) => {
            if (activeRegion !== null && activeRegion !== sIdx) return null;
            const color = REGION_COLORS[sIdx % REGION_COLORS.length];

            return (
              <div data-ev-id="ev_51eddcced3" key={section.id}>
                {/* Region header */}
                <div data-ev-id="ev_919ad7fd0f" className="flex items-center gap-2.5 mb-2.5">
                  <div data-ev-id="ev_3b9c76af2c" className="relative">
                    <div data-ev-id="ev_0cf7762eb1"
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}50` }} />

                    <div data-ev-id="ev_43838a826c"
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{ backgroundColor: color, opacity: 0.15 }} />

                  </div>
                  <span data-ev-id="ev_cdcf06b2e9" className="text-sm font-bold font-mono" style={{ color: color + 'aa' }}>
                    {section.emoji} {section.title}
                  </span>
                  <div data-ev-id="ev_da37d85335" className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}12, transparent)` }} />
                  <span data-ev-id="ev_ea2cdfe1b3" className="text-[9px] font-mono" style={{ color: color + '30' }}>
                    ACTIVITY: {section.links.length} nodes
                  </span>
                </div>

                {/* Hotspot cards */}
                <div data-ev-id="ev_0cba09790e" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {section.links.map((link, lIdx) =>
                  <HotspotCard
                    key={link.id}
                    link={link}
                    sIdx={sIdx}
                    delay={250 + sIdx * 80 + lIdx * 50}
                    isActive={activeId === link.id}
                    onSelect={setActiveId} />

                  )}
                </div>
              </div>);

          })}
        </div>

        {/* ─── HUD corners ─── */}
        <div data-ev-id="ev_fcd4aca810" className="absolute top-14 left-3 z-10 text-[7px] font-mono text-cyan-400/12 leading-relaxed pointer-events-none">
          <div data-ev-id="ev_aed9a81a78">MODALITY: fMRI</div>
          <div data-ev-id="ev_a04f6bc27c">TR: 2.0s</div>
          <div data-ev-id="ev_20d80e3fa5">SLICE: 24/48</div>
          <div data-ev-id="ev_e850f11c80">VOXEL: 2×2×2mm</div>
        </div>

        <div data-ev-id="ev_1dcb6e4e89" className="absolute top-14 right-3 z-10 text-[7px] font-mono text-cyan-400/12 leading-relaxed pointer-events-none text-right">
          <div data-ev-id="ev_e69a5bfc17">FIELD: 3.0T</div>
          <div data-ev-id="ev_1a33a68507">COIL: 32ch</div>
          <div data-ev-id="ev_7df8031191">SEQUENCE: EPI</div>
          <div data-ev-id="ev_2a39739f78">BOLD: ACTIVE</div>
        </div>

        {/* ─── Bottom bar ─── */}
        <div data-ev-id="ev_7367cef227"
        className="relative z-10 flex items-center justify-between px-5 py-2 border-t"
        style={{ borderColor: 'rgba(0,229,255,0.05)' }}>

          <div data-ev-id="ev_a4b0bb7d1b" className="flex items-center gap-3 text-[9px] font-mono text-cyan-400/20">
            <span data-ev-id="ev_7773f4283b" className="flex items-center gap-1"><Activity className="w-3 h-3" /> SIGNAL: NOMINAL</span>
            <span data-ev-id="ev_11d952194c">REGIONS: {sections.length}</span>
            <span data-ev-id="ev_a7d29a0c0f">HOTSPOTS: {totalLinks}</span>
          </div>
          <div data-ev-id="ev_0a784893c9" className="flex items-center gap-1.5">
            {sections.map((_, sIdx) =>
            <div data-ev-id="ev_2c7380c49e"
            key={sIdx}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: REGION_COLORS[sIdx % REGION_COLORS.length],
              boxShadow: `0 0 3px ${REGION_COLORS[sIdx % REGION_COLORS.length]}40`,
              opacity: activeRegion === null || activeRegion === sIdx ? 0.6 : 0.1
            }} />

            )}
          </div>
          <span data-ev-id="ev_678d70677c" className="text-[9px] font-mono text-cyan-400/15">fMRI SUITE v2.4</span>
        </div>
      </div>
    </div>);

};

export default BrainMRIView;