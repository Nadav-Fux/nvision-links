import { useState, useEffect, useCallback } from 'react';
import { fetchAnalytics } from '@/lib/adminApi';
import type { AnalyticsData } from '@/lib/adminApi';
import {
  BarChart3,
  TrendingUp,
  MousePointerClick,
  Eye,
  Layers,
  Calendar,
  Download,
  RefreshCw,
  Clock,
  LinkIcon,
  Monitor } from
'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend } from
'recharts';

// ===== Time range presets =====
type RangeKey = '1d' | '7d' | '30d' | '90d' | '365d' | 'custom';

const RANGE_PRESETS: {key: RangeKey;label: string;days: number;}[] = [
{ key: '1d', label: 'יום אחרון', days: 1 },
{ key: '7d', label: '7 ימים', days: 7 },
{ key: '30d', label: '30 יום', days: 30 },
{ key: '90d', label: '3 חודשים', days: 90 },
{ key: '365d', label: 'שנה', days: 365 }];


// ===== Chart type toggle =====
type ChartType = 'area' | 'bar';

// ===== Colors =====
const COLORS = ['#22d3ee', '#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#fb923c', '#60a5fa', '#e879f9'];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export const AnalyticsDashboard = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<RangeKey>('30d');
  const [chartType, setChartType] = useState<ChartType>('area');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [topLinksView, setTopLinksView] = useState<'bar' | 'pie'>('bar');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let from: string;
      let to: string = new Date().toISOString();

      if (range === 'custom' && customFrom && customTo) {
        from = new Date(customFrom).toISOString();
        to = new Date(customTo + 'T23:59:59').toISOString();
      } else {
        const preset = RANGE_PRESETS.find((p) => p.key === range);
        const days = preset?.days || 30;
        from = new Date(Date.now() - days * 86400000).toISOString();
      }

      const result = await fetchAnalytics(from, to);
      setData(result);
    } catch (err: unknown) {
      setError((err as Error).message || 'שגיאה בטעינת נתונים');
    }
    setLoading(false);
  }, [range, customFrom, customTo]);

  useEffect(() => {
    if (range !== 'custom') loadData();
  }, [range]); // eslint-disable-line react-hooks/exhaustive-deps

  // Export to CSV
  const exportCSV = () => {
    if (!data) return;
    const rows = [
    ['תאריך', 'צפיות', 'קליקים', 'החלפות תצוגה'],
    ...data.daily.map((d) => [d.date, d.page_views, d.clicks, d.view_switches])];

    const csv = rows.map((r) => r.join(',')).join('\n');
    const BOM = '﻿';
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${range}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: {active?: boolean;payload?: Array<{color: string;name: string;value: number;}>;label?: string;}) => {
    if (!active || !payload?.length) return null;
    return (
      <div data-ev-id="ev_2df172a22e" className="bg-[#1a1a2e] border border-white/10 rounded-lg px-3 py-2 shadow-xl text-xs">
        <p data-ev-id="ev_36d13d3bb3" className="text-white/60 mb-1">{label}</p>
        {payload.map((entry: {color: string;name: string;value: number;}) =>
        <p data-ev-id="ev_b1022553c8" key={entry.name} style={{ color: entry.color }} className="font-medium">
            {entry.name}: {entry.value}
          </p>
        )}
      </div>);

  };

  return (
    <div data-ev-id="ev_234870f817" className="space-y-4">
      {/* Controls bar */}
      <div data-ev-id="ev_7ca71258a0" className="flex flex-wrap items-center gap-2">
        {/* Range presets */}
        <div data-ev-id="ev_e366a9e4c7" className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-1 border border-white/[0.06]">
          {RANGE_PRESETS.map((p) =>
          <button data-ev-id="ev_0283e81014"
          key={p.key}
          onClick={() => setRange(p.key)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
          range === p.key ?
          'bg-primary/20 text-primary border border-primary/30' :
          'text-white/60 hover:text-white/60 border border-transparent'}`
          }>

              {p.label}
            </button>
          )}
          <button data-ev-id="ev_0f7fe321b9"
          onClick={() => setRange('custom')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
          range === 'custom' ?
          'bg-primary/20 text-primary border border-primary/30' :
          'text-white/60 hover:text-white/60 border border-transparent'}`
          }>

            <Calendar className="w-3 h-3 inline-block ml-1" aria-hidden="true" />
            מותאם
          </button>
        </div>

        {/* Custom date inputs */}
        {range === 'custom' &&
        <div data-ev-id="ev_8c71a4e167" className="flex items-center gap-2">
            <div data-ev-id="ev_311b813998" className="relative">
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" aria-hidden="true" />
              <input data-ev-id="ev_ff3224cb13"
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            aria-label="מתאריך"
            className="pr-7 pl-2 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white/70 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary [color-scheme:dark]" />
            </div>

            <span data-ev-id="ev_55b347627f" className="text-white/60 text-xs">עד</span>
            <div data-ev-id="ev_3f8ee2e330" className="relative">
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" aria-hidden="true" />
              <input data-ev-id="ev_a2c3094194"
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            aria-label="עד תאריך"
            className="pr-7 pl-2 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white/70 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary [color-scheme:dark]" />
            </div>

            <button data-ev-id="ev_b2e1ebb2db"
          onClick={loadData}
          disabled={!customFrom || !customTo}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-all disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

              הצג
            </button>
          </div>
        }

        {/* Spacer */}
        <div data-ev-id="ev_1dab4138d5" className="flex-1" />

        {/* Chart type toggle */}
        <div data-ev-id="ev_93a6980468" className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-1 border border-white/[0.06]">
          <button data-ev-id="ev_f789ed3a4b"
          onClick={() => setChartType('area')}
          aria-label="גרף שטח"
          className={`p-1.5 rounded-md transition-all ${
          chartType === 'area' ? 'bg-primary/20 text-primary' : 'text-white/60 hover:text-white/70'}`
          }>

            <TrendingUp className="w-3.5 h-3.5" />
          </button>
          <button data-ev-id="ev_0877ae2542"
          onClick={() => setChartType('bar')}
          aria-label="גרף עמודות"
          className={`p-1.5 rounded-md transition-all ${
          chartType === 'bar' ? 'bg-primary/20 text-primary' : 'text-white/60 hover:text-white/70'}`
          }>

            <BarChart3 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Export */}
        <button data-ev-id="ev_9807050828"
        onClick={exportCSV}
        disabled={!data}
        aria-label="ייצוא ל-CSV"
        className="p-1.5 rounded-lg text-white/60 hover:text-white/70 border border-white/[0.06] hover:border-white/[0.12] transition-all disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

          <Download className="w-3.5 h-3.5" />
        </button>

        {/* Refresh */}
        <button data-ev-id="ev_17711a90c9"
        onClick={loadData}
        disabled={loading}
        aria-label="רענן נתונים"
        className="p-1.5 rounded-lg text-white/60 hover:text-white/70 border border-white/[0.06] hover:border-white/[0.12] transition-all disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Loading skeletons */}
      {loading &&
      <div className="space-y-5" role="status">
          <span className="sr-only">טוען נתוני אנליטיקס...</span>
          {/* Summary card skeletons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 rounded bg-white/[0.06] animate-pulse" />
                  <div className="h-3 w-16 rounded bg-white/[0.06] animate-pulse" />
                </div>
                <div className="h-7 w-20 rounded bg-white/[0.06] animate-pulse" />
              </div>
            ))}
          </div>
          {/* Chart skeleton */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
            <div className="h-3 w-24 rounded bg-white/[0.06] animate-pulse mb-4" />
            <div className="h-64 flex items-end gap-1.5 px-2">
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-white/[0.04] animate-pulse"
                  style={{ height: `${20 + Math.sin(i * 0.8) * 30 + ((i * 37) % 30)}%` }}
                />
              ))}
            </div>
          </div>
          {/* Bottom row skeletons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
              <div className="h-3 w-28 rounded bg-white/[0.06] animate-pulse mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="h-2.5 rounded bg-white/[0.06] animate-pulse" style={{ width: `${50 + i * 8}%` }} />
                      <div className="h-2.5 w-8 rounded bg-white/[0.06] animate-pulse" />
                    </div>
                    <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-white/[0.06] animate-pulse" style={{ width: `${90 - i * 15}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
              <div className="h-3 w-24 rounded bg-white/[0.06] animate-pulse mb-4" />
              <div className="grid grid-cols-12 gap-1">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-md bg-white/[0.04] animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      }

      {error &&
      <div data-ev-id="ev_dc069cb2b6" role="alert" className="text-red-400/70 text-sm px-4 py-3 bg-red-500/[0.06] border border-red-500/15 rounded-xl">
          {error}
        </div>
      }

      {/* Data loaded */}
      {!loading && data &&
      <div data-ev-id="ev_b9001c7e28" className="space-y-5">
          {/* Summary cards */}
          <div data-ev-id="ev_af6f8e64e0" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <SummaryCard icon={Eye} label="צפיות" value={data.summary.totalPageViews} color="text-cyan-400" />
            <SummaryCard icon={MousePointerClick} label="קליקים" value={data.summary.totalClicks} color="text-purple-400" />
            <SummaryCard icon={Layers} label="החלפות תצוגה" value={data.summary.totalViewSwitches} color="text-pink-400" />
            <SummaryCard icon={TrendingUp} label="סה״כ אירועים" value={data.summary.totalEvents} color="text-emerald-400" />
          </div>

          {/* Daily trend chart */}
          {data.daily.length > 0 &&
        <div data-ev-id="ev_9f74def91b" className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
              <h3 data-ev-id="ev_d2c0d8e8e5" className="text-white/60 text-xs font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                מגמה יומית
              </h3>
              <div data-ev-id="ev_a11e83217c" className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'area' ?
              <AreaChart data={data.daily.map((d) => ({ ...d, date: formatDate(d.date) }))}>
                      <defs data-ev-id="ev_ea2a00eb60">
                        <linearGradient data-ev-id="ev_9c6265749e" id="gradViews" x1="0" y1="0" x2="0" y2="1">
                          <stop data-ev-id="ev_d99b588eec" offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                          <stop data-ev-id="ev_14ecb0baa8" offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient data-ev-id="ev_8caf223853" id="gradClicks" x1="0" y1="0" x2="0" y2="1">
                          <stop data-ev-id="ev_3629bb4604" offset="0%" stopColor="#a78bfa" stopOpacity={0.3} />
                          <stop data-ev-id="ev_8b2fe04f4a" offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="page_views" name="צפיות" stroke="#22d3ee" fill="url(#gradViews)" strokeWidth={2} />
                      <Area type="monotone" dataKey="clicks" name="קליקים" stroke="#a78bfa" fill="url(#gradClicks)" strokeWidth={2} />
                    </AreaChart> :

              <BarChart data={data.daily.map((d) => ({ ...d, date: formatDate(d.date) }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="page_views" name="צפיות" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="clicks" name="קליקים" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                    </BarChart>
              }
                </ResponsiveContainer>
              </div>
            </div>
        }

          {/* Bottom row: Top Links + Hourly Heatmap + Top Views */}
          <div data-ev-id="ev_4c030ac90a" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top clicked links */}
            <div data-ev-id="ev_5c8018763e" className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
              <div data-ev-id="ev_c25f5f9481" className="flex items-center justify-between mb-4">
                <h3 data-ev-id="ev_2c1f26f342" className="text-white/60 text-xs font-semibold flex items-center gap-2">
                  <LinkIcon className="w-3.5 h-3.5" aria-hidden="true" />
                  קישורים פופולריים
                </h3>
                <div data-ev-id="ev_901d11b050" className="flex items-center gap-1 bg-white/[0.03] rounded-md p-0.5">
                  <button data-ev-id="ev_4890a0fe3a"
                onClick={() => setTopLinksView('bar')}
                className={`p-1 rounded text-xs transition-all ${topLinksView === 'bar' ? 'bg-primary/20 text-primary' : 'text-white/60'}`}
                aria-label="תצוגת עמודות">

                    <BarChart3 className="w-3 h-3" />
                  </button>
                  <button data-ev-id="ev_17cbc5d0af"
                onClick={() => setTopLinksView('pie')}
                className={`p-1 rounded text-xs transition-all ${topLinksView === 'pie' ? 'bg-primary/20 text-primary' : 'text-white/60'}`}
                aria-label="תצוגת עוגה">

                    <svg data-ev-id="ev_7bbf3e32fa" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path data-ev-id="ev_d957b88daf" d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                      <path data-ev-id="ev_bb3c23efb7" d="M22 12A10 10 0 0 0 12 2v10z" />
                    </svg>
                  </button>
                </div>
              </div>
              {data.topLinks.length === 0 ?
            <p data-ev-id="ev_48b8a2c40a" className="text-white/60 text-xs text-center py-8">אין נתוני קליקים עדיין</p> :
            topLinksView === 'bar' ?
            <div data-ev-id="ev_2dd59158f1" className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
                  {data.topLinks.slice(0, 10).map((link, i) => {
                const maxCount = data.topLinks[0]?.count || 1;
                const pct = link.count / maxCount * 100;
                return (
                  <div data-ev-id="ev_872c390735" key={link.name} className="group">
                        <div data-ev-id="ev_d2de427fd4" className="flex items-center justify-between mb-1">
                          <span data-ev-id="ev_1827f9cf85" className="text-white/60 text-xs truncate max-w-[70%]" title={link.name}>
                            {link.name}
                          </span>
                          <span data-ev-id="ev_a273f9095e" className="text-white/60 text-xs font-mono">{link.count}</span>
                        </div>
                        <div data-ev-id="ev_bae9b82d01" className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                          <div data-ev-id="ev_4cf74c6561"
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }} />

                        </div>
                      </div>);

              })}
                </div> :

            <div data-ev-id="ev_a86dc50b71" className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                    data={data.topLinks.slice(0, 8)}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={35}
                    strokeWidth={0}>

                        {data.topLinks.slice(0, 8).map((entry, i) =>
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                    )}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                    formatter={(value: string) =>
                    <span data-ev-id="ev_442dcc29ec" className="text-white/60 text-[10px]">{value.length > 15 ? value.slice(0, 15) + '…' : value}</span>
                    } />

                    </PieChart>
                  </ResponsiveContainer>
                </div>
            }
            </div>

            {/* Hourly activity heatmap */}
            <div data-ev-id="ev_7cad32ff86" className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
              <h3 data-ev-id="ev_d0d28a408e" className="text-white/60 text-xs font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                פעילות לפי שעה
              </h3>
              <HourlyHeatmap data={data.hourly} />

              {/* Top views */}
              {data.topViews.length > 0 &&
            <div data-ev-id="ev_2019ee7d8e" className="mt-5 pt-4 border-t border-white/[0.06]">
                  <h4 data-ev-id="ev_a3c8fd8563" className="text-white/60 text-xs font-semibold mb-3 flex items-center gap-2">
                    <Monitor className="w-3.5 h-3.5" aria-hidden="true" />
                    תצוגות פופולריות
                  </h4>
                  <div data-ev-id="ev_fa4423672e" className="flex flex-wrap gap-2">
                    {data.topViews.slice(0, 8).map((v, i) =>
                <span data-ev-id="ev_ff3ab33fab"
                key={v.name}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border border-white/[0.08] bg-white/[0.02]">

                        <span data-ev-id="ev_31e4045d72" className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span data-ev-id="ev_f3f8cd4326" className="text-white/60">{v.name}</span>
                        <span data-ev-id="ev_89559bba2d" className="text-white/60 font-mono">{v.count}</span>
                      </span>
                )}
                  </div>
                </div>
            }
            </div>
          </div>
        </div>
      }

      {/* Empty state */}
      {!loading && !error && !data &&
      <div data-ev-id="ev_af42df7436" className="flex flex-col items-center justify-center py-12 text-white/60">
          <BarChart3 className="w-10 h-10 mb-3" />
          <p data-ev-id="ev_9c09296ad7" className="text-sm">בחר טווח זמן כדי לצפות בנתונים</p>
        </div>
      }
    </div>);

};

// ===== Sub-components =====

function SummaryCard({
  icon: Icon,
  label,
  value,
  color





}: {icon: typeof Eye;label: string;value: number;color: string;}) {
  return (
    <div data-ev-id="ev_a406346087" className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 sm:p-4">
      <div data-ev-id="ev_b4f729e24a" className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} aria-hidden="true" />
        <span data-ev-id="ev_ca4f9b9fcf" className="text-white/60 text-xs">{label}</span>
      </div>
      <p data-ev-id="ev_b12a860aac" className={`text-xl sm:text-2xl font-bold ${color}`}>
        {formatNumber(value)}
      </p>
    </div>);

}

function HourlyHeatmap({ data }: {data: number[];}) {
  const max = Math.max(...data, 1);

  return (
    <div data-ev-id="ev_35a663c671" className="space-y-2">
      <div data-ev-id="ev_dbc3e7aeeb" className="grid grid-cols-12 gap-1">
        {data.map((count, hour) => {
          const intensity = count / max;
          const bg =
          intensity === 0 ?
          'rgba(255,255,255,0.02)' :
          `rgba(34, 211, 238, ${0.1 + intensity * 0.7})`;
          return (
            <div data-ev-id="ev_6f5a0244a1"
            key={hour}
            className="aspect-square rounded-md flex items-center justify-center text-[9px] font-mono transition-all hover:scale-110 cursor-default"
            style={{ backgroundColor: bg }}
            title={`${hour}:00 — ${count} אירועים`}
            aria-label={`שעה ${hour}: ${count} אירועים`}>

              <span data-ev-id="ev_30d6935117" className={`${intensity > 0.4 ? 'text-white/80' : 'text-white/60'}`}>
                {hour}
              </span>
            </div>);

        })}
      </div>
      {/* Legend row */}
      <div data-ev-id="ev_b7996db820" className="flex items-center justify-between text-[9px] text-white/60 px-0.5">
        <span data-ev-id="ev_d0aafa0e9b">00:00</span>
        <div data-ev-id="ev_c23e01e18e" className="flex items-center gap-1">
          <span data-ev-id="ev_fe7b2b422b">פחות</span>
          <div data-ev-id="ev_e3080c0837" className="flex gap-0.5">
            {[0.05, 0.2, 0.4, 0.6, 0.8].map((opacity, i) =>
            <div data-ev-id="ev_af5c390bf3"
            key={i}
            className="w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: `rgba(34, 211, 238, ${opacity})` }} />

            )}
          </div>
          <span data-ev-id="ev_1f5b5aa044">יותר</span>
        </div>
        <span data-ev-id="ev_2cbc535093">23:00</span>
      </div>
    </div>);

}