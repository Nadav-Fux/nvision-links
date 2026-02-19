import { useState, useEffect } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink, FlaskConical } from 'lucide-react';

interface PeriodicTableViewProps {
  sections: LinkSection[];
  visible: boolean;
}

interface Element {
  link: LinkItem;
  symbol: string;
  number: number;
  weight: string;
  category: string;
  section: string;
  row: number;
  col: number;
}

const PT_COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981', '#ef4444'];

/* Generate 1-3 letter symbol from link title */
const makeSymbol = (title: string): string => {
  const clean = title.replace(/[^a-zA-Z֐-׿]/g, '');
  // Try English letters first
  const eng = title.replace(/[^a-zA-Z]/g, '');
  if (eng.length >= 2) return eng[0].toUpperCase() + eng[1].toLowerCase();
  // Hebrew fallback: first two chars
  const heb = title.replace(/[^֐-׿]/g, '');
  if (heb.length >= 2) return heb.slice(0, 2);
  return title.slice(0, 2);
};

/* Fake atomic weight */
const fakeWeight = (i: number): string => {
  return (26.98 + i * 7.3 + Math.sin(i) * 12).toFixed(2);
};

/* Category names — generic pools, one per section (wraps around) */
const CATEGORY_POOLS = [
  ['תקשורת', 'עדכונים', 'דיונים', 'למידה', 'רשת'],
  ['שפה', 'תמונה', 'קוד', 'עיצוב', 'חיפוש'],
  ['מודל', 'שרת', 'וידאו', 'קול', 'תשתית', 'מדיה'],
  ['ניתוח', 'אוטומציה', 'ענן', 'ממשק', 'נתונים'],
];

/* ════ Periodic Table View ════ */
export const PeriodicTableView = ({
  sections,
  visible
}: PeriodicTableViewProps) => {
  const [revealed, setRevealed] = useState(0);
  const [selectedEl, setSelectedEl] = useState<Element | null>(null);
  const [hoveredEl, setHoveredEl] = useState<Element | null>(null);

  const allLinks = sections.flatMap((s) => s.links);

  // Build elements with grid positions — grouped by section
  const elements: Element[] = [];
  let globalNumber = 1;
  let currentRow = 0;
  const sectionStartRows: number[] = [];

  sections.forEach((section, sIdx) => {
    sectionStartRows.push(currentRow);
    const cols = Math.min(5, Math.ceil(Math.sqrt(section.links.length * 1.5)));

    section.links.forEach((link, i) => {
      const sectionIdx = i;
      const row = Math.floor(sectionIdx / cols) + currentRow;
      const col = sectionIdx % cols;
      const staggerOffset = row % 2 === 1 ? 0.5 : 0;
      const categories = CATEGORY_POOLS[sIdx % CATEGORY_POOLS.length];

      elements.push({
        link,
        symbol: makeSymbol(link.title),
        number: globalNumber++,
        weight: fakeWeight(globalNumber - 1),
        category: categories[i % categories.length],
        section: section.id,
        row,
        col: col + staggerOffset
      });
    });
    currentRow += Math.ceil(section.links.length / cols) + 1; // +1 for separator
  });

  // Reveal
  useEffect(() => {
    if (!visible) return;
    setRevealed(0);
    setSelectedEl(null);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setRevealed(i);
      if (i >= allLinks.length + 3) clearInterval(timer);
    }, 60);
    return () => clearInterval(timer);
  }, [visible, allLinks.length]);

  let lineIdx = 0;
  const show = () => lineIdx++ < revealed;

  return (
    <div data-ev-id="ev_d38bac15ea"
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      <div data-ev-id="ev_5fac6572f8"
      className="mx-auto max-w-4xl rounded-xl overflow-hidden border border-white/[0.05]"
      style={{
        background: 'linear-gradient(160deg, rgba(8,8,18,0.98) 0%, rgba(5,8,15,0.99) 100%)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
      }}>

        {/* Header */}
        <div data-ev-id="ev_b75b2be8bf" className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/[0.04]">
          <div data-ev-id="ev_99b76c6dbe" className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-cyan-400/40" />
            <span data-ev-id="ev_7e3110b918" className="text-[12px] font-bold text-white/30">
              nVision טבלה מחזורית
            </span>
          </div>
          <div data-ev-id="ev_6d83cd5bc8" className="flex items-center gap-3 text-[9px] text-white/15 font-mono flex-wrap">
            {sections.map((section, sIdx) =>
            <span data-ev-id="ev_6f712891d4" key={section.id} className="flex items-center gap-1.5">
                <span data-ev-id="ev_c31b797d01" className="w-3 h-2 rounded-sm" style={{ backgroundColor: `${PT_COLORS[sIdx % PT_COLORS.length]}40` }} />
                {section.title}
              </span>
            )}
            <span data-ev-id="ev_e78f835869">{allLinks.length} יסודות</span>
          </div>
        </div>

        <div data-ev-id="ev_5aa75c4ee6" className="p-4 sm:p-6">
          {/* Sections rendered dynamically */}
          {sections.map((section, sIdx) => {
            const color = PT_COLORS[sIdx % PT_COLORS.length];
            const sectionElements = elements.filter((el) => el.section === section.id);
            const cols = Math.min(5, Math.ceil(Math.sqrt(section.links.length * 1.5)));

            return (
              <div data-ev-id="ev_62c15f446a" key={section.id}>
                {/* Separator between sections */}
                {sIdx > 0 && show() &&
                <div data-ev-id="ev_6212453543" className="flex items-center gap-3 mb-4 animate-in fade-in duration-300">
                    <div data-ev-id="ev_37cb185805" className="flex-1 h-px bg-white/[0.03]" />
                    <div data-ev-id="ev_d104bae3b1" className="flex gap-1">
                      {Array.from({ length: 8 }).map((_, i) =>
                    <div data-ev-id="ev_81cd0eb84a" key={i} className="w-1.5 h-1.5 rounded-full bg-white/[0.04]" />
                    )}
                    </div>
                    <div data-ev-id="ev_c9befc5201" className="flex-1 h-px bg-white/[0.03]" />
                  </div>
                }

                {/* Section label */}
                {show() &&
                <div data-ev-id="ev_fb4326f7c4" className="flex items-center gap-2 mb-3 animate-in fade-in duration-300">
                    <div data-ev-id="ev_636d29e80c" className="w-1 h-3 rounded-full" style={{ backgroundColor: `${color}66` }} />
                    <span data-ev-id="ev_665ba7ec11" className="text-[10px] font-mono tracking-wider" style={{ color: `${color}59` }}>
                      {section.title.toUpperCase()} ELEMENTS
                    </span>
                    <div data-ev-id="ev_e3b5c7b047" className="flex-1 h-px" style={{ background: `${color}0d` }} />
                  </div>
                }

                {/* Element grid */}
                <div data-ev-id="ev_a1a9c2b8cc"
                className={`grid gap-2 ${sIdx < sections.length - 1 ? 'mb-6' : ''}`}
                style={{
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
                }}>

                  {sectionElements.map((el) => {
                    const s = show();
                    return s ?
                    <ElementCard
                      key={el.link.id}
                      element={el}
                      isSelected={selectedEl?.link.id === el.link.id}
                      isHovered={hoveredEl?.link.id === el.link.id}
                      onSelect={() => setSelectedEl(selectedEl?.link.id === el.link.id ? null : el)}
                      onHover={() => setHoveredEl(el)}
                      onLeave={() => setHoveredEl(null)} /> :
                    <div data-ev-id="ev_2d7cd76f2f" key={el.link.id} className="aspect-square" />;
                  })}
                </div>
              </div>);

          })}
        </div>

        {/* Detail panel */}
        {selectedEl &&
        <div data-ev-id="ev_1cb01567b8" className="px-4 sm:px-6 pb-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <ElementDetailPanel element={selectedEl} onClose={() => setSelectedEl(null)} />
          </div>
        }

        {/* Footer */}
        <div data-ev-id="ev_711e55da8a" className="flex items-center justify-center px-4 py-2.5 border-t border-white/[0.03] text-[8px] font-mono text-white/10">
          nVision Periodic Table · {allLinks.length} elements · 2 groups · © 2024
        </div>
      </div>
    </div>);

};

/* ═════ Element Card (small) ═════ */
const ElementCard = ({
  element,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onLeave
}: {element: Element;isSelected: boolean;isHovered: boolean;onSelect: () => void;onHover: () => void;onLeave: () => void;}) => {
  const { link } = element;
  const sectionColor = link.color;

  return (
    <button data-ev-id="ev_d5cee6163d"
    className="relative aspect-square rounded-lg border transition-all duration-300 group overflow-hidden text-left animate-in fade-in zoom-in-95 duration-300"
    style={{
      borderColor: isSelected ?
      `${link.color}50` :
      isHovered ?
      `${link.color}35` :
      `${sectionColor}12`,
      background: isSelected ?
      `linear-gradient(160deg, ${link.color}15, ${link.color}05)` :
      isHovered ?
      `linear-gradient(160deg, ${link.color}0a, rgba(255,255,255,0.02))` :
      `linear-gradient(160deg, ${sectionColor}06, rgba(255,255,255,0.01))`,
      boxShadow: isSelected ?
      `0 0 25px ${link.color}15, inset 0 0 20px ${link.color}05` :
      isHovered ?
      `0 4px 15px ${link.color}08` :
      'none'
    }}
    onClick={onSelect}
    onMouseEnter={onHover}
    onMouseLeave={onLeave}>

      {/* Atomic number */}
      <span data-ev-id="ev_13d3801f9f"
      className="absolute top-1.5 right-2 text-[9px] font-mono font-bold transition-colors duration-200"
      style={{ color: isHovered || isSelected ? `${link.color}80` : `${sectionColor}30` }}>

        {element.number}
      </span>

      {/* Content */}
      <div data-ev-id="ev_ef206ec5f0" className="absolute inset-0 flex flex-col items-center justify-center p-1.5">
        {/* Icon (shown on hover/select, otherwise symbol) */}
        <div data-ev-id="ev_bc11c29362"
        className="transition-all duration-300"
        style={{
          transform: isHovered || isSelected ? 'scale(1)' : 'scale(0)',
          opacity: isHovered || isSelected ? 1 : 0,
          position: 'absolute'
        }}>

          <div data-ev-id="ev_3a35510d98"
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: `${link.color}15`
          }}>

            <AnimatedIcon
              icon={link.icon}
              animation={link.animation}
              color={link.color}
              isHovered={isHovered || isSelected} />

          </div>
        </div>

        {/* Symbol */}
        <span data-ev-id="ev_a8bf54ecd8"
        className="text-[22px] sm:text-[26px] font-bold leading-none transition-all duration-300"
        style={{
          color: isHovered || isSelected ? `${link.color}` : `${sectionColor}60`,
          opacity: isHovered || isSelected ? 0 : 1,
          transform: isHovered || isSelected ? 'scale(0.5)' : 'scale(1)'
        }}>

          {element.symbol}
        </span>

        {/* Title (small) */}
        <span data-ev-id="ev_1e2e267943"
        className="text-[8px] sm:text-[9px] truncate max-w-full mt-1 font-medium transition-colors duration-200 px-1 text-center leading-tight"
        style={{
          color: isHovered || isSelected ? `${link.color}cc` : 'rgba(255,255,255,0.25)'
        }}>

          {link.title}
        </span>

        {/* Weight */}
        <span data-ev-id="ev_a3feb914bf"
        className="text-[7px] font-mono mt-0.5 transition-colors duration-200"
        style={{ color: isHovered || isSelected ? `${link.color}50` : 'rgba(255,255,255,0.1)' }}>

          {element.weight}
        </span>
      </div>

      {/* Category color bar at bottom */}
      <div data-ev-id="ev_cbf9e124dd"
      className="absolute bottom-0 left-0 right-0 h-[2px] transition-opacity duration-200"
      style={{
        background: `linear-gradient(90deg, transparent, ${link.color}${isHovered || isSelected ? '60' : '15'}, transparent)`
      }} />


      {/* Electron orbit animation on hover */}
      {(isHovered || isSelected) &&
      <div data-ev-id="ev_f6009e6ba3" className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          <div data-ev-id="ev_c0e1982e30"
        className="absolute w-3 h-3 rounded-full"
        style={{
          background: `radial-gradient(circle, ${link.color}40, transparent)`,
          animation: 'orbitTL 3s linear infinite'
        }} />

          <div data-ev-id="ev_007c6f531b"
        className="absolute w-2 h-2 rounded-full"
        style={{
          background: `radial-gradient(circle, ${link.color}30, transparent)`,
          animation: 'orbitBR 2.5s linear infinite'
        }} />

        </div>
      }

      <style data-ev-id="ev_d18d9dc2db">{`
        @keyframes orbitTL {
          0% { top: -5%; left: -5%; }
          25% { top: -5%; left: 95%; }
          50% { top: 95%; left: 95%; }
          75% { top: 95%; left: -5%; }
          100% { top: -5%; left: -5%; }
        }
        @keyframes orbitBR {
          0% { bottom: -5%; right: -5%; }
          25% { bottom: 95%; right: -5%; }
          50% { bottom: 95%; right: 95%; }
          75% { bottom: -5%; right: 95%; }
          100% { bottom: -5%; right: -5%; }
        }
      `}</style>
    </button>);

};

/* ═════ Element Detail Panel ═════ */
const ElementDetailPanel = ({
  element,
  onClose



}: {element: Element;onClose: () => void;}) => {
  const [hovered, setHovered] = useState(false);
  const { link } = element;
  const sectionColor = element.link.color;

  return (
    <div data-ev-id="ev_5d64168186"
    className="rounded-xl overflow-hidden border backdrop-blur-xl"
    style={{
      background: 'rgba(10,10,20,0.95)',
      borderColor: `${link.color}20`,
      boxShadow: `0 10px 30px rgba(0,0,0,0.4), 0 0 20px ${link.color}06`
    }}>

      <div data-ev-id="ev_41b667979e" className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${link.color}50, transparent)` }} />

      <div data-ev-id="ev_349f3ae14a" className="p-4 flex items-start gap-4">
        {/* Element "card" mini */}
        <div data-ev-id="ev_11ea22fbe0"
        className="w-20 h-24 rounded-lg border flex flex-col items-center justify-center flex-shrink-0"
        style={{
          background: `linear-gradient(160deg, ${link.color}12, ${link.color}04)`,
          borderColor: `${link.color}30`
        }}>

          <span data-ev-id="ev_cbdd8ef7f7" className="text-[9px] font-mono" style={{ color: `${link.color}60` }}>
            {element.number}
          </span>
          <div data-ev-id="ev_e7e47e02fc" className="w-8 h-8 flex items-center justify-center my-1">
            <AnimatedIcon icon={link.icon} animation={link.animation} color={link.color} isHovered />
          </div>
          <span data-ev-id="ev_8229b56b5b" className="text-[10px] font-bold" style={{ color: link.color }}>
            {element.symbol}
          </span>
          <span data-ev-id="ev_a2969f8ba2" className="text-[7px] font-mono" style={{ color: `${link.color}40` }}>
            {element.weight}
          </span>
        </div>

        {/* Info */}
        <div data-ev-id="ev_dafccbfb37" className="flex-1 min-w-0">
          <div data-ev-id="ev_360900a3ad" className="flex items-center gap-2 flex-wrap">
            <h3 data-ev-id="ev_15636b6cc6" className="text-white/90 text-[15px] font-bold">{link.title}</h3>
            <span data-ev-id="ev_706a938823"
            className="text-[8px] font-mono px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${sectionColor}12`, color: `${sectionColor}70` }}>

              {element.category}
            </span>
            <span data-ev-id="ev_eea686932e"
            className="text-[8px] px-2 py-0.5 rounded-full bg-white/[0.03] text-white/20 font-mono">

              #{element.number}
            </span>
          </div>
          <p data-ev-id="ev_b487c9857e" className="text-white/30 text-xs mt-0.5">{link.subtitle}</p>
          <p data-ev-id="ev_0fd8a8a7a4" className="text-white/45 text-xs mt-1.5 leading-relaxed">{link.description}</p>

          {/* Properties row */}
          <div data-ev-id="ev_34b01f0051" className="flex items-center gap-4 mt-3 text-[9px] font-mono text-white/20">
            <span data-ev-id="ev_6f91a9e26c">מספר אטומי: <strong data-ev-id="ev_eb64cf6e62" style={{ color: `${link.color}80` }}>{element.number}</strong></span>
            <span data-ev-id="ev_48a1c310b5">משקל: <strong data-ev-id="ev_5b172bf764" style={{ color: `${link.color}80` }}>{element.weight}</strong></span>
            <span data-ev-id="ev_13312a595d">קטגוריה: <strong data-ev-id="ev_deac55a1fc" style={{ color: `${link.color}80` }}>{element.category}</strong></span>
          </div>

          <div data-ev-id="ev_dd45b39886" className="flex items-center gap-2 mt-3">
            <a data-ev-id="ev_06b1c32b62"
            href={link.url}
            target="_blank" rel="noopener noreferrer"
            aria-label={`${link.title} (נפתח בחלון חדש)`}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            style={{
              backgroundColor: hovered ? `${link.color}25` : `${link.color}15`,
              color: `${link.color}cc`
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}>

              <ExternalLink className="w-3 h-3" />
              פתח
            </a>
            <button data-ev-id="ev_ffdb2d7dee"
            onClick={onClose}
            className="text-xs px-3 py-1.5 rounded-lg text-white/25 hover:text-white/40 hover:bg-white/[0.04] transition-colors">

              סגור
            </button>
          </div>
        </div>
      </div>
    </div>);

};