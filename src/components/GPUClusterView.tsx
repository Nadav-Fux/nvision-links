import { useState, useEffect } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink, Cpu, Thermometer, HardDrive, Activity } from 'lucide-react';

interface Props {sections: LinkSection[];visible: boolean;}

const RACK_COLORS = ['#22d3ee', '#a855f7', '#34d399', '#f472b6', '#fbbf24', '#60a5fa'];

const GPUCard = ({ link, sIdx, delay, isActive, onHover

}: {link: LinkItem;sIdx: number;delay: number;isActive: boolean;onHover: (id: string | null) => void;}) => {
  const [show, setShow] = useState(false);
  const color = RACK_COLORS[sIdx % RACK_COLORS.length];
  const temp = 42 + link.id.charCodeAt(0) * 7 % 35;
  const vram = 60 + (link.id.charCodeAt(1) || 50) * 3 % 38;
  const util = 55 + (link.id.charCodeAt(2) || 60) * 5 % 40;

  useEffect(() => {const t = setTimeout(() => setShow(true), delay);return () => clearTimeout(t);}, [delay]);

  return (
    <a data-ev-id="ev_976f278293" href={link.url} target="_blank" rel="noopener noreferrer"
    aria-label={`${link.title} — ${link.subtitle} (נפתח בחלון חדש)`}
    onMouseEnter={() => onHover(link.id)} onMouseLeave={() => onHover(null)}
    className={`block rounded transition-all duration-400 group focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'} ${isActive ? 'scale-[1.02] z-10' : 'hover:scale-[1.01]'}`}
    style={{ background: 'rgba(8,8,16,0.7)', border: `1px solid ${isActive ? color + '40' : 'rgba(255,255,255,0.04)'}`, boxShadow: isActive ? `0 0 20px ${color}10` : 'none' }}>

      {/* LED strip */}
      <div data-ev-id="ev_3ff922cb49" className="flex gap-0.5 px-2 pt-1.5">
        {[...Array(6)].map((_, i) =>
        <div data-ev-id="ev_9e27688734" key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: i < 4 ? '#22c55e' : i < 5 ? '#fbbf24' : '#555', boxShadow: i < 4 ? '0 0 3px #22c55e60' : 'none' }} />
        )}
        <div data-ev-id="ev_bbaddc5b41" className="flex-1" />
        <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-40 transition-opacity" style={{ color }} />
      </div>

      <div data-ev-id="ev_c7137c3c37" className="p-2.5 pt-1.5">
        <div data-ev-id="ev_20aa6ee792" className="flex items-center gap-2 mb-2">
          <div data-ev-id="ev_4395764ca4" className="w-7 h-7 rounded flex items-center justify-center" style={{ background: `${color}0c`, border: `1px solid ${color}15` }}>
            <AnimatedIcon icon={link.icon} animation={link.animation} color={color} size={14} />
          </div>
          <div data-ev-id="ev_b0af023276" className="flex-1 min-w-0">
            <h3 data-ev-id="ev_521b743750" className="text-[11px] font-bold truncate" style={{ color: color + 'cc' }}>{link.title}</h3>
            <p data-ev-id="ev_afb477d43e" className="text-[8px] truncate text-white/20">{link.subtitle}</p>
          </div>
        </div>

        {/* Meters */}
        <div data-ev-id="ev_f52a2123f7" className="space-y-1">
          {[{ label: 'TEMP', value: temp, max: 95, unit: '°C', warn: temp > 70 },
          { label: 'VRAM', value: vram, max: 100, unit: '%', warn: vram > 90 },
          { label: 'UTIL', value: util, max: 100, unit: '%', warn: false }].map((m) =>
          <div data-ev-id="ev_d75936b4f1" key={m.label} className="flex items-center gap-1.5 text-[7px] font-mono">
              <span data-ev-id="ev_1a99d7bdaf" className="w-7 text-right" style={{ color: 'rgba(255,255,255,0.2)' }}>{m.label}</span>
              <div data-ev-id="ev_94f8a2c4e7" className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <div data-ev-id="ev_4d97982fef" className="h-full rounded-full transition-all duration-1000" style={{ width: `${m.value / m.max * 100}%`, background: m.warn ? '#ef4444' : color, opacity: 0.6 }} />
              </div>
              <span data-ev-id="ev_3e51c53c06" style={{ color: m.warn ? '#ef444480' : 'rgba(255,255,255,0.2)', minWidth: 24 }}>{m.value}{m.unit}</span>
            </div>
          )}
        </div>
      </div>
    </a>);

};

export const GPUClusterView = ({ sections, visible }: Props) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const totalLinks = sections.reduce((a, s) => a + s.links.length, 0);

  return (
    <div data-ev-id="ev_86d1b6f4e5" className={`transition-[opacity,transform] duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div data-ev-id="ev_0298df1b80" className="mx-auto max-w-5xl rounded-xl overflow-hidden border" style={{ background: 'linear-gradient(180deg, #060610 0%, #0a0a16 100%)', borderColor: 'rgba(255,255,255,0.04)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>

        {/* Header */}
        <div data-ev-id="ev_68968e4e27" className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          <div data-ev-id="ev_d91366e1a4" className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-cyan-400/50" />
            <div data-ev-id="ev_2301149b2b">
              <span data-ev-id="ev_6a1bdee51a" className="text-cyan-300/70 text-xs font-mono font-bold tracking-widest">GPU CLUSTER</span>
              <span data-ev-id="ev_22b6d667b5" className="text-cyan-400/20 text-[9px] font-mono block">NVIDIA DGX RACK MANAGER</span>
            </div>
          </div>
          <div data-ev-id="ev_7460c28046" className="flex items-center gap-4 text-[10px] font-mono text-cyan-400/25">
            <span data-ev-id="ev_0cdf6a68c7" className="flex items-center gap-1"><Thermometer className="w-3 h-3" /> THERMAL: OK</span>
            <span data-ev-id="ev_c7f5c18d71" className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> {totalLinks} GPUs</span>
            <span data-ev-id="ev_4c5fdd2c2d" className="flex items-center gap-1 text-green-400/40"><Activity className="w-3 h-3" /> ONLINE</span>
          </div>
        </div>

        {/* Racks */}
        <div data-ev-id="ev_3a43d40335" className="p-5 space-y-6">
          {sections.map((section, sIdx) => {
            const color = RACK_COLORS[sIdx % RACK_COLORS.length];
            return (
              <div data-ev-id="ev_6ea3a8c530" key={section.id} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.01)', border: `1px solid ${color}08` }}>
                <div data-ev-id="ev_3a9237c752" className="flex items-center gap-2 mb-3">
                  <div data-ev-id="ev_9e84793de2" className="w-1 h-4 rounded-full" style={{ backgroundColor: color + '60' }} />
                  <span data-ev-id="ev_f7908ea0d1" className="text-xs font-bold font-mono" style={{ color: color + 'aa' }}>{section.emoji} {section.title}</span>
                  <div data-ev-id="ev_af1c1e7786" className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}10, transparent)` }} />
                  <span data-ev-id="ev_3524916f9a" className="text-[9px] font-mono" style={{ color: color + '25' }}>RACK {sIdx + 1} • {section.links.length} UNITS</span>
                </div>
                <div data-ev-id="ev_f40bd26c8a" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {section.links.map((link, lIdx) =>
                  <GPUCard key={link.id} link={link} sIdx={sIdx} delay={200 + sIdx * 80 + lIdx * 50} isActive={hovered === link.id} onHover={setHovered} />
                  )}
                </div>
              </div>);

          })}
        </div>

        {/* Footer */}
        <div data-ev-id="ev_1584cfd620" className="flex items-center justify-between px-5 py-2 border-t text-[9px] font-mono text-white/15" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
          <span data-ev-id="ev_90e8e7302e">RACKS: {sections.length}</span>
          <span data-ev-id="ev_d95c68b9ca">TOTAL VRAM: {totalLinks * 80}GB</span>
          <span data-ev-id="ev_698df43408">DGX MANAGER v4.2</span>
        </div>
      </div>
    </div>);

};

export default GPUClusterView;