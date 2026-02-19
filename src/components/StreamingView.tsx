import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { Play, Plus, ThumbsUp, ChevronLeft, ChevronRight, Star, Info, Volume2, VolumeX } from 'lucide-react';

interface StreamingViewProps {
  sections: LinkSection[];
  visible: boolean;
}

/* colour for each section row */
const ROW_ACCENTS = ['#e50914', '#e87c03', '#46d369', '#6d6aee', '#e50914', '#2ebdbb'];

/* ══════════════════════════════════════════════
 *  Streaming / Netflix View
 * ══════════════════════════════════════════════ */
export const StreamingView = ({ sections, visible }: StreamingViewProps) => {
  const [heroLink, setHeroLink] = useState<{link: LinkItem;sectionIdx: number;} | null>(null);
  const [myList, setMyList] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);
  const [revealed, setRevealed] = useState(false);

  // Pick a random hero link on mount
  useEffect(() => {
    const allLinks = sections.flatMap((s, sIdx) => s.links.map((l) => ({ link: l, sectionIdx: sIdx })));
    if (allLinks.length > 0) {
      setHeroLink(allLinks[Math.floor(Math.random() * allLinks.length)]);
    }
  }, [sections]);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setRevealed(true), 200);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const toggleMyList = useCallback((id: string) => {
    setMyList((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);else next.add(id);
      return next;
    });
  }, []);

  // Generate a fake "match %" and rating from link id hash
  const fakeMatch = (id: string) => 85 + (id.charCodeAt(0) + id.charCodeAt(id.length - 1)) % 14;
  const fakeRating = (id: string) => (3.5 + (id.charCodeAt(1) || 0) % 15 / 10).toFixed(1);
  const fakeYear = (id: string) => 2020 + id.charCodeAt(0) % 5;

  return (
    <div data-ev-id="ev_ba3f1a52e8"
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      <div data-ev-id="ev_9d929ec534"
      className="mx-auto max-w-5xl rounded-xl overflow-hidden border border-white/[0.04]"
      style={{
        background: '#141414',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)'
      }}>

        {/* ─── Hero Banner ─── */}
        {heroLink &&
        <div data-ev-id="ev_5d499494a5" className="relative h-[320px] sm:h-[380px] overflow-hidden">
            {/* Gradient background as "poster" */}
            <div data-ev-id="ev_bb43dd7512"
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${heroLink.link.color}30 0%, #141414 60%, ${heroLink.link.color}10 100%)`
          }} />

            {/* Large icon as hero visual */}
            <div data-ev-id="ev_422be43e8e" className="absolute top-1/2 right-12 -translate-y-1/2 opacity-[0.06]">
              <AnimatedIcon icon={heroLink.link.icon} animation={heroLink.link.animation} color="#fff" size={220} />
            </div>
            {/* Bottom fade */}
            <div data-ev-id="ev_e6d5aef22a" className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#141414] to-transparent" />
            {/* Vignette sides */}
            <div data-ev-id="ev_e42de06d38" className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent opacity-60" />

            {/* Hero content */}
            <div data-ev-id="ev_9fcb989b39" className="absolute bottom-8 left-6 right-6 z-10">
              {/* Tag line */}
              <div data-ev-id="ev_b7d088055c" className="flex items-center gap-2 mb-2">
                <span data-ev-id="ev_64bc7e4f0f" className="text-red-500 font-bold text-sm tracking-wider">N</span>
                <span data-ev-id="ev_8ac1f2c87c" className="text-white/50 text-[11px] font-medium tracking-widest uppercase">סדרה מומלצת</span>
              </div>

              <h2 data-ev-id="ev_a090e4a74d" className="text-white text-2xl sm:text-3xl font-bold mb-2 leading-tight">
                {heroLink.link.title}
              </h2>
              <p data-ev-id="ev_b12b77096a" className="text-white/60 text-sm sm:text-base max-w-md mb-4 leading-relaxed line-clamp-2">
                {heroLink.link.description || heroLink.link.subtitle}
              </p>

              <div data-ev-id="ev_6cc6880a9e" className="flex items-center gap-3">
                <a data-ev-id="ev_a1d2c262c6"
              href={heroLink.link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${heroLink.link.title} — הפעל (נפתח בחלון חדש)`}
              className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded font-bold text-sm hover:bg-white/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

                  <Play className="w-5 h-5 fill-black" />
                  הפעל
                </a>
                <button data-ev-id="ev_eb607e82d2"
              onClick={() => toggleMyList(heroLink.link.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded font-semibold text-sm transition-colors ${
              myList.has(heroLink.link.id) ?
              'bg-white/20 text-white' :
              'bg-white/[0.08] text-white/80 hover:bg-white/[0.15]'}`
              }>

                  <Plus className={`w-4 h-4 transition-transform ${myList.has(heroLink.link.id) ? 'rotate-45' : ''}`} />
                  {myList.has(heroLink.link.id) ? 'ברשימה' : 'הרשימה שלי'}
                </button>
                <button data-ev-id="ev_f4a2616d4f"
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
              onClick={() => setMuted(!muted)}>

                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Meta badges */}
              <div data-ev-id="ev_8329c68831" className="flex items-center gap-3 mt-3 text-[11px]">
                <span data-ev-id="ev_b2656c1215" className="text-green-400 font-bold">{fakeMatch(heroLink.link.id)}% התאמה</span>
                <span data-ev-id="ev_5ec67cc2b0" className="text-white/40">{fakeYear(heroLink.link.id)}</span>
                <span data-ev-id="ev_ad810e547c" className="px-1.5 py-0.5 border border-white/20 rounded text-white/50 text-[10px]">HD</span>
                <span data-ev-id="ev_6a38ecc623" className="flex items-center gap-0.5 text-white/40">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  {fakeRating(heroLink.link.id)}
                </span>
              </div>
            </div>

            {/* Top gradient for "nav bar" feel */}
            <div data-ev-id="ev_73703be2bc" className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#141414]/80 to-transparent" />
          </div>
        }

        {/* ─── Content Rows ─── */}
        <div data-ev-id="ev_183157fd1a" className="px-4 sm:px-6 pb-6 -mt-4 relative z-10 space-y-6">
          {sections.map((section, sIdx) =>
          <SectionRow
            key={section.id}
            section={section}
            sIdx={sIdx}
            revealed={revealed}
            delay={sIdx * 150}
            myList={myList}
            toggleMyList={toggleMyList}
            hoveredCard={hoveredCard}
            setHoveredCard={setHoveredCard}
            onHeroChange={(link) => setHeroLink({ link, sectionIdx: sIdx })}
            fakeMatch={fakeMatch}
            fakeRating={fakeRating}
            fakeYear={fakeYear} />

          )}
        </div>

        {/* Footer */}
        <div data-ev-id="ev_a590ef8a1e" className="px-6 py-3 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-white/20 font-mono">
          <span data-ev-id="ev_6224c06c1b">nVision Streaming © {new Date().getFullYear()}</span>
          <span data-ev-id="ev_cc1913e1dd">{sections.reduce((a, s) => a + s.links.length, 0)} titles available</span>
        </div>
      </div>
    </div>);

};

/* ─── Horizontal Scroll Row ─── */
interface SectionRowProps {
  section: LinkSection;
  sIdx: number;
  revealed: boolean;
  delay: number;
  myList: Set<string>;
  toggleMyList: (id: string) => void;
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
  onHeroChange: (link: LinkItem) => void;
  fakeMatch: (id: string) => number;
  fakeRating: (id: string) => string;
  fakeYear: (id: string) => number;
}

const SectionRow = ({
  section, sIdx, revealed, delay, myList, toggleMyList,
  hoveredCard, setHoveredCard, onHeroChange,
  fakeMatch, fakeRating, fakeYear
}: SectionRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (revealed) {
      const t = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(t);
    }
  }, [revealed, delay]);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 10);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows, { passive: true });
    updateArrows();
    return () => el.removeEventListener('scroll', updateArrows);
  }, [updateArrows]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  return (
    <div data-ev-id="ev_32e5fdd516"
    className={`transition-[opacity,transform] duration-700 ${
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`
    }>

      {/* Row title */}
      <div data-ev-id="ev_33e6c115ce" className="flex items-center gap-2 mb-2.5">
        <span data-ev-id="ev_46a9867b41" className="text-lg">{section.emoji}</span>
        <h3 data-ev-id="ev_263852a8fd" className="text-white font-bold text-base sm:text-lg">{section.title}</h3>
        <ChevronLeft className="w-4 h-4 text-white/30 mr-auto rotate-180" />
      </div>

      {/* Scroll container */}
      <div data-ev-id="ev_8b60714dfe" className="relative group">
        {/* Left arrow */}
        {showLeft &&
        <button data-ev-id="ev_76333dbd2c"
        onClick={() => scroll('left')}
        className="absolute left-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-r from-[#141414] to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">

            <ChevronRight className="w-6 h-6 text-white rotate-180" />
          </button>
        }

        {/* Right arrow */}
        {showRight &&
        <button data-ev-id="ev_545c5c34b2"
        onClick={() => scroll('right')}
        className="absolute right-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-l from-[#141414] to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">

            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        }

        <div data-ev-id="ev_b26fb31d82"
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style={{ WebkitOverflowScrolling: 'touch' }}>

          {section.links.map((link, lIdx) =>
          <PosterCard
            key={link.id}
            link={link}
            sIdx={sIdx}
            lIdx={lIdx}
            isHovered={hoveredCard === link.id}
            inMyList={myList.has(link.id)}
            onHover={setHoveredCard}
            onToggleList={toggleMyList}
            onSetHero={onHeroChange}
            fakeMatch={fakeMatch}
            fakeRating={fakeRating}
            fakeYear={fakeYear} />

          )}
        </div>
      </div>
    </div>);

};

/* ─── Poster Card ─── */
interface PosterCardProps {
  link: LinkItem;
  sIdx: number;
  lIdx: number;
  isHovered: boolean;
  inMyList: boolean;
  onHover: (id: string | null) => void;
  onToggleList: (id: string) => void;
  onSetHero: (link: LinkItem) => void;
  fakeMatch: (id: string) => number;
  fakeRating: (id: string) => string;
  fakeYear: (id: string) => number;
}

const PosterCard = ({
  link, sIdx, lIdx, isHovered, inMyList,
  onHover, onToggleList, onSetHero,
  fakeMatch, fakeRating, fakeYear
}: PosterCardProps) => {
  const isTop10 = lIdx < 3;

  return (
    <div data-ev-id="ev_d71a138c5f"
    className="relative flex-shrink-0 group/card"
    style={{ width: 160 }}
    onMouseEnter={() => onHover(link.id)}
    onMouseLeave={() => onHover(null)}>

      {/* Main card */}
      <div data-ev-id="ev_8352e1d58c"
      className={`relative rounded-md overflow-hidden transition-all duration-300 ${
      isHovered ? 'scale-110 z-20 shadow-2xl' : 'scale-100 z-0'}`
      }
      style={{
        aspectRatio: '2/3'
      }}>

        {/* Poster background */}
        <div data-ev-id="ev_48910405fa"
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, ${link.color}35 0%, #1a1a2e 50%, ${link.color}15 100%)`
        }} />


        {/* Icon watermark */}
        <div data-ev-id="ev_d59bd23b75" className="absolute inset-0 flex items-center justify-center opacity-[0.12]">
          <AnimatedIcon icon={link.icon} animation={link.animation} color="#fff" size={64} />
        </div>

        {/* Top 10 badge */}
        {isTop10 &&
        <div data-ev-id="ev_481796b591" className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
            TOP 10
          </div>
        }

        {/* Tag badge */}
        {link.tag &&
        <div data-ev-id="ev_cd55a537fc" className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white/80">
            {link.tag === 'free' ? 'חינם' : link.tag === 'freemium' ? 'Freemium' : 'מבצע'}
          </div>
        }

        {/* Bottom info overlay */}
        <div data-ev-id="ev_389a8f322f" className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <div data-ev-id="ev_31e1ed6ecc" className="flex items-center gap-1.5 mb-1">
            <AnimatedIcon icon={link.icon} animation={link.animation} color={link.color} size={12} />
            <span data-ev-id="ev_e23b40edf4" className="text-white text-[11px] font-bold truncate leading-tight">{link.title}</span>
          </div>
          <p data-ev-id="ev_40261c8176" className="text-white/50 text-[9px] line-clamp-1">{link.subtitle}</p>
        </div>

        {/* Hover overlay */}
        {isHovered &&
        <div data-ev-id="ev_3232caca8d" className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <a data-ev-id="ev_638d942a0d"
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${link.title} — הפעל (נפתח בחלון חדש)`}
          className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

              <Play className="w-6 h-6 text-black fill-black ml-0.5" />
            </a>
          </div>
        }
      </div>

      {/* Expanded detail card on hover */}
      {isHovered &&
      <div data-ev-id="ev_7f464d750f"
      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 rounded-b-lg overflow-hidden z-30 shadow-2xl"
      style={{ background: '#1a1a2e' }}>

          <div data-ev-id="ev_fed4030ee0" className="p-3">
            {/* Action buttons */}
            <div data-ev-id="ev_00ba77c0b8" className="flex items-center gap-2 mb-2.5">
              <a data-ev-id="ev_5ecf5d4d32"
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${link.title} — הפעל (נפתח בחלון חדש)`}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

                <Play className="w-4 h-4 text-black fill-black ml-0.5" />
              </a>
              <button data-ev-id="ev_98f59f6478"
            onClick={(e) => {e.stopPropagation();onToggleList(link.id);}}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
            inMyList ?
            'border-white/40 bg-white/10 text-white' :
            'border-white/20 text-white/50 hover:border-white/40 hover:text-white'}`
            }>

                <Plus className={`w-4 h-4 ${inMyList ? 'rotate-45' : ''}`} />
              </button>
              <button data-ev-id="ev_cce04e88ae"
            className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-white/40 hover:text-white transition-colors">

                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button data-ev-id="ev_323b353f0f"
            onClick={() => onSetHero(link)}
            className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-white/40 hover:text-white transition-colors mr-auto">

                <Info className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Meta */}
            <div data-ev-id="ev_54e59d4ead" className="flex items-center gap-2 mb-1.5 text-[10px]">
              <span data-ev-id="ev_af1c427c97" className="text-green-400 font-bold">{fakeMatch(link.id)}% התאמה</span>
              <span data-ev-id="ev_b1380bf90b" className="px-1 py-0.5 border border-white/15 rounded text-white/40 text-[9px]">HD</span>
              <span data-ev-id="ev_f1a93d708d" className="text-white/30">{fakeYear(link.id)}</span>
            </div>

            {/* Description */}
            <p data-ev-id="ev_fe81ebd175" className="text-white/50 text-[10px] leading-relaxed line-clamp-2 mb-2">
              {link.description || link.subtitle}
            </p>

            {/* Rating */}
            <div data-ev-id="ev_5db4f70a4c" className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span data-ev-id="ev_da3e550bac" className="text-white/60 text-[10px]">{fakeRating(link.id)}</span>
              <span data-ev-id="ev_5297d353cf" className="text-white/20 text-[10px] mx-1">•</span>
              <span data-ev-id="ev_017ec65823"
            className="text-[9px] px-1.5 py-0.5 rounded"
            style={{ background: link.color + '20', color: link.color }}>

                {link.tag === 'free' ? 'חינם' : link.tag === 'deal' ? 'מבצע' : 'AI'}
              </span>
            </div>
          </div>
        </div>
      }
    </div>);

};

export default StreamingView;