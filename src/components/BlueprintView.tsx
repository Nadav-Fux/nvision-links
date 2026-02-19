import { useState, useEffect } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink, Ruler, PenTool, Building2 } from 'lucide-react';

interface Props {sections: LinkSection[];visible: boolean;}
const FLOOR_COLORS = ['#93c5fd', '#60a5fa', '#38bdf8', '#7dd3fc', '#a5b4fc', '#c4b5fd'];

const RoomCard = ({ link, sIdx, delay, isActive, onHover

}: {link: LinkItem;sIdx: number;delay: number;isActive: boolean;onHover: (id: string | null) => void;}) => {
  const [show, setShow] = useState(false);
  const color = FLOOR_COLORS[sIdx % FLOOR_COLORS.length];
  useEffect(() => {const t = setTimeout(() => setShow(true), delay);return () => clearTimeout(t);}, [delay]);

  // "Dimension" based on link id
  const w = 2 + link.id.charCodeAt(0) % 5;
  const h_ = 2 + link.id.charCodeAt(link.id.length - 1) % 4;

  return (
    <a data-ev-id="ev_72b2604a58" href={link.url} target="_blank" rel="noopener noreferrer"
    aria-label={`${link.title} — ${link.subtitle} (נפתח בחלון חדש)`}
    onMouseEnter={() => onHover(link.id)} onMouseLeave={() => onHover(null)}
    className={`block transition-all duration-400 group focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'} ${isActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
    style={{ border: `1px solid ${isActive ? color + '40' : color + '18'}`, background: isActive ? `${color}06` : 'transparent', borderStyle: 'dashed' }}>
      <div data-ev-id="ev_5fdeb3dbb0" className="p-3">
        <div data-ev-id="ev_9dd1d00b7b" className="flex items-center gap-2.5">
          <div data-ev-id="ev_f9a6232823" className="w-8 h-8 flex items-center justify-center" style={{ border: `1px solid ${color}20`, borderStyle: 'dashed' }}>
            <AnimatedIcon icon={link.icon} animation={link.animation} color={color} size={16} />
          </div>
          <div data-ev-id="ev_7e08100f37" className="flex-1 min-w-0">
            <h3 data-ev-id="ev_2c2aef0767" className="text-[11px] font-bold truncate" style={{ color: color + 'dd' }}>{link.title}</h3>
            <p data-ev-id="ev_5b79d1c233" className="text-[9px] truncate" style={{ color: color + '40' }}>{link.subtitle}</p>
          </div>
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity flex-shrink-0" style={{ color }} />
        </div>
        {/* Dimension annotation */}
        <div data-ev-id="ev_3eaa647a58" className="mt-2 flex items-center justify-between">
          <div data-ev-id="ev_37e982241c" className="flex items-center gap-1">
            <Ruler className="w-2.5 h-2.5" style={{ color: color + '30' }} />
            <span data-ev-id="ev_a81f305a75" className="text-[7px] font-mono" style={{ color: color + '35' }}>{w}.0m × {h_}.0m</span>
          </div>
          <span data-ev-id="ev_a48812ed3a" className="text-[7px] font-mono px-1.5 py-0.5" style={{ color: color + '50', backgroundColor: color + '08', border: `1px solid ${color}12` }}>
            {link.tag === 'free' ? 'OPEN' : link.tag === 'deal' ? 'PREMIUM' : 'STD'}
          </span>
        </div>
        {/* Annotation arrows */}
        <div data-ev-id="ev_3ec6411b3b" className="mt-1.5 border-t" style={{ borderColor: color + '0c', borderStyle: 'dashed' }}>
          <div data-ev-id="ev_88f8191597" className="flex justify-between pt-1 text-[6px] font-mono" style={{ color: color + '25' }}>
            <span data-ev-id="ev_b01ceb3fe6">← {w}.0m →</span>
            <span data-ev-id="ev_614ad19107">A={w * h_}m²</span>
          </div>
        </div>
      </div>
    </a>);

};

export const BlueprintView = ({ sections, visible }: Props) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const total = sections.reduce((a, s) => a + s.links.length, 0);

  return (
    <div data-ev-id="ev_bb06978569" className={`transition-[opacity,transform] duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <style data-ev-id="ev_c1c1a95311">{`
        .blueprint-grid {
          background-image:
            linear-gradient(rgba(96,165,250,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96,165,250,0.04) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
      <div data-ev-id="ev_0203217124" className="mx-auto max-w-5xl rounded-xl overflow-hidden border blueprint-grid" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0c1a30 100%)', borderColor: 'rgba(96,165,250,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>

        {/* Header – title block */}
        <div data-ev-id="ev_4010bacfcb" className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'rgba(96,165,250,0.08)' }}>
          <div data-ev-id="ev_276ae184c4" className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5" style={{ color: '#60a5fa70' }} />
            <div data-ev-id="ev_b2801e55fe">
              <span data-ev-id="ev_778b0b0590" className="text-[13px] font-mono font-bold tracking-wider" style={{ color: '#93c5fdcc' }}>ARCHITECTURAL BLUEPRINT</span>
              <span data-ev-id="ev_41d6b8cc93" className="text-[9px] font-mono block" style={{ color: '#60a5fa30' }}>AI SYSTEMS FLOOR PLAN • SCALE 1:100</span>
            </div>
          </div>
          <div data-ev-id="ev_ee7cdfc749" className="flex items-center gap-4 text-[10px] font-mono" style={{ color: '#60a5fa25' }}>
            <span data-ev-id="ev_6f907234e8" className="flex items-center gap-1"><PenTool className="w-3 h-3" /> DRAFT</span>
            <span data-ev-id="ev_3e5cb6bd2f">{total} ROOMS</span>
          </div>
        </div>

        {/* Floors / sections */}
        <div data-ev-id="ev_e40a27f40f" className="p-5 space-y-6">
          {sections.map((section, sIdx) => {
            const color = FLOOR_COLORS[sIdx % FLOOR_COLORS.length];
            return (
              <div data-ev-id="ev_3907539923" key={section.id}>
                {/* Floor label */}
                <div data-ev-id="ev_49959ea4a9" className="flex items-center gap-2 mb-3">
                  <div data-ev-id="ev_110ce8fd8a" className="px-2 py-0.5 text-[10px] font-mono font-bold" style={{ color, border: `1px solid ${color}25`, borderStyle: 'dashed' }}>
                    FLOOR {sIdx + 1}
                  </div>
                  <span data-ev-id="ev_0aa7565f88" className="text-xs font-mono font-bold" style={{ color: color + '90' }}>{section.emoji} {section.title}</span>
                  <div data-ev-id="ev_d326ef8e47" className="flex-1 h-px" style={{ background: color + '10', borderTop: `1px dashed ${color}15` }} />
                  <span data-ev-id="ev_600c2b41da" className="text-[9px] font-mono" style={{ color: color + '25' }}>{section.links.length} rooms</span>
                </div>

                <div data-ev-id="ev_c206fb80b8" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {section.links.map((link, lIdx) =>
                  <RoomCard key={link.id} link={link} sIdx={sIdx} delay={200 + sIdx * 80 + lIdx * 50} isActive={hovered === link.id} onHover={setHovered} />
                  )}
                </div>
              </div>);

          })}
        </div>

        {/* Footer – title block */}
        <div data-ev-id="ev_a2e08e5f95" className="flex items-center justify-between px-5 py-2 border-t text-[9px] font-mono" style={{ borderColor: 'rgba(96,165,250,0.06)', color: '#60a5fa20' }}>
          <span data-ev-id="ev_b4caa1a3b1">FLOORS: {sections.length}</span>
          <span data-ev-id="ev_ff2dbe86f4">DRAWN BY: AI ARCHITECT</span>
          <span data-ev-id="ev_8e8212dc17">REV 1.0 • SCALE 1:100</span>
        </div>
      </div>
    </div>);

};

export default BlueprintView;