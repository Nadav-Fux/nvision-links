import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink } from 'lucide-react';

interface ConstellationViewProps {
  sections: LinkSection[];
  visible: boolean;
}

interface Star {
  link: LinkItem;
  x: number; // 0-1 normalized
  y: number;
  size: number;
  brightness: number;
  section: string;
  twinkleSpeed: number;
  twinklePhase: number;
}

/* ════ Constellation Star Map View ════ */
export const ConstellationView = ({
  sections,
  visible
}: ConstellationViewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(0);
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  const [hoveredStar, setHoveredStar] = useState<Star | null>(null);
  const mousePosRef = useRef({ x: 0.5, y: 0.5 });
  const animRef = useRef(0);
  const starsRef = useRef<Star[]>([]);
  const bgStarsRef = useRef<{x: number;y: number;s: number;b: number;speed: number;}[]>([]);

  // Layout stars in constellation groups — one cluster per section
  useEffect(() => {
    const allStars: Star[] = [];
    const numSections = sections.length;

    sections.forEach((section, sIdx) => {
      const total = section.links.length;
      // Spread section clusters across the canvas horizontally
      const centerX = numSections <= 1 ? 0.5 : 0.2 + sIdx / (numSections - 1) * 0.6;
      const centerY = 0.38 + Math.sin(sIdx * 1.5) * 0.06;

      section.links.forEach((link, i) => {
        const angle = i / total * Math.PI * 1.2 - Math.PI * 0.3;
        const radiusX = 0.10 + Math.sin(i * 1.7) * 0.05;
        const radiusY = 0.14 + Math.cos(i * 2.1) * 0.05;
        allStars.push({
          link,
          x: centerX + Math.cos(angle) * radiusX + i % 2 * 0.02,
          y: centerY + Math.sin(angle) * radiusY + Math.sin(i * 0.9) * 0.03,
          size: 1 + i % 3 * 0.4,
          brightness: 0.7 + Math.random() * 0.3,
          section: section.id,
          twinkleSpeed: 1.5 + Math.random() * 2,
          twinklePhase: Math.random() * Math.PI * 2
        });
      });
    });

    starsRef.current = allStars;

    // Background stars
    bgStarsRef.current = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random(),
      s: 0.3 + Math.random() * 1.5,
      b: 0.1 + Math.random() * 0.4,
      speed: 0.5 + Math.random() * 2
    }));
  }, [sections]);

  // Reveal
  useEffect(() => {
    if (!visible) return;
    setRevealed(0);
    setSelectedStar(null);
    let i = 0;
    const total = sections.reduce((sum, s) => sum + s.links.length, 0);
    const timer = setInterval(() => {
      i++;
      setRevealed(i);
      if (i >= total + 5) clearInterval(timer);
    }, 80);
    return () => clearInterval(timer);
  }, [visible, sections]);

  // Mouse tracking for parallax
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mousePosRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    };
  }, []);

  // Canvas animation - background stars + constellation lines
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      const t = Date.now() / 1000;
      ctx.clearRect(0, 0, w, h);

      // Parallax offset
      const px = (mousePosRef.current.x - 0.5) * 8;
      const py = (mousePosRef.current.y - 0.5) * 8;

      // Background stars with parallax
      bgStarsRef.current.forEach((star) => {
        const sx = star.x * w + px * (star.s * 0.5);
        const sy = star.y * h + py * (star.s * 0.5);
        const twinkle = 0.3 + Math.sin(t * star.speed + star.x * 10) * 0.5 + 0.5;
        const alpha = star.b * twinkle;

        ctx.beginPath();
        ctx.arc(sx, sy, star.s * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${alpha})`;
        ctx.fill();
      });

      // Constellation lines between stars in same section
      const stars = starsRef.current;
      const starSections = Array.from(new Set(stars.map((s) => s.section)));
      // Build section offset map for reveal staggering
      const sectionOffsets: Record<string, number> = {};
      let runOffset = 0;
      for (const sec of starSections) {
        sectionOffsets[sec] = runOffset;
        runOffset += stars.filter((s) => s.section === sec).length;
      }

      starSections.forEach((sec, secIdx) => {
        const group = stars.filter((s) => s.section === sec);
        if (group.length < 2) return;

        const secColor = sec === sections[0]?.id ? '6,182,212' : secIdx % 2 === 0 ? '6,182,212' : '139,92,246';
        const lineRevealCount = Math.min(
          revealed - (sectionOffsets[sec] || 0),
          group.length
        );

        // Connect each star to the next (chain) + one diagonal for a constellation feel
        for (let i = 0; i < lineRevealCount - 1; i++) {
          const a = group[i];
          const b = group[i + 1];
          const ax = a.x * w + px * 1.5;
          const ay = a.y * h + py * 1.5;
          const bx = b.x * w + px * 1.5;
          const by = b.y * h + py * 1.5;

          const lineAlpha = 0.08 + Math.sin(t * 0.5 + i) * 0.04;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.strokeStyle = `rgba(${secColor},${lineAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Traveling pulse along line
          const pulseProg = (t * 0.3 + i * 0.4) % 1;
          const pulseX = ax + (bx - ax) * pulseProg;
          const pulseY = ay + (by - ay) * pulseProg;
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${secColor},${0.3 + Math.sin(t * 2) * 0.15})`;
          ctx.fill();
        }

        // Cross-connect: first to last for a "closed" constellation feel
        if (lineRevealCount >= group.length && group.length > 2) {
          const a = group[0];
          const b = group[Math.floor(group.length / 2)];
          ctx.beginPath();
          ctx.moveTo(a.x * w + px * 1.5, a.y * h + py * 1.5);
          ctx.lineTo(b.x * w + px * 1.5, b.y * h + py * 1.5);
          ctx.strokeStyle = `rgba(${secColor},0.04)`;
          ctx.lineWidth = 0.8;
          ctx.setLineDash([4, 6]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // Star glows for each link-star
      stars.forEach((star, i) => {
        if (i >= revealed) return;
        const sx = star.x * w + px * 1.5;
        const sy = star.y * h + py * 1.5;
        const twinkle =
        star.brightness * (
        0.7 + Math.sin(t * star.twinkleSpeed + star.twinklePhase) * 0.3);

        // Outer glow
        const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 18 * star.size);
        // Use the link's own color for the glow
        const starHex = star.link.color || '#06b6d4';
        const r = parseInt(starHex.slice(1, 3), 16);
        const g = parseInt(starHex.slice(3, 5), 16);
        const b = parseInt(starHex.slice(5, 7), 16);
        const rgb = `${r},${g},${b}`;
        grad.addColorStop(0, `rgba(${rgb},${twinkle * 0.25})`);
        grad.addColorStop(1, `rgba(${rgb},0)`);
        ctx.beginPath();
        ctx.arc(sx, sy, 18 * star.size, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [revealed, sections]);

  // Parallax offset for HTML elements
  const px = (mousePosRef.current.x - 0.5) * 8;
  const py = (mousePosRef.current.y - 0.5) * 8;

  return (
    <div data-ev-id="ev_caf080b184"
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      <div data-ev-id="ev_56d801e003"
      ref={containerRef}
      className="relative mx-auto max-w-4xl rounded-xl overflow-hidden border border-white/[0.05]"
      style={{
        height: 520,
        background: 'radial-gradient(ellipse at 30% 40%, rgba(6,20,40,0.6), rgba(5,5,15,0.98) 70%)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
      }}
      onMouseMove={handleMouseMove}>

        {/* Canvas layer */}
        <canvas data-ev-id="ev_dde8aea93c" ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

        {/* Section labels — rendered dynamically */}
        {sections.map((section, sIdx) => {
          // Compute offset for reveal check
          let revealOffset = 0;
          for (let si = 0; si < sIdx; si++) revealOffset += sections[si].links.length;

          return (
            <div data-ev-id="ev_8054ef07d3"
            key={section.id}
            className="absolute text-[10px] font-mono tracking-[0.3em] uppercase transition-all duration-700 pointer-events-none"
            style={{
              top: '8%',
              [sIdx % 2 === 0 ? 'left' : 'right']: `${22 - px * 0.15}%`,
              color: `${['rgba(6,182,212,0.25)', 'rgba(139,92,246,0.25)', 'rgba(245,158,11,0.25)', 'rgba(236,72,153,0.25)'][sIdx % 4]}`,
              opacity: revealed > revealOffset + 2 ? 1 : 0,
              transform: `translate(${px}px, ${py}px)`
            }}>

              {section.emoji} {section.title}
            </div>);

        })}

        {/* Interactive star buttons */}
        {starsRef.current.map((star, i) => {
          if (i >= revealed) return null;
          const rect = containerRef.current?.getBoundingClientRect();
          const w = rect?.width || 800;
          const h = rect?.height || 520;
          const sx = star.x * w + px * 1.5;
          const sy = star.y * h + py * 1.5;
          const isSelected = selectedStar?.link.id === star.link.id;
          const isHovered = hoveredStar?.link.id === star.link.id;

          return (
            <button data-ev-id="ev_3835d571f6"
            key={star.link.id}
            className="absolute group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-full"
            style={{
              left: sx,
              top: sy,
              transform: 'translate(-50%, -50%)',
              zIndex: isSelected ? 30 : isHovered ? 20 : 10,
              transition: 'all 0.3s ease-out'
            }}
            onClick={() => setSelectedStar(isSelected ? null : star)}
            onMouseEnter={() => setHoveredStar(star)} onTouchStart={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(null)}>

              {/* Star body */}
              <div data-ev-id="ev_15502ef949"
              className="rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                width: isSelected ? 44 : isHovered ? 38 : 28 + star.size * 4,
                height: isSelected ? 44 : isHovered ? 38 : 28 + star.size * 4,
                background: isSelected ?
                `${star.link.color}25` :
                isHovered ?
                `${star.link.color}18` :
                `${star.link.color}0a`,
                border: isSelected ?
                `2px solid ${star.link.color}60` :
                isHovered ?
                `1.5px solid ${star.link.color}40` :
                `1px solid ${star.link.color}15`,
                boxShadow: isSelected ?
                `0 0 25px ${star.link.color}30, 0 0 50px ${star.link.color}10` :
                isHovered ?
                `0 0 15px ${star.link.color}20` :
                `0 0 8px ${star.link.color}10`
              }}>

                <AnimatedIcon
                  icon={star.link.icon}
                  animation={star.link.animation}
                  color={star.link.color}
                  isHovered={isSelected || isHovered} />

              </div>

              {/* Tooltip on hover */}
              <div data-ev-id="ev_f4177435e9"
              className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold transition-all duration-200 ${
              isHovered || isSelected ?
              'opacity-90 translate-y-0' :
              'opacity-0 translate-y-1'}`
              }
              style={{ color: star.link.color }}>

                {star.link.title}
              </div>
            </button>);

        })}

        {/* Selected star detail card */}
        {selectedStar &&
        <div data-ev-id="ev_8efa17e347"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 w-80 max-w-[90%] animate-in fade-in slide-in-from-bottom-4 duration-300">

            <StarDetailCard star={selectedStar} sections={sections} onClose={() => setSelectedStar(null)} />
          </div>
        }

        {/* Legend — dynamic from sections */}
        <div data-ev-id="ev_dd98612213" className="absolute bottom-3 right-3 flex items-center gap-4 text-[9px] text-white/60 font-mono">
          {sections.map((section, sIdx) => {
            const legendColors = ['rgba(6,182,212,0.3)', 'rgba(139,92,246,0.3)', 'rgba(245,158,11,0.3)', 'rgba(236,72,153,0.3)', 'rgba(16,185,129,0.3)', 'rgba(239,68,68,0.3)'];
            return (
              <span data-ev-id="ev_6c908831cc" key={section.id} className="flex items-center gap-1">
                <span data-ev-id="ev_ab608a2b4f" className="w-2 h-2 rounded-full" style={{ backgroundColor: legendColors[sIdx % legendColors.length] }} /> {section.title}
              </span>);

          })}
        </div>

        {/* Instruction */}
        <div data-ev-id="ev_f9e9e9082a"
        className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] text-white/10 font-mono transition-opacity duration-1000 pointer-events-none"
        style={{ opacity: revealed > 3 && !selectedStar ? 1 : 0 }}>

          ✦ לחץ על כוכב לפרטים
        </div>
      </div>
    </div>);

};

/* ═════ Star Detail Card ═════ */
const StarDetailCard = ({ star, sections, onClose }: {star: Star; sections: LinkSection[]; onClose: () => void;}) => {
  const [hovered, setHovered] = useState(false);
  const { link } = star;

  return (
    <div data-ev-id="ev_61c746cb6f"
    className="rounded-xl overflow-hidden border backdrop-blur-xl"
    style={{
      background: 'rgba(10,10,20,0.92)',
      borderColor: `${link.color}25`,
      boxShadow: `0 15px 40px rgba(0,0,0,0.5), 0 0 30px ${link.color}08`
    }}>

      {/* Accent strip */}
      <div data-ev-id="ev_d686a60fe7"
      className="h-[2px]"
      style={{ background: `linear-gradient(90deg, transparent, ${link.color}60, transparent)` }} />


      <div data-ev-id="ev_651198dfbf" className="p-4 flex items-start gap-3">
        <div data-ev-id="ev_7e90360e1f"
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: `${link.color}15`,
          border: `1px solid ${link.color}25`,
          boxShadow: `0 0 15px ${link.color}15`
        }}>

          <AnimatedIcon icon={link.icon} animation={link.animation} color={link.color} isHovered />
        </div>

        <div data-ev-id="ev_e832c24ad5" className="flex-1 min-w-0">
          <div data-ev-id="ev_c01533cb1d" className="flex items-center gap-2">
            <h3 data-ev-id="ev_6744cefbe0" className="text-white/90 text-[14px] font-bold">{link.title}</h3>
            <span data-ev-id="ev_62fd661c6b"
            className="text-[8px] px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: `${link.color}15`, color: `${link.color}90` }}>

              {(() => {
                const sec = sections.find((s) => s.id === star.section);
                return sec ? `${typeof sec.emoji === 'string' ? sec.emoji : ''} ${sec.title}` : star.section;
              })()}
            </span>
          </div>
          <p data-ev-id="ev_bf1d7de1e5" className="text-white/60 text-xs mt-0.5">{link.subtitle}</p>
          <p data-ev-id="ev_622dd6437d" className="text-white/60 text-xs mt-1.5 leading-relaxed">{link.description}</p>

          <div data-ev-id="ev_510c2aed23" className="flex items-center gap-2 mt-3">
            <a data-ev-id="ev_a1269ba93d"
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
            <button data-ev-id="ev_8734e9a01d"
            onClick={onClose}
            className="text-xs px-3 py-1.5 rounded-lg text-white/60 hover:text-white/70 hover:bg-white/[0.04] transition-colors">

              סגור
            </button>
          </div>
        </div>
      </div>
    </div>);

};