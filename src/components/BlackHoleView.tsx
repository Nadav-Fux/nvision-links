import { useState, useEffect, useRef } from 'react';
import { LinkCard } from '@/components/LinkCard';
import type { LinkSection } from '@/data/links';
import type { SectionWithLinks } from '@/lib/usePublicData';

interface BlackHoleViewProps {
  sections: (LinkSection | SectionWithLinks)[];
  visible: boolean;
}

type Phase = 'idle' | 'sucking' | 'emerging';

export const BlackHoleView = ({ sections, visible }: BlackHoleViewProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [cardsVisible, setCardsVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const pendingTab = useRef<number | null>(null);
  const holeRef = useRef<HTMLDivElement>(null);

  // Entrance
  useEffect(() => {
    if (visible) {
      const t1 = setTimeout(() => setSidebarVisible(true), 150);
      const t2 = setTimeout(() => setCardsVisible(true), 400);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    setSidebarVisible(false);
    setCardsVisible(false);
  }, [visible]);

  // Tab switch with black hole animation
  const switchTab = (i: number) => {
    if (i === activeTab || phase !== 'idle') return;
    pendingTab.current = i;

    // Phase 1: Suck cards into black hole
    setPhase('sucking');
    setCardsVisible(false);

    setTimeout(() => {
      // Phase 2: Switch content
      setActiveTab(i);
      setPhase('emerging');

      setTimeout(() => {
        // Phase 3: Cards emerge from black hole
        setCardsVisible(true);
        setTimeout(() => setPhase('idle'), 600);
      }, 150);
    }, 500);
  };

  const currentSection = sections[activeTab];
  if (!currentSection) return null;
  const links = currentSection.links || [];

  // Stack rotation per section
  const rotations = [-0.8, 0.5, -0.4, 0.7, -0.6, 0.3];
  const rot = rotations[activeTab % rotations.length];

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 pt-4" dir="rtl">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">

        {/* Sidebar — categories */}
        <div
          className={`
            lg:w-52 flex-shrink-0 flex lg:flex-col gap-2
            overflow-x-auto lg:overflow-visible pb-2 lg:pb-0
            scrollbar-hide transition-all duration-600
            ${sidebarVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
          `}
        >
          {sections.map((section, i) => {
            const isActive = i === activeTab;
            const emoji = 'emoji' in section ? section.emoji : '';
            return (
              <button
                key={i}
                onClick={() => switchTab(i)}
                className={`
                  flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl
                  text-sm font-medium transition-all duration-300 border text-right
                  ${isActive
                    ? 'bg-gradient-to-l from-primary/20 to-purple-500/10 border-primary/30 text-white shadow-lg shadow-primary/10 scale-[1.03]'
                    : 'bg-white/[0.02] border-white/[0.05] text-white/40 hover:bg-white/[0.05] hover:text-white/60'
                  }
                `}
              >
                <span className="text-lg">{emoji}</span>
                <span className="hidden lg:inline whitespace-nowrap">{section.title}</span>
                <span className="lg:hidden whitespace-nowrap text-xs">{section.title}</span>
                {isActive && (
                  <span className="mr-auto text-[10px] text-primary/60">{links.length}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main content area */}
        <div className="flex-1 relative min-h-[400px]">

          {/* Black hole */}
          <div
            ref={holeRef}
            className={`
              absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2
              w-48 h-48 rounded-full pointer-events-none z-10
              transition-all duration-700
              ${phase === 'sucking'
                ? 'scale-150 opacity-90'
                : phase === 'emerging'
                  ? 'scale-125 opacity-70'
                  : 'scale-100 opacity-40'
              }
            `}
            style={{
              background: 'radial-gradient(circle, #000 0%, #0a001a 25%, rgba(99,50,200,0.15) 50%, transparent 70%)',
              boxShadow: phase !== 'idle'
                ? '0 0 80px 30px rgba(120,60,220,0.3), 0 0 120px 60px rgba(80,30,180,0.15), inset 0 0 60px rgba(0,0,0,0.8)'
                : '0 0 40px 15px rgba(80,40,160,0.15), inset 0 0 40px rgba(0,0,0,0.6)',
            }}
          >
            {/* Accretion ring */}
            <div
              className={`
                absolute inset-2 rounded-full border border-purple-500/20
                transition-all duration-700
                ${phase !== 'idle' ? 'animate-spin border-purple-400/40' : ''}
              `}
              style={{ animationDuration: '3s' }}
            />
            <div
              className={`
                absolute inset-6 rounded-full border border-cyan-500/10
                transition-all duration-700
                ${phase !== 'idle' ? 'animate-spin border-cyan-400/30' : ''}
              `}
              style={{ animationDuration: '2s', animationDirection: 'reverse' }}
            />
          </div>

          {/* Stacked card container */}
          <div className="relative">
            {/* Background stack layers */}
            {[1, 2].map(layer => (
              <div
                key={layer}
                className={`
                  absolute inset-0 rounded-3xl border border-white/[0.03] bg-white/[0.008]
                  transition-all duration-700
                  ${cardsVisible ? 'opacity-100' : 'opacity-0'}
                `}
                style={{
                  transform: `rotate(${layer * 1.2 * (activeTab % 2 === 0 ? 1 : -1)}deg) translateX(${layer * 6}px) translateY(${layer * 3}px)`,
                  zIndex: -layer,
                }}
              />
            ))}

            {/* Main card */}
            <div
              className={`
                relative rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm
                p-4 sm:p-6 transition-all
                ${phase === 'sucking'
                  ? 'duration-500 opacity-0 scale-75 translate-y-24 blur-sm'
                  : phase === 'emerging'
                    ? 'duration-100 opacity-0 scale-90 translate-y-8'
                    : cardsVisible
                      ? 'duration-600 opacity-100 scale-100 translate-y-0 blur-0'
                      : 'duration-500 opacity-0 scale-95 translate-y-8'
                }
              `}
              style={{
                transform: phase === 'idle' && cardsVisible
                  ? `rotate(${rot}deg) scale(1) translateY(0)`
                  : phase === 'sucking'
                    ? 'rotate(8deg) scale(0.6) translateY(120px)'
                    : undefined,
                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {/* Section header */}
              <div className="text-center mb-5">
                <h2 className="text-lg font-bold text-white/90">
                  {'emoji' in currentSection ? currentSection.emoji : ''} {currentSection.title}
                </h2>
                <p className="text-white/30 text-xs mt-1">{links.length} כלים</p>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {links.length > 0 && (
                  <div className="col-span-1 sm:col-span-2">
                    <LinkCard
                      key={`bh-${activeTab}-${links[0].id}`}
                      {...links[0]}
                      delay={0}
                      visible={cardsVisible && phase === 'idle'}
                      featured
                      direction="right"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  {links.slice(1).filter((_, i) => i % 2 === 0).map((link, i) => (
                    <LinkCard
                      key={`bh-${activeTab}-${link.id}`}
                      {...link}
                      delay={(i + 1) * 50}
                      visible={cardsVisible && phase === 'idle'}
                      direction="right"
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  {links.slice(1).filter((_, i) => i % 2 === 1).map((link, i) => (
                    <LinkCard
                      key={`bh-${activeTab}-${link.id}`}
                      {...link}
                      delay={(i + 1) * 50 + 25}
                      visible={cardsVisible && phase === 'idle'}
                      direction="left"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom glow from black hole */}
          <div
            className={`
              absolute bottom-0 left-0 right-0 h-32 pointer-events-none
              bg-gradient-to-t from-purple-900/10 to-transparent
              transition-opacity duration-700
              ${phase !== 'idle' ? 'opacity-100' : 'opacity-30'}
            `}
          />
        </div>
      </div>
    </div>
  );
};
