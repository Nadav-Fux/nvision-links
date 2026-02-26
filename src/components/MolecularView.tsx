import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink, Atom } from 'lucide-react';

interface MolecularViewProps {
  sections: LinkSection[];
  visible: boolean;
}

interface AtomNode {
  link: LinkItem;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  section: string;
  bonds: number[]; // indices into allAtoms
  electronPhase: number;
}

const MOL_RGBS = ['6,182,212', '139,92,246', '245,158,11', '236,72,153', '16,185,129', '239,68,68'];

/* ════ Molecular Graph View ════ */
export const MolecularView = ({
  sections,
  visible
}: MolecularViewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const atomsRef = useRef<AtomNode[]>([]);
  const animRef = useRef(0);
  const [revealed, setRevealed] = useState(0);
  const [selectedAtom, setSelectedAtom] = useState<AtomNode | null>(null);
  const [hoveredAtom, setHoveredAtom] = useState<AtomNode | null>(null);
  const [, tick] = useState(0);

  // Drag state
  const dragging = useRef<number | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const allLinks = sections.flatMap((s) => s.links);

  // Section color map for canvas drawing
  const sectionRgbMap: Record<string, string> = {};
  sections.forEach((s, sIdx) => {
    sectionRgbMap[s.id] = MOL_RGBS[sIdx % MOL_RGBS.length];
  });
  // Section center X positions for gravity
  const numSections = sections.length;
  const sectionCenterXMap: Record<string, number> = {};
  sections.forEach((s, sIdx) => {
    sectionCenterXMap[s.id] = numSections <= 1 ? 0.5 : 0.2 + (sIdx / (numSections - 1)) * 0.6;
  });

  // Initialize atoms with positions and bonds
  useEffect(() => {
    const w = containerRef.current?.getBoundingClientRect().width || 800;
    const h = 500;
    const atoms: AtomNode[] = [];
    const numSections = sections.length;

    let globalIdx = 0;
    sections.forEach((section, sIdx) => {
      // Spread section clusters horizontally
      const sectionCenterX = numSections <= 1 ? w * 0.5 : w * (0.2 + sIdx / (numSections - 1) * 0.6);
      const sectionCenterY = h * 0.5;
      const spread = Math.min(w * 0.14, 120);

      section.links.forEach((link, i) => {
        const angle = i / section.links.length * Math.PI * 2 + sIdx * Math.PI * 0.5;

        atoms.push({
          link,
          x: sectionCenterX + Math.cos(angle) * spread * (0.6 + Math.random() * 0.4),
          y: sectionCenterY + Math.sin(angle) * spread * (0.5 + Math.random() * 0.5),
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: 24 + globalIdx % 3 * 4,
          section: section.id,
          bonds: [],
          electronPhase: Math.random() * Math.PI * 2
        });
        globalIdx++;
      });
    });

    // Create bonds: connect each atom to 1-2 nearest in same section
    atoms.forEach((atom, i) => {
      const sameSection = atoms.
      map((a, j) => ({ a, j, dist: Math.hypot(a.x - atom.x, a.y - atom.y) })).
      filter((d) => d.j !== i && d.a.section === atom.section).
      sort((a, b) => a.dist - b.dist);

      const bondCount = 1 + i % 2;
      sameSection.slice(0, bondCount).forEach((b) => {
        if (!atom.bonds.includes(b.j) && !atoms[b.j].bonds.includes(i)) {
          atom.bonds.push(b.j);
          atoms[b.j].bonds.push(i);
        }
      });
    });

    atomsRef.current = atoms;
  }, [sections]);

  // Reveal
  useEffect(() => {
    if (!visible) return;
    setRevealed(0);
    setSelectedAtom(null);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setRevealed(i);
      if (i >= allLinks.length + 3) clearInterval(timer);
    }, 70);
    return () => clearInterval(timer);
  }, [visible, allLinks.length]);

  // Physics + Canvas render loop
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
      const atoms = atomsRef.current;
      ctx.clearRect(0, 0, w, h);

      // Physics: gentle floating + repulsion + bond attraction
      atoms.forEach((atom, i) => {
        if (i >= revealed) return;
        if (dragging.current === i) return;

        // Gentle floating
        atom.vx += Math.sin(t * 0.5 + i) * 0.01;
        atom.vy += Math.cos(t * 0.4 + i * 0.7) * 0.01;

        // Repulsion from other atoms
        atoms.forEach((other, j) => {
          if (j === i || j >= revealed) return;
          const dx = atom.x - other.x;
          const dy = atom.y - other.y;
          const dist = Math.hypot(dx, dy) || 1;
          const minDist = atom.radius + other.radius + 20;
          if (dist < minDist) {
            const force = (minDist - dist) * 0.005;
            atom.vx += dx / dist * force;
            atom.vy += dy / dist * force;
          }
        });

        // Bond attraction (spring)
        atom.bonds.forEach((bi) => {
          const other = atoms[bi];
          if (!other) return;
          const dx = other.x - atom.x;
          const dy = other.y - atom.y;
          const dist = Math.hypot(dx, dy) || 1;
          const idealDist = 90 + atom.radius + other.radius;
          const force = (dist - idealDist) * 0.001;
          atom.vx += dx / dist * force;
          atom.vy += dy / dist * force;
        });

        // Section gravity (pull toward section center)
        const containerW = containerRef.current?.getBoundingClientRect().width || 800;
        const cx = (sectionCenterXMap[atom.section] ?? 0.5) * containerW;
        const cy = h * 0.5;
        atom.vx += (cx - atom.x) * 0.0003;
        atom.vy += (cy - atom.y) * 0.0003;

        // Damping
        atom.vx *= 0.97;
        atom.vy *= 0.97;

        // Apply velocity
        atom.x += atom.vx;
        atom.y += atom.vy;

        // Boundary
        const margin = atom.radius + 10;
        if (atom.x < margin) {atom.x = margin;atom.vx *= -0.5;}
        if (atom.x > w - margin) {atom.x = w - margin;atom.vx *= -0.5;}
        if (atom.y < margin) {atom.y = margin;atom.vy *= -0.5;}
        if (atom.y > h - margin) {atom.y = h - margin;atom.vy *= -0.5;}
      });

      // Draw bonds
      atoms.forEach((atom, i) => {
        if (i >= revealed) return;
        const rgb = sectionRgbMap[atom.section] || '6,182,212';

        atom.bonds.forEach((bi) => {
          if (bi >= revealed || bi < i) return; // draw each bond once
          const other = atoms[bi];
          const dx = other.x - atom.x;
          const dy = other.y - atom.y;
          const dist = Math.hypot(dx, dy);

          // Double bond lines
          const nx = -dy / dist * 3;
          const ny = dx / dist * 3;

          for (let line = -1; line <= 1; line += 2) {
            ctx.beginPath();
            ctx.moveTo(atom.x + nx * line, atom.y + ny * line);
            ctx.lineTo(other.x + nx * line, other.y + ny * line);
            ctx.strokeStyle = `rgba(${rgb},0.12)`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          // Electron flow along bond
          const electrons = 3;
          for (let e = 0; e < electrons; e++) {
            const prog = (t * 0.6 + e * (1 / electrons) + i * 0.1) % 1;
            const ex = atom.x + dx * prog;
            const ey = atom.y + dy * prog;

            ctx.beginPath();
            ctx.arc(ex, ey, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb},${0.3 + Math.sin(t * 3 + e) * 0.15})`;
            ctx.fill();

            // Glow
            const grad = ctx.createRadialGradient(ex, ey, 0, ex, ey, 6);
            grad.addColorStop(0, `rgba(${rgb},0.2)`);
            grad.addColorStop(1, `rgba(${rgb},0)`);
            ctx.beginPath();
            ctx.arc(ex, ey, 6, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
          }
        });
      });

      // Draw atom glows
      atoms.forEach((atom, i) => {
        if (i >= revealed) return;
        const rgb = sectionRgbMap[atom.section] || '6,182,212';
        const isHov = hoveredAtom?.link.id === atom.link.id;
        const isSel = selectedAtom?.link.id === atom.link.id;

        // Electron orbit
        const orbitR = atom.radius + 10;
        const eCount = 2 + i % 2;
        for (let e = 0; e < eCount; e++) {
          const angle = t * (1.5 + i * 0.1) + e * Math.PI * 2 / eCount + atom.electronPhase;
          const ex = atom.x + Math.cos(angle) * orbitR;
          const ey = atom.y + Math.sin(angle) * orbitR * 0.6;

          ctx.beginPath();
          ctx.arc(ex, ey, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb},0.4)`;
          ctx.fill();
        }

        // Orbit path
        ctx.beginPath();
        ctx.ellipse(atom.x, atom.y, orbitR, orbitR * 0.6, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgb},0.04)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Outer glow for hovered/selected
        if (isHov || isSel) {
          const grad = ctx.createRadialGradient(atom.x, atom.y, atom.radius, atom.x, atom.y, atom.radius + 25);
          grad.addColorStop(0, `rgba(${rgb},0.15)`);
          grad.addColorStop(1, `rgba(${rgb},0)`);
          ctx.beginPath();
          ctx.arc(atom.x, atom.y, atom.radius + 25, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      });

      // Center divider
      ctx.beginPath();
      ctx.moveTo(w / 2, 20);
      ctx.lineTo(w / 2, h - 20);
      ctx.strokeStyle = 'rgba(255,255,255,0.02)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      tick((n) => n + 1);
      animRef.current = requestAnimationFrame(frame);
    };

    frame();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [revealed, hoveredAtom, selectedAtom]);

  // Drag handlers
  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    if ('touches' in e) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const findAtom = (x: number, y: number) => {
    const atoms = atomsRef.current;
    for (let i = atoms.length - 1; i >= 0; i--) {
      if (i >= revealed) continue;
      const a = atoms[i];
      if (Math.hypot(x - a.x, y - a.y) < a.radius + 8) return i;
    }
    return null;
  };

  const onPointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const pos = getPos(e);
    const idx = findAtom(pos.x, pos.y);
    if (idx !== null) {
      dragging.current = idx;
      const atom = atomsRef.current[idx];
      dragOffset.current = { x: pos.x - atom.x, y: pos.y - atom.y };
    }
  }, [revealed]);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (dragging.current === null) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const atom = atomsRef.current[dragging.current];
      if (atom) {
        atom.x = cx - rect.left - dragOffset.current.x;
        atom.y = cy - rect.top - dragOffset.current.y;
        atom.vx = 0;
        atom.vy = 0;
      }
    };
    const onUp = () => {dragging.current = null;};
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  return (
    <div data-ev-id="ev_e4760946fe"
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      <div data-ev-id="ev_f4778693a1"
      ref={containerRef}
      className="relative mx-auto max-w-4xl rounded-xl overflow-hidden border border-white/[0.05] select-none"
      style={{
        height: 520,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(10,15,25,0.9), rgba(5,5,12,0.98) 80%)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        cursor: dragging.current !== null ? 'grabbing' : 'default'
      }}
      onMouseDown={onPointerDown}
      onTouchStart={onPointerDown}>

        <canvas data-ev-id="ev_d633365984" ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

        {/* Section labels */}
        <div data-ev-id="ev_7a04e0c211" className="absolute top-3 left-0 right-0 z-10 flex justify-between px-6 sm:px-16 pointer-events-none">
          <div data-ev-id="ev_794da0b782" className="flex items-center gap-1.5">
            <Atom className="w-3.5 h-3.5 text-cyan-400/30" />
            <span data-ev-id="ev_2db69cb664" className="text-[10px] font-mono text-cyan-400/30 tracking-wider">👥 COMMUNITY</span>
          </div>
          <div data-ev-id="ev_2e663e08e8" className="flex items-center gap-1.5">
            <Atom className="w-3.5 h-3.5 text-purple-400/30" />
            <span data-ev-id="ev_b2f003f7c1" className="text-[10px] font-mono text-purple-400/30 tracking-wider">⚡ AI TOOLS</span>
          </div>
        </div>

        {/* Drag hint */}
        <div data-ev-id="ev_33a160cd05" className="absolute top-3 left-1/2 -translate-x-1/2 z-10 text-[9px] text-white/10 font-mono pointer-events-none">
          ✨ גרור אטומים • לחץ לפרטים
        </div>

        {/* Interactive atom buttons overlay */}
        {atomsRef.current.map((atom, i) => {
          if (i >= revealed) return null;
          const isSel = selectedAtom?.link.id === atom.link.id;
          const isHov = hoveredAtom?.link.id === atom.link.id;

          return (
            <button data-ev-id="ev_543a7d1751"
            key={atom.link.id}
            className="absolute group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-full"
            style={{
              left: atom.x,
              top: atom.y,
              transform: 'translate(-50%, -50%)',
              zIndex: isSel ? 30 : isHov ? 20 : 10,
              width: atom.radius * 2,
              height: atom.radius * 2,
              pointerEvents: dragging.current !== null ? 'none' : 'auto'
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAtom(isSel ? null : atom);
            }}
            onMouseEnter={() => setHoveredAtom(atom)} onTouchStart={() => setHoveredAtom(atom)}
            onMouseLeave={() => setHoveredAtom(null)}>

              <div data-ev-id="ev_e040246c76"
              className="w-full h-full rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: isSel ?
                `radial-gradient(circle, ${atom.link.color}25, ${atom.link.color}08)` :
                isHov ?
                `radial-gradient(circle, ${atom.link.color}18, ${atom.link.color}05)` :
                `radial-gradient(circle, ${atom.link.color}10, ${atom.link.color}03)`,
                border: isSel ?
                `2px solid ${atom.link.color}50` :
                isHov ?
                `1.5px solid ${atom.link.color}35` :
                `1px solid ${atom.link.color}15`,
                boxShadow: isSel ?
                `0 0 20px ${atom.link.color}20, inset 0 0 15px ${atom.link.color}08` :
                'none',
                cursor: dragging.current !== null ? 'grabbing' : 'grab'
              }}>

                <AnimatedIcon
                  icon={atom.link.icon}
                  animation={atom.link.animation}
                  color={atom.link.color}
                  isHovered={isSel || isHov} />

              </div>

              {/* Element symbol label */}
              <div data-ev-id="ev_17862f9d75"
              className={`absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-200 ${
              isHov || isSel ? 'opacity-90' : 'opacity-0'}`
              }>

                <span data-ev-id="ev_bbaff20f40" className="text-[9px] font-bold" style={{ color: atom.link.color }}>
                  {atom.link.title}
                </span>
              </div>

              {/* Atomic number badge */}
              <div data-ev-id="ev_290bd9a05e"
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-mono font-bold"
              style={{
                backgroundColor: `${atom.link.color}15`,
                color: `${atom.link.color}60`,
                border: `1px solid ${atom.link.color}20`
              }}>

                {i + 1}
              </div>
            </button>);

        })}

        {/* Selected atom detail */}
        {selectedAtom &&
        <div data-ev-id="ev_df43c8df05" className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 w-80 max-w-[90%] animate-in fade-in slide-in-from-bottom-4 duration-300">
            <AtomDetailCard atom={selectedAtom} index={atomsRef.current.indexOf(selectedAtom)} onClose={() => setSelectedAtom(null)} />
          </div>
        }

        {/* Formula bar */}
        <div data-ev-id="ev_e16dcca11f" className="absolute bottom-3 right-3 z-10 text-[9px] font-mono text-white/10 flex items-center gap-2 pointer-events-none">
          {sections.map((section, sIdx) =>
          <span data-ev-id="ev_a71dda7550" key={section.id} style={{ color: `${['#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899'][sIdx % 4]}33` }}>{section.links.length} atoms</span>
          ).reduce((acc: React.ReactNode[], el, i) => i === 0 ? [el] : [...acc, <span data-ev-id="ev_85782e3854" key={`sep-${i}`}>·</span>, el], [])}
          <span data-ev-id="ev_0f07cd138b">·</span>
          <span data-ev-id="ev_d63f552f55">{atomsRef.current.reduce((s, a) => s + a.bonds.length, 0) / 2 | 0} bonds</span>
        </div>
      </div>
    </div>);

};

/* ═════ Atom Detail Card ═════ */
const AtomDetailCard = ({
  atom,
  index,
  onClose




}: {atom: AtomNode;index: number;onClose: () => void;}) => {
  const [hovered, setHovered] = useState(false);
  const { link } = atom;

  return (
    <div data-ev-id="ev_7bc3c5ad00"
    className="rounded-xl overflow-hidden border backdrop-blur-xl"
    style={{
      background: 'rgba(10,10,20,0.93)',
      borderColor: `${link.color}25`,
      boxShadow: `0 15px 40px rgba(0,0,0,0.5), 0 0 30px ${link.color}08`
    }}>

      <div data-ev-id="ev_bc90172879" className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${link.color}60, transparent)` }} />

      <div data-ev-id="ev_aee8334ad8" className="p-4 flex items-start gap-3">
        <div data-ev-id="ev_0ee4e43e3d" className="flex flex-col items-center flex-shrink-0">
          <div data-ev-id="ev_9b23b00d41"
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${link.color}20, ${link.color}08)`,
            border: `2px solid ${link.color}35`,
            boxShadow: `0 0 20px ${link.color}15`
          }}>

            <AnimatedIcon icon={link.icon} animation={link.animation} color={link.color} isHovered />
          </div>
          <span data-ev-id="ev_af6210ee28" className="text-[8px] font-mono mt-1" style={{ color: `${link.color}50` }}>
            #{index + 1}
          </span>
        </div>

        <div data-ev-id="ev_eb3f68efa4" className="flex-1 min-w-0">
          <div data-ev-id="ev_5fc50f231f" className="flex items-center gap-2">
            <h3 data-ev-id="ev_53dd0a0419" className="text-white/90 text-[14px] font-bold">{link.title}</h3>
            <span data-ev-id="ev_0ae3093816"
            className="text-[8px] px-1.5 py-0.5 rounded-full font-mono"
            style={{ backgroundColor: `${link.color}15`, color: `${link.color}80` }}>

              {(() => {
                const sec = sections.find((s) => s.id === atom.section);
                return sec ? `${typeof sec.emoji === 'string' ? sec.emoji : ''} ${sec.title}` : atom.section;
              })()}
            </span>
            <span data-ev-id="ev_241cbc2740" className="text-[8px] text-white/60 font-mono">
              {atom.bonds.length} bonds
            </span>
          </div>
          <p data-ev-id="ev_8449d543e1" className="text-white/60 text-xs mt-0.5">{link.subtitle}</p>
          <p data-ev-id="ev_2c9a481092" className="text-white/60 text-xs mt-1.5 leading-relaxed">{link.description}</p>

          <div data-ev-id="ev_81b4c55ea1" className="flex items-center gap-2 mt-3">
            <a data-ev-id="ev_12c2a408ff"
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
            <button data-ev-id="ev_f558fab90f"
            onClick={onClose}
            className="text-xs px-3 py-1.5 rounded-lg text-white/60 hover:text-white/70 hover:bg-white/[0.04] transition-colors">

              סגור
            </button>
          </div>
        </div>
      </div>
    </div>);

};