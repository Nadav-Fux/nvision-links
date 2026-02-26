import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink } from 'lucide-react';

interface RadarViewProps {
  sections: LinkSection[];
  visible: boolean;
}

interface Blip {
  link: LinkItem;
  sectionIdx: number;
  angle: number; // radians
  distance: number; // 0–1 from center
  x: number; // px from center
  y: number; // px from center
}

const SECTION_COLORS = [
'#22d3ee', // cyan
'#a78bfa', // purple
'#f59e0b', // amber
'#34d399', // emerald
'#f472b6', // pink
'#60a5fa' // blue
];

/* ══════════════════════════════════════════════
 *  Radar View — Military / Sci-Fi Radar Screen
 * ══════════════════════════════════════════════ */
export const RadarView = ({ sections, visible }: RadarViewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sweepAngle = useRef(0);
  const animFrame = useRef(0);
  const [hoveredBlip, setHoveredBlip] = useState<Blip | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [size, setSize] = useState(500);
  const blipsRef = useRef<Blip[]>([]);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [pingBlips, setPingBlips] = useState<Set<number>>(new Set());

  // Calculate blip positions
  useEffect(() => {
    const blips: Blip[] = [];
    sections.forEach((section, sIdx) => {
      const sectionAngleStart = sIdx / sections.length * Math.PI * 2 - Math.PI / 2;
      const sectionAngleSpan = 1 / sections.length * Math.PI * 2;

      section.links.forEach((link, lIdx) => {
        const totalLinks = section.links.length;
        // Spread within sector
        const anglePad = sectionAngleSpan * 0.1;
        const angle = sectionAngleStart + anglePad +
        lIdx / Math.max(totalLinks - 1, 1) * (sectionAngleSpan - anglePad * 2);
        // Distance from center: vary between 0.25 and 0.85
        const distance = 0.3 + lIdx % 3 * 0.2 + (lIdx * 7 + sIdx * 13) % 11 / 30;
        const clampedDist = Math.min(0.85, Math.max(0.25, distance));

        blips.push({
          link,
          sectionIdx: sIdx,
          angle,
          distance: clampedDist,
          x: Math.cos(angle) * clampedDist,
          y: Math.sin(angle) * clampedDist
        });
      });
    });
    blipsRef.current = blips;
  }, [sections]);

  // Responsive size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        setSize(Math.min(w - 32, 560));
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Reveal
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setRevealed(true), 300);
      return () => clearTimeout(t);
    }
  }, [visible]);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !revealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 16;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      // Background
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      bgGrad.addColorStop(0, 'rgba(0, 30, 20, 0.95)');
      bgGrad.addColorStop(0.5, 'rgba(0, 20, 15, 0.97)');
      bgGrad.addColorStop(1, 'rgba(0, 10, 8, 0.99)');
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Border
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Grid rings
      for (let i = 1; i <= 4; i++) {
        const r = radius / 4 * i;
        ctx.strokeStyle = `rgba(34, 211, 238, ${i === 4 ? 0.15 : 0.07})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Cross lines
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.06)';
      ctx.lineWidth = 1;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
        ctx.stroke();
      }

      // Section divider lines (brighter)
      sections.forEach((_, sIdx) => {
        const angle = sIdx / sections.length * Math.PI * 2 - Math.PI / 2;
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Sweep line
      sweepAngle.current += 0.015;
      const sweep = sweepAngle.current;

      // Sweep gradient trail
      const sweepGrad = ctx.createConicGradient(sweep - 0.5, cx, cy);
      sweepGrad.addColorStop(0, 'rgba(34, 211, 238, 0)');
      sweepGrad.addColorStop(0.08, 'rgba(34, 211, 238, 0.12)');
      sweepGrad.addColorStop(0.1, 'rgba(34, 211, 238, 0)');
      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Sweep line itself
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(34, 211, 238, 0.5)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweep) * radius, cy + Math.sin(sweep) * radius);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Center dot
      ctx.fillStyle = 'rgba(34, 211, 238, 0.8)';
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw blips
      const newPings = new Set<number>();
      blipsRef.current.forEach((blip, idx) => {
        if (activeSection !== null && blip.sectionIdx !== activeSection) return;

        const bx = cx + blip.x * radius;
        const by = cy + blip.y * radius;
        const color = SECTION_COLORS[blip.sectionIdx % SECTION_COLORS.length];

        // Check if sweep just passed this blip
        const blipAngleNorm = (blip.angle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const sweepNorm = (sweep % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const diff = Math.abs(sweepNorm - blipAngleNorm);
        if (diff < 0.08 || diff > Math.PI * 2 - 0.08) {
          newPings.add(idx);
        }

        // Blip glow
        const isHovered = hoveredBlip?.link.id === blip.link.id;
        const isPinged = pingBlips.has(idx);

        if (isPinged || isHovered) {
          ctx.shadowColor = color;
          ctx.shadowBlur = isHovered ? 20 : 12;
        }

        ctx.fillStyle = color;
        ctx.globalAlpha = isPinged ? 1 : 0.6;
        ctx.beginPath();
        ctx.arc(bx, by, isHovered ? 6 : isPinged ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Ping ring
        if (isPinged) {
          ctx.strokeStyle = color;
          ctx.globalAlpha = 0.3;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(bx, by, 10, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      });

      if (newPings.size > 0) setPingBlips(newPings);

      // Ring labels
      ctx.fillStyle = 'rgba(34, 211, 238, 0.25)';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      for (let i = 1; i <= 4; i++) {
        const r = radius / 4 * i;
        ctx.fillText(`${i * 25}%`, cx, cy - r + 12);
      }

      animFrame.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animFrame.current);
  }, [size, revealed, activeSection, hoveredBlip, pingBlips, sections]);

  // Hit detection for hover
  const handleCanvasMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 16;

    let found: Blip | null = null;
    for (const blip of blipsRef.current) {
      if (activeSection !== null && blip.sectionIdx !== activeSection) continue;
      const bx = cx + blip.x * radius;
      const by = cy + blip.y * radius;
      const dist = Math.sqrt((mx - bx) ** 2 + (my - by) ** 2);
      if (dist < 14) {
        found = blip;
        break;
      }
    }
    setHoveredBlip(found);
  }, [size, activeSection]);

  const handleCanvasClick = useCallback(() => {
    if (hoveredBlip) {
      window.open(hoveredBlip.link.url, '_blank', 'noopener,noreferrer');
    }
  }, [hoveredBlip]);

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  return (
    <div data-ev-id="ev_441ccf254b"
    ref={containerRef}
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      <div data-ev-id="ev_e361199a76"
      className="mx-auto max-w-3xl rounded-xl overflow-hidden border border-cyan-500/10"
      style={{
        background: 'linear-gradient(180deg, rgba(0,15,10,0.98) 0%, rgba(0,8,6,0.99) 100%)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 80px rgba(34,211,238,0.03)'
      }}>

        {/* Header */}
        <div data-ev-id="ev_a8b4204622" className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/10">
          <div data-ev-id="ev_92786d4f0a" className="flex items-center gap-2">
            <div data-ev-id="ev_bad451c7eb" className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span data-ev-id="ev_566446249f" className="text-cyan-400 text-xs font-mono font-bold tracking-widest">
              nVISION RADAR SYSTEM
            </span>
          </div>
          <div data-ev-id="ev_ece973b882" className="flex items-center gap-4">
            <span data-ev-id="ev_bcb362303b" className="text-cyan-400/40 text-[10px] font-mono">SIG: STRONG</span>
            <span data-ev-id="ev_e2972313f7" className="text-cyan-400/40 text-[10px] font-mono">FREQ: 2.4GHz</span>
            <span data-ev-id="ev_c582555cb5" className="text-cyan-400/60 text-xs font-mono">{timeStr} UTC</span>
          </div>
        </div>

        {/* Section filters */}
        <div data-ev-id="ev_b7e666b45d" className="flex items-center gap-2 px-4 py-2.5 border-b border-cyan-500/[0.06] overflow-x-auto scrollbar-hide">
          <button data-ev-id="ev_56e6476382"
          onClick={() => setActiveSection(null)}
          className={`px-3 py-1 rounded text-[11px] font-mono transition-colors flex-shrink-0 ${
          activeSection === null ?
          'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
          'text-cyan-400/40 hover:text-cyan-400/70 border border-transparent'}`
          }>

            ALL SECTORS
          </button>
          {sections.map((section, sIdx) =>
          <button data-ev-id="ev_a289ce0524"
          key={section.id}
          onClick={() => setActiveSection(activeSection === sIdx ? null : sIdx)}
          className={`px-3 py-1 rounded text-[11px] font-mono transition-colors flex-shrink-0 flex items-center gap-1.5 ${
          activeSection === sIdx ?
          'border text-white/90' :
          'text-white/60 hover:text-white/60 border border-transparent'}`
          }
          style={{
            borderColor: activeSection === sIdx ? SECTION_COLORS[sIdx % SECTION_COLORS.length] + '60' : undefined,
            backgroundColor: activeSection === sIdx ? SECTION_COLORS[sIdx % SECTION_COLORS.length] + '15' : undefined
          }}>

              <span data-ev-id="ev_60c62e409b"
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: SECTION_COLORS[sIdx % SECTION_COLORS.length] }} />

              {section.title}
            </button>
          )}
        </div>

        {/* Radar canvas + side panel */}
        <div data-ev-id="ev_74bb33ed50" className="flex flex-col lg:flex-row">
          {/* Canvas */}
          <div data-ev-id="ev_e52f05d0e2" className="flex-1 flex items-center justify-center p-4 relative">
            <canvas data-ev-id="ev_16d5d9e86d"
            ref={canvasRef}
            width={size}
            height={size}
            style={{ width: size, height: size, cursor: hoveredBlip ? 'pointer' : 'default' }}
            className="rounded-full"
            onMouseMove={handleCanvasMove}
            onMouseLeave={() => setHoveredBlip(null)}
            onClick={handleCanvasClick} />


            {/* Hovered blip tooltip */}
            {hoveredBlip &&
            <div data-ev-id="ev_8175188e93"
            className="absolute z-20 pointer-events-none"
            style={{
              left: size / 2 + hoveredBlip.x * (size / 2 - 16) + 48,
              top: size / 2 + hoveredBlip.y * (size / 2 - 16) + 16
            }}>

                <div data-ev-id="ev_055eda55b9"
              className="px-3 py-2 rounded-lg border text-xs font-mono min-w-[160px]"
              style={{
                background: 'rgba(0,15,10,0.95)',
                borderColor: SECTION_COLORS[hoveredBlip.sectionIdx % SECTION_COLORS.length] + '40',
                boxShadow: `0 8px 25px rgba(0,0,0,0.4), 0 0 20px ${SECTION_COLORS[hoveredBlip.sectionIdx % SECTION_COLORS.length]}10`
              }}>

                  <div data-ev-id="ev_e8e557bfcd" className="flex items-center gap-2 mb-1">
                    <AnimatedIcon icon={hoveredBlip.link.icon} animation={hoveredBlip.link.animation} color={hoveredBlip.link.color} size={14} />
                    <span data-ev-id="ev_09ac778a9d" className="text-white font-semibold text-[11px]">{hoveredBlip.link.title}</span>
                  </div>
                  <p data-ev-id="ev_0f965244d3" className="text-white/60 text-[10px] leading-relaxed">{hoveredBlip.link.subtitle}</p>
                  <div data-ev-id="ev_60dd760ebb" className="mt-1.5 flex items-center gap-1 text-cyan-400/50 text-[9px]">
                    <ExternalLink className="w-2.5 h-2.5" />
                    <span data-ev-id="ev_1a591c06fb">לחץ לפתיחה</span>
                  </div>
                </div>
              </div>
            }

            {/* Corner HUD decorations */}
            <div data-ev-id="ev_f3d8c66384" className="absolute top-5 left-5 text-[9px] font-mono text-cyan-400/30 leading-tight">
              <div data-ev-id="ev_4515d2280b">LAT: 32.0853°N</div>
              <div data-ev-id="ev_8b6999ab18">LON: 34.7818°E</div>
            </div>
            <div data-ev-id="ev_d8fc7d41af" className="absolute top-5 right-5 text-[9px] font-mono text-cyan-400/30 leading-tight text-right">
              <div data-ev-id="ev_cb3cbcb45e">RANGE: 100NM</div>
              <div data-ev-id="ev_0e5f995889">ZOOM: 1.0x</div>
            </div>
            <div data-ev-id="ev_7dc6082122" className="absolute bottom-5 left-5 text-[9px] font-mono text-cyan-400/30 leading-tight">
              <div data-ev-id="ev_12b4ba109d">TARGETS: {blipsRef.current.length}</div>
              <div data-ev-id="ev_e1b5a61fba">STATUS: ACTIVE</div>
            </div>
            <div data-ev-id="ev_733736dc2d" className="absolute bottom-5 right-5 text-[9px] font-mono text-cyan-400/30">
              <div data-ev-id="ev_ef6c59771a" className="flex items-center gap-1">
                <span data-ev-id="ev_f502665661" className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                SCANNING
              </div>
            </div>
          </div>

          {/* Side panel: detected targets */}
          <div data-ev-id="ev_798dd1d9eb"
          className="lg:w-72 border-t lg:border-t-0 lg:border-l border-cyan-500/[0.06] max-h-[400px] lg:max-h-[580px] overflow-y-auto scrollbar-hide">

            <div data-ev-id="ev_342c8efc8c" className="px-3 py-2 border-b border-cyan-500/[0.06] sticky top-0 z-10" style={{ background: 'rgba(0,15,10,0.98)' }}>
              <span data-ev-id="ev_6749d9c23c" className="text-cyan-400/60 text-[10px] font-mono tracking-widest">
                ■ DETECTED TARGETS ({activeSection !== null ? sections[activeSection]?.links.length : sections.reduce((a, s) => a + s.links.length, 0)})
              </span>
            </div>

            {sections.map((section, sIdx) => {
              if (activeSection !== null && activeSection !== sIdx) return null;
              return (
                <div data-ev-id="ev_e72432b144" key={section.id}>
                  <div data-ev-id="ev_4b5f3afc90"
                  className="px-3 py-1.5 flex items-center gap-2 border-b border-white/[0.03]"
                  style={{ background: SECTION_COLORS[sIdx % SECTION_COLORS.length] + '08' }}>

                    <span data-ev-id="ev_c1da572814"
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: SECTION_COLORS[sIdx % SECTION_COLORS.length] }} />

                    <span data-ev-id="ev_b56c5e36b2" className="text-[10px] font-mono font-bold text-white/60 tracking-wide">
                      {section.emoji} {section.title}
                    </span>
                    <span data-ev-id="ev_f97f2a36d3" className="text-[9px] font-mono text-white/60 mr-auto">
                      [{section.links.length}]
                    </span>
                  </div>
                  {section.links.map((link) =>
                  <a data-ev-id="ev_f33099c92d"
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.title} — ${link.subtitle} (נפתח בחלון חדש)`}
                  className="flex items-center gap-2.5 px-3 py-2 border-b border-white/[0.02] hover:bg-cyan-500/[0.06] transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onMouseEnter={() => {
                    const blip = blipsRef.current.find((b) => b.link.id === link.id);
                    if (blip) setHoveredBlip(blip);
                  }}
                  onMouseLeave={() => setHoveredBlip(null)}>

                      <AnimatedIcon icon={link.icon} animation={link.animation} color={link.color} size={14} />
                      <div data-ev-id="ev_9b7876b86e" className="flex-1 min-w-0">
                        <div data-ev-id="ev_72768408ea" className="text-white/70 text-[11px] font-mono truncate group-hover:text-white/90 transition-colors">
                          {link.title}
                        </div>
                        <div data-ev-id="ev_2cfe923320" className="text-white/60 text-[9px] font-mono truncate">
                          {link.subtitle}
                        </div>
                      </div>
                      <ExternalLink className="w-3 h-3 text-white/60 group-hover:text-cyan-400/50 transition-colors flex-shrink-0" />
                    </a>
                  )}
                </div>);

            })}
          </div>
        </div>

        {/* Bottom status bar */}
        <div data-ev-id="ev_8014155c1e" className="flex items-center justify-between px-4 py-2 border-t border-cyan-500/[0.06] text-[9px] font-mono text-cyan-400/30">
          <span data-ev-id="ev_e02e04b869">SWEEP RATE: 4RPM</span>
          <div data-ev-id="ev_5e0c8d09ac" className="flex items-center gap-3">
            {sections.map((section, sIdx) =>
            <span data-ev-id="ev_75255bb01f" key={section.id} className="flex items-center gap-1">
                <span data-ev-id="ev_409100caec"
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: SECTION_COLORS[sIdx % SECTION_COLORS.length] }} />

                {section.links.length}
              </span>
            )}
          </div>
          <span data-ev-id="ev_64d442053d">nVision RADAR v2.0</span>
        </div>
      </div>
    </div>);

};

export default RadarView;