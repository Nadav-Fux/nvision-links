import { useState, useEffect, useRef, useCallback } from 'react';
import { StackCard } from '@/components/StackCard';
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
  const pendingTab = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Entrance
  useEffect(() => {
    if (visible) {
      const t1 = setTimeout(() => setHeaderVisible(true), 100);
      const t2 = setTimeout(() => setPhase('emerging'), 300);
      const t3 = setTimeout(() => setPhase('visible'), 800);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
    setHeaderVisible(false);
    setPhase('gone');
  }, [visible]);

  // Tab switch with black hole suck animation
  const switchTab = useCallback((i: number) => {
    if (i === activeTab || phase === 'sucking') return;
    pendingTab.current = i;
    setHoveredLeft(null);
    setHoveredRight(null);

    // Phase 1: suck everything into the vortex
    setPhase('sucking');

    // Phase 2: swap content
    setTimeout(() => {
      setActiveTab(i);
      setPhase('gone');

      // Phase 3: emerge from vortex
      setTimeout(() => {
        setPhase('emerging');
        setTimeout(() => setPhase('visible'), 500);
      }, 100);
    }, 600);
  }, [activeTab, phase]);

  const currentSection = sections[activeTab];
  if (!currentSection) return null;

  const links = currentSection.links || [];
  const leftColumn = links.filter((_, i) => i % 2 === 0);
  const rightColumn = links.filter((_, i) => i % 2 === 1);

  // Per-card animation styles during suck/emerge
  const getCardStyle = (colIndex: number, rowIndex: number, isLeft: boolean): React.CSSProperties => {
    if (phase === 'visible') return {};

    // Calculate position relative to center (the black hole)
    const xDir = isLeft ? 1 : -1;
    const yOffset = (rowIndex - 2) * 30; // spread vertically around center

    if (phase === 'sucking') {
      // Cards spiral toward center and shrink
      const delay = rowIndex * 0.06;
      const spiralX = xDir * (-80 - rowIndex * 20);
      const spiralY = 200 + yOffset * 0.3;
      const rotation = xDir * (180 + rowIndex * 45);
      return {
        transform: `translate(${spiralX}px, ${spiralY}px) rotate(${rotation}deg) scale(0.1)`,
        opacity: 0,
        transition: `all 0.5s cubic-bezier(0.55, 0.06, 0.68, 0.19) ${delay}s`,
        filter: 'blur(4px)',
      };
    }

    if (phase === 'gone') {
      return {
        transform: 'translate(0, 200px) scale(0)',
        opacity: 0,
        transition: 'none',
      };
    }

    if (phase === 'emerging') {
      // Cards fly out from center
      const delay = rowIndex * 0.07;
      return {
        transform: 'translate(0, 0) rotate(0deg) scale(1)',
        opacity: 1,
        transition: `all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s`,
        filter: 'blur(0)',
      };
    }

    return {};
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pt-4" dir="rtl">
      {/* Centered tab bar */}
      <div
        className={`flex gap-2 justify-center overflow-x-auto pb-4 mb-6 scrollbar-hide transition-all duration-500 ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        {sections.map((section, i) => {
          const isActive = i === activeTab;
          const emoji = 'emoji' in section ? section.emoji : '';
          return (
            <button
              key={i}
              onClick={() => switchTab(i)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
                isActive
                  ? 'bg-primary/20 border-primary/40 text-white shadow-lg shadow-primary/10 scale-105'
                  : 'bg-white/[0.04] border-white/[0.08] text-white/60 hover:bg-white/[0.08] hover:text-white/80'
              }`}
            >
              <span className="ml-1.5">{emoji}</span>
              {section.title}
            </button>
          );
        })}
      </div>

      {/* Content area with black hole */}
      <div ref={containerRef} className="relative pb-8">
        {/* Black hole vortex — always present at bottom-center */}
        <div
          className={`
            absolute left-1/2 -translate-x-1/2 bottom-[-40px] w-40 h-40 rounded-full
            pointer-events-none z-20 transition-all duration-500
            ${phase === 'sucking' ? 'scale-[2] opacity-100' : phase === 'emerging' ? 'scale-150 opacity-60' : 'scale-75 opacity-0'}
          `}
          style={{
            background: 'radial-gradient(circle, #000 0%, #0a001a 30%, rgba(120,50,220,0.2) 55%, transparent 75%)',
            boxShadow: phase === 'sucking'
              ? '0 0 100px 40px rgba(120,60,220,0.35), 0 0 160px 80px rgba(80,30,180,0.15), inset 0 0 80px rgba(0,0,0,0.9)'
              : phase === 'emerging'
                ? '0 0 60px 20px rgba(100,50,200,0.2), inset 0 0 40px rgba(0,0,0,0.7)'
                : 'none',
          }}
        >
          {/* Spinning accretion rings */}
          <div
            className={`absolute inset-3 rounded-full border transition-all duration-500 ${
              phase === 'sucking' || phase === 'emerging' ? 'border-purple-400/50 animate-spin' : 'border-transparent'
            }`}
            style={{ animationDuration: '2s' }}
          />
          <div
            className={`absolute inset-8 rounded-full border transition-all duration-500 ${
              phase === 'sucking' || phase === 'emerging' ? 'border-cyan-400/30 animate-spin' : 'border-transparent'
            }`}
            style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
          />
          {/* Center glow */}
          <div
            className={`absolute inset-[35%] rounded-full transition-all duration-500 ${
              phase === 'sucking' ? 'bg-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.5)]' : 'bg-transparent'
            }`}
          />
        </div>

        {/* Two-column stacks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {/* Left column */}
          <div className="relative w-full">
            {leftColumn.map((link, i) => (
              <div
                key={`${activeTab}-L-${link.id}`}
                style={getCardStyle(i, i, true)}
              >
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
              <div
                key={`${activeTab}-R-${link.id}`}
                style={getCardStyle(i, i, false)}
              >
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
