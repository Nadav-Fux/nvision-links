import { useState, useEffect, useRef } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink, GitBranch, Zap, ArrowRight } from 'lucide-react';

interface Props {sections: LinkSection[];visible: boolean;}

const CHAIN_COLORS = ['#00e5ff', '#a855f7', '#22d3ee', '#f472b6', '#34d399', '#fbbf24'];

/* Flowing dot on a pipe */
const FlowDot = ({ color }: {color: string;}) => {
  return (
    <span data-ev-id="ev_b09dadfed4"
    className="absolute w-1.5 h-1.5 rounded-full animate-flow-dot"
    style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}60`, top: '50%', left: '-4px', transform: 'translateY(-50%)' }} />);


};

const NodeCard = ({ link, sIdx, delay, isActive, onHover

}: {link: LinkItem;sIdx: number;delay: number;isActive: boolean;onHover: (id: string | null) => void;}) => {
  const [show, setShow] = useState(false);
  const color = CHAIN_COLORS[sIdx % CHAIN_COLORS.length];
  useEffect(() => {const t = setTimeout(() => setShow(true), delay);return () => clearTimeout(t);}, [delay]);

  return (
    <a data-ev-id="ev_f6c1877345"
    href={link.url} target="_blank" rel="noopener noreferrer"
    aria-label={`${link.title} — ${link.subtitle} (נפתח בחלון חדש)`}
    onMouseEnter={() => onHover(link.id)} onMouseLeave={() => onHover(null)}
    className={`relative block rounded-lg transition-all duration-400 group focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none ${
    show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${
    isActive ? 'scale-[1.03] z-10' : 'hover:scale-[1.01]'}`}
    style={{
      background: 'rgba(12,12,24,0.7)',
      border: `1.5px solid ${isActive ? color + '50' : color + '15'}`,
      boxShadow: isActive ? `0 0 24px ${color}12, 0 8px 24px rgba(0,0,0,0.3)` : `0 4px 12px rgba(0,0,0,0.2)`
    }}>

      {/* Top colored accent */}
      <div data-ev-id="ev_8b65de2a83" className="h-0.5 rounded-t-lg" style={{ background: `linear-gradient(90deg, ${color}40, ${color}15)` }} />

      <div data-ev-id="ev_24a4796a40" className="p-3">
        {/* Node type badge */}
        <div data-ev-id="ev_7237cb49dc" className="flex items-center justify-between mb-2">
          <span data-ev-id="ev_2420f0ba5b" className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ color: color + '80', backgroundColor: color + '10', border: `1px solid ${color}15` }}>
            NODE
          </span>
          <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-40 transition-opacity" style={{ color }} />
        </div>

        <div data-ev-id="ev_057f6c3895" className="flex items-center gap-2">
          <div data-ev-id="ev_77e9b37eef" className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: `${color}10`, border: `1px solid ${color}18` }}>
            <AnimatedIcon icon={link.icon} animation={link.animation} color={color} size={16} />
          </div>
          <div data-ev-id="ev_c9163608e4" className="flex-1 min-w-0">
            <h3 data-ev-id="ev_b46c14af8e" className="text-[11px] font-semibold truncate" style={{ color: color + 'cc' }}>{link.title}</h3>
            <p data-ev-id="ev_d0a58f3063" className="text-[9px] truncate text-white/25">{link.subtitle}</p>
          </div>
        </div>

        {/* IO ports */}
        <div data-ev-id="ev_9a162fc821" className="flex items-center justify-between mt-2 text-[7px] font-mono" style={{ color: color + '30' }}>
          <span data-ev-id="ev_d192c57208">IN ●</span>
          <span data-ev-id="ev_4d9d0f3132" className="flex-1 mx-2 border-t border-dashed" style={{ borderColor: color + '12' }} />
          <span data-ev-id="ev_ffe446a77e">● OUT</span>
        </div>
      </div>

      {/* Connection dot left */}
      <div data-ev-id="ev_179fda2d68" className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border" style={{ borderColor: color + '40', backgroundColor: '#0c0c18' }}>
        <div data-ev-id="ev_a879c88653" className="absolute inset-0.5 rounded-full" style={{ backgroundColor: color + '30' }} />
      </div>
      {/* Connection dot right */}
      <div data-ev-id="ev_32b0ea28ca" className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border" style={{ borderColor: color + '40', backgroundColor: '#0c0c18' }}>
        <div data-ev-id="ev_e818724ff6" className="absolute inset-0.5 rounded-full" style={{ backgroundColor: color + '30' }} />
      </div>
    </a>);

};

export const PromptFlowView = ({ sections, visible }: Props) => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div data-ev-id="ev_aac7122a4b" className={`transition-[opacity,transform] duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <style data-ev-id="ev_497dac385b">{`
        @keyframes flow-dot { 0% { left: -4px; opacity:0; } 20% { opacity:1; } 80% { opacity:1; } 100% { left: calc(100% + 4px); opacity:0; } }
        .animate-flow-dot { animation: flow-dot 2s linear infinite; }
      `}</style>
      <div data-ev-id="ev_56e7c55abe" className="mx-auto max-w-5xl rounded-xl overflow-hidden border relative"
      style={{ background: 'linear-gradient(180deg, #080810 0%, #0c0c1a 100%)', borderColor: 'rgba(0,229,255,0.06)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>

        {/* Grid bg */}
        <div data-ev-id="ev_822421a9d7" className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(0,229,255,0.03) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        {/* Header */}
        <div data-ev-id="ev_4889ceaa09" className="relative z-10 flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'rgba(0,229,255,0.05)' }}>
          <div data-ev-id="ev_d8a9902a71" className="flex items-center gap-2.5">
            <GitBranch className="w-4 h-4 text-cyan-400/50" />
            <div data-ev-id="ev_5f0e437524">
              <span data-ev-id="ev_4e61f1f4a3" className="text-cyan-300/70 text-xs font-mono font-bold tracking-[0.15em]">PROMPT FLOW</span>
              <span data-ev-id="ev_845f75ebc8" className="text-cyan-400/20 text-[9px] font-mono block">NODE GRAPH EDITOR v1.0</span>
            </div>
          </div>
          <div data-ev-id="ev_91709c5449" className="flex items-center gap-3 text-[10px] font-mono text-cyan-400/25">
            <span data-ev-id="ev_40979fc544" className="flex items-center gap-1"><Zap className="w-3 h-3" /> RUNNING</span>
            <span data-ev-id="ev_1490b8bacf">{sections.reduce((a, s) => a + s.links.length, 0)} NODES</span>
          </div>
        </div>

        {/* Chains */}
        <div data-ev-id="ev_11d7399164" className="relative z-10 p-5 space-y-8">
          {sections.map((section, sIdx) => {
            const color = CHAIN_COLORS[sIdx % CHAIN_COLORS.length];
            return (
              <div data-ev-id="ev_e80c1da2c1" key={section.id}>
                {/* Chain header */}
                <div data-ev-id="ev_285d2c3b21" className="flex items-center gap-2 mb-3">
                  <div data-ev-id="ev_f63edc6843" className="w-1 h-5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}30` }} />
                  <span data-ev-id="ev_a58165eea8" className="text-sm font-bold font-mono" style={{ color: color + 'aa' }}>
                    {section.emoji} {section.title}
                  </span>
                  <ArrowRight className="w-3 h-3" style={{ color: color + '30' }} />
                  <div data-ev-id="ev_6889e0fd25" className="flex-1 relative h-px" style={{ background: `linear-gradient(90deg, ${color}20, transparent)` }}>
                    <FlowDot color={color} />
                  </div>
                  <span data-ev-id="ev_e0deaa6dfb" className="text-[9px] font-mono" style={{ color: color + '25' }}>[{section.links.length} nodes]</span>
                </div>

                {/* Nodes with connecting pipes */}
                <div data-ev-id="ev_ebc0ec0dd6" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
                  {section.links.map((link, lIdx) =>
                  <div data-ev-id="ev_e6d5bb9b65" key={link.id} className="relative">
                      {/* Pipe connector to next */}
                      {lIdx < section.links.length - 1 &&
                    <div data-ev-id="ev_f91a376e3a" className="hidden lg:block absolute top-1/2 -right-8 w-8 h-px" style={{ background: `linear-gradient(90deg, ${color}20, ${color}10)` }}>
                          <span data-ev-id="ev_db5854e60c" className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full" style={{ backgroundColor: color + '40' }} />
                        </div>
                    }
                      <NodeCard link={link} sIdx={sIdx} delay={200 + sIdx * 100 + lIdx * 60} isActive={hovered === link.id} onHover={setHovered} />
                    </div>
                  )}
                </div>
              </div>);

          })}
        </div>

        {/* Footer */}
        <div data-ev-id="ev_0b8cc2fc5f" className="relative z-10 flex items-center justify-between px-5 py-2 border-t text-[9px] font-mono text-cyan-400/20" style={{ borderColor: 'rgba(0,229,255,0.04)' }}>
          <span data-ev-id="ev_019f0c5326">CHAINS: {sections.length}</span>
          <span data-ev-id="ev_f940ecb3f4">EXECUTION: PARALLEL</span>
          <span data-ev-id="ev_a6b5520184">PROMPT FLOW v1.0</span>
        </div>
      </div>
    </div>);

};

export default PromptFlowView;