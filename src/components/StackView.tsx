import { useState, useEffect } from 'react';
import { StackCard } from '@/components/StackCard';
import { SectionDivider } from '@/components/SectionDivider';
import type { LinkSection } from '@/data/links';

interface StackGroupProps {
  links: LinkSection['links'];
  visible: boolean;
}

const StackGroup = ({ links, visible }: StackGroupProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div data-ev-id="ev_9aac51e575" className="relative w-full max-w-lg mx-auto px-2">
      {links.map((link, i) =>
      <StackCard
        key={link.id}
        {...link}
        index={i}
        total={links.length}
        visible={visible}
        hoveredIndex={hoveredIndex}
        onHover={(h) => setHoveredIndex(h ? i : null)} />

      )}
    </div>);

};

interface StackViewProps {
  sections: LinkSection[];
  visible: boolean;
}

export const StackView = ({ sections, visible }: StackViewProps) => {
  const [showSection, setShowSection] = useState<boolean[]>([]);

  useEffect(() => {
    if (visible) {
      const timers = sections.map((_, i) =>
      setTimeout(() => setShowSection((prev) => {
        const next = [...prev];
        next[i] = true;
        return next;
      }), 200 + i * 300)
      );
      return () => timers.forEach(clearTimeout);
    } else {
      setShowSection([]);
    }
  }, [visible, sections.length]);

  return (
    <div data-ev-id="ev_0719396440" className="space-y-14">
      {sections.map((section, sIdx) =>
      <section data-ev-id="ev_5d606d9ebe" key={section.id}>
          <SectionDivider
          title={section.title}
          emoji={section.emoji}
          visible={!!showSection[sIdx]}
          delay={0} />

          <div data-ev-id="ev_888d460514" className="mt-6">
            <StackGroup links={section.links} visible={!!showSection[sIdx]} />
          </div>
        </section>
      )}
    </div>);

};