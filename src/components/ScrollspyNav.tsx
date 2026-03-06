import { useEffect, useState, useCallback } from 'react';

interface ScrollspySection {
  id: string;
  title: string;
}

interface ScrollspyNavProps {
  sections: ScrollspySection[];
  /** Show only when scrolled past the hero area */
  heroHeight?: number;
}

/**
 * Fixed vertical dot navigation on the LEFT side of the screen (RTL layout).
 * Highlights the dot for the section currently in viewport via IntersectionObserver.
 * Hidden on mobile (< 768px).
 */
export const ScrollspyNav = ({ sections, heroHeight = 300 }: ScrollspyNavProps) => {
  const [activeId, setActiveId] = useState<string>('');
  const [visible, setVisible] = useState(false);

  // Track scroll position to show/hide the nav
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > heroHeight);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [heroHeight]);

  // IntersectionObserver to detect which section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible section
        let bestEntry: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
              bestEntry = entry;
            }
          }
        }
        if (bestEntry) {
          setActiveId(bestEntry.target.id);
        }
      },
      { threshold: [0.1, 0.3, 0.5], rootMargin: '-10% 0px -40% 0px' }
    );

    // Observe all section elements
    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  const handleClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <nav
      aria-label="ניווט מהיר בין קטגוריות"
      className={`fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-3 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {sections.map((section) => {
        const isActive = activeId === section.id;
        return (
          <button
            key={section.id}
            onClick={() => handleClick(section.id)}
            aria-label={`גלול אל ${section.title}`}
            aria-current={isActive ? 'true' : undefined}
            className="group relative flex items-center"
          >
            {/* Tooltip — appears on hover to the right (since nav is on the left) */}
            <span className="absolute left-full mr-3 ml-3 px-2.5 py-1 rounded-md text-xs text-white/80 bg-white/10 backdrop-blur-md border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {section.title}
            </span>
            {/* Dot */}
            <span
              className={`rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-3 h-3 bg-primary shadow-[0_0_8px_2px_rgba(6,182,212,0.4)]'
                  : 'w-2 h-2 bg-white/25 hover:bg-white/40'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
};
