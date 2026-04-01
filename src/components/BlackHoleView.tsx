import { useState, useEffect } from 'react';
import { StackCard } from '@/components/StackCard';
import { getSectionIcon } from '@/lib/sectionIcons';
import type { LinkSection } from '@/data/links';
import type { SectionWithLinks } from '@/lib/usePublicData';

interface BlackHoleViewProps {
  sections: (LinkSection | SectionWithLinks)[];
  visible: boolean;
}

/**
 * View 44 — Spotify-style sidebar categories + StackCard two-column grid.
 * Simple fade transition on tab switch, no black hole effect.
 */
export const BlackHoleView = ({ sections, visible }: BlackHoleViewProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [hoveredLeft, setHoveredLeft] = useState<number | null>(null);
  const [hoveredRight, setHoveredRight] = useState<number | null>(null);

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

  // Tab switch
  useEffect(() => {
    setCardsVisible(false);
    setHoveredLeft(null);
    setHoveredRight(null);
    const t = setTimeout(() => setCardsVisible(true), 200);
    return () => clearTimeout(t);
  }, [activeTab]);

  const currentSection = sections[activeTab];
  if (!currentSection) return null;
  const links = currentSection.links || [];
  const leftColumn = links.filter((_, i) => i % 2 === 0);
  const rightColumn = links.filter((_, i) => i % 2 === 1);

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 pt-4" dir="rtl">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">

        {/* Sidebar — categories with SVG icons */}
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
            const icon = getSectionIcon(section.title);
            return (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`
                  flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl
                  text-sm font-medium transition-all duration-300 border text-right
                  ${isActive
                    ? 'bg-gradient-to-l from-primary/20 to-purple-500/10 border-primary/30 text-white shadow-lg shadow-primary/10 scale-[1.03]'
                    : 'bg-white/[0.02] border-white/[0.05] text-white/40 hover:bg-white/[0.05] hover:text-white/60'
                  }
                `}
              >
                {icon && <span className="flex-shrink-0">{icon}</span>}
                <span className="hidden lg:inline whitespace-nowrap">{section.title}</span>
                <span className="lg:hidden whitespace-nowrap text-xs">{section.title}</span>
                {isActive && (
                  <span className="mr-auto text-[10px] text-primary/60">{links.length}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main content — two-column StackCards */}
        <div className="flex-1 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
            <div className="relative w-full">
              {leftColumn.map((link, i) => (
                <StackCard
                  key={`${activeTab}-L-${link.id}`}
                  {...link}
                  index={i}
                  total={leftColumn.length}
                  visible={cardsVisible}
                  hoveredIndex={hoveredLeft}
                  onHover={(h) => setHoveredLeft(h ? i : null)}
                />
              ))}
            </div>
            <div className="relative w-full">
              {rightColumn.map((link, i) => (
                <StackCard
                  key={`${activeTab}-R-${link.id}`}
                  {...link}
                  index={i}
                  total={rightColumn.length}
                  visible={cardsVisible}
                  hoveredIndex={hoveredRight}
                  onHover={(h) => setHoveredRight(h ? i : null)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
