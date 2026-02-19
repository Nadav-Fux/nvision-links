import { useState, useEffect, useRef } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink, Shield, Swords, Sparkles, Crown } from 'lucide-react';

interface SkillTreeViewProps {
  sections: LinkSection[];
  visible: boolean;
}

interface SkillNode {
  link: LinkItem;
  x: number; // percent
  y: number;
  tier: number; // 0-3
  section: string;
  connections: number[]; // indices in same section
}

const SKILL_COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981', '#ef4444'];

/* ════ RPG Skill Tree View ════ */
export const SkillTreeView = ({
  sections,
  visible
}: SkillTreeViewProps) => {
  const allLinks = sections.flatMap((s) => s.links);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(0);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<SkillNode | null>(null);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const animRef = useRef(0);
  const nodesRef = useRef<SkillNode[]>([]);

  const totalXP = unlockedIds.size;
  const maxXP = allLinks.length;

  // Layout sections dynamically — spread horizontally
  useEffect(() => {
    const layoutSection = (
    links: LinkItem[],
    section: string,
    xCenter: number)
    : SkillNode[] => {
      const nodes: SkillNode[] = [];
      const total = links.length;
      // Distribute into tiers (rows)
      const tiers = [1, Math.ceil((total - 1) / 3), Math.ceil((total - 1) / 3), total - 1 - 2 * Math.ceil((total - 1) / 3)];
      // Simpler: just distribute evenly across 3-4 rows
      const rows: LinkItem[][] = [];
      const perRow = Math.ceil(total / 4);
      for (let i = 0; i < total; i += perRow) {
        rows.push(links.slice(i, i + perRow));
      }

      const spread = 28; // horizontal spread %
      rows.forEach((row, tier) => {
        row.forEach((link, col) => {
          const rowWidth = (row.length - 1) * (spread / Math.max(row.length - 1, 1));
          const startX = xCenter - rowWidth / 2;
          const x = row.length === 1 ? xCenter : startX + col / (row.length - 1) * rowWidth;
          const y = 12 + tier * 22;
          const idx = nodes.length;

          // Connect to previous tier nodes (closest)
          const connections: number[] = [];
          if (tier > 0) {
            const prevStart = nodes.length - rows[tier - 1].length;
            // Connect to closest node in previous tier
            const closest = Math.min(col, rows[tier - 1].length - 1);
            connections.push(prevStart + closest);
            // Also connect to neighbor if exists
            if (closest > 0 && col > 0) connections.push(prevStart + closest - 1);
            if (closest < rows[tier - 1].length - 1 && col < row.length - 1)
            connections.push(prevStart + closest + 1);
          }

          nodes.push({ link, x, y, tier, section, connections });
        });
      });

      return nodes;
    };

    const allNodes: SkillNode[] = [];
    sections.forEach((section, sIdx) => {
      // Spread each section tree across the width
      const centerX = sections.length <= 1 ? 50 : 15 + sIdx / (sections.length - 1) * 70;
      const sectionNodes = layoutSection(section.links, section.id, centerX);
      allNodes.push(...sectionNodes);
    });
    nodesRef.current = allNodes;
  }, [sections]);

  // Reveal
  useEffect(() => {
    if (!visible) return;
    setRevealed(0);
    setSelectedNode(null);
    const total = allLinks.length;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setRevealed(i);
      if (i >= total + 4) clearInterval(timer);
    }, 80);
    return () => clearInterval(timer);
  }, [visible, allLinks.length]);

  // Toggle unlock
  const toggleUnlock = (node: SkillNode) => {
    setSelectedNode((prev) => prev?.link.id === node.link.id ? null : node);
    setUnlockedIds((prev) => {
      const next = new Set(prev);
      if (next.has(node.link.id)) next.delete(node.link.id);else
      next.add(node.link.id);
      return next;
    });
  };

  // Canvas: draw connection paths + energy flow
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

    const draw = () => {
      const w = container.getBoundingClientRect().width;
      const h = container.getBoundingClientRect().height;
      const t = Date.now() / 1000;
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;

      // Draw connections
      nodes.forEach((node, i) => {
        if (i >= revealed) return;
        const nx = node.x / 100 * w;
        const ny = node.y / 100 * h;
        // Determine color based on section — find which section index this node belongs to
        const sectionIdx = sections.findIndex((s) => s.id === node.section);
        const baseColor = SKILL_COLORS[Math.max(0, sectionIdx) % SKILL_COLORS.length];
        const baseRgb = (() => {
          const hex = baseColor;
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return `${r},${g},${b}`;
        })();
        const isUnlocked = unlockedIds.has(node.link.id);

        node.connections.forEach((ci) => {
          // Connections store absolute indices within the full nodesRef array
          const actualTarget = nodes[ci];
          if (!actualTarget) return;
          if (ci >= revealed) return;

          const tx = actualTarget.x / 100 * w;
          const ty = actualTarget.y / 100 * h;

          const bothUnlocked =
          isUnlocked && unlockedIds.has(actualTarget.link.id);

          // Path line
          ctx.beginPath();
          ctx.moveTo(nx, ny);
          // Bezier curve for smoother path
          const midY = (ny + ty) / 2;
          ctx.bezierCurveTo(nx, midY, tx, midY, tx, ty);
          ctx.strokeStyle = bothUnlocked ?
          `rgba(${baseRgb},0.25)` :
          `rgba(${baseRgb},0.06)`;
          ctx.lineWidth = bothUnlocked ? 2.5 : 1.5;
          ctx.stroke();

          // Energy flow on unlocked paths
          if (bothUnlocked) {
            const pulseCount = 2;
            for (let p = 0; p < pulseCount; p++) {
              const prog = (t * 0.4 + p * 0.5 + i * 0.1) % 1;
              const pt = prog;
              const invT = 1 - pt;
              // Bezier point calculation
              const px =
              invT * invT * invT * nx +
              3 * invT * invT * pt * nx +
              3 * invT * pt * pt * tx +
              pt * pt * pt * tx;
              const py =
              invT * invT * invT * ny +
              3 * invT * invT * pt * midY +
              3 * invT * pt * pt * midY +
              pt * pt * pt * ty;

              const grad = ctx.createRadialGradient(px, py, 0, px, py, 10);
              grad.addColorStop(0, `rgba(${baseRgb},0.6)`);
              grad.addColorStop(1, `rgba(${baseRgb},0)`);
              ctx.beginPath();
              ctx.arc(px, py, 10, 0, Math.PI * 2);
              ctx.fillStyle = grad;
              ctx.fill();
            }
          }
        });
      });

      // Center divider line
      ctx.beginPath();
      ctx.moveTo(w / 2, h * 0.08);
      ctx.lineTo(w / 2, h * 0.92);
      ctx.strokeStyle = 'rgba(255,255,255,0.02)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [revealed, unlockedIds, sections.length]);

  return (
    <div data-ev-id="ev_ab506038b0"
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      <div data-ev-id="ev_91bf3725f5"
      ref={containerRef}
      className="relative mx-auto max-w-4xl rounded-xl overflow-hidden border border-white/[0.05]"
      style={{
        minHeight: 560,
        background:
        'radial-gradient(ellipse at 50% 20%, rgba(15,10,30,0.8), rgba(5,5,12,0.98) 70%)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
      }}>

        {/* Canvas */}
        <canvas data-ev-id="ev_0719cd082d" ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />

        {/* Top bar */}
        <div data-ev-id="ev_e43d919149" className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/[0.04]">
          <div data-ev-id="ev_3cc9015d7b" className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-yellow-500/50" />
            <span data-ev-id="ev_71b3869174" className="text-xs font-bold text-white/30">
              nVision Skill Tree
            </span>
          </div>
          {/* XP Bar */}
          <div data-ev-id="ev_5e6796a065" className="flex items-center gap-3">
            <div data-ev-id="ev_6516a2859b" className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-yellow-400/60" />
              <span data-ev-id="ev_9127a7b45f" className="text-[11px] font-mono text-yellow-400/60">
                {totalXP} / {maxXP} XP
              </span>
            </div>
            <div data-ev-id="ev_646bc9a695" className="w-24 h-2 rounded-full bg-white/[0.04] overflow-hidden">
              <div data-ev-id="ev_771835a7e6"
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${totalXP / maxXP * 100}%`,
                background: 'linear-gradient(90deg, #facc15, #f97316)',
                boxShadow: '0 0 8px rgba(250,204,21,0.3)'
              }} />

            </div>
          </div>
        </div>

        {/* Tree section labels — dynamic */}
        <div data-ev-id="ev_de6b4925a7" className="relative z-10 flex justify-between px-6 sm:px-12 pt-3 flex-wrap gap-2">
          {sections.map((section, sIdx) => {
            const color = SKILL_COLORS[sIdx % SKILL_COLORS.length];
            const icons = [Shield, Swords, Crown, Sparkles];
            const Icon = icons[sIdx % icons.length];
            return (
              <div data-ev-id="ev_1d1875fefe" key={section.id} className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5" style={{ color: `${color}66` }} />
                <span data-ev-id="ev_c11cca8ff7" className="text-[10px] font-mono tracking-wider" style={{ color: `${color}55` }}>
                  {section.emoji} {section.title.toUpperCase()} TREE
                </span>
              </div>);

          })}
        </div>

        {/* Skill nodes */}
        <div data-ev-id="ev_0c8b4947bc" className="relative z-10" style={{ minHeight: 440 }}>
          {nodesRef.current.map((node, i) => {
            if (i >= revealed) return null;
            const isUnlocked = unlockedIds.has(node.link.id);
            const isSelected = selectedNode?.link.id === node.link.id;
            const isHovered = hoveredNode?.link.id === node.link.id;
            const sectionIdx2 = sections.findIndex((s) => s.id === node.section);
            const sectionColor = SKILL_COLORS[Math.max(0, sectionIdx2) % SKILL_COLORS.length];

            return (
              <button data-ev-id="ev_325bdfa444"
              key={node.link.id}
              className="absolute group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-xl"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isSelected ? 30 : isHovered ? 20 : 10
              }}
              onClick={() => toggleUnlock(node)}
              onMouseEnter={() => setHoveredNode(node)} onTouchStart={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}>

                {/* Node body */}
                <div data-ev-id="ev_25462136f8"
                className="relative flex items-center justify-center transition-all duration-300"
                style={{
                  width: isSelected ? 54 : isHovered ? 48 : node.tier === 0 ? 46 : 40,
                  height: isSelected ? 54 : isHovered ? 48 : node.tier === 0 ? 46 : 40,
                  borderRadius: node.tier === 0 ? '16px' : '50%',
                  background: isUnlocked ?
                  `linear-gradient(145deg, ${node.link.color}30, ${node.link.color}10)` :
                  'rgba(255,255,255,0.03)',
                  border: isUnlocked ?
                  `2px solid ${node.link.color}60` :
                  isHovered ?
                  `1.5px solid ${sectionColor}40` :
                  `1px solid rgba(255,255,255,0.06)`,
                  boxShadow: isUnlocked ?
                  `0 0 20px ${node.link.color}25, 0 0 40px ${node.link.color}08` :
                  isHovered ?
                  `0 0 12px ${sectionColor}12` :
                  'none',
                  filter: isUnlocked ? 'none' : 'grayscale(0.6)'
                }}>

                  <AnimatedIcon
                    icon={node.link.icon}
                    animation={node.link.animation}
                    color={isUnlocked ? node.link.color : '#666'}
                    isHovered={isHovered || isSelected} />


                  {/* Tier badge */}
                  {node.tier === 0 &&
                  <div data-ev-id="ev_ead03ca4ba"
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold"
                  style={{
                    background: isUnlocked ?
                    `linear-gradient(135deg, #facc15, #f97316)` :
                    'rgba(255,255,255,0.08)',
                    color: isUnlocked ? '#000' : 'rgba(255,255,255,0.3)'
                  }}>

                      ★
                    </div>
                  }

                  {/* Lock overlay for locked nodes */}
                  {!isUnlocked && !isHovered &&
                  <div data-ev-id="ev_6106925b83" className="absolute inset-0 rounded-full flex items-center justify-center bg-black/20">
                      <span data-ev-id="ev_365455342e" className="text-[10px] text-white/15">🔒</span>
                    </div>
                  }
                </div>

                {/* Name label */}
                <div data-ev-id="ev_5bf48d4f33"
                className={`absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold transition-all duration-200 text-center max-w-20 truncate ${
                isHovered || isSelected || isUnlocked ?
                'opacity-80 translate-y-0' :
                'opacity-0 translate-y-1'}`
                }
                style={{ color: isUnlocked ? node.link.color : '#999' }}>

                  {node.link.title}
                </div>
              </button>);

          })}
        </div>

        {/* Selected node detail card */}
        {selectedNode &&
        <div data-ev-id="ev_9d68c1fcb0" className="relative z-40 mx-4 mb-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <SkillDetailCard
            node={selectedNode}
            isUnlocked={unlockedIds.has(selectedNode.link.id)}
            onClose={() => setSelectedNode(null)} />

          </div>
        }

        {/* Bottom hint */}
        <div data-ev-id="ev_939d6b1bd1" className="relative z-10 text-center pb-3">
          <span data-ev-id="ev_93052b047d" className="text-[9px] text-white/10 font-mono">
            לחץ על כישור לפתיחה • {maxXP - totalXP} נותרו
          </span>
        </div>
      </div>
    </div>);

};

/* ═════ Skill Detail Card ═════ */
const SkillDetailCard = ({
  node,
  isUnlocked,
  onClose




}: {node: SkillNode;isUnlocked: boolean;onClose: () => void;}) => {
  const [hovered, setHovered] = useState(false);
  const { link } = node;
  const tierNames = ['נדיר', 'נפוץ', 'אפי', 'אגדי'];
  const tierColors = ['#facc15', '#f97316', '#ef4444', '#8b5cf6'];

  return (
    <div data-ev-id="ev_1f17b530e5"
    className="max-w-md mx-auto rounded-xl overflow-hidden border backdrop-blur-xl"
    style={{
      background: 'rgba(10,10,20,0.95)',
      borderColor: isUnlocked ? `${link.color}30` : 'rgba(255,255,255,0.06)',
      boxShadow: isUnlocked ?
      `0 15px 40px rgba(0,0,0,0.5), 0 0 30px ${link.color}08` :
      '0 15px 40px rgba(0,0,0,0.5)'
    }}>

      {/* Top accent */}
      <div data-ev-id="ev_a8736e7dce"
      className="h-[2px]"
      style={{
        background: isUnlocked ?
        `linear-gradient(90deg, transparent, ${link.color}60, transparent)` :
        'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
      }} />


      <div data-ev-id="ev_49a9030860" className="p-4">
        <div data-ev-id="ev_9bebdd2a7f" className="flex items-start gap-3">
          {/* Icon */}
          <div data-ev-id="ev_c32ca1fbe8"
          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: isUnlocked ? `${link.color}15` : 'rgba(255,255,255,0.03)',
            border: `1.5px solid ${isUnlocked ? `${link.color}30` : 'rgba(255,255,255,0.06)'}`,
            filter: isUnlocked ? 'none' : 'grayscale(0.7)'
          }}>

            <AnimatedIcon
              icon={link.icon}
              animation={link.animation}
              color={isUnlocked ? link.color : '#666'}
              isHovered={isUnlocked} />

          </div>

          <div data-ev-id="ev_9d672b77f2" className="flex-1 min-w-0">
            <div data-ev-id="ev_90ff1608b1" className="flex items-center gap-2 flex-wrap">
              <h3 data-ev-id="ev_18c66f2f1f"
              className="text-[15px] font-bold"
              style={{ color: isUnlocked ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)' }}>

                {link.title}
              </h3>
              <span data-ev-id="ev_c807625b97"
              className="text-[8px] font-mono px-2 py-0.5 rounded-full font-bold"
              style={{
                backgroundColor: `${tierColors[node.tier]}15`,
                color: `${tierColors[node.tier]}aa`
              }}>

                TIER {node.tier + 1} • {tierNames[node.tier]}
              </span>
              {isUnlocked &&
              <span data-ev-id="ev_685c7a32f5" className="text-[8px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400/70 font-mono">
                  ✓ UNLOCKED
                </span>
              }
            </div>
            <p data-ev-id="ev_38cf78d8c4" className="text-white/30 text-xs mt-0.5">{link.subtitle}</p>
            <p data-ev-id="ev_b7232819ba" className="text-white/45 text-xs mt-1.5 leading-relaxed">
              {link.description}
            </p>

            <div data-ev-id="ev_1e8c5996bc" className="flex items-center gap-2 mt-3">
              <a data-ev-id="ev_3b57f5ef1f"
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
              <button data-ev-id="ev_f779fc34af"
              onClick={onClose}
              className="text-xs px-3 py-1.5 rounded-lg text-white/25 hover:text-white/40 hover:bg-white/[0.04] transition-colors">

                סגור
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);

};