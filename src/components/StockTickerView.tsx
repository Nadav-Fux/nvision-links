import { useState, useEffect, useRef } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink, TrendingUp, TrendingDown, BarChart3, DollarSign } from 'lucide-react';

interface Props {sections: LinkSection[];visible: boolean;}
const SECTOR_COLORS = ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b', '#a855f7', '#ec4899'];

/* Mini sparkline SVG */
const Sparkline = ({ color, seed }: {color: string;seed: number;}) => {
  const pts: number[] = [];
  let v = 20 + seed % 20;
  for (let i = 0; i < 20; i++) {
    v += Math.sin(seed + i * 0.7) * 4 + Math.cos(i * 1.3) * 2;
    v = Math.max(5, Math.min(35, v));
    pts.push(v);
  }
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${i * 4},${40 - p}`).join(' ');
  const trend = pts[pts.length - 1] > pts[0];
  return (
    <svg data-ev-id="ev_2a5bcac6d1" width="76" height="40" viewBox="0 0 76 40" className="opacity-60" aria-hidden="true">
      <defs data-ev-id="ev_4960d0c51e"><linearGradient data-ev-id="ev_c49ceb5d80" id={`sg${seed}`} x1="0" y1="0" x2="0" y2="1">
        <stop data-ev-id="ev_7a989a40b3" offset="0%" stopColor={trend ? '#22c55e' : '#ef4444'} stopOpacity="0.15" />
        <stop data-ev-id="ev_c615409538" offset="100%" stopColor={trend ? '#22c55e' : '#ef4444'} stopOpacity="0" />
      </linearGradient></defs>
      <path data-ev-id="ev_12f6841acd" d={path + ` L76,40 L0,40 Z`} fill={`url(#sg${seed})`} />
      <path data-ev-id="ev_5a2ad930d9" d={path} fill="none" stroke={trend ? '#22c55e' : '#ef4444'} strokeWidth="1" strokeOpacity="0.5" />
    </svg>);

};

const TickerCard = ({ link, sIdx, delay, isActive, onHover

}: {link: LinkItem;sIdx: number;delay: number;isActive: boolean;onHover: (id: string | null) => void;}) => {
  const [show, setShow] = useState(false);
  const seed = link.id.charCodeAt(0) + link.id.charCodeAt(link.id.length - 1);
  const change = (seed * 7 % 200 - 100) / 10; // -10 to +10
  const positive = change >= 0;
  const price = (50 + seed % 950).toFixed(2);
  const color = positive ? '#22c55e' : '#ef4444';
  useEffect(() => {const t = setTimeout(() => setShow(true), delay);return () => clearTimeout(t);}, [delay]);

  return (
    <a data-ev-id="ev_171efb314d" href={link.url} target="_blank" rel="noopener noreferrer"
    aria-label={`${link.title} — ${link.subtitle} (נפתח בחלון חדש)`}
    onMouseEnter={() => onHover(link.id)} onMouseLeave={() => onHover(null)}
    className={`block rounded-lg transition-all duration-400 group focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'} ${isActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
    style={{ background: 'rgba(8,10,16,0.75)', border: `1px solid ${isActive ? color + '25' : 'rgba(255,255,255,0.03)'}`, boxShadow: isActive ? `0 0 16px ${color}0a` : 'none' }}>
      <div data-ev-id="ev_6b1cf08586" className="p-3">
        <div data-ev-id="ev_87736741ae" className="flex items-start gap-2.5">
          <div data-ev-id="ev_a79b815c9f" className="w-8 h-8 rounded flex items-center justify-center" style={{ background: `${SECTOR_COLORS[sIdx % 6]}0c`, border: `1px solid ${SECTOR_COLORS[sIdx % 6]}12` }}>
            <AnimatedIcon icon={link.icon} animation={link.animation} color={SECTOR_COLORS[sIdx % 6]} size={16} />
          </div>
          <div data-ev-id="ev_4f9cde6f3b" className="flex-1 min-w-0">
            <div data-ev-id="ev_066a1f4eb8" className="flex items-center gap-1.5">
              <h3 data-ev-id="ev_e0959da4be" className="text-[11px] font-bold font-mono truncate text-white/70">{link.title}</h3>
              <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-30 transition-opacity flex-shrink-0 text-white" />
            </div>
            <p data-ev-id="ev_fb83bec887" className="text-[9px] truncate text-white/20 font-mono">{link.subtitle}</p>
          </div>
          <div data-ev-id="ev_fddc319b3a" className="text-right flex-shrink-0">
            <div data-ev-id="ev_978e27b903" className="text-[11px] font-mono font-bold text-white/60">${price}</div>
            <div data-ev-id="ev_c3c94d7467" className="flex items-center gap-0.5 justify-end">
              {positive ? <TrendingUp className="w-2.5 h-2.5 text-green-400/70" /> : <TrendingDown className="w-2.5 h-2.5 text-red-400/70" />}
              <span data-ev-id="ev_9f3bd329e2" className="text-[9px] font-mono font-bold" style={{ color }}>{positive ? '+' : ''}{change.toFixed(1)}%</span>
            </div>
          </div>
        </div>
        {/* Mini chart */}
        <div data-ev-id="ev_c7ccac8f79" className="mt-1.5 flex items-end justify-between">
          <Sparkline color={color} seed={seed} />
          <div data-ev-id="ev_e9622ad6e2" className="flex flex-col items-end text-[7px] font-mono text-white/15">
            <span data-ev-id="ev_9cb7ab60cc">VOL {(seed * 13 % 999).toFixed(0)}K</span>
            <span data-ev-id="ev_cc27a1e70c">MKT {(seed * 7 % 99).toFixed(0)}B</span>
          </div>
        </div>
      </div>
    </a>);

};

/* Scrolling ticker tape */
const TickerTape = ({ sections }: {sections: LinkSection[];}) => {
  const all = sections.flatMap((s) => s.links);
  return (
    <div data-ev-id="ev_cef7fc679b" className="overflow-hidden border-b" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
      <div data-ev-id="ev_32bff8ce69" className="flex animate-[scroll_30s_linear_infinite] whitespace-nowrap py-1.5 px-3 gap-4">
        {[...all, ...all].map((l, i) => {
          const seed = l.id.charCodeAt(0) + l.id.charCodeAt(l.id.length - 1);
          const change = (seed * 7 % 200 - 100) / 10;
          const pos = change >= 0;
          return (
            <span data-ev-id="ev_66f59f1aa1" key={i} className="text-[9px] font-mono flex items-center gap-1.5">
              <span data-ev-id="ev_22d9b3194a" className="text-white/30 font-bold">{l.title}</span>
              <span data-ev-id="ev_c141f36c23" style={{ color: pos ? '#22c55e80' : '#ef444480' }}>{pos ? '▲' : '▼'}{Math.abs(change).toFixed(1)}%</span>
            </span>);

        })}
      </div>
    </div>);

};

export const StockTickerView = ({ sections, visible }: Props) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const total = sections.reduce((a, s) => a + s.links.length, 0);

  return (
    <div data-ev-id="ev_352778f003" className={`transition-[opacity,transform] duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <style data-ev-id="ev_de595d6a4c">{`@keyframes scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
      <div data-ev-id="ev_b62d0e40ef" className="mx-auto max-w-5xl rounded-xl overflow-hidden border" style={{ background: 'linear-gradient(180deg, #080a10 0%, #0c0e16 100%)', borderColor: 'rgba(255,255,255,0.04)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>

        {/* Header */}
        <div data-ev-id="ev_f2f818ec65" className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
          <div data-ev-id="ev_7a771d160d" className="flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5 text-green-400/50" />
            <div data-ev-id="ev_199338cb24">
              <span data-ev-id="ev_8df61c6c27" className="text-green-300/70 text-xs font-mono font-bold tracking-widest">AI EXCHANGE</span>
              <span data-ev-id="ev_bde1edd6f0" className="text-green-400/20 text-[9px] font-mono block">REAL-TIME MARKET DATA</span>
            </div>
          </div>
          <div data-ev-id="ev_e8c7536b8b" className="flex items-center gap-4 text-[10px] font-mono text-white/20">
            <span data-ev-id="ev_1d2139b8a0" className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> MARKETS OPEN</span>
            <span data-ev-id="ev_d9d9f81883">{total} TICKERS</span>
          </div>
        </div>

        <TickerTape sections={sections} />

        {/* Sectors */}
        <div data-ev-id="ev_604c6fee75" className="p-5 space-y-6">
          {sections.map((section, sIdx) => {
            const color = SECTOR_COLORS[sIdx % SECTOR_COLORS.length];
            return (
              <div data-ev-id="ev_acf3a59ac7" key={section.id}>
                <div data-ev-id="ev_f83dec4e7d" className="flex items-center gap-2 mb-3">
                  <div data-ev-id="ev_a364d4198a" className="px-2 py-0.5 rounded text-[10px] font-mono font-bold" style={{ color, backgroundColor: color + '0c', border: `1px solid ${color}15` }}>
                    SECTOR
                  </div>
                  <span data-ev-id="ev_456b65d212" className="text-xs font-mono font-bold text-white/50">{section.emoji} {section.title}</span>
                  <div data-ev-id="ev_644461b2ce" className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.03)' }} />
                  <span data-ev-id="ev_7b13da35e5" className="text-[9px] font-mono text-white/15">{section.links.length} listings</span>
                </div>
                <div data-ev-id="ev_e8f2daf104" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {section.links.map((link, lIdx) =>
                  <TickerCard key={link.id} link={link} sIdx={sIdx} delay={200 + sIdx * 80 + lIdx * 50} isActive={hovered === link.id} onHover={setHovered} />
                  )}
                </div>
              </div>);

          })}
        </div>

        {/* Footer */}
        <div data-ev-id="ev_45e6decb3c" className="flex items-center justify-between px-5 py-2 border-t text-[9px] font-mono text-white/12" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
          <span data-ev-id="ev_7de87c3de9">SECTORS: {sections.length}</span>
          <span data-ev-id="ev_e32a328bda">AI INDEX +4.2%</span>
          <span data-ev-id="ev_f0758c1683">EXCHANGE v1.0</span>
        </div>
      </div>
    </div>);

};

export default StockTickerView;