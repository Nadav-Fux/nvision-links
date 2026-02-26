import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import { ExternalLink } from 'lucide-react';
import type { LinkItem, LinkSection } from '@/data/links';

interface RolodexViewProps {
  sections: LinkSection[];
  visible: boolean;
}

type FlyDir = 'left' | 'right' | null;
type EnterDir = 'from-left' | 'from-right' | null;

export const RolodexView = ({
  sections,
  visible
}: RolodexViewProps) => {
  const allLinks = sections.flatMap((s) => s.links);
  const total = allLinks.length;

  // Build section boundary info: for each link index, which section it belongs to
  const sectionBounds: {start: number;end: number;section: LinkSection;}[] = [];
  let offset = 0;
  for (const section of sections) {
    sectionBounds.push({ start: offset, end: offset + section.links.length, section });
    offset += section.links.length;
  }
  const getSectionIdx = (i: number) => sectionBounds.findIndex((b) => i >= b.start && i < b.end);

  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [flyOut, setFlyOut] = useState<FlyDir>(null);
  const [enterFrom, setEnterFrom] = useState<EnterDir>(null);
  const [showHint, setShowHint] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const startX = useRef(0);
  const startT = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const rafRef = useRef(0);
  const lastFrame = useRef(0);

  const SWIPE_THRESHOLD = 55;
  const AUTO_MS = 4500;

  const activeLink = allLinks[active];
  const activeSectionIdx = getSectionIdx(active);

  /* ── navigate ── */
  const goTo = useCallback(
    (idx: number, enter: EnterDir = null) => {
      const next = (idx % total + total) % total;
      setActive(next);
      setDrag(0);
      setFlyOut(null);
      setEnterFrom(enter);
      // Clear entrance animation after it plays
      setTimeout(() => setEnterFrom(null), 420);
      progressRef.current = 0;
      setProgress(0);
    },
    [total]
  );

  const shuffle = useCallback(
    (dir: 'left' | 'right') => {
      setFlyOut(dir);
      setTimeout(() => {
        goTo(
          dir === 'left' ? active + 1 : active - 1,
          dir === 'left' ? 'from-right' : 'from-left'
        );
      }, 300);
    },
    [active, goTo]
  );

  /* ── hint ── */
  useEffect(() => {
    if (!showHint) return;
    const t = setTimeout(() => setShowHint(false), 3500);
    return () => clearTimeout(t);
  }, [showHint]);

  /* ── auto-advance ── */
  useEffect(() => {
    if (isPaused || isDragging) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    lastFrame.current = performance.now();
    const tick = (now: number) => {
      progressRef.current += now - lastFrame.current;
      lastFrame.current = now;
      const p = Math.min(1, progressRef.current / AUTO_MS);
      setProgress(p);
      if (p >= 1) {
        shuffle('left');
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, isPaused, isDragging, shuffle]);

  /* ── pointer ── */
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (flyOut) return;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      startX.current = e.clientX;
      startT.current = Date.now();
      setIsDragging(true);
      setShowHint(false);
      setIsPaused(true);
    },
    [flyOut]
  );
  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      setDrag(e.clientX - startX.current);
    },
    [isDragging]
  );
  const onPointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const dt = Date.now() - startT.current;
    const vel = Math.abs(drag) / Math.max(dt, 1) * 1000;
    if (Math.abs(drag) > SWIPE_THRESHOLD || vel > 400) {
      shuffle(drag < 0 ? 'left' : 'right');
    } else {
      setDrag(0);
    }
    setTimeout(() => setIsPaused(false), 5000);
  }, [isDragging, drag, shuffle]);

  /* ── wheel ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let lock = false;
    const h = (e: WheelEvent) => {
      e.preventDefault();
      if (lock) return;
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(d) > 30) {
        lock = true;
        setIsPaused(true);
        shuffle(d > 0 ? 'left' : 'right');
        setTimeout(() => {lock = false;setIsPaused(false);}, 600);
      }
    };
    el.addEventListener('wheel', h, { passive: false });
    return () => el.removeEventListener('wheel', h);
  }, [shuffle]);

  /* ── keyboard ── */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') shuffle('left');
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') shuffle('right');
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [shuffle]);

  /* ── card transform ── */
  const getTransform = (): React.CSSProperties => {
    if (flyOut) {
      const dir = flyOut === 'left' ? -1 : 1;
      return {
        transform: `translateX(${dir * 120}%) rotateZ(${dir * 18}deg) scale(0.85)`,
        opacity: 0,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 1, 1)'
      };
    }
    if (enterFrom) {
      // Already entering – CSS transition will animate to rest
      return {
        transform: 'translateX(0) rotateZ(0deg) scale(1)',
        opacity: 1,
        transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
      };
    }
    // Dragging
    const rz = drag * 0.04;
    return {
      transform: `translateX(${drag}px) rotateZ(${rz}deg)`,
      opacity: 1,
      transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
      cursor: isDragging ? 'grabbing' : 'grab'
    };
  };

  return (
    <div data-ev-id="ev_04bf55e402"
    role="group"
    aria-roledescription="קרוסלה"
    aria-label={`${total} פריטים`}
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      {/* Screen reader announcement for slide changes */}
      <div data-ev-id="ev_cb9751a61a" className="sr-only" aria-live="polite" aria-atomic="true">
        {activeLink ? `פריט ${active + 1} מתוך ${total}: ${activeLink.title}` : ''}
      </div>

      {/* Section pills */}
      <div data-ev-id="ev_9e0f5457d1" className="flex items-center justify-center gap-3 mb-5 flex-wrap">
        {sections.map((section, sIdx) =>
        <div data-ev-id="ev_d362418083" key={section.id} className="flex items-center gap-3">
            {sIdx > 0 && <div data-ev-id="ev_ac7058c4b7" className="w-6 h-px bg-white/10" />}
            <span data-ev-id="ev_c2c120eac5"
          className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-500 ${
          activeSectionIdx === sIdx ?
          'bg-white/[0.08] text-white/80 border border-white/[0.12]' :
          'text-white/60 border border-transparent'}`
          }>
              {section.emoji} {section.title}
            </span>
          </div>
        )}
      </div>

      {/* ─── Single-card stage ─── */}
      <div data-ev-id="ev_42f463d882"
      ref={containerRef}
      className="relative mx-auto select-none touch-none"
      style={{ maxWidth: '380px' }}>

        {/* The card */}
        <div data-ev-id="ev_07bba5e66f"
        style={getTransform()}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}>

          <SingleCard link={activeLink} progress={progress} />
        </div>

        {/* Swipe hint */}
        {showHint &&
        <div data-ev-id="ev_4ca845e52a" className="absolute -bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <span data-ev-id="ev_7606bba6f0" className="text-white/60 text-xs font-medium">
              ← גרור כדי לעבור →
            </span>
          </div>
        }
      </div>

      {/* ─── Icon filmstrip / preview rail ─── */}
      <div data-ev-id="ev_ac520b6339" className="mt-7 px-2">
        <div data-ev-id="ev_6731eb749b" className="flex items-center justify-center gap-1 flex-wrap">
          {allLinks.map((link, i) => {
            const isAct = i === active;
            const isBoundary = sectionBounds.some((b) => i === b.end - 1 && b.end < total);

            return (
              <button data-ev-id="ev_33661a69af"
              key={link.id}
              onClick={() => {
                setIsPaused(true);
                const dir = i > active ? 'left' : 'right';
                setFlyOut(dir as 'left' | 'right');
                setTimeout(() => {
                  goTo(i, dir === 'left' ? 'from-right' : 'from-left');
                  setTimeout(() => setIsPaused(false), 5000);
                }, 300);
              }}
              className="relative flex items-center justify-center rounded-lg transition-all duration-400"
              style={{
                width: isAct ? 44 : 34,
                height: isAct ? 44 : 34,
                background: isAct ? `${link.color}18` : `${link.color}08`,
                border: isAct ?
                `2px solid ${link.color}50` :
                `1px solid ${link.color}15`,
                boxShadow: isAct ?
                `0 0 14px ${link.color}25` :
                'none',
                transform: isAct ? 'scale(1.05)' : 'scale(1)'
              }}
              title={link.title}>

                <AnimatedIcon
                  icon={link.icon}
                  animation={link.animation}
                  color={isAct ? link.color : `${link.color}`}
                  isHovered={isAct} />


                {/* Section divider marker */}
                {isBoundary &&
                <div data-ev-id="ev_bfa2b408cb" className="absolute -right-[4px] top-1/2 -translate-y-1/2 w-[2px] h-3 bg-white/[0.06] rounded-full" />
                }
              </button>);

          })}
        </div>

        {/* Counter */}
        <div data-ev-id="ev_12d22b1327" className="text-center mt-3">
          <span data-ev-id="ev_f214cc4c66" className="text-white/60 text-xs font-mono">
            {active + 1} / {total}
          </span>
        </div>
      </div>
    </div>);

};

/* ═════ Single full card (no overlap) ═════ */
const SingleCard = ({
  link,
  progress



}: {link: LinkItem;progress: number;}) => {
  return (
    <a data-ev-id="ev_76affb5473"
    href={link.url}
    target="_blank" rel="noopener noreferrer"
    className="block group"
    draggable={false}>

      <div data-ev-id="ev_326cbbc452"
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.11)',
        boxShadow: `0 25px 60px -15px ${link.color}20, 0 0 40px ${link.color}06, inset 0 1px 0 rgba(255,255,255,0.07)`
      }}>

        {/* Top accent + progress bar */}
        <div data-ev-id="ev_b0eda8701e" className="relative h-[2px]">
          <div data-ev-id="ev_826947ed69"
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent, ${link.color}60, transparent)`
          }} />

          {progress > 0 &&
          <div data-ev-id="ev_a747f2e36e"
          className="absolute top-0 left-0 h-full"
          style={{
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${link.color}, ${link.color}cc)`,
            boxShadow: `0 0 8px ${link.color}60`,
            transition: 'width 0.1s linear'
          }} />

          }
        </div>

        <div data-ev-id="ev_01b79caba7" className="p-5">
          <div data-ev-id="ev_887591ab05" className="flex items-center gap-3.5">
            <div data-ev-id="ev_ee01eac141"
            className="flex items-center justify-center w-13 h-13 rounded-xl"
            style={{
              width: 52,
              height: 52,
              backgroundColor: `${link.color}15`,
              boxShadow: `0 0 22px ${link.color}15`
            }}>

              <AnimatedIcon
                icon={link.icon}
                animation={link.animation}
                color={link.color}
                isHovered />

            </div>
            <div data-ev-id="ev_a0cc2a0db1" className="flex-1 min-w-0">
              <h3 data-ev-id="ev_1867307d56" className="text-white font-bold text-[16px] truncate">
                {link.title}
              </h3>
              <p data-ev-id="ev_0ca4ff8d7e" className="text-white/60 text-sm mt-0.5 truncate">
                {link.subtitle}
              </p>
            </div>
            <div data-ev-id="ev_6f065cd849" className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all">
              <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white/65 transition-colors" />
            </div>
          </div>

          {/* Description */}
          <p data-ev-id="ev_a1f6ab1975" className="text-white/60 text-[13px] leading-relaxed mt-3.5 pt-3.5 border-t border-white/[0.06] line-clamp-3">
            {link.description}
          </p>
        </div>

        {/* Corner glows */}
        <div data-ev-id="ev_8d8c5f4390"
        className="absolute top-0 left-0 w-28 h-28 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 0% 0%, ${link.color}10, transparent 70%)`
        }} />

        <div data-ev-id="ev_ad474c42bd"
        className="absolute bottom-0 right-0 w-28 h-28 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 100% 100%, ${link.color}08, transparent 70%)`
        }} />

      </div>
    </a>);

};