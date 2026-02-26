import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { Activity, Zap, Globe, Signal, Radio, ChevronLeft, ChevronRight } from 'lucide-react';

interface MissionControlViewProps {
  sections: LinkSection[];
  visible: boolean;
}

const MC_COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981', '#ef4444'];

/* ════ Mission Control / NASA Dashboard View ════ */
export const MissionControlView = ({
  sections,
  visible
}: MissionControlViewProps) => {
  const allLinks = sections.flatMap((s) => s.links);

  // Reveal animation
  useEffect(() => {
    if (!visible) return;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setRevealed(i);
      if (i >= allLinks.length + 4) clearInterval(timer);
    }, 60);
    return () => clearInterval(timer);
  }, [visible, allLinks.length]);

  // Global tick for live updates
  useEffect(() => {
    const t = setInterval(() => setGlobalTick((n) => n + 1), 2000);
    return () => clearInterval(t);
  }, []);

  let lineIdx = 0;
  const show = () => lineIdx++ < revealed;

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  const [revealed, setRevealed] = useState(0);
  const [globalTick, setGlobalTick] = useState(0);

  return (
    <div data-ev-id="ev_cf9f98f9b4"
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      {/* Main container */}
      <div data-ev-id="ev_3b9a10d3e3"
      className="mx-auto max-w-4xl rounded-xl overflow-hidden border border-white/[0.06]"
      style={{
        background: 'linear-gradient(180deg, rgba(8,8,18,0.98) 0%, rgba(10,10,20,0.99) 100%)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 80px rgba(6,182,212,0.02)'
      }}>

        {/* Top bar — mission status */}
        <div data-ev-id="ev_7294f5eb1b" className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/[0.05] bg-white/[0.01]">
          <div data-ev-id="ev_8e2c9d879c" className="flex items-center gap-3">
            <div data-ev-id="ev_f7cc8a8c63" className="flex items-center gap-1.5">
              <div data-ev-id="ev_a01f268000" className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span data-ev-id="ev_ebcfd1bc56" className="text-green-400/70 text-[11px] font-mono font-bold">ONLINE</span>
            </div>
            <div data-ev-id="ev_58adb162ee" className="hidden sm:block h-3 w-px bg-white/[0.08]" />
            <span data-ev-id="ev_896e2a4398" className="hidden sm:block text-white/60 text-[10px] font-mono">nVISION COMMAND CENTER</span>
          </div>
          <div data-ev-id="ev_c627ca7da2" className="flex items-center gap-3">
            <span data-ev-id="ev_f600f3222a" className="text-cyan-400/50 text-[11px] font-mono">{timeStr} UTC</span>
            <div data-ev-id="ev_e86caeff6e" className="flex items-center gap-1">
              <Signal className="w-3 h-3 text-green-400/50" />
              <span data-ev-id="ev_2e808b8828" className="text-[9px] text-white/60 font-mono">UPLINK</span>
            </div>
          </div>
        </div>

        {/* Global stats bar */}
        {show() &&
        <div data-ev-id="ev_538bfbc2b4" className="grid grid-cols-4 gap-px bg-white/[0.03] border-b border-white/[0.04] animate-in fade-in duration-500">
            <StatMini label="SYSTEMS" value={allLinks.length} unit="active" color="#06b6d4" />
            <StatMini label="UPTIME" value={99.97} unit="%" color="#22c55e" />
            <StatMini label="LATENCY" value={12 + globalTick % 5} unit="ms" color="#facc15" />
            <StatMini label="TRAFFIC" value={`${(2.4 + globalTick % 3 * 0.1).toFixed(1)}`} unit="K/s" color="#8b5cf6" />
          </div>
        }

        <div data-ev-id="ev_10b6651cc8" className="p-3 sm:p-4 space-y-4">
          {/* Sections rendered dynamically */}
          {(() => {
            let globalIdx = 0;
            return sections.map((section, sIdx) => {
              const color = MC_COLORS[sIdx % MC_COLORS.length];
              const startIdx = globalIdx;

              const result =
              <div data-ev-id="ev_c41b0aa516" key={section.id}>
                  {show() &&
                <SectionHeader
                  label={section.title.toUpperCase()}
                  count={section.links.length}
                  color={color}
                  icon={<Globe className="w-3.5 h-3.5" />} />
                }

                  <div data-ev-id="ev_7e80b277aa" className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {section.links.map((link, i) => {
                    const s = show();
                    globalIdx++;
                    return s ?
                    <MonitorPanel
                      key={link.id}
                      link={link}
                      index={startIdx + i}
                      globalTick={globalTick}
                      sectionColor={color} /> :
                    <div data-ev-id="ev_c4fff3f08a" key={link.id} className="h-24" />;
                  })}
                  </div>
                </div>;

              return result;
            });
          })()}
        </div>

        {/* Bottom bar */}
        {show() &&
        <div data-ev-id="ev_3c9be94b9c" className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-t border-white/[0.04] bg-white/[0.01] text-[9px] font-mono text-white/60 animate-in fade-in duration-500">
            <span data-ev-id="ev_a4366c5886">SYS.STATUS: ALL NOMINAL</span>
            <div data-ev-id="ev_29178b8ffe" className="flex items-center gap-3">
              <span data-ev-id="ev_595b4a3999" className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-green-400/40" />
                HEARTBEAT OK
              </span>
              <span data-ev-id="ev_e6d413b5cc">BUILD.2024.nV</span>
            </div>
          </div>
        }
      </div>
    </div>);

};

/* ═════ Section Header ═════ */
const SectionHeader = ({
  label,
  count,
  color,
  icon





}: {label: string;count: number;color: string;icon: React.ReactNode;}) =>
<div data-ev-id="ev_2cca8e9245" className="flex items-center gap-2 pt-2 animate-in fade-in duration-300">
    <div data-ev-id="ev_9c73d178aa"
  className="w-6 h-6 rounded flex items-center justify-center"
  style={{ backgroundColor: `${color}15`, color: `${color}80` }}>

      {icon}
    </div>
    <span data-ev-id="ev_d826008034" className="text-xs font-mono font-bold tracking-widest" style={{ color: `${color}70` }}>
      {label}
    </span>
    <div data-ev-id="ev_1578d8dec3" className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${color}20, transparent)` }} />
    <span data-ev-id="ev_d8686d4ea9"
  className="text-[10px] font-mono px-2 py-0.5 rounded"
  style={{ backgroundColor: `${color}10`, color: `${color}60` }}>

      {count} ACTIVE
    </span>
  </div>;


/* ═════ Global Stats Mini ═════ */
const StatMini = ({
  label,
  value,
  unit,
  color





}: {label: string;value: number | string;unit: string;color: string;}) =>
<div data-ev-id="ev_0b5cbecf6f" className="flex flex-col items-center py-2.5 px-2">
    <span data-ev-id="ev_4e0ee934b9" className="text-[8px] font-mono text-white/60 tracking-wider mb-1">{label}</span>
    <span data-ev-id="ev_ce8d479cbc" className="text-[14px] font-mono font-bold" style={{ color }}>
      {value}
    </span>
    <span data-ev-id="ev_928f384059" className="text-[8px] font-mono text-white/60">{unit}</span>
  </div>;


/* ═════ Monitor Panel (per link) ═════ */
const MonitorPanel = ({
  link,
  index,
  globalTick,
  sectionColor





}: {link: LinkItem;index: number;globalTick: number;sectionColor: string;}) => {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isActive = hovered || expanded;

  // Pseudo-random but stable per-link fake metrics
  const seed = link.id.charCodeAt(0) + link.id.charCodeAt(link.id.length - 1);
  const usage = 60 + (seed * 7 + globalTick * 3) % 35;
  const users = 120 + (seed * 13 + globalTick) % 200;
  const ping = 8 + (seed * 3 + globalTick * 2) % 25;
  const statusOk = usage < 92;

  // Mini sparkline data (8 points)
  const sparkData = useRef(
    Array.from({ length: 8 }, (_, i) => 30 + seed * (i + 3) * 7 % 60)
  );

  // Update sparkline on tick
  useEffect(() => {
    sparkData.current = [
    ...sparkData.current.slice(1),
    30 + seed * (globalTick + 5) * 7 % 60];

  }, [globalTick, seed]);

  const maxSpark = Math.max(...sparkData.current);
  const minSpark = Math.min(...sparkData.current);
  const sparkRange = maxSpark - minSpark || 1;

  // Build SVG path for sparkline
  const sparkW = 64;
  const sparkH = 22;
  const sparkPoints = sparkData.current.
  map((v, i) => {
    const x = i / (sparkData.current.length - 1) * sparkW;
    const y = sparkH - (v - minSpark) / sparkRange * (sparkH - 4) - 2;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).
  join(' ');

  return (
    <a data-ev-id="ev_7a94df50b7"
    href={link.url}
    target="_blank" rel="noopener noreferrer"
    aria-label={`${link.title} — ${link.subtitle} (נפתח בחלון חדש)`}
    className="block group animate-in fade-in slide-in-from-bottom-2 duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
    onClick={(e) => {if ('ontouchstart' in window && !expanded) {e.preventDefault();setExpanded(true);}}}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => {setHovered(false);setExpanded(false);}}
    onBlur={() => setExpanded(false)}>
      <div data-ev-id="ev_87e587c91f"
      className="rounded-lg border transition-all duration-300 overflow-hidden"
      style={{
        borderColor: isActive ? `${link.color}35` : 'rgba(255,255,255,0.04)',
        background: isActive ?
        `linear-gradient(135deg, ${link.color}08, rgba(255,255,255,0.02))` :
        'rgba(255,255,255,0.015)',
        boxShadow: isActive ? `0 4px 25px ${link.color}10, 0 0 40px ${link.color}05` : 'none'
      }}>

        {/* Top accent + status */}
        <div data-ev-id="ev_fff1b7d536" className="flex items-center justify-between px-3 py-1.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
          <div data-ev-id="ev_b1f6a0f6bd" className="flex items-center gap-2">
            <div data-ev-id="ev_f95266ea0c"
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: statusOk ? '#22c55e' : '#facc15',
              boxShadow: statusOk ? '0 0 6px #22c55e80' : '0 0 6px #facc1580',
              animation: 'pulse 2s ease-in-out infinite'
            }} />

            <span data-ev-id="ev_a8f83a72d7" className="text-[9px] font-mono text-white/60 tracking-wide">
              SYS.{String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <span data-ev-id="ev_d4ea5cee7d"
          className="text-[8px] font-mono px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: statusOk ? 'rgba(34,197,94,0.08)' : 'rgba(250,204,21,0.08)',
            color: statusOk ? 'rgba(34,197,94,0.6)' : 'rgba(250,204,21,0.6)'
          }}>

            {statusOk ? 'NOMINAL' : 'ELEVATED'}
          </span>
        </div>

        <div data-ev-id="ev_909037a7da" className="p-3 flex gap-3">
          {/* Left: Icon + Info */}
          <div data-ev-id="ev_ab841ab028" className="flex-1 min-w-0">
            <div data-ev-id="ev_2d4cfabbd8" className="flex items-center gap-2.5 mb-2">
              <div data-ev-id="ev_e3e04f301f"
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
              style={{
                background: `${link.color}12`,
                border: `1px solid ${link.color}${isActive ? '40' : '20'}`,
                boxShadow: isActive ? `0 0 12px ${link.color}18` : 'none'
              }}>

                <AnimatedIcon
                  icon={link.icon}
                  animation={link.animation}
                  color={link.color}
                  isHovered={hovered} />

              </div>
              <div data-ev-id="ev_47c65f81a3" className="min-w-0">
                <h3 data-ev-id="ev_51a1b0bfa6" className="text-white/85 text-[12.5px] font-semibold truncate">{link.title}</h3>
                <p data-ev-id="ev_81582f6f08" className="text-white/60 text-xs truncate">{link.subtitle}</p>
              </div>
            </div>

            {/* Metrics row */}
            <div data-ev-id="ev_245b7a1387" className="flex items-center gap-3">
              <Metric label="LOAD" value={`${usage}%`} color={usage > 85 ? '#facc15' : '#22c55e'} />
              <Metric label="USERS" value={`${users}`} color={link.color} />
              <Metric label="PING" value={`${ping}ms`} color={ping > 25 ? '#facc15' : '#06b6d4'} />
            </div>
          </div>

          {/* Right: Sparkline + progress */}
          <div data-ev-id="ev_fde6ff75d5" className="flex flex-col items-end justify-between flex-shrink-0">
            {/* Mini sparkline */}
            <svg data-ev-id="ev_a49872915e" width={sparkW} height={sparkH} className="opacity-60">
              <defs data-ev-id="ev_2c552a54f8">
                <linearGradient data-ev-id="ev_27e1d18d98" id={`grad-${link.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop data-ev-id="ev_ca1761a054" offset="0%" stopColor={link.color} stopOpacity="0.3" />
                  <stop data-ev-id="ev_58783ea469" offset="100%" stopColor={link.color} stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Fill area */}
              <path data-ev-id="ev_120f2e16ac"
              d={`${sparkPoints} L${sparkW},${sparkH} L0,${sparkH} Z`}
              fill={`url(#grad-${link.id})`} />

              {/* Line */}
              <path data-ev-id="ev_f97f2c4b28" d={sparkPoints} fill="none" stroke={link.color} strokeWidth="1.5" strokeLinecap="round" />
              {/* Current value dot */}
              <circle data-ev-id="ev_4d88a57da3"
              cx={sparkW}
              cy={
              sparkH -
              (sparkData.current[sparkData.current.length - 1] - minSpark) / sparkRange * (
              sparkH - 4) -
              2
              }
              r="2"
              fill={link.color}>

                <animate data-ev-id="ev_ebc6118605" attributeName="r" values="2;3;2" dur="1.5s" repeatCount="indefinite" />
              </circle>
            </svg>

            {/* Usage bar */}
            <div data-ev-id="ev_6836c4b2e0" className="w-16 mt-1.5">
              <div data-ev-id="ev_ba2b830df2" className="h-1 rounded-full bg-white/[0.04] overflow-hidden">
                <div data-ev-id="ev_a2d687b4f4"
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${usage}%`,
                  background: `linear-gradient(90deg, ${link.color}60, ${link.color})`,
                  boxShadow: `0 0 6px ${link.color}40`
                }} />

              </div>
            </div>

            {/* Open indicator */}
            <span data-ev-id="ev_94c3103f96"
            className="text-[8px] font-mono mt-1 transition-all duration-200"
            style={{
              color: isActive ? `${link.color}aa` : 'transparent'
            }}>

              OPEN →
            </span>
          </div>
        </div>
      </div>
    </a>);

};

/* ═════ Metric badge ═════ */
const Metric = ({ label, value, color }: {label: string;value: string;color: string;}) =>
<div data-ev-id="ev_ae802c588d" className="flex flex-col">
    <span data-ev-id="ev_e3d74707bc" className="text-[7px] font-mono text-white/60 tracking-wider">{label}</span>
    <span data-ev-id="ev_940711dd7e" className="text-[11px] font-mono font-bold" style={{ color: `${color}bb` }}>
      {value}
    </span>
  </div>;