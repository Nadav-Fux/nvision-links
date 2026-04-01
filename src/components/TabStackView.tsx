import { useState, useEffect, useRef, useCallback } from 'react';
import { LinkCard } from '@/components/LinkCard';
import type { LinkSection } from '@/data/links';
import type { SectionWithLinks } from '@/lib/usePublicData';

interface TabStackViewProps {
  sections: (LinkSection | SectionWithLinks)[];
  visible: boolean;
}

export const TabStackView = ({ sections, visible }: TabStackViewProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [tabsFloating, setTabsFloating] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabsAnchorRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  // Entrance animation
  useEffect(() => {
    if (visible) {
      const t1 = setTimeout(() => setHeaderVisible(true), 100);
      const t2 = setTimeout(() => setCardsVisible(true), 350);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    setHeaderVisible(false);
    setCardsVisible(false);
  }, [visible]);

  // Tab switch animation
  const switchTab = useCallback((i: number) => {
    if (i === activeTab) return;
    setCardsVisible(false);
    setTimeout(() => {
      setActiveTab(i);
      setTimeout(() => setCardsVisible(true), 50);
    }, 250);
  }, [activeTab]);

  // Floating tabs on scroll (mobile Telegram-style)
  useEffect(() => {
    const handleScroll = () => {
      if (!tabsAnchorRef.current) return;
      const anchorTop = tabsAnchorRef.current.getBoundingClientRect().top;
      const scrollingDown = window.scrollY > lastScrollY.current;
      lastScrollY.current = window.scrollY;

      if (anchorTop < 0 && scrollingDown) {
        setTabsFloating(true);
      } else if (anchorTop >= 0) {
        setTabsFloating(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentSection = sections[activeTab];
  if (!currentSection) return null;
  const links = currentSection.links || [];

  // Stack offsets — each "layer" of the grid gets slight rotation + offset
  const stackLayers = [
    { rotate: -1.2, x: -6, y: 0 },
    { rotate: 0.4, x: 3, y: 0 },
    { rotate: -0.3, x: -2, y: 0 },
    { rotate: 0.8, x: 4, y: 0 },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 pt-4" dir="rtl">
      {/* Tab anchor (for scroll detection) */}
      <div ref={tabsAnchorRef} />

      {/* Tabs — desktop: fixed top bar, mobile: floating */}
      <div
        ref={tabsRef}
        className={`
          flex gap-2 justify-center pb-4 mb-2 z-50
          transition-all duration-500
          ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}
          ${tabsFloating
            ? 'fixed top-0 left-0 right-0 bg-[#0a0a14]/90 backdrop-blur-xl py-3 px-4 shadow-2xl shadow-black/50 border-b border-white/[0.06]'
            : ''
          }
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
                relative px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium
                transition-all duration-300 border overflow-hidden
                ${isActive
                  ? 'bg-primary/20 border-primary/40 text-white scale-105 shadow-lg shadow-primary/20'
                  : 'bg-white/[0.03] border-white/[0.06] text-white/50 hover:bg-white/[0.06] hover:text-white/70 hover:scale-[1.02]'
                }
              `}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
              )}
              <span className="relative">
                <span className="ml-1">{emoji}</span>
                <span className="hidden sm:inline">{section.title}</span>
                <span className="sm:hidden">{section.title.split(' ')[0]}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Floating tabs spacer */}
      {tabsFloating && <div className="h-16" />}

      {/* Stacked grid container */}
      <div className="relative perspective-[1200px] mt-4">
        {/* Background stack shadows (visual depth) */}
        <div
          className={`absolute inset-0 transition-all duration-700 ${
            cardsVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {[1, 2].map(layer => (
            <div
              key={layer}
              className="absolute inset-0 rounded-3xl border border-white/[0.03] bg-white/[0.01]"
              style={{
                transform: `rotate(${layer * 1.5}deg) translateX(${layer * 8}px) translateY(${layer * 4}px)`,
                zIndex: -layer,
                opacity: 0.4 - layer * 0.15,
              }}
            />
          ))}
        </div>

        {/* Main content card */}
        <div
          className={`
            relative rounded-3xl border border-white/[0.08] bg-white/[0.02]
            p-4 sm:p-6 transition-all duration-500
            ${cardsVisible
              ? 'opacity-100 translate-y-0 rotate-0'
              : 'opacity-0 translate-y-4 rotate-[0.5deg]'
            }
          `}
          style={{
            transform: cardsVisible
              ? `rotate(${stackLayers[activeTab % stackLayers.length].rotate}deg) translateX(${stackLayers[activeTab % stackLayers.length].x}px)`
              : 'rotate(2deg) translateY(20px)',
            transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Section title inside card */}
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
                  key={`${activeTab}-${links[0].id}`}
                  {...links[0]}
                  delay={0}
                  visible={cardsVisible}
                  featured
                  direction="right"
                />
              </div>
            )}
            <div className="flex flex-col gap-3">
              {links.slice(1).filter((_, i) => i % 2 === 0).map((link, i) => (
                <LinkCard
                  key={`${activeTab}-${link.id}`}
                  {...link}
                  delay={(i + 1) * 50}
                  visible={cardsVisible}
                  direction="right"
                />
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {links.slice(1).filter((_, i) => i % 2 === 1).map((link, i) => (
                <LinkCard
                  key={`${activeTab}-${link.id}`}
                  {...link}
                  delay={(i + 1) * 50 + 25}
                  visible={cardsVisible}
                  direction="left"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
