import { useState, useEffect } from 'react';
import { LinkCard } from '@/components/LinkCard';
import type { LinkSection } from '@/data/links';
import type { SectionWithLinks } from '@/lib/usePublicData';

interface TabsViewProps {
  sections: (LinkSection | SectionWithLinks)[];
  visible: boolean;
}

export const TabsView = ({ sections, visible }: TabsViewProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabVisible, setTabVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      const t1 = setTimeout(() => setHeaderVisible(true), 100);
      const t2 = setTimeout(() => setTabVisible(true), 300);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else {
      setHeaderVisible(false);
      setTabVisible(false);
    }
  }, [visible]);

  // Reset animation when switching tabs
  useEffect(() => {
    setTabVisible(false);
    const t = setTimeout(() => setTabVisible(true), 50);
    return () => clearTimeout(t);
  }, [activeTab]);

  const currentSection = sections[activeTab];
  if (!currentSection) return null;

  const links = currentSection.links || [];
  const emoji = 'emoji' in currentSection ? currentSection.emoji : '';

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pt-4" dir="rtl">
      {/* Tab bar */}
      <div
        className={`flex gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-hide transition-all duration-500 ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        {sections.map((section, i) => {
          const isActive = i === activeTab;
          const sectionEmoji = 'emoji' in section ? section.emoji : '';
          return (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
                isActive
                  ? 'bg-primary/20 border-primary/40 text-white shadow-lg shadow-primary/10'
                  : 'bg-white/[0.04] border-white/[0.08] text-white/60 hover:bg-white/[0.08] hover:text-white/80'
              }`}
            >
              <span className="ml-1.5">{sectionEmoji}</span>
              {section.title}
            </button>
          );
        })}
      </div>

      {/* Section header */}
      <div
        className={`text-center mb-6 transition-all duration-500 ${
          tabVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <span className="text-3xl">{emoji}</span>
        <h2 className="text-xl font-bold text-white mt-1">{currentSection.title}</h2>
        <p className="text-white/40 text-sm mt-1">{links.length} כלים</p>
      </div>

      {/* Links grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pb-8">
        {links.length > 0 && (
          <div className="col-span-1 sm:col-span-2">
            <LinkCard
              key={links[0].id as string}
              {...links[0]}
              delay={0}
              visible={tabVisible}
              featured
              direction="right"
            />
          </div>
        )}
        <div className="flex flex-col gap-3">
          {links.slice(1).filter((_, i) => i % 2 === 0).map((link, i) => (
            <LinkCard
              key={link.id as string}
              {...link}
              delay={(i + 1) * 60}
              visible={tabVisible}
              direction="right"
            />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {links.slice(1).filter((_, i) => i % 2 === 1).map((link, i) => (
            <LinkCard
              key={link.id as string}
              {...link}
              delay={(i + 1) * 60 + 30}
              visible={tabVisible}
              direction="left"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
