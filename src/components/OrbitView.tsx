import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import { ExternalLink, RotateCcw } from 'lucide-react';
import type { LinkItem, LinkSection } from '@/data/links';

interface OrbitViewProps {
  sections: LinkSection[];
  visible: boolean;
}

const SECTION_ACCENTS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981', '#ef4444'];

/* ════ Main Orbit View — N independent rings + detail panels ════ */
export const OrbitView = ({
  sections,
  visible
}: OrbitViewProps) => {
  return (
    <div data-ev-id="ev_b9fddbcb5a"
    className={`transition-all duration-700 space-y-4 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      {sections.map((section, sIdx) =>
      <div data-ev-id="ev_10fe99357d" key={section.id}>
          {sIdx > 0 &&
        <div data-ev-id="ev_2483086a3a" className="flex items-center justify-center gap-3 py-1">
              <div data-ev-id="ev_6fea416185" className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-white/5" />
              <div data-ev-id="ev_27cba62a86" className="w-1.5 h-1.5 rounded-full bg-white/10" />
              <div data-ev-id="ev_56b3379aeb" className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-white/5" />
            </div>
        }
          <OrbitRing
          links={section.links}
          label={section.title}
          emoji={section.emoji}
          accentColor={SECTION_ACCENTS[sIdx % SECTION_ACCENTS.length]}
          direction={sIdx % 2 === 0 ? 1 : -1} />
        </div>
      )}
    </div>);

};

/* ══════ Single Orbit Ring + Detail Panel ══════ */
const OrbitRing = ({
  links,
  label,
  emoji,
  accentColor,
  direction






}: {links: LinkItem[];label: string;emoji: string;accentColor: string;direction: 1 | -1;}) => {
  const total = links.length;
  const [active, setActive] = useState(0);
  const [isSpinning, setIsSpinning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const angleRef = useRef(0);
  const animRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const [, tick] = useState(0);

  // Drag state
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartAngle = useRef(0);
  const dragVelocity = useRef(0);
  const lastDragX = useRef(0);
  const lastDragTime = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  // Track if we actually moved (vs just a click)
  const dragMoved = useRef(false);

  const activeLink = links[active];

  const goTo = useCallback(
    (idx: number) => {
      const n = (idx % total + total) % total;
      setActive(n);
      angleRef.current = -(n / total) * Math.PI * 2;
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), 5000);
    },
    [total]
  );

  /* ── Drag handlers ── */
  const getClientX = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if ('touches' in e) return e.touches[0]?.clientX ?? 0;
    return (e as MouseEvent).clientX;
  };

  const onDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      isDragging.current = true;
      dragMoved.current = false;
      dragStartX.current = getClientX(e);
      dragStartAngle.current = angleRef.current;
      dragVelocity.current = 0;
      lastDragX.current = getClientX(e);
      lastDragTime.current = Date.now();
      setIsPaused(true);
    },
    []
  );

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const cx = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const dx = cx - dragStartX.current;

      if (Math.abs(dx) > 5) dragMoved.current = true;

      const stageW = stageRef.current?.offsetWidth ?? 400;
      // Map drag pixels to angle: full width = full rotation
      const sensitivity = Math.PI * 2 / stageW;
      angleRef.current = dragStartAngle.current + dx * sensitivity;

      // Track velocity
      const now = Date.now();
      const dt = now - lastDragTime.current;
      if (dt > 0) {
        dragVelocity.current = (cx - lastDragX.current) * sensitivity / (dt / 1000);
      }
      lastDragX.current = cx;
      lastDragTime.current = now;
    };

    const onUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;

      // Find closest front-facing icon and snap
      const frontIdx =
      Math.round(-angleRef.current / (Math.PI * 2) * total) % total;
      const snapped = (frontIdx % total + total) % total;
      setActive(snapped);
      angleRef.current = -(snapped / total) * Math.PI * 2;

      setTimeout(() => setIsPaused(false), 3000);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [total]);

  /* ── Animation loop ── */
  useEffect(() => {
    const frame = () => {
      const now = Date.now();
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (isSpinning && !isPaused && !isDragging.current) {
        angleRef.current += dt * 0.22 * direction;
        const frontIdx =
        Math.round(-angleRef.current / (Math.PI * 2) * total) % total;
        setActive((frontIdx % total + total) % total);
      }
      tick((n) => n + 1);
      animRef.current = requestAnimationFrame(frame);
    };
    animRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animRef.current);
  }, [isSpinning, isPaused, total, direction]);

  /* ── Responsive radius ── */
  const vw = typeof window !== 'undefined' ? window.innerWidth : 400;
  const isMobile = vw < 640;
  const rx = isMobile ? Math.min(vw * 0.38, 150) : Math.min(vw * 0.28, 200);
  const ry = isMobile ? 50 : 60;
  const stageH = isMobile ? 140 : 160;

  return (
    <div data-ev-id="ev_d83d5abe15">
      {/* Section label */}
      <div data-ev-id="ev_1c6577f0b2" className="flex items-center justify-center gap-2 mb-2">
        <div data-ev-id="ev_b7afe97c2f"
        className="h-px w-8"
        style={{ background: `linear-gradient(to right, transparent, ${accentColor}30)` }} />

        <span data-ev-id="ev_1d8a726727" className="text-sm font-medium" style={{ color: `${accentColor}90` }}>
          {emoji} {label}
        </span>
        <div data-ev-id="ev_b7dc3c7da4"
        className="h-px w-8"
        style={{ background: `linear-gradient(to left, transparent, ${accentColor}30)` }} />

      </div>

      {/* Orbit stage — draggable */}
      <div data-ev-id="ev_ac5b724868"
      ref={stageRef}
      className="relative mx-auto select-none"
      style={{ height: stageH, cursor: isDragging.current ? 'grabbing' : 'grab' }}
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}>

        {/* Orbit ring trace */}
        <div data-ev-id="ev_9d9e8fc66f"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: rx * 2 + 16,
          height: ry * 2 + 16,
          border: `1px dashed ${accentColor}12`
        }} />


        {/* Drag hint */}
        <div data-ev-id="ev_dfbbf091c7" className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] text-white/10 pointer-events-none flex items-center gap-1">
          <span data-ev-id="ev_af04802526">↔</span> גרור לסיבוב
        </div>

        {/* Orbiting icons */}
        {links.map((link, i) => {
          const a = angleRef.current + i / total * Math.PI * 2;
          const x = Math.cos(a) * rx;
          const y = Math.sin(a) * ry;
          const z = Math.sin(a); // -1..1 depth — positive = front
          const isAct = i === active;
          const isFront = z > -0.3; // Front ~70% of the ring is clickable
          const depthScale = 0.65 + (z + 1) * 0.17;

          return (
            <button data-ev-id="ev_1defdd6d0b"
            key={link.id}
            onClick={(e) => {
              // Only handle click if we didn't drag
              if (dragMoved.current) return;
              if (isFront) {
                e.stopPropagation();
                goTo(i);
              }
            }}
            className="absolute top-1/2 left-1/2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-xl"
            style={{
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${isAct ? 1.2 : depthScale})`,
              zIndex: isAct ? 40 : Math.round((z + 1) * 10),
              opacity: isAct ? 1 : isFront ? 0.5 + (z + 1) * 0.2 : 0.2 + (z + 1) * 0.15,
              transition: isDragging.current ? 'none' : 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
              pointerEvents: isFront ? 'auto' : 'none',
              cursor: isFront ? 'pointer' : 'default'
            }}
            aria-label={link.title}>

              <div data-ev-id="ev_d3ffaed583"
              className="relative flex items-center justify-center rounded-full transition-all duration-400"
              style={{
                width: isAct ? 46 : isFront && z > 0.3 ? 42 : 38,
                height: isAct ? 46 : isFront && z > 0.3 ? 42 : 38,
                background: isAct ?
                `${link.color}22` :
                isFront ?
                `${link.color}14` :
                `${link.color}08`,
                border: isAct ?
                `2px solid ${link.color}70` :
                isFront ?
                `1.5px solid ${link.color}40` :
                `1px solid ${link.color}18`,
                boxShadow: isAct ?
                `0 0 18px ${link.color}35, 0 0 35px ${link.color}12` :
                isFront ?
                `0 0 10px ${link.color}12` :
                'none',
                backdropFilter: 'blur(8px)'
              }}>

                <AnimatedIcon
                  icon={link.icon}
                  animation={link.animation}
                  color={link.color}
                  isHovered={isAct} />


                {isAct &&
                <div data-ev-id="ev_75f95fb7aa"
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  border: `1px solid ${link.color}35`,
                  animationDuration: '2.5s'
                }} />

                }
              </div>

              {/* Name label — show for active + nearby front icons on hover */}
              <div data-ev-id="ev_fd651a3c7f"
              className={`absolute -bottom-[18px] left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold transition-all duration-300 ${
              isAct ?
              'opacity-90 translate-y-0' :
              isFront && z > 0.2 ?
              'opacity-0 translate-y-1 group-hover:opacity-70 group-hover:translate-y-0' :
              'opacity-0 translate-y-1'}`
              }
              style={{ color: link.color }}>

                {link.title.length > 12 ? link.title.slice(0, 11) + '..' : link.title}
              </div>
            </button>);

        })}
      </div>

      {/* Detail panel below the ring */}
      <DetailPanel link={activeLink} accentColor={accentColor} />

      {/* Spin toggle + dots */}
      <div data-ev-id="ev_49d40296b2" className="flex items-center justify-center gap-4 mt-2">
        <button data-ev-id="ev_c02f9469d9"
        onClick={() => setIsSpinning((s) => !s)}
        className="flex items-center gap-1.5 text-white/60 hover:text-white/70 transition-colors text-xs">

          <RotateCcw
            className={`w-3 h-3 ${isSpinning && !isPaused ? 'animate-spin' : ''}`}
            style={{ animationDuration: '3s' }} />

          <span data-ev-id="ev_366392d9b6">{isSpinning ? 'מסתובב' : 'עצור'}</span>
        </button>
        <div data-ev-id="ev_de7b21f7b4" className="flex gap-[3px] items-center">
          {links.map((link, i) =>
          <button data-ev-id="ev_88323ee631"
          key={i}
          onClick={() => goTo(i)}
          className="rounded-full transition-all duration-400"
          style={{
            width: i === active ? 14 : 4,
            height: 4,
            backgroundColor: i === active ? link.color : `${accentColor}20`,
            boxShadow: i === active ? `0 0 6px ${link.color}60` : 'none'
          }} />

          )}
        </div>
      </div>
    </div>);

};

/* ═════ Detail Panel ═════ */
const DetailPanel = ({
  link,
  accentColor



}: {link: LinkItem | undefined;accentColor: string;}) => {
  if (!link) return null;

  return (
    <div data-ev-id="ev_a329820662" className="mx-auto max-w-xs mt-2 px-2">
      <a data-ev-id="ev_d9b0450200"
      href={link.url}
      target="_blank" rel="noopener noreferrer"
      className="block group">

        <div data-ev-id="ev_8c08f22972"
        className="rounded-xl overflow-hidden transition-all duration-500"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: `0 12px 30px -10px ${link.color}18, 0 0 25px ${link.color}05`
        }}>

          <div data-ev-id="ev_5d2b0a9d4c"
          className="h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${link.color}80, transparent)`
          }} />


          <div data-ev-id="ev_da56e01164" className="p-3.5 flex items-center gap-3">
            <div data-ev-id="ev_0af6c7543b"
            className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500"
            style={{
              backgroundColor: `${link.color}12`,
              boxShadow: `0 0 14px ${link.color}12`
            }}>

              <AnimatedIcon
                icon={link.icon}
                animation={link.animation}
                color={link.color}
                isHovered />

            </div>

            <div data-ev-id="ev_8596d5fc53" className="flex-1 min-w-0">
              <h3 data-ev-id="ev_4e8921d105" className="text-white font-bold text-[13px] truncate">{link.title}</h3>
              <p data-ev-id="ev_44e82438cc" className="text-white/60 text-xs truncate">{link.subtitle}</p>
              <p data-ev-id="ev_08f3f821f0" className="text-white/60 text-xs leading-relaxed line-clamp-1 mt-0.5">
                {link.description}
              </p>
            </div>

            <div data-ev-id="ev_c61dba9185"
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{
              backgroundColor: `${link.color}15`,
              border: `1px solid ${link.color}25`
            }}>

              <ExternalLink
                className="w-3.5 h-3.5 transition-transform group-hover:translate-x-[-1px] group-hover:translate-y-[-1px]"
                style={{ color: `${link.color}90` }} />

            </div>
          </div>
        </div>
      </a>
    </div>);

};