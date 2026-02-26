import React, { useState, useEffect, useRef } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink, Cpu } from 'lucide-react';

interface CircuitBoardViewProps {
  sections: LinkSection[];
  visible: boolean;
}

const CB_COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981', '#ef4444'];

/* ════ Circuit Board / PCB View ════ */
export const CircuitBoardView = ({
  sections,
  visible
}: CircuitBoardViewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(0);
  const animRef = useRef(0);
  const allLinks = sections.flatMap((s) => s.links);

  // Reveal animation
  useEffect(() => {
    if (!visible) return;
    setRevealed(0);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setRevealed(i);
      if (i >= allLinks.length + 4) clearInterval(timer);
    }, 70);
    return () => clearInterval(timer);
  }, [visible, allLinks.length]);

  // Canvas animation — draw circuit traces
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const container = containerRef.current;
      if (!container) return;
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width * 2;
      canvas.height = height * 2;
      ctx.scale(2, 2);
    };
    resize();

    const traces: {x1: number;y1: number;x2: number;y2: number;color: string;}[] = [];
    const w = canvas.width / 2;
    const h = canvas.height / 2;

    // Generate traces
    for (let i = 0; i < 60; i++) {
      const x1 = Math.random() * w;
      const y1 = Math.random() * h;
      const horiz = Math.random() > 0.5;
      const len = 40 + Math.random() * 120;
      traces.push({
        x1, y1,
        x2: horiz ? x1 + len : x1,
        y2: horiz ? y1 : y1 + len,
        color: i % 3 === 0 ? 'rgba(6,182,212,0.07)' : i % 3 === 1 ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.03)'
      });
    }

    // Compute section-based color for data pulses
    let sOff = 0;
    const sectionRanges = sections.map((s, sIdx) => {
      const start = sOff;
      sOff += s.links.length;
      return { start, end: sOff, color: CB_COLORS[sIdx % CB_COLORS.length] };
    });

    // Helper: get chip element positions relative to canvas
    const getChipPositions = (): { x: number; y: number }[] => {
      const container = containerRef.current;
      if (!container) return [];
      const chips = container.querySelectorAll('[data-chip]');
      const containerRect = container.getBoundingClientRect();
      return Array.from(chips).map((el) => {
        const r = el.getBoundingClientRect();
        return {
          x: r.left - containerRect.left + r.width / 2,
          y: r.top - containerRect.top + r.height / 2,
        };
      });
    };

    const draw = () => {
      const t = Date.now() / 1000;
      ctx.clearRect(0, 0, w, h);

      // PCB background grid pattern
      ctx.strokeStyle = 'rgba(6,182,212,0.015)';
      ctx.lineWidth = 0.5;
      const gridSize = 20;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Random vias (small circles at grid intersections)
      const viaSeed = 42;
      for (let i = 0; i < 40; i++) {
        const vx = viaSeed * (i + 1) * 7 % Math.floor(w / gridSize) * gridSize;
        const vy = viaSeed * (i + 3) * 11 % Math.floor(h / gridSize) * gridSize;
        ctx.beginPath();
        ctx.arc(vx, vy, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6,182,212,0.04)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(vx, vy, 1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6,182,212,0.08)';
        ctx.fill();
      }

      // Draw traces between chips
      const positions = getChipPositions();
      if (positions.length < 2) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      // Connect chips in sequence within each section, then cross-connect
      const drawTrace = (
      from: {x: number;y: number;},
      to: {x: number;y: number;},
      color: string,
      idx: number) =>
      {
        // L-shaped trace (horizontal then vertical)
        const midX = from.x;
        const midY = to.y;
        // Offset to avoid overlap
        const offsetX = (idx % 3 - 1) * 4;

        ctx.beginPath();
        ctx.moveTo(from.x + offsetX, from.y);
        ctx.lineTo(from.x + offsetX, midY);
        ctx.lineTo(to.x, midY);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Rounded corners at bend
        ctx.beginPath();
        ctx.arc(from.x + offsetX, midY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Flowing electricity pulse
        const totalLen = Math.abs(midY - from.y) + Math.abs(to.x - from.x - offsetX);
        const pulsePos = (t * 60 + idx * 40) % (totalLen + 30) - 15;

        // Pulse on vertical segment
        const vLen = Math.abs(midY - from.y);
        if (pulsePos >= 0 && pulsePos < vLen) {
          const py = from.y + (midY > from.y ? 1 : -1) * pulsePos;
          const grad = ctx.createRadialGradient(
            from.x + offsetX, py, 0,
            from.x + offsetX, py, 8
          );
          grad.addColorStop(0, color.replace(/[\d.]+\)$/, '0.8)'));
          grad.addColorStop(1, color.replace(/[\d.]+\)$/, '0)'));
          ctx.beginPath();
          ctx.arc(from.x + offsetX, py, 8, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Pulse on horizontal segment
        if (pulsePos >= vLen && pulsePos < totalLen) {
          const hProgress = pulsePos - vLen;
          const dir = to.x > from.x + offsetX ? 1 : -1;
          const px = from.x + offsetX + dir * hProgress;
          const grad = ctx.createRadialGradient(px, midY, 0, px, midY, 8);
          grad.addColorStop(0, color.replace(/[\d.]+\)$/, '0.8)'));
          grad.addColorStop(1, color.replace(/[\d.]+\)$/, '0)'));
          ctx.beginPath();
          ctx.arc(px, midY, 8, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      };

      // Draw traces per section
      let traceOffset = 0;
      sections.forEach((section, sIdx) => {
        const color = `${CB_COLORS[sIdx % CB_COLORS.length]}14`;
        const sectionLen = section.links.length;
        for (let i = traceOffset; i < traceOffset + sectionLen - 1 && i < positions.length - 1; i++) {
          if (i + 1 >= revealed) break;
          drawTrace(
            positions[i],
            positions[i + 1],
            color,
            i
          );
        }
        traceOffset += sectionLen;
      });

      // Cross-connect: draw dashed lines between section boundaries
      let boundaryIdx = 0;
      sections.forEach((section, sIdx) => {
        boundaryIdx += section.links.length;
        if (sIdx < sections.length - 1 && boundaryIdx > 0 && boundaryIdx < positions.length && boundaryIdx - 1 < revealed) {
          const from = positions[boundaryIdx - 1];
          const to = positions[boundaryIdx];
          if (from && to) {
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.strokeStyle = 'rgba(255,255,255,0.03)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 6]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [revealed]);

  let lineIdx = 0;
  const show = () => lineIdx++ < revealed;

  return (
    <div data-ev-id="ev_6d82d8d974"
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      <div data-ev-id="ev_7e524e1679"
      ref={containerRef}
      className="relative mx-auto max-w-4xl rounded-xl overflow-hidden border border-white/[0.06]"
      style={{
        background: 'linear-gradient(160deg, #050a12 0%, #080d18 50%, #060a10 100%)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 80px rgba(6,182,212,0.02)'
      }}>

        {/* Canvas for traces */}
        <canvas data-ev-id="ev_7d836f51ee" ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />

        {/* Top bar */}
        <div data-ev-id="ev_3730130583" className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/[0.04]">
          <div data-ev-id="ev_6b3f1d513d" className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400/40" />
            <span data-ev-id="ev_cefa1f50a6" className="text-[11px] font-mono text-white/60 tracking-wider">nVISION PCB v2.0</span>
          </div>
          <div data-ev-id="ev_0dc5ec5186" className="flex items-center gap-3 text-[9px] font-mono text-white/60">
            <span data-ev-id="ev_9f489c88d9" className="flex items-center gap-1">
              <span data-ev-id="ev_de4e3cfb7f" className="w-1.5 h-1.5 rounded-full bg-green-500/50 animate-pulse" />
              POWER ON
            </span>
            <span data-ev-id="ev_e59dfa384e">{allLinks.length} COMPONENTS</span>
          </div>
        </div>

        <div data-ev-id="ev_7d11d7a20f" className="relative z-10 p-3 sm:p-5 space-y-5">
          {/* Sections rendered dynamically */}
          {(() => {
            let globalIdx = 0;
            return sections.map((section, sIdx) => {
              const color = CB_COLORS[sIdx % CB_COLORS.length];
              const startIdx = globalIdx;

              const result =
              <div data-ev-id="ev_abdc2296ca" key={section.id}>
                  {/* Section header */}
                  {show() &&
                <div data-ev-id="ev_176cdb31ea" className="flex items-center gap-2 animate-in fade-in duration-300">
                      <div data-ev-id="ev_7574c4a938" className="h-px flex-1" style={{ background: `linear-gradient(to right, ${color}33, transparent)` }} />
                      <span data-ev-id="ev_44ef767c7f" className="text-[10px] font-mono tracking-widest flex items-center gap-1.5" style={{ color: `${color}66` }}>
                        <span data-ev-id="ev_782b9e4978" className="w-2 h-2 rounded-sm border" style={{ backgroundColor: `${color}33`, borderColor: `${color}4d` }} />
                        {section.title.toUpperCase()} BUS
                      </span>
                      <div data-ev-id="ev_d0cd505fa3" className="h-px flex-1" style={{ background: `linear-gradient(to left, ${color}33, transparent)` }} />
                    </div>
                }

                  <div data-ev-id="ev_80991b36af" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {section.links.map((link, i) => {
                    const s = show();
                    globalIdx++;
                    return s ?
                    <ChipComponent key={link.id} link={link} index={startIdx + i} section={section.id} /> :
                    <div data-ev-id="ev_16c1ec400b" key={link.id} className="h-20" />;
                  })}
                  </div>

                  {/* Separator bus between sections */}
                  {sIdx < sections.length - 1 && show() &&
                <div data-ev-id="ev_e99cde6d19" className="flex items-center gap-3 py-1 animate-in fade-in duration-300">
                      <div data-ev-id="ev_7ad4b89c19" className="h-px flex-1 bg-white/[0.03]" />
                      <div data-ev-id="ev_3ee013a58c" className="flex items-center gap-1">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((b) =>
                    <div data-ev-id="ev_5a777e7c82"
                    key={b}
                    className="w-1 h-3 rounded-sm"
                    style={{
                      backgroundColor: `rgba(255,255,255,${0.03 + Math.sin(Date.now() / 500 + b) * 0.02})`
                    }} />
                    )}
                      </div>
                      <span data-ev-id="ev_34d29faa84" className="text-[8px] font-mono text-white/60 tracking-widest">DATA BUS</span>
                      <div data-ev-id="ev_7b392bc8bf" className="flex items-center gap-1">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((b) =>
                    <div data-ev-id="ev_54c9f95aa1"
                    key={b}
                    className="w-1 h-3 rounded-sm"
                    style={{
                      backgroundColor: `rgba(255,255,255,${0.03 + Math.cos(Date.now() / 500 + b) * 0.02})`
                    }} />

                    )}
                      </div>
                      <div data-ev-id="ev_9dc6d46ab9" className="h-px flex-1 bg-white/[0.03]" />
                    </div>
                }
                </div>;

              return result;
            });
          })()}
        </div>

        {/* Bottom status bar */}
        {show() &&
        <div data-ev-id="ev_1b88a7268d" className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-2.5 border-t border-white/[0.04] text-[8px] font-mono text-white/60 animate-in fade-in duration-500">
            <span data-ev-id="ev_b1364f1d21">PCB.REV.4 · FR-4 SUBSTRATE</span>
            <div data-ev-id="ev_54d12d1085" className="flex items-center gap-2">
              <span data-ev-id="ev_d033f51575" className="text-green-400/30">✓ ALL CIRCUITS NOMINAL</span>
              <span data-ev-id="ev_5f0b61d38e">·</span>
              <span data-ev-id="ev_6f21172369">COPPER L4</span>
            </div>
          </div>
        }
      </div>
    </div>);

};

/* ═════ Chip Component (per link) ═════ */
const ChipComponent = ({
  link,
  index,
  section
}: {link: LinkItem; index: number; section: string;}) => {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const sectionColor = link.color;
  const isActive = hovered || expanded;

  const handleClick = (e: React.MouseEvent) => {
    if ('ontouchstart' in window && !expanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  return (
    <a data-ev-id="ev_c5c867f845"
    href={link.url}
    target="_blank" rel="noopener noreferrer"
    aria-label={`${link.title} — ${link.subtitle} (נפתח בחלון חדש)`}
    data-chip
    className="block group animate-in fade-in slide-in-from-bottom-2 duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
    onClick={handleClick}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => {setHovered(false);setExpanded(false);}}
    onBlur={() => setExpanded(false)}>

      <div data-ev-id="ev_dbc8e663a1"
      className="relative rounded-lg border transition-all duration-300 overflow-hidden"
      style={{
        borderColor: isActive ? `${link.color}40` : 'rgba(255,255,255,0.04)',
        background: isActive ?
        `linear-gradient(135deg, ${link.color}08, rgba(8,13,24,0.95))` :
        'rgba(8,13,24,0.8)',
        boxShadow: isActive ?
        `0 0 25px ${link.color}12, inset 0 0 20px ${link.color}03` :
        'none'
      }}>

        {/* IC pins - top */}
        <div data-ev-id="ev_bb42a9a95c" className="flex justify-center gap-[6px] -mt-[3px] px-6">
          {Array.from({ length: 6 }).map((_, i) =>
          <div data-ev-id="ev_0ff53f65b1"
          key={`t${i}`}
          className="w-[4px] h-[6px] rounded-b-sm transition-colors duration-300"
          style={{
            backgroundColor: isActive ?
            `${sectionColor}40` :
            'rgba(255,255,255,0.06)'
          }} />

          )}
        </div>

        <div data-ev-id="ev_ea69aaf768" className="p-3 flex items-center gap-3">
          {/* Pin row - left side */}
          <div data-ev-id="ev_51b4eb5955" className="flex flex-col gap-1 -mr-1">
            {[0, 1, 2].map((p) =>
            <div data-ev-id="ev_602d29f044"
            key={p}
            className="w-[6px] h-[4px] rounded-r-sm transition-colors duration-300"
            style={{
              backgroundColor: isActive ?
              `${sectionColor}40` :
              'rgba(255,255,255,0.06)'
            }} />

            )}
          </div>

          {/* Chip icon */}
          <div data-ev-id="ev_fb4878d33f"
          className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 relative"
          style={{
            background: `${link.color}12`,
            border: `1px solid ${link.color}${isActive ? '50' : '20'}`,
            boxShadow: isActive ? `0 0 15px ${link.color}20` : 'none'
          }}>

            <AnimatedIcon
              icon={link.icon}
              animation={link.animation}
              color={link.color}
              isHovered={hovered} />

            {/* Corner dot (chip marking) */}
            <div data-ev-id="ev_e280c81014"
            className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: `${link.color}30` }} />

          </div>

          {/* Info */}
          <div data-ev-id="ev_5fb469ac92" className="flex-1 min-w-0">
            <div data-ev-id="ev_f840d67b42" className="flex items-center gap-2">
              <h3 data-ev-id="ev_0a87da3563" className="text-white/85 text-[12.5px] font-semibold truncate">
                {link.title}
              </h3>
              <span data-ev-id="ev_c5f6e15dbf"
              className="text-[7px] font-mono px-1.5 py-0.5 rounded tracking-wider flex-shrink-0"
              style={{
                backgroundColor: `${sectionColor}10`,
                color: `${sectionColor}60`
              }}>

                IC{String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <p data-ev-id="ev_6f2718041f" className="text-white/60 text-xs truncate mt-0.5">
              {link.subtitle}
            </p>
            {/* Chip details on hover */}
            <div data-ev-id="ev_7d894b584f"
            className="overflow-hidden transition-all duration-300"
            style={{
              maxHeight: isActive ? 40 : 0,
              opacity: isActive ? 1 : 0
            }}>

              <p data-ev-id="ev_2f985aa963" className="text-white/60 text-xs leading-relaxed mt-1 line-clamp-2">
                {link.description}
              </p>
            </div>
          </div>

          {/* Pin row - right side */}
          <div data-ev-id="ev_2d45dc1ce0" className="flex flex-col gap-1 -ml-1">
            {[0, 1, 2].map((p) =>
            <div data-ev-id="ev_43f7030ae4"
            key={p}
            className="w-[6px] h-[4px] rounded-l-sm transition-colors duration-300"
            style={{
              backgroundColor: isActive ?
              `${sectionColor}40` :
              'rgba(255,255,255,0.06)'
            }} />

            )}
          </div>

          {/* Open indicator */}
          <div data-ev-id="ev_5f14669c41"
          className="flex-shrink-0 w-7 h-7 rounded flex items-center justify-center transition-all duration-200"
          style={{
            backgroundColor: isActive ? `${link.color}15` : 'transparent',
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'scale(1)' : 'scale(0.8)'
          }}>

            <ExternalLink className="w-3.5 h-3.5" style={{ color: `${link.color}90` }} />
          </div>
        </div>

        {/* IC pins - bottom */}
        <div data-ev-id="ev_9f4fea0789" className="flex justify-center gap-[6px] -mb-[3px] px-6">
          {Array.from({ length: 6 }).map((_, i) =>
          <div data-ev-id="ev_2dba943082"
          key={`b${i}`}
          className="w-[4px] h-[6px] rounded-t-sm transition-colors duration-300"
          style={{
            backgroundColor: isActive ?
            `${sectionColor}40` :
            'rgba(255,255,255,0.06)'
          }} />

          )}
        </div>
      </div>
    </a>);

};