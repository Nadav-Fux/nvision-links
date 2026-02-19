import { useRef, useEffect, useCallback, useState } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import { ExternalLink } from 'lucide-react';
import type { LinkItem, LinkSection } from '@/data/links';

interface NeuralMapViewProps {
  sections: LinkSection[];
  visible: boolean;
}

/* ════ Animated neural canvas background ════ */
const NeuralCanvas = ({ height }: {height: number;}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<{x: number;y: number;}[]>([]);
  const edgesRef = useRef<[number, number][]>([]);
  const dimRef = useRef({ w: 0, h: 0 });

  const initNetwork = useCallback((w: number, h: number) => {
    const nodes: {x: number;y: number;}[] = [];
    const count = Math.max(25, Math.round(w * h / 8000));
    for (let i = 0; i < count; i++) {
      nodes.push({ x: Math.random() * w, y: Math.random() * h });
    }
    const edges: [number, number][] = [];
    const maxDist = Math.min(w, h) * 0.28;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (d < maxDist && Math.random() < 0.45) edges.push([i, j]);
      }
    }
    nodesRef.current = nodes;
    edgesRef.current = edges;
    dimRef.current = { w, h };
  }, []);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const r = cvs.parentElement?.getBoundingClientRect();
      if (!r) return;
      cvs.width = r.width * devicePixelRatio;
      cvs.height = height * devicePixelRatio;
      cvs.style.width = `${r.width}px`;
      cvs.style.height = `${height}px`;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      initNetwork(r.width, height);
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    const draw = (time: number) => {
      const { w, h } = dimRef.current;
      const t = time * 0.001;
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      const edges = edgesRef.current;

      // Draw edges
      edges.forEach(([i, j]) => {
        const a = nodes[i],b = nodes[j];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = 'rgba(6,182,212,0.045)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Animated pulse along edge
        const pulse = (t * 0.4 + i * 0.1 + j * 0.07) % 3 / 3;
        if (pulse < 1) {
          const px = a.x + (b.x - a.x) * pulse;
          const py = a.y + (b.y - a.y) * pulse;
          ctx.beginPath();
          ctx.arc(px, py, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(6,182,212,${0.25 * (1 - pulse)})`;
          ctx.fill();
        }
      });

      // Draw nodes
      nodes.forEach((n, i) => {
        const pulse = 0.3 + Math.sin(t * 2 + i * 0.8) * 0.2;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6,182,212,${pulse})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [height, initNetwork]);

  return (
    <canvas data-ev-id="ev_7eff8bac68"
    ref={canvasRef}
    className="absolute inset-0 pointer-events-none"
    aria-hidden="true"
    style={{ opacity: 0.8 }} />);


};

/* ════ Compact neural node card ════ */
const NeuralNode = ({
  link,
  index,
  hovered,
  onHover,
  tappedIndex,
  onTap





}: {link: LinkItem;index: number;hovered: boolean;onHover: (i: number | null) => void;tappedIndex?: number | null;onTap?: (i: number | null) => void;}) => {
  // Stagger offset for organic feel
  const nudgeX = index % 3 === 1 ? 6 : index % 3 === 2 ? -4 : 0;
  const nudgeY = index % 4 === 0 ? -3 : index % 4 === 2 ? 4 : 0;
  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;

  const handleClick = (e: React.MouseEvent) => {
    if (isTouchDevice && onTap) {
      if (tappedIndex !== index) {
        e.preventDefault();
        onTap(index);
      }
      // If already tapped, let the <a> navigate
    }
  };

  return (
    <a data-ev-id="ev_42f1121899"
    href={link.url}
    target="_blank" rel="noopener noreferrer"
    aria-label={`${link.title} — ${link.subtitle} (נפתח בחלון חדש)`}
    className="group block relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
    onClick={handleClick}
    onMouseEnter={() => onHover(index)}
    onMouseLeave={() => onHover(null)}
    style={{ transform: `translate(${nudgeX}px, ${nudgeY}px)` }}>

      {/* Node connector dot */}
      <div data-ev-id="ev_87ad19f34f"
      className="absolute -left-2 top-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full transition-all duration-500"
      style={{
        backgroundColor: hovered ? link.color : `${link.color}40`,
        boxShadow: hovered ? `0 0 10px ${link.color}60` : 'none'
      }} />


      <div data-ev-id="ev_e07878600a"
      className="relative rounded-xl p-3 transition-all duration-400"
      style={{
        background: hovered ?
        `linear-gradient(135deg, ${link.color}12, rgba(255,255,255,0.06))` :
        'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? `${link.color}30` : 'rgba(255,255,255,0.05)'}`,
        boxShadow: hovered ?
        `0 12px 30px -8px ${link.color}20, 0 0 20px ${link.color}08` :
        '0 2px 8px rgba(0,0,0,0.2)',
        transform: hovered ? 'scale(1.03)' : 'scale(1)'
      }}>

        <div data-ev-id="ev_21f5053389" className="flex items-center gap-2.5">
          <div data-ev-id="ev_c171a3b142"
          className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-400"
          style={{
            backgroundColor: `${link.color}12`,
            boxShadow: hovered ? `0 0 12px ${link.color}18` : 'none'
          }}>

            <AnimatedIcon
              icon={link.icon}
              animation={link.animation}
              color={link.color}
              isHovered={hovered} />

          </div>
          <div data-ev-id="ev_90e331ce22" className="flex-1 min-w-0">
            <h3 data-ev-id="ev_a0be5cbef2"
            className="text-[13px] font-semibold truncate transition-colors duration-300"
            style={{ color: hovered ? '#fff' : 'rgba(255,255,255,0.75)' }}>

              {link.title}
            </h3>
            <p data-ev-id="ev_cd0179663a" className="text-xs text-white/30 truncate">
              {link.subtitle}
            </p>
          </div>
          <ExternalLink
            className="w-3.5 h-3.5 flex-shrink-0 transition-all duration-300"
            style={{
              color: hovered ? `${link.color}80` : 'rgba(255,255,255,0.12)',
              transform: hovered ? 'translate(-1px, -1px)' : 'none'
            }} />

        </div>

        {/* Expand description on hover */}
        <div data-ev-id="ev_e05f76ccb9"
        className="overflow-hidden transition-all duration-400"
        style={{
          maxHeight: hovered ? '48px' : '0px',
          opacity: hovered ? 1 : 0
        }}>

          <p data-ev-id="ev_89d4b5da93" className="text-white/35 text-xs leading-relaxed mt-2 pt-2 border-t border-white/[0.05] line-clamp-2">
            {link.description}
          </p>
        </div>

        {/* Accent glow corners */}
        {hovered &&
        <div data-ev-id="ev_9c35114cda"
        className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 100% 0%, ${link.color}10, transparent 70%)`
        }} />

        }
      </div>
    </a>);

};

/* ════ Section label styled as neural layer ════ */
const LayerLabel = ({
  label,
  color,
  emoji




}: {label: string;color: string;emoji: string;}) =>
<div data-ev-id="ev_0d405272bb" className="flex items-center gap-3 mb-4 mt-2">
    <div data-ev-id="ev_f38fa5ece9"
  className="h-px flex-1"
  style={{
    background: `linear-gradient(to right, ${color}20, transparent)`
  }} />

    <div data-ev-id="ev_ea3bb04503" className="flex items-center gap-2">
      <div data-ev-id="ev_744fc629c6"
    className="w-2 h-2 rounded-full"
    style={{ backgroundColor: `${color}60`, boxShadow: `0 0 6px ${color}40` }} />

      <span data-ev-id="ev_46ac8f0010" className="text-sm font-medium" style={{ color: `${color}80` }}>
        {emoji} {label}
      </span>
      <div data-ev-id="ev_765f6f2b8a"
    className="w-2 h-2 rounded-full"
    style={{ backgroundColor: `${color}30` }} />

    </div>
    <div data-ev-id="ev_b4b2f657ea"
  className="h-px flex-1"
  style={{
    background: `linear-gradient(to left, ${color}20, transparent)`
  }} />

  </div>;


const SECTION_COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981', '#ef4444'];

/* ═══════════ Main View ═══════════ */
export const NeuralMapView = ({
  sections,
  visible
}: NeuralMapViewProps) => {
  const allLinks = sections.flatMap((s) => s.links);
  const [hovered, setHovered] = useState<number | null>(null);
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerH, setContainerH] = useState(600);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setContainerH(entries[0].contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Compute global index offsets for each section
  let globalOffset = 0;
  const sectionOffsets = sections.map((s) => {
    const off = globalOffset;
    globalOffset += s.links.length;
    return off;
  });

  return (
    <div data-ev-id="ev_073c5bae1a"
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      <div data-ev-id="ev_d9da1e7e10" ref={containerRef} className="relative">
        {/* Animated neural background */}
        <NeuralCanvas height={containerH} />

        {/* Cards grid */}
        <div data-ev-id="ev_6a361c1769" className="relative z-10 px-2">
          {sections.map((section, sIdx) => {
            const color = SECTION_COLORS[sIdx % SECTION_COLORS.length];
            const baseIndex = sectionOffsets[sIdx];

            return (
              <div data-ev-id="ev_91dc2a6adb" key={section.id}>
                {/* Neural pathway divider between sections */}
                {sIdx > 0 &&
                <div data-ev-id="ev_2a2efb4c0f" className="relative flex items-center justify-center py-4">
                    <div data-ev-id="ev_b90b3afa22" className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <div data-ev-id="ev_7dafb0521c" className="relative flex items-center gap-2">
                      {[0, 1, 2, 3, 4].map((i) =>
                    <div data-ev-id="ev_85ef59841f"
                    key={i}
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{
                      backgroundColor:
                      i === 2 ? `${color}80` : `${SECTION_COLORS[(sIdx - 1) % SECTION_COLORS.length]}40`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '2s'
                    }} />
                    )}
                    </div>
                  </div>
                }

                <LayerLabel label={section.title} color={color} emoji={section.emoji} />
                <div data-ev-id="ev_871081d7fd" className={`grid grid-cols-2 sm:grid-cols-3 gap-2.5 ${sIdx < sections.length - 1 ? 'mb-6' : ''}`}>
                  {section.links.map((link, i) =>
                  <NeuralNode
                    key={link.id}
                    link={link}
                    index={baseIndex + i}
                    hovered={hovered === baseIndex + i || tappedIndex === baseIndex + i}
                    onHover={(idx) => setHovered(idx)}
                    tappedIndex={tappedIndex}
                    onTap={setTappedIndex} />
                  )}
                </div>
              </div>);

          })}
        </div>
      </div>
    </div>);

};