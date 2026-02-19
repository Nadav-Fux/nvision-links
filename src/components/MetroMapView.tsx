import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink, MapPin, Train } from 'lucide-react';

interface MetroMapViewProps {
  sections: LinkSection[];
  visible: boolean;
}

interface Station {
  link: LinkItem;
  sectionIdx: number;
  stationIdx: number;
  x: number;
  y: number;
}

const LINE_COLORS = ['#e53935', '#1e88e5', '#43a047', '#fdd835', '#8e24aa', '#ff8f00'];
const LINE_NAMES = ['Red Line', 'Blue Line', 'Green Line', 'Gold Line', 'Purple Line', 'Orange Line'];

/* ════════════════════════════════════════════
 *  Metro Map View — Transit / Subway Map
 * ════════════════════════════════════════════ */
export const MetroMapView = ({ sections, visible }: MetroMapViewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrame = useRef(0);
  const [revealed, setRevealed] = useState(false);
  const [canvasW, setCanvasW] = useState(800);
  const [canvasH, setCanvasH] = useState(500);
  const [hoveredStation, setHoveredStation] = useState<Station | null>(null);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [trainPositions, setTrainPositions] = useState<number[]>([]);
  const stationsRef = useRef<Station[]>([]);

  // Responsive
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth - 32;
        const clamped = Math.min(w, 900);
        setCanvasW(clamped);
        setCanvasH(Math.min(Math.max(clamped * 0.55, 350), 520));
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setRevealed(true), 250);
      return () => clearTimeout(t);
    }
  }, [visible]);

  // Compute station positions
  const computeStations = useCallback(() => {
    const stations: Station[] = [];
    const padX = 60;
    const padY = 50;
    const usableW = canvasW - padX * 2;
    const usableH = canvasH - padY * 2;
    const numLines = sections.length;

    sections.forEach((section, sIdx) => {
      const count = section.links.length;
      // Each line runs mostly horizontal with gentle vertical offset
      const baseY = padY + sIdx / Math.max(numLines - 1, 1) * usableH;

      section.links.forEach((link, lIdx) => {
        const x = padX + lIdx / Math.max(count - 1, 1) * usableW;
        // Add slight wave to y
        const wave = Math.sin(lIdx * 0.8 + sIdx * 1.5) * 18;
        const y = baseY + wave;

        stations.push({
          link,
          sectionIdx: sIdx,
          stationIdx: lIdx,
          x,
          y
        });
      });
    });
    stationsRef.current = stations;
  }, [sections, canvasW, canvasH]);

  useEffect(() => computeStations(), [computeStations]);

  // Train animation
  useEffect(() => {
    if (!revealed) return;
    setTrainPositions(sections.map(() => 0));
    const t = setInterval(() => {
      setTrainPositions((prev) =>
      prev.map((pos, i) => {
        const count = sections[i]?.links.length || 1;
        return (pos + 0.008) % 1;
      })
      );
    }, 50);
    return () => clearInterval(t);
  }, [revealed, sections]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !revealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasW * dpr;
    canvas.height = canvasH * dpr;
    ctx.scale(dpr, dpr);

    const draw = () => {
      ctx.clearRect(0, 0, canvasW, canvasH);
      const stations = stationsRef.current;

      // Background grid
      ctx.strokeStyle = 'rgba(255,255,255,0.02)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < canvasW; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasH);
        ctx.stroke();
      }
      for (let y = 0; y < canvasH; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasW, y);
        ctx.stroke();
      }

      // Draw lines
      sections.forEach((section, sIdx) => {
        if (activeLine !== null && activeLine !== sIdx) {
          // Dimmed line
          const lineStations = stations.filter((s) => s.sectionIdx === sIdx);
          if (lineStations.length < 2) return;
          ctx.strokeStyle = LINE_COLORS[sIdx % LINE_COLORS.length] + '15';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(lineStations[0].x, lineStations[0].y);
          for (let i = 1; i < lineStations.length; i++) {
            const prev = lineStations[i - 1];
            const curr = lineStations[i];
            const midX = (prev.x + curr.x) / 2;
            ctx.bezierCurveTo(midX, prev.y, midX, curr.y, curr.x, curr.y);
          }
          ctx.stroke();
          return;
        }

        const lineStations = stations.filter((s) => s.sectionIdx === sIdx);
        if (lineStations.length < 2) return;
        const color = LINE_COLORS[sIdx % LINE_COLORS.length];

        // Line shadow
        ctx.strokeStyle = color + '30';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(lineStations[0].x, lineStations[0].y);
        for (let i = 1; i < lineStations.length; i++) {
          const prev = lineStations[i - 1];
          const curr = lineStations[i];
          const midX = (prev.x + curr.x) / 2;
          ctx.bezierCurveTo(midX, prev.y, midX, curr.y, curr.x, curr.y);
        }
        ctx.stroke();

        // Main line
        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(lineStations[0].x, lineStations[0].y);
        for (let i = 1; i < lineStations.length; i++) {
          const prev = lineStations[i - 1];
          const curr = lineStations[i];
          const midX = (prev.x + curr.x) / 2;
          ctx.bezierCurveTo(midX, prev.y, midX, curr.y, curr.x, curr.y);
        }
        ctx.stroke();

        // Train marker
        const trainT = trainPositions[sIdx] || 0;
        if (lineStations.length >= 2) {
          const totalLen = lineStations.length - 1;
          const segFloat = trainT * totalLen;
          const segIdx = Math.min(Math.floor(segFloat), totalLen - 1);
          const segT = segFloat - segIdx;
          const from = lineStations[segIdx];
          const to = lineStations[segIdx + 1];
          if (from && to) {
            const tx = from.x + (to.x - from.x) * segT;
            const ty = from.y + (to.y - from.y) * segT;
            // Train glow
            ctx.beginPath();
            ctx.arc(tx, ty, 10, 0, Math.PI * 2);
            ctx.fillStyle = color + '30';
            ctx.fill();
            // Train body
            ctx.beginPath();
            ctx.arc(tx, ty, 5, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
            // Inner
            ctx.beginPath();
            ctx.arc(tx, ty, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
          }
        }
      });

      // Draw stations
      stations.forEach((station) => {
        if (activeLine !== null && station.sectionIdx !== activeLine) {
          // Dimmed dot
          ctx.beginPath();
          ctx.arc(station.x, station.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.06)';
          ctx.fill();
          return;
        }

        const color = LINE_COLORS[station.sectionIdx % LINE_COLORS.length];
        const isHovered = hoveredStation?.link.id === station.link.id;
        const r = isHovered ? 9 : 6;

        // Outer ring
        ctx.beginPath();
        ctx.arc(station.x, station.y, r + 2, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? color + '40' : 'transparent';
        ctx.fill();

        // Station circle
        ctx.beginPath();
        ctx.arc(station.x, station.y, r, 0, Math.PI * 2);
        ctx.fillStyle = '#0d1117';
        ctx.strokeStyle = color;
        ctx.lineWidth = isHovered ? 3 : 2.5;
        ctx.fill();
        ctx.stroke();

        // Inner dot
        ctx.beginPath();
        ctx.arc(station.x, station.y, r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Station label
        const isFirstOrLast = station.stationIdx === 0 || station.stationIdx === sections[station.sectionIdx].links.length - 1;
        if (isHovered || isFirstOrLast) {
          ctx.save();
          ctx.font = `${isHovered ? 'bold ' : ''}${isHovered ? 11 : 9}px system-ui, sans-serif`;
          ctx.fillStyle = isHovered ? '#fff' : 'rgba(255,255,255,0.5)';
          ctx.textAlign = 'center';
          ctx.fillText(station.link.title, station.x, station.y - r - 6);
          ctx.restore();
        }
      });

      animFrame.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animFrame.current);
  }, [canvasW, canvasH, revealed, hoveredStation, activeLine, trainPositions, sections]);

  // Hit detection
  const handleCanvasMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let found: Station | null = null;
    for (const s of stationsRef.current) {
      if (activeLine !== null && s.sectionIdx !== activeLine) continue;
      const d = Math.sqrt((mx - s.x) ** 2 + (my - s.y) ** 2);
      if (d < 16) {found = s;break;}
    }
    setHoveredStation(found);
  }, [activeLine]);

  const handleCanvasClick = useCallback(() => {
    if (hoveredStation) {
      window.open(hoveredStation.link.url, '_blank', 'noopener,noreferrer');
    }
  }, [hoveredStation]);

  return (
    <div data-ev-id="ev_4a039b5c2a"
    ref={containerRef}
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      <div data-ev-id="ev_2bf453559e"
      className="mx-auto max-w-4xl rounded-xl overflow-hidden border border-white/[0.06]"
      style={{
        background: 'linear-gradient(180deg, #0d1117 0%, #0a0e14 100%)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
      }}>

        {/* Header */}
        <div data-ev-id="ev_a32905cfe6" className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <div data-ev-id="ev_3ba0a84e15" className="flex items-center gap-2">
            <Train className="w-4 h-4 text-white/60" />
            <span data-ev-id="ev_0a7958caf6" className="text-white/80 text-xs font-bold tracking-widest font-mono">
              nVISION METRO
            </span>
          </div>
          <div data-ev-id="ev_cb32262fc6" className="flex items-center gap-2 text-[10px] font-mono text-white/30">
            <MapPin className="w-3 h-3" />
            <span data-ev-id="ev_11aa2c034c">{sections.reduce((a, s) => a + s.links.length, 0)} תחנות • {sections.length} קווים</span>
          </div>
        </div>

        {/* Line filter */}
        <div data-ev-id="ev_ab9ee379e0" className="flex items-center gap-1.5 px-4 py-2 border-b border-white/[0.04] overflow-x-auto scrollbar-hide">
          <button data-ev-id="ev_214863099e"
          onClick={() => setActiveLine(null)}
          className={`px-3 py-1 rounded text-[11px] font-mono transition-colors flex-shrink-0 ${
          activeLine === null ?
          'bg-white/10 text-white border border-white/20' :
          'text-white/30 hover:text-white/60 border border-transparent'}`
          }>

            כל הקווים
          </button>
          {sections.map((section, sIdx) =>
          <button data-ev-id="ev_924f1facd4"
          key={section.id}
          onClick={() => setActiveLine(activeLine === sIdx ? null : sIdx)}
          className={`px-3 py-1 rounded text-[11px] font-mono transition-colors flex-shrink-0 flex items-center gap-1.5 ${
          activeLine === sIdx ?
          'text-white border' :
          'text-white/35 hover:text-white/60 border border-transparent'}`
          }
          style={{
            borderColor: activeLine === sIdx ? LINE_COLORS[sIdx % LINE_COLORS.length] + '60' : undefined,
            backgroundColor: activeLine === sIdx ? LINE_COLORS[sIdx % LINE_COLORS.length] + '15' : undefined
          }}>

              <span data-ev-id="ev_4ade1c75c0" className="w-3 h-1.5 rounded-full" style={{ backgroundColor: LINE_COLORS[sIdx % LINE_COLORS.length] }} />
              {section.title}
            </button>
          )}
        </div>

        {/* Canvas + side panel */}
        <div data-ev-id="ev_04616a31f6" className="flex flex-col lg:flex-row">
          {/* Map canvas */}
          <div data-ev-id="ev_40a37fba34" className="flex-1 flex items-center justify-center p-4 relative">
            <canvas data-ev-id="ev_92cccf16cd"
            ref={canvasRef}
            style={{ width: canvasW, height: canvasH, cursor: hoveredStation ? 'pointer' : 'grab' }}
            className="rounded-lg"
            onMouseMove={handleCanvasMove}
            onMouseLeave={() => setHoveredStation(null)}
            onClick={handleCanvasClick} />


            {/* Tooltip */}
            {hoveredStation &&
            <div data-ev-id="ev_4459c6b5c8"
            className="absolute z-20 pointer-events-none"
            style={{
              left: hoveredStation.x + 24,
              top: hoveredStation.y + 16
            }}>

                <div data-ev-id="ev_a01ff41aef"
              className="px-3 py-2.5 rounded-lg border text-xs min-w-[170px]"
              style={{
                background: 'rgba(13,17,23,0.96)',
                borderColor: LINE_COLORS[hoveredStation.sectionIdx % LINE_COLORS.length] + '40',
                boxShadow: `0 8px 25px rgba(0,0,0,0.4)`
              }}>

                  <div data-ev-id="ev_6be574f925" className="flex items-center gap-2 mb-1.5">
                    <AnimatedIcon icon={hoveredStation.link.icon} animation={hoveredStation.link.animation} color={hoveredStation.link.color} size={14} />
                    <span data-ev-id="ev_01009e193c" className="text-white font-semibold text-[11px]">{hoveredStation.link.title}</span>
                  </div>
                  <p data-ev-id="ev_0b63f8d6e2" className="text-white/45 text-[10px] leading-relaxed mb-1.5">{hoveredStation.link.subtitle}</p>
                  <div data-ev-id="ev_a9f1622a6c" className="flex items-center gap-2">
                    <span data-ev-id="ev_49bf1d8757"
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1"
                  style={{
                    color: LINE_COLORS[hoveredStation.sectionIdx % LINE_COLORS.length],
                    background: LINE_COLORS[hoveredStation.sectionIdx % LINE_COLORS.length] + '15'
                  }}>

                      <span data-ev-id="ev_ee7376df35" className="w-2 h-1 rounded-full" style={{ backgroundColor: LINE_COLORS[hoveredStation.sectionIdx % LINE_COLORS.length] }} />
                      {LINE_NAMES[hoveredStation.sectionIdx % LINE_NAMES.length]}
                    </span>
                    <span data-ev-id="ev_a09bde8e9d" className="text-white/25 text-[9px] flex items-center gap-0.5 mr-auto">
                      <ExternalLink className="w-2.5 h-2.5" />
                      לחץ לפתיחה
                    </span>
                  </div>
                </div>
              </div>
            }

            {/* Legend */}
            <div data-ev-id="ev_73da579813" className="absolute bottom-5 left-5 flex flex-col gap-1">
              {sections.map((section, sIdx) =>
              <div data-ev-id="ev_a94168f162" key={section.id} className="flex items-center gap-1.5 text-[9px] text-white/30 font-mono">
                  <span data-ev-id="ev_d0667a9520" className="w-4 h-1.5 rounded-full" style={{ backgroundColor: LINE_COLORS[sIdx % LINE_COLORS.length] }} />
                  {section.title} ({section.links.length})
                </div>
              )}
            </div>
          </div>

          {/* Side panel: Station list */}
          <div data-ev-id="ev_8db9726899" className="lg:w-64 border-t lg:border-t-0 lg:border-l border-white/[0.04] max-h-[400px] lg:max-h-[540px] overflow-y-auto scrollbar-hide">
            <div data-ev-id="ev_1f114a65f3" className="px-3 py-2 border-b border-white/[0.04] sticky top-0 z-10" style={{ background: 'rgba(13,17,23,0.98)' }}>
              <span data-ev-id="ev_9ec2864c7b" className="text-white/40 text-[10px] font-mono tracking-widest">
                ■ תחנות ({activeLine !== null ? sections[activeLine]?.links.length : sections.reduce((a, s) => a + s.links.length, 0)})
              </span>
            </div>
            {sections.map((section, sIdx) => {
              if (activeLine !== null && activeLine !== sIdx) return null;
              const color = LINE_COLORS[sIdx % LINE_COLORS.length];
              return (
                <div data-ev-id="ev_a2e58a0825" key={section.id}>
                  <div data-ev-id="ev_96e9405fc0" className="px-3 py-1.5 flex items-center gap-2 border-b border-white/[0.02]" style={{ background: color + '08' }}>
                    <span data-ev-id="ev_27a76542d3" className="w-3 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                    <span data-ev-id="ev_b33d43d677" className="text-[10px] font-mono font-bold text-white/50 tracking-wide">
                      {section.emoji} {section.title}
                    </span>
                    <span data-ev-id="ev_3a6a2ebc0f" className="text-[9px] font-mono text-white/20 mr-auto">
                      [{section.links.length}]
                    </span>
                  </div>
                  {section.links.map((link, lIdx) =>
                  <a data-ev-id="ev_53b3811351"
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.title} — ${link.subtitle} (נפתח בחלון חדש)`}
                  className="flex items-center gap-2.5 px-3 py-2 border-b border-white/[0.02] hover:bg-white/[0.03] transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onMouseEnter={() => {
                    const s = stationsRef.current.find((st) => st.link.id === link.id);
                    if (s) setHoveredStation(s);
                  }}
                  onMouseLeave={() => setHoveredStation(null)}>

                      {/* Station dot with line */}
                      <div data-ev-id="ev_5dce7b60fb" className="flex flex-col items-center flex-shrink-0 w-4">
                        {lIdx > 0 && <div data-ev-id="ev_02ccb91ab0" className="w-0.5 h-2 -mt-2" style={{ backgroundColor: color + '40' }} />}
                        <div data-ev-id="ev_41615c03ca" className="w-3 h-3 rounded-full border-2" style={{ borderColor: color, background: '#0d1117' }}>
                          <div data-ev-id="ev_af9e9d7f18" className="w-1 h-1 rounded-full mx-auto mt-[2px]" style={{ backgroundColor: color }} />
                        </div>
                        {lIdx < section.links.length - 1 && <div data-ev-id="ev_5c9c392f9c" className="w-0.5 h-2" style={{ backgroundColor: color + '40' }} />}
                      </div>
                      <div data-ev-id="ev_997579aa98" className="flex-1 min-w-0">
                        <div data-ev-id="ev_4c9f38001e" className="text-white/65 text-[11px] font-mono truncate group-hover:text-white/90 transition-colors">
                          {link.title}
                        </div>
                        <div data-ev-id="ev_05a0e17514" className="text-white/25 text-[9px] font-mono truncate">{link.subtitle}</div>
                      </div>
                      <ExternalLink className="w-3 h-3 text-white/10 group-hover:text-white/30 transition-colors flex-shrink-0" />
                    </a>
                  )}
                </div>);

            })}
          </div>
        </div>

        {/* Footer */}
        <div data-ev-id="ev_653a378c86" className="flex items-center justify-between px-4 py-2 border-t border-white/[0.04] text-[9px] font-mono text-white/20">
          <span data-ev-id="ev_ced6f07184" className="flex items-center gap-1"><Train className="w-3 h-3" /> nVision Metro Authority</span>
          <span data-ev-id="ev_215701858a">{sections.length} lines • {sections.reduce((a, s) => a + s.links.length, 0)} stations</span>
        </div>
      </div>
    </div>);

};

export default MetroMapView;