import { useState, useEffect } from 'react';
import { StackCard } from '@/components/StackCard';
import { getSectionIcon } from '@/lib/sectionIcons';
import type { LinkSection } from '@/data/links';
import type { SectionWithLinks } from '@/lib/usePublicData';

interface TabStackViewProps {
  sections: (LinkSection | SectionWithLinks)[];
  visible: boolean;
}

/** Stack column with accordion hover — exactly like StackView */
const StackColumn = ({ links, visible }: { links: LinkSection['links']; visible: boolean }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="relative w-full">
      {links.map((link, i) => (
        <StackCard
          key={link.id}
          {...link}
          index={i}
          total={links.length}
          visible={visible}
          hoveredIndex={hoveredIndex}
          onHover={(h) => setHoveredIndex(h ? i : null)}
        />
      ))}
    </div>
  );
};

export const TabStackView = ({ sections, visible }: TabStackViewProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);

  // Entrance
  useEffect(() => {
    if (visible) {
      const t1 = setTimeout(() => setHeaderVisible(true), 100);
      const t2 = setTimeout(() => setCardsVisible(true), 300);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    setHeaderVisible(false);
    setCardsVisible(false);
  }, [visible]);

  // Tab switch — fade out, switch, fade in
  useEffect(() => {
    setCardsVisible(false);
    const t = setTimeout(() => setCardsVisible(true), 150);
    return () => clearTimeout(t);
  }, [activeTab]);

  const currentSection = sections[activeTab];
  if (!currentSection) return null;

  const links = currentSection.links || [];
  const leftColumn = links.filter((_, i) => i % 2 === 0);
  const rightColumn = links.filter((_, i) => i % 2 === 1);

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pt-4" dir="rtl">
      {/* Centered tab bar — same as TabsView */}
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
              onClick={() => setActiveTab(i)}
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

      {/* Two-column stacks with accordion hover */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto pb-8">
        <StackColumn links={leftColumn} visible={cardsVisible} />
        <StackColumn links={rightColumn} visible={cardsVisible} />
      </div>
    </div>
  );
};
