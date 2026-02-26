import { useState, useEffect, useRef, useMemo } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import {
  ExternalLink, Activity, TrendingUp, BarChart3, Clock,
  RefreshCw, Maximize2, ChevronDown, Circle, Wifi } from
'lucide-react';

interface DashboardViewProps {
  sections: LinkSection[];
  visible: boolean;
}

const PANEL_COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899', '#3b82f6'];

/* Fake sparkline data for a link */
const generateSparkline = (id: string, points = 20): number[] => {
  const seed = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const data: number[] = [];
  let val = 40 + seed % 30;
  for (let i = 0; i < points; i++) {
    val += Math.sin(seed + i * 0.7) * 8 + Math.cos(i * 1.3) * 5;
    val = Math.max(10, Math.min(95, val));
    data.push(val);
  }
  return data;
};

/* Fake metric from id hash */
const fakeMetric = (id: string) => {
  const h = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return ((h * 17 + 42) % 900 + 100).toLocaleString();
};
const fakeUptime = (id: string) => {
  const h = id.charCodeAt(0) + (id.charCodeAt(1) || 0);
  return (97 + h % 30 / 10).toFixed(1);
};
const fakeStatus = (id: string): 'healthy' | 'warning' | 'critical' => {
  const h = id.charCodeAt(id.length - 1);
  if (h % 10 < 7) return 'healthy';
  if (h % 10 < 9) return 'warning';
  return 'critical';
};
const STATUS_COLORS = { healthy: '#10b981', warning: '#f59e0b', critical: '#ef4444' };
const STATUS_LABELS = { healthy: 'HEALTHY', warning: 'WARNING', critical: 'CRITICAL' };

/* Mini SVG Sparkline */
const Sparkline = ({ data, color, width = 100, height = 28 }: {data: number[];color: string;width?: number;height?: number;}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = i / (data.length - 1) * width;
    const y = height - (v - min) / range * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg data-ev-id="ev_f35bb91f65" width={width} height={height} className="flex-shrink-0">
      <defs data-ev-id="ev_2760246595">
        <linearGradient data-ev-id="ev_a2b789491a" id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop data-ev-id="ev_ab491a336d" offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop data-ev-id="ev_8875197f1a" offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon data-ev-id="ev_510929f3ca" points={areaPoints} fill={`url(#sg-${color.replace('#', '')})`} />
      <polyline data-ev-id="ev_d71097c53c" points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>);

};

/* Mini bar chart */
const MiniBarChart = ({ data, color, width = 80, height = 28 }: {data: number[];color: string;width?: number;height?: number;}) => {
  const max = Math.max(...data);
  const barW = width / data.length - 1;
  return (
    <svg data-ev-id="ev_eaebebc294" width={width} height={height} className="flex-shrink-0">
      {data.map((v, i) => {
        const barH = v / max * (height - 2);
        return (
          <rect data-ev-id="ev_c7f9506bc1"
          key={i}
          x={i * (barW + 1)}
          y={height - barH}
          width={barW}
          height={barH}
          rx={1}
          fill={color}
          opacity={0.4 + i / data.length * 0.5} />);


      })}
    </svg>);

};

/* Donut chart */
const DonutChart = ({ values, colors, size = 60 }: {values: number[];colors: string[];size?: number;}) => {
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const r = (size - 8) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg data-ev-id="ev_e184384ece" width={size} height={size} className="flex-shrink-0">
      {values.map((v, i) => {
        const pct = v / total;
        const dash = pct * circumference;
        const gap = circumference - dash;
        const el =
        <circle data-ev-id="ev_ea39ac6f5e"
        key={i}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={colors[i % colors.length]}
        strokeWidth={6}
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={-offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        opacity={0.8} />;


        offset += dash;
        return el;
      })}
      <text data-ev-id="ev_0c042442e0" x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="10" fontFamily="monospace" opacity={0.6}>
        {total}
      </text>
    </svg>);

};

/* ══════════════════════════════════════════════
 *  Dashboard / Analytics View
 * ══════════════════════════════════════════════ */
export const DashboardView = ({ sections, visible }: DashboardViewProps) => {
  const [revealed, setRevealed] = useState(false);
  const [tick, setTick] = useState(0);
  const [timeRange, setTimeRange] = useState('24h');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setRevealed(true), 200);
      return () => clearTimeout(t);
    }
  }, [visible]);

  // Tick for live feel
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 3000);
    return () => clearInterval(t);
  }, []);

  const totalLinks = sections.reduce((a, s) => a + s.links.length, 0);
  const allLinks = useMemo(() => sections.flatMap((s) => s.links), [sections]);
  const healthyCount = allLinks.filter((l) => fakeStatus(l.id) === 'healthy').length;
  const warningCount = allLinks.filter((l) => fakeStatus(l.id) === 'warning').length;
  const criticalCount = allLinks.filter((l) => fakeStatus(l.id) === 'critical').length;

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div data-ev-id="ev_ca69cd66b3"
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      <div data-ev-id="ev_175524a48b"
      className="mx-auto max-w-5xl rounded-xl overflow-hidden border border-white/[0.06]"
      style={{
        background: 'linear-gradient(180deg, #0d1117 0%, #0a0e14 100%)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
      }}>

        {/* ─── Top bar ─── */}
        <div data-ev-id="ev_2182c2495b" className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
          <div data-ev-id="ev_53f78eea76" className="flex items-center gap-3">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span data-ev-id="ev_8d25c19fc8" className="text-white/80 text-sm font-semibold">nVision Analytics</span>
            <span data-ev-id="ev_a2e7dd7fab" className="text-white/60 text-[10px] font-mono">/ dashboard / overview</span>
          </div>
          <div data-ev-id="ev_cf403357ca" className="flex items-center gap-3">
            {/* Time range selector */}
            <div data-ev-id="ev_97290da914" className="relative">
              <button data-ev-id="ev_b3ee5862a8"
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-white/60 text-[11px] font-mono hover:bg-white/[0.08] transition-colors">

                <Clock className="w-3 h-3" />
                {timeRange}
                <ChevronDown className="w-3 h-3" />
              </button>
              {showTimeDropdown &&
              <div data-ev-id="ev_7226dfe058" className="absolute top-full right-0 mt-1 bg-[#161b22] border border-white/[0.08] rounded-lg shadow-xl z-30 py-1 min-w-[100px]">
                  {['1h', '6h', '24h', '7d', '30d'].map((r) =>
                <button data-ev-id="ev_447490f641"
                key={r}
                onClick={() => {setTimeRange(r);setShowTimeDropdown(false);}}
                className={`w-full text-left px-3 py-1 text-[11px] font-mono transition-colors ${
                r === timeRange ? 'text-cyan-400 bg-cyan-400/10' : 'text-white/60 hover:text-white/70 hover:bg-white/[0.04]'}`
                }>

                      {r}
                    </button>
                )}
                </div>
              }
            </div>
            <button data-ev-id="ev_db026b1aa6" className="text-white/60 hover:text-white/60 transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 ${tick % 2 === 0 ? 'animate-spin' : ''}`} style={{ animationDuration: '1s' }} />
            </button>
            <div data-ev-id="ev_6bf945cc3a" className="flex items-center gap-1.5 text-[10px] font-mono text-white/60">
              <Wifi className="w-3 h-3 text-green-400" />
              LIVE
            </div>
          </div>
        </div>

        {/* ─── Summary cards ─── */}
        <div data-ev-id="ev_1dce4ee853" className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4">
          <SummaryCard
            label="Total Services"
            value={totalLinks.toString()}
            color="#06b6d4"
            change="+2"
            revealed={revealed}
            delay={0} />

          <SummaryCard
            label="Healthy"
            value={healthyCount.toString()}
            color="#10b981"
            change={`${(healthyCount / totalLinks * 100).toFixed(0)}%`}
            revealed={revealed}
            delay={80} />

          <SummaryCard
            label="Warnings"
            value={warningCount.toString()}
            color="#f59e0b"
            change={warningCount > 0 ? `⚠ ${warningCount}` : '✓'}
            revealed={revealed}
            delay={160} />

          <SummaryCard
            label="Avg Uptime"
            value="99.7%"
            color="#8b5cf6"
            change="↑ 0.2%"
            revealed={revealed}
            delay={240} />

        </div>

        {/* ─── Overview row: donut + mini bar ─── */}
        <div data-ev-id="ev_7973e4c9ca" className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-4 pb-4">
          {/* Donut */}
          <div data-ev-id="ev_05903f7a99" className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
            <div data-ev-id="ev_dd2a5b534a" className="flex items-center justify-between mb-3">
              <span data-ev-id="ev_75b4dc390e" className="text-white/60 text-[11px] font-mono">■ STATUS BREAKDOWN</span>
              <Maximize2 className="w-3 h-3 text-white/60" />
            </div>
            <div data-ev-id="ev_a96059af17" className="flex items-center gap-4">
              <DonutChart
                values={[healthyCount, warningCount, criticalCount]}
                colors={['#10b981', '#f59e0b', '#ef4444']}
                size={72} />

              <div data-ev-id="ev_42d7384f4b" className="flex flex-col gap-1.5">
                {[{ label: 'Healthy', count: healthyCount, color: '#10b981' }, { label: 'Warning', count: warningCount, color: '#f59e0b' }, { label: 'Critical', count: criticalCount, color: '#ef4444' }].map((s) =>
                <div data-ev-id="ev_0fed395077" key={s.label} className="flex items-center gap-2 text-[10px]">
                    <span data-ev-id="ev_e3040aac9f" className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span data-ev-id="ev_d38d724140" className="text-white/60">{s.label}</span>
                    <span data-ev-id="ev_3d467fa8e1" className="text-white/70 font-mono font-bold mr-auto">{s.count}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity sparkline per section */}
          <div data-ev-id="ev_e7add41a99" className="sm:col-span-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
            <div data-ev-id="ev_c6da1162a1" className="flex items-center justify-between mb-3">
              <span data-ev-id="ev_263c9194b4" className="text-white/60 text-[11px] font-mono">■ SECTION ACTIVITY</span>
              <span data-ev-id="ev_7273dcd21e" className="text-white/60 text-[9px] font-mono">{timeRange}</span>
            </div>
            <div data-ev-id="ev_83289c4309" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sections.map((section, sIdx) => {
                const color = PANEL_COLORS[sIdx % PANEL_COLORS.length];
                const sparkData = generateSparkline(section.id + sIdx, 16);
                return (
                  <div data-ev-id="ev_91f7782b41" key={section.id} className="flex items-center gap-2.5">
                    <div data-ev-id="ev_fcacca7e39" className="flex-1 min-w-0">
                      <div data-ev-id="ev_37aa993985" className="text-white/60 text-[10px] font-mono truncate mb-0.5">{section.emoji} {section.title}</div>
                      <div data-ev-id="ev_34eead5a09" className="text-white/60 text-[9px] font-mono">{section.links.length} services</div>
                    </div>
                    <MiniBarChart data={sparkData.slice(0, 10)} color={color} width={60} height={24} />
                  </div>);

              })}
            </div>
          </div>
        </div>

        {/* ─── Section panels ─── */}
        <div data-ev-id="ev_b130e83784" className="px-4 pb-4 space-y-3">
          {sections.map((section, sIdx) =>
          <SectionPanel
            key={section.id}
            section={section}
            sIdx={sIdx}
            revealed={revealed}
            delay={sIdx * 120 + 300}
            tick={tick} />

          )}
        </div>

        {/* Footer */}
        <div data-ev-id="ev_7f83b1b679" className="flex items-center justify-between px-4 py-2 border-t border-white/[0.04] text-[9px] font-mono text-white/60">
          <span data-ev-id="ev_1bab8d6acb">Last refresh: {timeStr}</span>
          <span data-ev-id="ev_84fdd89139">{totalLinks} endpoints monitored</span>
          <span data-ev-id="ev_866885ab94">nVision Dashboard v3.0</span>
        </div>
      </div>
    </div>);

};

/* ─── Summary card ─── */
const SummaryCard = ({ label, value, color, change, revealed, delay

}: {label: string;value: string;color: string;change: string;revealed: boolean;delay: number;}) => {
  const [show, setShow] = useState(false);
  const [displayVal, setDisplayVal] = useState(0);
  const target = parseInt(value) || 0;

  useEffect(() => {
    if (revealed) {
      const t = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(t);
    }
  }, [revealed, delay]);

  // Count-up animation
  useEffect(() => {
    if (!show) return;
    let frame = 0;
    const total = 20;
    const interval = setInterval(() => {
      frame++;
      setDisplayVal(Math.round(frame / total * target));
      if (frame >= total) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [show, target]);

  return (
    <div data-ev-id="ev_75cc9c3e4c"
    className={`rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 transition-[opacity,transform] duration-500 ${
    show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`
    }>

      <div data-ev-id="ev_5e639615e7" className="text-white/60 text-[10px] font-mono mb-1.5">{label}</div>
      <div data-ev-id="ev_207412c52c" className="flex items-end justify-between">
        <span data-ev-id="ev_8e6a721519" className="text-2xl font-bold font-mono" style={{ color }}>
          {isNaN(target) ? value : displayVal}
        </span>
        <span data-ev-id="ev_b424e9dfbe" className="text-[10px] font-mono" style={{ color: change.includes('↑') || change.includes('+') ? '#10b981' : color }}>
          {change}
        </span>
      </div>
    </div>);

};

/* ─── Section panel (Grafana-like) ─── */
const SectionPanel = ({ section, sIdx, revealed, delay, tick

}: {section: LinkSection;sIdx: number;revealed: boolean;delay: number;tick: number;}) => {
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const color = PANEL_COLORS[sIdx % PANEL_COLORS.length];

  useEffect(() => {
    if (revealed) {
      const t = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(t);
    }
  }, [revealed, delay]);

  return (
    <div data-ev-id="ev_a0562d098f"
    className={`rounded-lg border border-white/[0.06] overflow-hidden transition-[opacity,transform] duration-500 ${
    show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`
    }
    style={{ background: 'rgba(255,255,255,0.015)' }}>

      {/* Panel header */}
      <button data-ev-id="ev_b6613007ea"
      onClick={() => setExpanded(!expanded)}
      className="w-full flex items-center gap-2.5 px-3 py-2 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">

        <span data-ev-id="ev_92224e8550" className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span data-ev-id="ev_8c5693b834" className="text-white/70 text-xs font-mono font-bold">{section.emoji} {section.title}</span>
        <span data-ev-id="ev_8c1abf161e" className="text-white/60 text-[10px] font-mono">[{section.links.length}]</span>
        <Activity className="w-3 h-3 mr-auto" style={{ color: color + '60' }} />
        <span data-ev-id="ev_240d8efd12" className="text-white/60 text-[9px] font-mono">{section.links.filter((l) => fakeStatus(l.id) === 'healthy').length}/{section.links.length} UP</span>
        <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform ${expanded ? '' : '-rotate-90'}`} />
      </button>

      {/* Rows */}
      {expanded &&
      <div data-ev-id="ev_6ecde36420" className="divide-y divide-white/[0.03]">
          {section.links.map((link, lIdx) => {
          const status = fakeStatus(link.id);
          const sparkData = generateSparkline(link.id);
          return (
            <a data-ev-id="ev_548d397159"
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${link.title} — ${link.subtitle} (נפתח בחלון חדש)`}
            className="flex items-center gap-3 px-3 py-2 hover:bg-white/[0.03] transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">

                {/* Status dot */}
                <Circle
                className="w-2.5 h-2.5 flex-shrink-0"
                fill={STATUS_COLORS[status]}
                stroke="none" />


                {/* Icon + name */}
                <AnimatedIcon icon={link.icon} animation={link.animation} color={link.color} size={14} />
                <div data-ev-id="ev_0b5c55eaf1" className="flex-1 min-w-0">
                  <div data-ev-id="ev_fc9b5a1929" className="text-white/70 text-[11px] font-mono truncate group-hover:text-white transition-colors">
                    {link.title}
                  </div>
                  <div data-ev-id="ev_4cfe189bc7" className="text-white/60 text-[9px] font-mono truncate">{link.subtitle}</div>
                </div>

                {/* Status badge */}
                <span data-ev-id="ev_2c4ed14f54"
              className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded flex-shrink-0 hidden sm:block"
              style={{ color: STATUS_COLORS[status], background: STATUS_COLORS[status] + '15' }}>

                  {STATUS_LABELS[status]}
                </span>

                {/* Uptime */}
                <span data-ev-id="ev_35be3be966" className="text-white/60 text-[10px] font-mono w-12 text-right flex-shrink-0 hidden sm:block">
                  {fakeUptime(link.id)}%
                </span>

                {/* Metric */}
                <span data-ev-id="ev_ca305c20b3" className="text-white/60 text-[10px] font-mono w-14 text-right flex-shrink-0 hidden md:block">
                  {fakeMetric(link.id)}
                </span>

                {/* Sparkline */}
                <div data-ev-id="ev_082c5571ed" className="flex-shrink-0 hidden sm:block">
                  <Sparkline data={sparkData} color={color} width={80} height={22} />
                </div>

                {/* Link */}
                <ExternalLink className="w-3 h-3 text-white/60 group-hover:text-white/70 transition-colors flex-shrink-0" />
              </a>);

        })}
        </div>
      }
    </div>);

};

export default DashboardView;