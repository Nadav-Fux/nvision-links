import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import { ExternalLink, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { SectionDivider } from '@/components/SectionDivider';
import type { LinkItem, LinkSection } from '@/data/links';

interface CarouselViewProps {
  sections: LinkSection[];
  visible: boolean;
}

/* Section accent colors by index for visual variety */
const SECTION_ACCENTS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981', '#ef4444'];

/* ═══════════ Main Carousel View — N sections ═══════════ */
export const CarouselView = ({
  sections,
  visible
}: CarouselViewProps) => {
  return (
    <div data-ev-id="ev_06f272f01e"
    className={`transition-[opacity,transform] duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

      {sections.map((section, sIdx) =>
      <div data-ev-id="ev_145031a843" key={section.id}>
          {sIdx > 0 && <div data-ev-id="ev_17b0f09d8f" className="mt-14" />}
          <section data-ev-id="ev_319e4f2846" aria-label={section.title}>
            <SectionDivider title={section.title} emoji={section.emoji} visible={visible} delay={200 + sIdx * 200} />
            <SingleCarousel links={section.links} accentColor={SECTION_ACCENTS[sIdx % SECTION_ACCENTS.length]} />
          </section>
        </div>
      )}
    </div>);

};

/* ═══════════ Single Carousel Section ═══════════ */
interface SingleCarouselProps {
  links: LinkItem[];
  accentColor: string;
}

const SingleCarousel = ({ links, accentColor }: SingleCarouselProps) => {
  const total = links.length;
  const [active, setActive] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchRef = useRef({ x: 0, t: 0 });
  const autoRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  const activeLink = links[active];

  const goTo = useCallback(
    (idx: number) => setActive((idx % total + total) % total),
    [total]
  );
  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  const interact = useCallback(() => {
    setIsInteracting(true);
    clearTimeout(autoRef.current);
    const t = setTimeout(() => setIsInteracting(false), 7000);
    return () => clearTimeout(t);
  }, []);

  /* auto-advance */
  useEffect(() => {
    if (isInteracting || total === 0) return;
    autoRef.current = setTimeout(next, 4200);
    return () => clearTimeout(autoRef.current);
  }, [active, isInteracting, next, total]);

  /* pointer drag for swipe */
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    touchRef.current = { x: e.clientX, t: Date.now() };
    setIsDragging(true);
    setDragX(0);
    interact();
  }, [interact]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    setDragX(e.clientX - touchRef.current.x);
  }, [isDragging]);

  const onPointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const dt = Date.now() - touchRef.current.t;
    const vel = Math.abs(dragX) / Math.max(dt, 1) * 1000;
    if (Math.abs(dragX) > 50 || vel > 350) {
      dragX < 0 ? next() : prev();
    }
    setDragX(0);
  }, [isDragging, dragX, next, prev]);

  /* wheel */
  const wheelLock = useRef(false);
  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (wheelLock.current) return;
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(d) > 25) {
        wheelLock.current = true;
        d > 0 ? next() : prev();
        interact();
        setTimeout(() => wheelLock.current = false, 400);
      }
    },
    [next, prev, interact]
  );

  if (total === 0) return null;

  return (
    <div data-ev-id="ev_f2e5b81f75" role="group" aria-roledescription="קרוסלה" aria-label={`${total} פריטים`}>
      {/* Screen reader announcement for slide changes */}
      <div data-ev-id="ev_7055c08eaa" className="sr-only" aria-live="polite" aria-atomic="true">
        {activeLink ? `פריט ${active + 1} מתוך ${total}: ${activeLink.title}` : ''}
      </div>

      {/* ─── 3D Stage ─── */}
      <div data-ev-id="ev_7055c08eaa"
      ref={containerRef}
      className="relative mx-auto select-none touch-none overflow-hidden"
      style={{ perspective: '900px', height: '300px' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onWheel={onWheel}>

        {/* Background glow */}
        <div data-ev-id="ev_46c829e4e7"
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse 50% 70% at 50% 55%, ${activeLink?.color}0a, transparent 70%)`
        }} />


        {/* Edge fades */}
        <div data-ev-id="ev_01672c3b35"
        className="absolute inset-y-0 left-0 w-12 sm:w-20 z-30 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(10,10,20,0.98), transparent)' }} />

        <div data-ev-id="ev_05cdf381b3"
        className="absolute inset-y-0 right-0 w-12 sm:w-20 z-30 pointer-events-none"
        style={{ background: 'linear-gradient(to left, rgba(10,10,20,0.98), transparent)' }} />


        {/* Floor reflection */}
        <div data-ev-id="ev_1aa63d9880"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[320px] h-8 rounded-full pointer-events-none z-20"
        style={{
          background: `radial-gradient(ellipse, ${activeLink?.color}0a, transparent 70%)`,
          filter: 'blur(6px)'
        }} />


        {/* Cards */}
        <div data-ev-id="ev_262ce9f361" className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          {links.map((link, i) => {
            let offset = i - active;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;
            if (Math.abs(offset) > 1) return null;

            return (
              <CoverCard
                key={link.id}
                link={link}
                offset={offset}
                dragX={offset === 0 ? dragX : 0}
                isDragging={offset === 0 && isDragging}
                onClick={() => {goTo(i);interact();}} />);


          })}
        </div>
      </div>

      {/* Navigation */}
      <div data-ev-id="ev_4322971de9" className="flex items-center justify-center gap-5 mt-6">
        <button data-ev-id="ev_9f6f7578f7"
        onClick={() => {prev();interact();}}
        aria-label="הקודם"
        className="group w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 hover:border-white/25 transition-all hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Dots */}
        <div data-ev-id="ev_4836751290" className="flex items-center gap-1 px-3 py-2 rounded-full bg-white/[0.02] border border-white/[0.04]" role="tablist" aria-label="בחירת קישור">
          {links.map((_, i) => {
            const isAct = i === active;
            const near = Math.abs(i - active) <= 1;
            return (
              <button data-ev-id="ev_0a56d85314"
              key={i}
              onClick={() => {goTo(i);interact();}}
              role="tab"
              aria-selected={isAct}
              aria-label={`קישור ${i + 1}`}
              className="rounded-full transition-all duration-500 p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              style={{
                width: isAct ? 18 : near ? 6 : 4,
                height: isAct ? 6 : near ? 5 : 4,
                backgroundColor: isAct ? accentColor : `rgba(255,255,255,${near ? 0.15 : 0.06})`,
                boxShadow: isAct ? `0 0 10px ${accentColor}80` : 'none'
              }} />);


          })}
        </div>

        <button data-ev-id="ev_9b7f135a37"
        onClick={() => {next();interact();}}
        aria-label="הבא"
        className="group w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 hover:border-white/25 transition-all hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Active card label */}
      <div data-ev-id="ev_fe337bb1c9" className="flex items-center justify-center gap-3 mt-3">
        <span data-ev-id="ev_68a668d2ba" className="text-white/12 text-xs font-mono">
          {active + 1} / {total}
        </span>
        <Sparkles className="w-3 h-3 text-white/10" aria-hidden="true" />
        <span data-ev-id="ev_23d072a126"
        className="text-xs font-medium transition-colors duration-500"
        style={{ color: `${activeLink?.color}50` }}>

          {activeLink?.title}
        </span>
      </div>
    </div>);

};

/* ═══════════ Cover-Flow Card ═══════════ */
const CoverCard = ({
  link,
  offset,
  dragX,
  isDragging,
  onClick






}: {link: LinkItem;offset: number;dragX: number;isDragging: boolean;onClick: () => void;}) => {
  const isActive = offset === 0;
  const sign = Math.sign(offset) || 1;

  let tx: number, tz: number, ry: number, sc: number, op: number;

  if (isActive) {
    tx = dragX;
    tz = 60;
    ry = dragX * -0.08;
    sc = 1;
    op = 1;
  } else {
    tx = sign * 280;
    tz = -60;
    ry = sign * -65;
    sc = 0.82;
    op = 0.65;
  }

  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouse = (e: React.MouseEvent) => {
    if (!cardRef.current || !isActive) return;
    const r = cardRef.current.getBoundingClientRect();
    setMousePos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  };

  return (
    <div data-ev-id="ev_1de6c7dc0e"
    ref={cardRef}
    onClick={onClick}
    onMouseMove={handleMouse}
    onMouseLeave={() => setMousePos({ x: 0.5, y: 0.5 })}
    className="absolute top-1/2 left-1/2"
    style={{
      width: isActive ? 340 : 280,
      transform: [
      'translate(-50%, -50%)',
      `translateX(${tx}px)`,
      `translateZ(${tz}px)`,
      `rotateY(${ry}deg)`,
      `scale(${sc})`].
      join(' '),
      opacity: op,
      zIndex: isActive ? 30 : 10,
      transition: isDragging ?
      'opacity 0.2s, width 0.2s' :
      'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
      cursor: isActive ? isDragging ? 'grabbing' : 'grab' : 'pointer',
      transformOrigin: isActive ?
      'center center' :
      offset < 0 ?
      'right center' :
      'left center'
    }}>

      <a data-ev-id="ev_163ce75fa8"
      href={link.url}
      target="_blank" rel="noopener noreferrer"
      aria-label={`${link.title} — ${link.subtitle} (נפתח בחלון חדש)`}
      onClick={(e) => {
        if (!isActive) {e.preventDefault();onClick();}
      }}
      className="block group rounded-2xl overflow-hidden transition-all duration-500"
      style={{
        background: isActive ?
        `linear-gradient(135deg, ${link.color}0c 0%, rgba(255,255,255,0.05) 50%, ${link.color}08 100%)` :
        'rgba(255,255,255,0.03)',
        border: isActive ?
        '1px solid rgba(255,255,255,0.14)' :
        '1px solid rgba(255,255,255,0.06)',
        boxShadow: isActive ?
        `0 30px 60px -20px ${link.color}30, 0 0 50px ${link.color}0c, inset 0 1px 0 rgba(255,255,255,0.07)` :
        '0 6px 20px rgba(0,0,0,0.4)'
      }}>

        {/* Mouse spotlight */}
        {isActive &&
        <div data-ev-id="ev_8fc7d088c6"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(300px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${link.color}12, transparent 60%)`
        }} />

        }

        {/* Top accent */}
        <div data-ev-id="ev_93ed1d9d25"
        className="h-[2px] w-full"
        style={{
          background: isActive ?
          `linear-gradient(90deg, transparent, ${link.color}90, ${link.color}, ${link.color}90, transparent)` :
          `linear-gradient(90deg, transparent, ${link.color}20, transparent)`
        }} />


        <div data-ev-id="ev_b74abaeac8" className="p-5">
          <div data-ev-id="ev_86f4d76550" className="flex items-center gap-3.5 mb-2">
            <div data-ev-id="ev_5f5f6d2328"
            className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-500 ${
            isActive ? '' : 'scale-90 opacity-60'}`
            }
            style={{
              backgroundColor: `${link.color}15`,
              border: `1px solid ${isActive ? `${link.color}30` : `${link.color}0a`}`,
              boxShadow: isActive ? `0 0 22px ${link.color}1a` : 'none'
            }}>

              <AnimatedIcon
                icon={link.icon}
                animation={link.animation}
                color={link.color}
                isHovered={isActive} />

            </div>
            <div data-ev-id="ev_d900880aa5" className="flex-1 min-w-0">
              <h3 data-ev-id="ev_9bf98a62a8"
              className="font-bold text-[15px] truncate transition-colors duration-300"
              style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.65)' }}>

                {link.title}
              </h3>
              <p data-ev-id="ev_58a46146dc"
              className="text-sm truncate transition-colors duration-300"
              style={{ color: isActive ? `${link.color}bb` : 'rgba(255,255,255,0.28)' }}>

                {link.subtitle}
              </p>
            </div>
            {isActive &&
            <ExternalLink
              className="w-4 h-4 flex-shrink-0"
              style={{ color: `${link.color}55` }} />

            }
          </div>

          {/* Description — visible only on active */}
          <div data-ev-id="ev_ae9fe3e60c"
          className="overflow-hidden transition-all duration-500"
          style={{
            maxHeight: isActive ? '90px' : '0px',
            opacity: isActive ? 1 : 0
          }}>

            <div data-ev-id="ev_e86774b2ad"
            className="h-px w-full mb-2.5"
            style={{
              background: `linear-gradient(90deg, transparent, ${link.color}22, transparent)`
            }} />

            <p data-ev-id="ev_e700fc241e" className="text-white/45 text-[13px] leading-relaxed line-clamp-3">
              {link.description}
            </p>
          </div>
        </div>

        {/* Active border glow */}
        {isActive &&
        <div data-ev-id="ev_3cb8a23e27"
        className="absolute -inset-px rounded-2xl pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${link.color}18, transparent 40%, transparent 60%, ${link.color}0e)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
          borderRadius: '16px'
        }} />

        }
      </a>
    </div>);

};