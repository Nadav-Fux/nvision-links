import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink, Waves } from 'lucide-react';

interface AquariumViewProps {
  sections: LinkSection[];
  visible: boolean;
}

interface Creature {
  link: LinkItem;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
  bobSpeed: number;
  section: string;
}

interface Bubble {
  x: number;
  y: number;
  r: number;
  speed: number;
  wobble: number;
  phase: number;
}

/* ════ Aquarium / Deep Sea View ════ */
export const AquariumView = ({
  sections,
  visible
}: AquariumViewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const creaturesRef = useRef<Creature[]>([]);
  const bubblesRef = useRef<Bubble[]>([]);
  const animRef = useRef(0);
  const [revealed, setRevealed] = useState(0);
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null);
  const [hoveredCreature, setHoveredCreature] = useState<Creature | null>(null);
  const [, tick] = useState(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const allLinks = sections.flatMap((s) => s.links);

  // Init creatures and bubbles
  useEffect(() => {
    const w = containerRef.current?.getBoundingClientRect().width || 800;
    const h = 520;

    // Build section index map: for each link, which section it belongs to
    let offset = 0;
    const linkSectionMap: string[] = [];
    sections.forEach((section) => {
      section.links.forEach(() => {
        linkSectionMap.push(section.id);
      });
    });

    creaturesRef.current = allLinks.map((link, i) => {
      return {
        link,
        x: 60 + Math.random() * (w - 120),
        y: 60 + Math.random() * (h - 120),
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.3,
        size: 28 + i % 4 * 5,
        phase: Math.random() * Math.PI * 2,
        bobSpeed: 0.8 + Math.random() * 0.6,
        section: linkSectionMap[i] || 'unknown'
      };
    });

    bubblesRef.current = Array.from({ length: 30 }, () => ({
      x: Math.random() * w,
      y: h + Math.random() * 100,
      r: 1 + Math.random() * 4,
      speed: 0.3 + Math.random() * 0.8,
      wobble: Math.random() * 2,
      phase: Math.random() * Math.PI * 2
    }));
  }, [sections]);

  // Reveal
  useEffect(() => {
    if (!visible) return;
    setRevealed(0);
    setSelectedCreature(null);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setRevealed(i);
      if (i >= allLinks.length + 2) clearInterval(timer);
    }, 80);
    return () => clearInterval(timer);
  }, [visible, allLinks.length]);

  // Mouse tracking
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    };
  }, []);

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const frame = () => {
      const w = container.getBoundingClientRect().width;
      const h = container.getBoundingClientRect().height;
      const t = Date.now() / 1000;
      const creatures = creaturesRef.current;
      const bubbles = bubblesRef.current;
      ctx.clearRect(0, 0, w, h);

      // Water caustics (light rays from top)
      for (let i = 0; i < 6; i++) {
        const rx = w * 0.1 + (i * w * 0.17 + Math.sin(t * 0.3 + i * 1.5) * 30);
        const grad = ctx.createLinearGradient(rx, 0, rx + 40, h);
        grad.addColorStop(0, 'rgba(6,182,212,0.015)');
        grad.addColorStop(0.4, 'rgba(6,182,212,0.005)');
        grad.addColorStop(1, 'rgba(6,182,212,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(rx, 0, 25 + Math.sin(t + i) * 10, h);
      }

      // Seaweed at bottom
      for (let i = 0; i < 8; i++) {
        const sx = w * 0.08 + i * w * 0.12;
        const seaH = 40 + i % 3 * 25;
        ctx.beginPath();
        ctx.moveTo(sx, h);
        for (let s = 0; s < seaH; s += 5) {
          const sway = Math.sin(t * 1.2 + i + s * 0.05) * (6 + s * 0.08);
          ctx.lineTo(sx + sway, h - s);
        }
        ctx.strokeStyle = `rgba(34,197,94,${0.04 + i % 2 * 0.02})`;
        ctx.lineWidth = 3 + i % 2;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Bubbles
      bubbles.forEach((b) => {
        b.y -= b.speed;
        b.x += Math.sin(t * b.wobble + b.phase) * 0.3;
        if (b.y < -10) {
          b.y = h + 10;
          b.x = Math.random() * w;
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(150,220,255,${0.08 + b.r * 0.02})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Highlight
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,240,255,${0.1 + b.r * 0.02})`;
        ctx.fill();
      });

      // Creature physics and rendering
      creatures.forEach((c, i) => {
        if (i >= revealed) return;

        // Gentle swimming motion
        c.vx += Math.sin(t * 0.3 + c.phase) * 0.008;
        c.vy += Math.cos(t * 0.25 + c.phase * 1.3) * 0.005;

        // Bob up and down
        c.vy += Math.sin(t * c.bobSpeed + c.phase) * 0.003;

        // Avoid mouse (gentle push away)
        const mx = mouseRef.current.x * w;
        const my = mouseRef.current.y * h;
        const mdx = c.x - mx;
        const mdy = c.y - my;
        const mDist = Math.hypot(mdx, mdy) || 1;
        if (mDist < 100) {
          c.vx += mdx / mDist * 0.03;
          c.vy += mdy / mDist * 0.02;
        }

        // Soft repulsion between creatures
        creatures.forEach((other, j) => {
          if (j === i || j >= revealed) return;
          const dx = c.x - other.x;
          const dy = c.y - other.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < c.size + other.size + 30) {
            c.vx += dx / dist * 0.01;
            c.vy += dy / dist * 0.008;
          }
        });

        // Damping
        c.vx *= 0.985;
        c.vy *= 0.985;

        // Clamp speed
        const speed = Math.hypot(c.vx, c.vy);
        if (speed > 1.2) {
          c.vx = c.vx / speed * 1.2;
          c.vy = c.vy / speed * 1.2;
        }

        c.x += c.vx;
        c.y += c.vy;

        // Boundaries
        const margin = c.size + 15;
        if (c.x < margin) {c.x = margin;c.vx = Math.abs(c.vx) * 0.5;}
        if (c.x > w - margin) {c.x = w - margin;c.vx = -Math.abs(c.vx) * 0.5;}
        if (c.y < margin) {c.y = margin;c.vy = Math.abs(c.vy) * 0.5;}
        if (c.y > h - margin) {c.y = h - margin;c.vy = -Math.abs(c.vy) * 0.5;}

        // Draw bioluminescent glow
        const cHex = c.link.color || '#06b6d4';
        const cR = parseInt(cHex.slice(1, 3), 16);
        const cG = parseInt(cHex.slice(3, 5), 16);
        const cB = parseInt(cHex.slice(5, 7), 16);
        const rgb = `${cR},${cG},${cB}`;
        const isHov = hoveredCreature?.link.id === c.link.id;
        const isSel = selectedCreature?.link.id === c.link.id;
        const glowSize = c.size + (isHov || isSel ? 20 : 10);
        const pulse = 0.5 + Math.sin(t * 2 + c.phase) * 0.2;

        // Tentacles / trailing particles
        const tentacles = 3;
        for (let tt = 0; tt < tentacles; tt++) {
          const tAngle = tt / tentacles * Math.PI * 0.6 + Math.PI * 0.7;
          const tLen = c.size * 0.8;
          const tWave = Math.sin(t * 2.5 + tt + c.phase) * 6;
          const tx = c.x + Math.cos(tAngle) * tLen + tWave;
          const ty = c.y + Math.sin(tAngle) * tLen * 0.6 + Math.abs(tWave) * 0.5;

          ctx.beginPath();
          ctx.moveTo(c.x, c.y + c.size * 0.2);
          ctx.quadraticCurveTo(
            c.x + tWave * 0.5,
            c.y + c.size * 0.5,
            tx,
            ty
          );
          ctx.strokeStyle = `rgba(${rgb},${0.08 + (isHov ? 0.06 : 0)})`;
          ctx.lineWidth = 1.5;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        // Outer glow
        const grad = ctx.createRadialGradient(c.x, c.y, c.size * 0.3, c.x, c.y, glowSize);
        grad.addColorStop(0, `rgba(${rgb},${(isHov || isSel ? 0.2 : 0.1) * pulse})`);
        grad.addColorStop(0.5, `rgba(${rgb},${(isHov || isSel ? 0.08 : 0.03) * pulse})`);
        grad.addColorStop(1, `rgba(${rgb},0)`);
        ctx.beginPath();
        ctx.arc(c.x, c.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      tick((n) => n + 1);
      animRef.current = requestAnimationFrame(frame);
    };

    frame();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [revealed, hoveredCreature, selectedCreature]);

  return (
    <div data-ev-id="ev_6a16ff1cf4"
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      <div data-ev-id="ev_d97f3e8980"
      ref={containerRef}
      className="relative mx-auto max-w-4xl rounded-xl overflow-hidden border border-white/[0.05] select-none"
      style={{
        height: 520,
        background: 'linear-gradient(180deg, #030a15 0%, #041020 30%, #020818 70%, #010510 100%)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6), inset 0 -60px 80px rgba(0,0,0,0.3)'
      }}
      onMouseMove={handleMouseMove}>

        <canvas data-ev-id="ev_6ebd297e82" ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

        {/* Water surface shimmer at top */}
        <div data-ev-id="ev_6dbffac1ef"
        className="absolute top-0 left-0 right-0 h-12 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(6,182,212,0.04), transparent)'
        }} />


        {/* Section labels — dynamic */}
        <div data-ev-id="ev_fa6655e248" className="absolute top-3 left-0 right-0 z-10 flex justify-between px-5 pointer-events-none flex-wrap gap-2">
          {sections.map((section, sIdx) => {
            const colors = ['text-cyan-400/20', 'text-purple-400/20', 'text-amber-400/20', 'text-pink-400/20', 'text-emerald-400/20'];
            return (
              <span data-ev-id="ev_08d71be501" key={section.id} className={`text-[10px] font-mono ${colors[sIdx % colors.length]} tracking-wider flex items-center gap-1`}>
                {sIdx === 0 && <Waves className="w-3 h-3" />}
                {section.emoji} {section.title}
                {sIdx === sections.length - 1 && <Waves className="w-3 h-3" />}
              </span>);

          })}
        </div>

        {/* Interactive creature buttons */}
        {creaturesRef.current.map((creature, i) => {
          if (i >= revealed) return null;
          const isSel = selectedCreature?.link.id === creature.link.id;
          const isHov = hoveredCreature?.link.id === creature.link.id;

          return (
            <button data-ev-id="ev_3d60819196"
            key={creature.link.id}
            className="absolute group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-full"
            style={{
              left: creature.x,
              top: creature.y,
              transform: 'translate(-50%, -50%)',
              zIndex: isSel ? 30 : isHov ? 20 : 10,
              width: creature.size * 2,
              height: creature.size * 2
            }}
            onClick={() => setSelectedCreature(isSel ? null : creature)}
            onMouseEnter={() => setHoveredCreature(creature)} onTouchStart={() => setHoveredCreature(creature)}
            onMouseLeave={() => setHoveredCreature(null)}>

              <div data-ev-id="ev_b189c47fa9"
              className="w-full h-full rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                background: isSel ?
                `radial-gradient(circle, ${creature.link.color}20, transparent 70%)` :
                isHov ?
                `radial-gradient(circle, ${creature.link.color}12, transparent 70%)` :
                'transparent',
                border: isSel ?
                `1.5px solid ${creature.link.color}30` :
                isHov ?
                `1px solid ${creature.link.color}18` :
                '1px solid transparent',
                cursor: 'pointer'
              }}>

                <AnimatedIcon
                  icon={creature.link.icon}
                  animation={creature.link.animation}
                  color={creature.link.color}
                  isHovered={isSel || isHov} />

              </div>

              {/* Name bubble */}
              <div data-ev-id="ev_c99fbe5825"
              className={`absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 ${
              isHov || isSel ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-2'}`
              }>

                <span data-ev-id="ev_4f8c960c49"
                className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  color: creature.link.color,
                  backgroundColor: `${creature.link.color}10`,
                  backdropFilter: 'blur(4px)'
                }}>

                  {creature.link.title}
                </span>
              </div>
            </button>);

        })}

        {/* Selected creature detail */}
        {selectedCreature &&
        <div data-ev-id="ev_65f61705a3" className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 w-80 max-w-[90%] animate-in fade-in slide-in-from-bottom-4 duration-300">
            <CreatureCard
              creature={selectedCreature}
              onClose={() => setSelectedCreature(null)}
              sectionLabel={(() => {
                const sec = sections.find((s) => s.id === selectedCreature.section);
                return sec ? `${typeof sec.emoji === 'string' ? sec.emoji : ''} ${sec.title}`.trim() : selectedCreature.section;
              })()}
            />
          </div>
        }

        {/* Bottom depth indicator */}
        <div data-ev-id="ev_1fcab8b304" className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[8px] font-mono text-white/6 pointer-events-none">
          ── DEPTH: {allLinks.length * 12}m ──
        </div>
      </div>
    </div>);

};

/* ═════ Creature Detail Card ═════ */
const CreatureCard = ({ creature, onClose, sectionLabel }: {creature: Creature;onClose: () => void;sectionLabel: string;}) => {
  const [hovered, setHovered] = useState(false);
  const { link } = creature;

  return (
    <div data-ev-id="ev_4a5f8ede2d"
    className="rounded-xl overflow-hidden border"
    style={{
      background: 'rgba(3,10,20,0.92)',
      backdropFilter: 'blur(20px)',
      borderColor: `${link.color}20`,
      boxShadow: `0 15px 40px rgba(0,0,0,0.6), 0 0 40px ${link.color}06`
    }}>

      <div data-ev-id="ev_50417aa53b" className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${link.color}40, transparent)` }} />

      <div data-ev-id="ev_2a04ce63d7" className="p-4 flex items-start gap-3">
        <div data-ev-id="ev_8dcc436166"
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: `radial-gradient(circle, ${link.color}18, transparent)`,
          border: `1.5px solid ${link.color}25`,
          boxShadow: `0 0 20px ${link.color}12`
        }}>

          <AnimatedIcon icon={link.icon} animation={link.animation} color={link.color} isHovered />
        </div>

        <div data-ev-id="ev_b9d548fde0" className="flex-1 min-w-0">
          <div data-ev-id="ev_05b4616580" className="flex items-center gap-2">
            <h3 data-ev-id="ev_8991a8ef7d" className="text-white/90 text-[14px] font-bold">{link.title}</h3>
            <span data-ev-id="ev_cd7f193bd9"
            className="text-[8px] px-1.5 py-0.5 rounded-full font-mono"
            style={{ backgroundColor: `${link.color}12`, color: `${link.color}70` }}>

              {sectionLabel}
            </span>
          </div>
          <p data-ev-id="ev_22b4dc0d49" className="text-white/60 text-xs mt-0.5">{link.subtitle}</p>
          <p data-ev-id="ev_3c16c1dea2" className="text-white/60 text-xs mt-1.5 leading-relaxed">{link.description}</p>

          <div data-ev-id="ev_c233a733f3" className="flex items-center gap-2 mt-3">
            <a data-ev-id="ev_1c1a090cdb"
            href={link.url}
            target="_blank" rel="noopener noreferrer"
            aria-label={`${link.title} (נפתח בחלון חדש)`}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            style={{
              backgroundColor: hovered ? `${link.color}25` : `${link.color}15`,
              color: `${link.color}cc`
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}>

              <ExternalLink className="w-3 h-3" />
              פתח
            </a>
            <button data-ev-id="ev_a3aa49f52a"
            onClick={onClose}
            className="text-xs px-3 py-1.5 rounded-lg text-white/60 hover:text-white/70 hover:bg-white/[0.04] transition-colors">

              סגור
            </button>
          </div>
        </div>
      </div>
    </div>);

};