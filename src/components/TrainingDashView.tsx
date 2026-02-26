import { useState, useEffect } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink, TrendingDown, Gauge, Clock, FlaskConical } from 'lucide-react';

interface Props {sections: LinkSection[];visible: boolean;}

const RUN_COLORS = ['#22d3ee', '#a855f7', '#34d399', '#f472b6', '#fbbf24', '#60a5fa'];

/* Mini sparkline */
const Sparkline = ({ color, seed }: {color: string;seed: number;}) => {
  const points: number[] = [];
  let val = 2 + seed % 3;
  for (let i = 0; i < 20; i++) {
    val = Math.max(0.1, val - (0.05 + Math.sin(seed + i * 0.8) * 0.04));
    points.push(val);
  }
  const max = Math.max(...points);
  const h = 24;
  const w = 80;
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${i / (points.length - 1) * w},${h - p / max * (h - 2)}`).join(' ');
  return (
    <svg data-ev-id="ev_957db1cd3f" width={w} height={h} className="opacity-60" aria-hidden="true">
      <path data-ev-id="ev_f5933fe991" d={d} fill="none" stroke={color} strokeWidth="1.2" />
    </svg>);

};

const MetricCard = ({ link, sIdx, delay, isActive, onHover

}: {link: LinkItem;sIdx: number;delay: number;isActive: boolean;onHover: (id: string | null) => void;}) => {
  const [show, setShow] = useState(false);
  const color = RUN_COLORS[sIdx % RUN_COLORS.length];
  const loss = (0.001 + link.id.charCodeAt(0) * 7 % 500 / 10000).toFixed(4);
  const acc = (85 + (link.id.charCodeAt(1) || 50) * 3 % 14).toFixed(1);
  const epoch = 10 + (link.id.charCodeAt(2) || 40) % 90;

  useEffect(() => {const t = setTimeout(() => setShow(true), delay);return () => clearTimeout(t);}, [delay]);

  return (
    <a data-ev-id="ev_feaf694262" href={link.url} target="_blank" rel="noopener noreferrer"
    aria-label={`${link.title} — ${link.subtitle} (נפתח בחלון חדש)`}
    onMouseEnter={() => onHover(link.id)} onMouseLeave={() => onHover(null)}
    className={`block rounded-lg transition-all duration-400 group focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'} ${isActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
    style={{ background: 'rgba(10,10,20,0.5)', border: `1px solid ${isActive ? color + '35' : 'rgba(255,255,255,0.04)'}`, boxShadow: isActive ? `0 0 20px ${color}08` : 'none' }}>
      <div data-ev-id="ev_4277815d8d" className="p-3">
        <div data-ev-id="ev_eca4d5a1b1" className="flex items-center gap-2 mb-2">
          <div data-ev-id="ev_104951cafa" className="w-7 h-7 rounded flex items-center justify-center" style={{ background: `${color}0c`, border: `1px solid ${color}15` }}>
            <AnimatedIcon icon={link.icon} animation={link.animation} color={color} size={14} />
          </div>
          <div data-ev-id="ev_eb7eaf179a" className="flex-1 min-w-0">
            <h3 data-ev-id="ev_357c03d3ce" className="text-[11px] font-bold truncate" style={{ color: color + 'cc' }}>{link.title}</h3>
            <p data-ev-id="ev_ca2df38c5e" className="text-[8px] truncate text-white/60">{link.subtitle}</p>
          </div>
          <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-40 transition-opacity" style={{ color }} />
        </div>

        {/* Loss curve */}
        <div data-ev-id="ev_aff0d7383e" className="mb-2">
          <Sparkline color={color} seed={link.id.charCodeAt(0) + sIdx * 10} />
        </div>

        {/* Stats */}
        <div data-ev-id="ev_f908773b91" className="grid grid-cols-3 gap-1 text-[8px] font-mono">
          <div data-ev-id="ev_d31f5bddb6" className="text-center p-1 rounded" style={{ background: color + '06' }}>
            <div data-ev-id="ev_d8a1e41787" style={{ color: color + '50' }}>LOSS</div>
            <div data-ev-id="ev_4c6a4586e8" className="font-bold" style={{ color: color + '90' }}>{loss}</div>
          </div>
          <div data-ev-id="ev_6726b1ec52" className="text-center p-1 rounded" style={{ background: color + '06' }}>
            <div data-ev-id="ev_93312109b0" style={{ color: color + '50' }}>ACC</div>
            <div data-ev-id="ev_fa9177066f" className="font-bold" style={{ color: color + '90' }}>{acc}%</div>
          </div>
          <div data-ev-id="ev_460fee4865" className="text-center p-1 rounded" style={{ background: color + '06' }}>
            <div data-ev-id="ev_5471276a51" style={{ color: color + '50' }}>EPOCH</div>
            <div data-ev-id="ev_dd3fb45814" className="font-bold" style={{ color: color + '90' }}>{epoch}</div>
          </div>
        </div>
      </div>
    </a>);

};

export const TrainingDashView = ({ sections, visible }: Props) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const totalLinks = sections.reduce((a, s) => a + s.links.length, 0);

  return (
    <div data-ev-id="ev_33c71c73a6" className={`transition-[opacity,transform] duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div data-ev-id="ev_006d93f32d" className="mx-auto max-w-5xl rounded-xl overflow-hidden border" style={{ background: 'linear-gradient(180deg, #0a0a14 0%, #0c0c1a 100%)', borderColor: 'rgba(255,255,255,0.04)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        {/* Header */}
        <div data-ev-id="ev_37f9db3ee7" className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          <div data-ev-id="ev_2a6a413994" className="flex items-center gap-2.5">
            <FlaskConical className="w-4 h-4 text-purple-400/50" />
            <div data-ev-id="ev_123fb36620">
              <span data-ev-id="ev_92cfe90d46" className="text-purple-300/70 text-xs font-mono font-bold tracking-widest">TRAINING DASHBOARD</span>
              <span data-ev-id="ev_d3979bcbef" className="text-purple-400/20 text-[9px] font-mono block">WEIGHTS & BIASES STYLE</span>
            </div>
          </div>
          <div data-ev-id="ev_299db18f22" className="flex items-center gap-4 text-[10px] font-mono text-purple-400/25">
            <span data-ev-id="ev_61e76faa0b" className="flex items-center gap-1"><TrendingDown className="w-3 h-3" /> LOSS: CONVERGING</span>
            <span data-ev-id="ev_ea11ae1ef0" className="flex items-center gap-1"><Gauge className="w-3 h-3" /> {totalLinks} RUNS</span>
            <span data-ev-id="ev_77087cd67c" className="flex items-center gap-1"><Clock className="w-3 h-3" /> 2h 14m</span>
          </div>
        </div>

        {/* Experiments */}
        <div data-ev-id="ev_d590d31546" className="p-5 space-y-6">
          {sections.map((section, sIdx) => {
            const color = RUN_COLORS[sIdx % RUN_COLORS.length];
            return (
              <div data-ev-id="ev_69d11492a5" key={section.id}>
                <div data-ev-id="ev_be5572033b" className="flex items-center gap-2 mb-3">
                  <div data-ev-id="ev_d3166f3922" className="w-1 h-4 rounded-full" style={{ backgroundColor: color + '60' }} />
                  <span data-ev-id="ev_1fa9cc52e8" className="text-xs font-bold font-mono" style={{ color: color + 'aa' }}>{section.emoji} {section.title}</span>
                  <div data-ev-id="ev_6a4515d0f8" className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}10, transparent)` }} />
                  <span data-ev-id="ev_35233d06c4" className="text-[9px] font-mono" style={{ color: color + '25' }}>RUN GROUP • {section.links.length} experiments</span>
                </div>
                <div data-ev-id="ev_99f4a54512" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {section.links.map((link, lIdx) =>
                  <MetricCard key={link.id} link={link} sIdx={sIdx} delay={200 + sIdx * 80 + lIdx * 50} isActive={hovered === link.id} onHover={setHovered} />
                  )}
                </div>
              </div>);

          })}
        </div>

        {/* Footer */}
        <div data-ev-id="ev_d93ee5348d" className="flex items-center justify-between px-5 py-2 border-t text-[9px] font-mono text-purple-400/15" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
          <span data-ev-id="ev_fedd3eb744">PROJECTS: {sections.length}</span>
          <span data-ev-id="ev_d0453545cd">COMPUTE: A100 × 8</span>
          <span data-ev-id="ev_5ff122bb6d">W&B DASHBOARD v3.1</span>
        </div>
      </div>
    </div>);

};

export default TrainingDashView;