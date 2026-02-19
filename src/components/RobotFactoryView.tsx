import { useState, useEffect } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink, Cog, Wrench, Factory, ArrowRight } from 'lucide-react';

interface Props {sections: LinkSection[];visible: boolean;}
const STATION_COLORS = ['#f59e0b', '#22d3ee', '#a855f7', '#34d399', '#f472b6', '#60a5fa'];

const PartCard = ({ link, sIdx, delay, isActive, onHover

}: {link: LinkItem;sIdx: number;delay: number;isActive: boolean;onHover: (id: string | null) => void;}) => {
  const [show, setShow] = useState(false);
  const color = STATION_COLORS[sIdx % STATION_COLORS.length];
  useEffect(() => {const t = setTimeout(() => setShow(true), delay);return () => clearTimeout(t);}, [delay]);

  return (
    <a data-ev-id="ev_fba449e977" href={link.url} target="_blank" rel="noopener noreferrer"
    aria-label={`${link.title} — ${link.subtitle} (נפתח בחלון חדש)`}
    onMouseEnter={() => onHover(link.id)} onMouseLeave={() => onHover(null)}
    className={`block rounded-lg transition-all duration-400 group focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none ${show ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} ${isActive ? 'scale-[1.03]' : 'hover:scale-[1.01]'}`}
    style={{ background: 'rgba(15,12,8,0.6)', border: `1px solid ${isActive ? color + '40' : color + '10'}`, boxShadow: isActive ? `0 0 20px ${color}10` : 'none' }}>
      <div data-ev-id="ev_a1ef1d7fb6" className="p-3">
        <div data-ev-id="ev_57deb6b86e" className="flex items-center gap-2.5">
          <div data-ev-id="ev_461de9dc7e" className="w-9 h-9 rounded-lg flex items-center justify-center relative" style={{ background: `${color}0c`, border: `1px solid ${color}15` }}>
            <AnimatedIcon icon={link.icon} animation={link.animation} color={color} size={18} />
            {/* Assembly bolt markers */}
            <div data-ev-id="ev_95e42cb645" className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color + '30' }} />
            <div data-ev-id="ev_7f6bbba9f5" className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color + '30' }} />
          </div>
          <div data-ev-id="ev_88d91b7a4d" className="flex-1 min-w-0">
            <h3 data-ev-id="ev_876c288c17" className="text-[11px] font-bold truncate" style={{ color: color + 'cc' }}>{link.title}</h3>
            <p data-ev-id="ev_f903950c1b" className="text-[9px] truncate" style={{ color: 'rgba(245,158,11,0.25)' }}>{link.subtitle}</p>
          </div>
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity flex-shrink-0" style={{ color }} />
        </div>
        {/* Progress assembly bar */}
        <div data-ev-id="ev_76966aa1c4" className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: color + '08' }}>
          <div data-ev-id="ev_f5db9104d3" className="h-full rounded-full" style={{ width: `${60 + link.id.charCodeAt(0) % 40}%`, background: `linear-gradient(90deg, ${color}50, ${color}20)` }} />
        </div>
        <div data-ev-id="ev_6467a725d5" className="flex justify-between mt-1 text-[7px] font-mono" style={{ color: color + '30' }}>
          <span data-ev-id="ev_9823d13e39">ASSEMBLING</span>
          <span data-ev-id="ev_554cde2c1c">{link.tag === 'free' ? 'OPEN-SOURCE' : link.tag === 'deal' ? '⚡ BOOSTED' : 'STANDARD'}</span>
        </div>
      </div>
    </a>);

};

export const RobotFactoryView = ({ sections, visible }: Props) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const total = sections.reduce((a, s) => a + s.links.length, 0);

  return (
    <div data-ev-id="ev_5ff5bfd32b" className={`transition-[opacity,transform] duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <style data-ev-id="ev_efa7a470f4">{`
        @keyframes convey { 0%{background-position:0 0} 100%{background-position:40px 0} }
        .conveyor-belt { animation: convey 2s linear infinite; background-image: repeating-linear-gradient(90deg, rgba(245,158,11,0.06) 0px, rgba(245,158,11,0.06) 2px, transparent 2px, transparent 20px); background-size: 40px 100%; }
      `}</style>
      <div data-ev-id="ev_10afe67a96" className="mx-auto max-w-5xl rounded-xl overflow-hidden border" style={{ background: 'linear-gradient(180deg, #0c0a06 0%, #100e08 100%)', borderColor: 'rgba(245,158,11,0.08)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>

        {/* Header */}
        <div data-ev-id="ev_5e81bb1de4" className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'rgba(245,158,11,0.06)' }}>
          <div data-ev-id="ev_908ce16f8a" className="flex items-center gap-2.5">
            <Factory className="w-5 h-5 text-amber-400/50" />
            <div data-ev-id="ev_60bd3502eb">
              <span data-ev-id="ev_0ee9026dac" className="text-amber-300/70 text-xs font-mono font-bold tracking-widest">ROBOT FACTORY</span>
              <span data-ev-id="ev_170d094eaa" className="text-amber-400/20 text-[9px] font-mono block">ASSEMBLY LINE v2.0</span>
            </div>
          </div>
          <div data-ev-id="ev_ae1d03f622" className="flex items-center gap-4 text-[10px] font-mono text-amber-400/25">
            <span data-ev-id="ev_7930ae257f" className="flex items-center gap-1"><Cog className="w-3 h-3 animate-[spin_4s_linear_infinite]" /> RUNNING</span>
            <span data-ev-id="ev_99b80f69ec" className="flex items-center gap-1"><Wrench className="w-3 h-3" /> {total} PARTS</span>
          </div>
        </div>

        {/* Assembly stations */}
        <div data-ev-id="ev_5144624e91" className="p-5 space-y-6">
          {sections.map((section, sIdx) => {
            const color = STATION_COLORS[sIdx % STATION_COLORS.length];
            return (
              <div data-ev-id="ev_5d2f0ed8fd" key={section.id}>
                {/* Station header with conveyor */}
                <div data-ev-id="ev_3abf46c164" className="flex items-center gap-2 mb-1">
                  <div data-ev-id="ev_38b69983c2" className="px-2 py-0.5 rounded text-[10px] font-mono font-bold" style={{ color: color + 'cc', backgroundColor: color + '10', border: `1px solid ${color}20` }}>
                    STATION {sIdx + 1}
                  </div>
                  <span data-ev-id="ev_ec64811ef1" className="text-xs font-bold" style={{ color: color + '90' }}>{section.emoji} {section.title}</span>
                  <div data-ev-id="ev_1ed23a75b2" className="flex-1" />
                  <span data-ev-id="ev_0969ef18ac" className="text-[9px] font-mono" style={{ color: color + '25' }}>{section.links.length} components</span>
                </div>
                {/* Conveyor belt line */}
                <div data-ev-id="ev_c7e95daacc" className="conveyor-belt h-1 rounded-full mb-3 flex items-center">
                  <ArrowRight className="w-3 h-3 ml-auto" style={{ color: color + '25' }} />
                </div>

                <div data-ev-id="ev_8e15537bee" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {section.links.map((link, lIdx) =>
                  <PartCard key={link.id} link={link} sIdx={sIdx} delay={200 + sIdx * 100 + lIdx * 60} isActive={hovered === link.id} onHover={setHovered} />
                  )}
                </div>
              </div>);

          })}
        </div>

        {/* Footer */}
        <div data-ev-id="ev_a5f3d8af59" className="flex items-center justify-between px-5 py-2 border-t text-[9px] font-mono text-amber-400/15" style={{ borderColor: 'rgba(245,158,11,0.05)' }}>
          <span data-ev-id="ev_a4d3035b64">STATIONS: {sections.length}</span>
          <span data-ev-id="ev_76a935974d">OUTPUT: {total} UNITS/CYCLE</span>
          <span data-ev-id="ev_78e0c2a9e7">FACTORY OS v2.0</span>
        </div>
      </div>
    </div>);

};

export default RobotFactoryView;