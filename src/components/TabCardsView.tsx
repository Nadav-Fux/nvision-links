import { useState, useEffect, useRef, useCallback } from 'react';
import { StackCard } from '@/components/StackCard';
import { getSectionIcon } from '@/lib/sectionIcons';
import type { LinkSection } from '@/data/links';
import type { SectionWithLinks } from '@/lib/usePublicData';

interface TabCardsViewProps {
  sections: (LinkSection | SectionWithLinks)[];
  visible: boolean;
}

type Phase = 'visible' | 'sucking' | 'gone' | 'emerging';

export const TabCardsView = ({ sections, visible }: TabCardsViewProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [phase, setPhase] = useState<Phase>('gone');
  const [headerVisible, setHeaderVisible] = useState(false);
  const [hoveredLeft, setHoveredLeft] = useState<number | null>(null);
  const [hoveredRight, setHoveredRight] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Entrance
  useEffect(() => {
    if (visible) {
      const t1 = setTimeout(() => setHeaderVisible(true), 100);
      const t2 = setTimeout(() => setPhase('emerging'), 300);
      const t3 = setTimeout(() => setPhase('visible'), 900);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
    setHeaderVisible(false);
    setPhase('gone');
  }, [visible]);

  const switchTab = useCallback((i: number) => {
    if (i === activeTab || phase === 'sucking') return;
    setHoveredLeft(null);
    setHoveredRight(null);
    setPhase('sucking');

    // Wait for suck animation, then swap
    setTimeout(() => {
      setActiveTab(i);
      setPhase('gone');
      setTimeout(() => {
        setPhase('emerging');
        setTimeout(() => setPhase('visible'), 600);
      }, 150);
    }, 700);
  }, [activeTab, phase]);

  const currentSection = sections[activeTab];
  if (!currentSection) return null;

  const links = currentSection.links || [];
  const leftColumn = links.filter((_, i) => i % 2 === 0);
  const rightColumn = links.filter((_, i) => i % 2 === 1);
  const totalCards = links.length;

  // Calculate suck animation per card — each card flies toward center independently
  const getCardStyle = (cardIndex: number, isLeft: boolean): React.CSSProperties => {
    if (phase === 'visible') return { transition: 'all 0.3s ease' };

    if (phase === 'sucking') {
      // Stagger: each card starts slightly after the previous (30ms apart)
      const delay = cardIndex * 0.03;
      // Direction: left cards fly right, right cards fly left, toward center
      const xTarget = isLeft ? 150 : -150;
      // All cards converge to vertical center
      const yTarget = 100;
      // Spiral rotation
      const rotation = (isLeft ? 1 : -1) * (90 + cardIndex * 30);

      return {
        transform: `translate(${xTarget}px, ${yTarget}px) rotate(${rotation}deg) scale(0)`,
        opacity: 0,
        filter: 'blur(6px)',
        transition: `transform 0.5s cubic-bezier(0.55, 0.06, 0.68, 0.19) ${delay}s, opacity 0.4s ease ${delay}s, filter 0.4s ease ${delay}s`,
      };
    }

    if (phase === 'gone') {
      return {
        transform: 'translate(0, 0) scale(0)',
        opacity: 0,
        transition: 'none',
      };
    }

    if (phase === 'emerging') {
      // Stagger emergence
      const delay = cardIndex * 0.05;
      return {
        transform: 'translate(0, 0) rotate(0deg) scale(1)',
        opacity: 1,
        filter: 'blur(0)',
        transition: `transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s, opacity 0.4s ease ${delay}s, filter 0.3s ease ${delay}s`,
      };
    }

    return {};
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pt-4" dir="rtl">
      {/* Tab bar with animated SVG icons */}
      <div
        className={`flex gap-2 justify-center overflow-x-auto pb-4 mb-6 scrollbar-hide transition-all duration-500 ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        {sections.map((section, i) => {
          const isActive = i === activeTab;
          const icon = getSectionIcon(section.title);
          return (
            <button
              key={i}
              onClick={() => switchTab(i)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
                isActive
                  ? 'bg-primary/20 border-primary/40 text-white shadow-lg shadow-primary/10 scale-105'
                  : 'bg-white/[0.04] border-white/[0.08] text-white/60 hover:bg-white/[0.08] hover:text-white/80'
              }`}
            >
              {icon && <span className="flex-shrink-0">{icon}</span>}
              <span className="hidden sm:inline">{section.title}</span>
              <span className="sm:hidden">{section.title.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Content area */}
      <div ref={containerRef} className="relative pb-8">
        {/* Black hole — appears in the center of the content area */}
        <div
          className={`
            absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            rounded-full pointer-events-none z-30
            transition-all
            ${phase === 'sucking'
              ? 'w-56 h-56 opacity-100 duration-500'
              : phase === 'emerging'
                ? 'w-40 h-40 opacity-50 duration-300'
                : 'w-0 h-0 opacity-0 duration-500'
            }
          `}
          style={{
            background: 'radial-gradient(circle, #000 0%, #05001a 25%, rgba(120,50,220,0.25) 50%, transparent 72%)',
            boxShadow: phase === 'sucking'
              ? '0 0 120px 50px rgba(120,60,220,0.4), 0 0 200px 100px rgba(80,30,180,0.15), inset 0 0 80px rgba(0,0,0,0.9)'
              : 'none',
          }}
        >
          {/* Accretion rings */}
          <div
            className={`absolute inset-3 rounded-full border-2 transition-all duration-300 ${
              phase === 'sucking' ? 'border-purple-400/60 animate-spin' : 'border-transparent'
            }`}
            style={{ animationDuration: '1.5s' }}
          />
          <div
            className={`absolute inset-8 rounded-full border transition-all duration-300 ${
              phase === 'sucking' ? 'border-cyan-400/40 animate-spin' : 'border-transparent'
            }`}
            style={{ animationDuration: '1s', animationDirection: 'reverse' }}
          />
          <div
            className={`absolute inset-12 rounded-full transition-all duration-300 ${
              phase === 'sucking' ? 'bg-purple-600/30 shadow-[0_0_40px_rgba(168,85,247,0.6)]' : 'bg-transparent'
            }`}
          />
        </div>

        {/* Two-column stacks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {/* Left column */}
          <div className="relative w-full">
            {leftColumn.map((link, i) => (
              <div key={`${activeTab}-L-${link.id}`} style={getCardStyle(i, true)}>
                <StackCard
                  {...link}
                  index={i}
                  total={leftColumn.length}
                  visible={phase === 'visible' || phase === 'emerging'}
                  hoveredIndex={phase === 'visible' ? hoveredLeft : null}
                  onHover={(h) => phase === 'visible' && setHoveredLeft(h ? i : null)}
                />
              </div>
            ))}
          </div>

          {/* Right column */}
          <div className="relative w-full">
            {rightColumn.map((link, i) => (
              <div key={`${activeTab}-R-${link.id}`} style={getCardStyle(i, false)}>
                <StackCard
                  {...link}
                  index={i}
                  total={rightColumn.length}
                  visible={phase === 'visible' || phase === 'emerging'}
                  hoveredIndex={phase === 'visible' ? hoveredRight : null}
                  onHover={(h) => phase === 'visible' && setHoveredRight(h ? i : null)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
