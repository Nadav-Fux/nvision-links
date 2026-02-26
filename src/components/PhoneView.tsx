import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { Signal, Wifi, Battery, Search, ChevronLeft, Clock, Globe } from 'lucide-react';

interface PhoneViewProps {
  sections: LinkSection[];
  visible: boolean;
}

/* ── Random open/close animation types ── */
type AppAnim = 'zoom' | 'slideUp' | 'slideDown' | 'flipX' | 'flipY' | 'rotate' | 'elastic';

const APP_ANIMS: AppAnim[] = ['zoom', 'slideUp', 'slideDown', 'flipX', 'flipY', 'rotate', 'elastic'];

const getAnimStyle = (anim: AppAnim, opening: boolean): React.CSSProperties => {
  if (opening) {
    switch (anim) {
      case 'zoom':return { transform: 'scale(0.3)', opacity: 0 };
      case 'slideUp':return { transform: 'translateY(60px) scale(0.95)', opacity: 0 };
      case 'slideDown':return { transform: 'translateY(-60px) scale(0.95)', opacity: 0 };
      case 'flipX':return { transform: 'perspective(600px) rotateY(90deg)', opacity: 0 };
      case 'flipY':return { transform: 'perspective(600px) rotateX(90deg)', opacity: 0 };
      case 'rotate':return { transform: 'scale(0.4) rotate(180deg)', opacity: 0 };
      case 'elastic':return { transform: 'scale(0.1)', opacity: 0 };
    }
  }
  return { transform: 'scale(1) translateY(0) rotate(0deg)', opacity: 1 };
};

const getAnimTransition = (anim: AppAnim): string => {
  switch (anim) {
    case 'elastic':return 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    case 'rotate':return 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
    default:return 'all 0.35s cubic-bezier(0.23, 1, 0.32, 1)';
  }
};

const SECTION_COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981', '#ef4444'];

/* ════ Enhanced Smartphone Home Screen View ════ */
export const PhoneView = ({ sections, visible }: PhoneViewProps) => {
  const [revealed, setRevealed] = useState(0);
  const [activeApp, setActiveApp] = useState<LinkItem | null>(null);
  const [appOpening, setAppOpening] = useState(false);
  const [currentAnim, setCurrentAnim] = useState<AppAnim>('zoom');
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    if (!visible) return;
    setRevealed(0);
    setActiveApp(null);
    setActivePage(0);
    let i = 0;
    const max = Math.max(...sections.map((s) => s.links.length), 0) + 4;
    const timer = setInterval(() => {
      i++;
      setRevealed(i);
      if (i >= max) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, [visible, sections.length]);

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const dateStr = now.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' });

  const pickRandomAnim = useCallback((): AppAnim => {
    return APP_ANIMS[Math.floor(Math.random() * APP_ANIMS.length)];
  }, []);

  const openApp = (link: LinkItem) => {
    const anim = pickRandomAnim();
    setCurrentAnim(anim);
    setActiveApp(link);
    setAppOpening(true);
    setTimeout(() => setAppOpening(false), 50);
  };

  const closeApp = () => {
    setAppOpening(true);
    setTimeout(() => {setActiveApp(null);setAppOpening(false);}, 300);
  };

  // Swipe between pages
  const touchStartX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => {touchStartX.current = e.touches[0].clientX;};
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 50 && activePage > 0) setActivePage(activePage - 1);
    if (dx < -50 && activePage < sections.length - 1) setActivePage(activePage + 1);
  };

  let lineIdx = 0;
  const show = () => lineIdx++ < revealed;

  const currentSection = sections[activePage];
  const currentLinks = currentSection?.links ?? [];
  const sectionColor = SECTION_COLORS[activePage % SECTION_COLORS.length];

  return (
    <div data-ev-id="ev_74f5d0b260"
    className={`transition-all duration-700 flex justify-center ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      {/* Phone Frame — iPhone style */}
      <div data-ev-id="ev_c0bd5ed353"
      className="relative overflow-hidden"
      style={{
        width: 370,
        borderRadius: '3rem',
        border: '3px solid rgba(255,255,255,0.08)',
        background: '#000',
        boxShadow: '0 30px 90px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.04), 0 0 80px rgba(6,182,212,0.04)'
      }}>

        {/* Dynamic Island */}
        <div data-ev-id="ev_904020415d" className="flex justify-center pt-3 pb-0.5 relative z-30">
          <div data-ev-id="ev_4110e7fa27"
          className="flex items-center gap-2 rounded-full px-5 py-1.5 transition-all duration-500"
          style={{
            background: '#000',
            boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
            minWidth: activeApp ? 140 : 125
          }}>
            {activeApp ?
            <>
                <div data-ev-id="ev_9327be32c5" className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: activeApp.color }} />
                <span data-ev-id="ev_5a93b02768" className="text-[10px] text-white/60 truncate max-w-[80px]">{activeApp.title}</span>
              </> :

            <>
                <div data-ev-id="ev_9ef3add54d" className="w-3 h-3 rounded-full bg-[#1a1a2e] border border-white/10" />
                <div data-ev-id="ev_ea34b57e52" className="w-2 h-2 rounded-full bg-[#1a1a2e]" />
              </>
            }
          </div>
        </div>

        {/* Status Bar */}
        <div data-ev-id="ev_c10d6d0464" className="flex items-center justify-between px-8 py-1 text-[11px] text-white/60 font-medium" dir="ltr">
          <span data-ev-id="ev_41c535323e" className="font-semibold text-white/70">{timeStr}</span>
          <div data-ev-id="ev_e806434621" className="flex items-center gap-1">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-5 h-5" />
          </div>
        </div>

        {/* Content Area */}
        <div data-ev-id="ev_d9d0c3575f" className="relative" style={{ minHeight: 560 }}>
          {/* Home Screen */}
          <div data-ev-id="ev_4f2606907b"
          className={`transition-all duration-300 ${
          activeApp ? 'scale-90 opacity-0 blur-sm pointer-events-none' : 'scale-100 opacity-100'}`
          }
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}>

            {/* Date + Time widget */}
            <div data-ev-id="ev_2c7f58fd1b" className="px-6 pt-2 mb-4">
              {show() &&
              <div data-ev-id="ev_6f58ad2765" className="animate-in fade-in duration-300">
                  <div data-ev-id="ev_9bb748d634" className="text-white/60 text-[11px] font-medium">{dateStr}</div>
                </div>
              }
            </div>

            {/* Weather-like widget */}
            {show() &&
            <div data-ev-id="ev_5ccee4f141" className="mx-5 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div data-ev-id="ev_3461da5f2f"
              className="rounded-2xl p-3 flex items-center gap-3"
              style={{
                background: `linear-gradient(135deg, ${sectionColor}12, ${sectionColor}05)`,
                border: `1px solid ${sectionColor}15`
              }}>
                  <div data-ev-id="ev_17229c960e"
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${sectionColor}15` }}>
                    <span data-ev-id="ev_6c29de1412" className="text-lg">{currentSection?.emoji}</span>
                  </div>
                  <div data-ev-id="ev_2abba68dea" className="flex-1">
                    <div data-ev-id="ev_92a4349dc1" className="text-white/70 text-[12px] font-semibold">{currentSection?.title}</div>
                    <div data-ev-id="ev_8295ace7aa" className="text-white/60 text-[10px]">{currentLinks.length} קישורים זמינים</div>
                  </div>
                  <div data-ev-id="ev_27f36e51d4" className="text-white/60 text-xl">›</div>
                </div>
              </div>
            }

            {/* Search Bar */}
            {show() &&
            <div data-ev-id="ev_c1bb16ad27" className="px-5 mb-3 animate-in fade-in duration-300">
                <div data-ev-id="ev_1767285b0a" className="flex items-center gap-2 px-4 py-2.5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <Search className="w-4 h-4 text-white/60" />
                  <span data-ev-id="ev_7dd10a1d79" className="text-white/60 text-[12px]">חיפוש</span>
                </div>
              </div>
            }

            {/* Page switcher tabs */}
            <div data-ev-id="ev_474526aabe" className="flex items-center gap-0.5 mx-5 mb-3 p-0.5 rounded-2xl overflow-x-auto" style={{ background: 'rgba(255,255,255,0.03)' }}>
              {sections.map((section, sIdx) => {
                const isActive = activePage === sIdx;
                const color = SECTION_COLORS[sIdx % SECTION_COLORS.length];
                return (
                  <button data-ev-id="ev_f1c0226dc7"
                  key={section.id}
                  onClick={() => setActivePage(sIdx)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[11px] font-medium transition-all duration-300 whitespace-nowrap min-w-0 ${
                  isActive ? 'text-white/90' : 'text-white/60 hover:text-white/70'}`
                  }
                  style={{
                    background: isActive ? `${color}18` : 'transparent'
                  }}>
                    <span data-ev-id="ev_0249158995">{section.emoji}</span>
                    <span data-ev-id="ev_083bad723d" className="truncate text-[10px]">{section.title}</span>
                  </button>);

              })}
            </div>

            {/* App Grid — 4 columns */}
            <div data-ev-id="ev_b225835994" className="px-4 overflow-hidden">
              <div data-ev-id="ev_99101cf2a8"
              className="grid grid-cols-4 gap-x-2 gap-y-4 transition-all duration-400"
              key={activePage}
              style={{ animation: 'fadeSlide 0.3s ease-out' }}>
                {currentLinks.map((link, i) => {
                  const s = show();
                  return s ?
                  <AppIcon
                    key={link.id}
                    link={link}
                    sectionColor={sectionColor}
                    onTap={() => openApp(link)}
                    delay={i * 35} /> :

                  <div data-ev-id="ev_302caaa8af" key={link.id} className="w-full" style={{ height: 85 }} />;

                })}
              </div>
            </div>

            {/* Page dots */}
            <div data-ev-id="ev_70fecfb2ff" className="flex items-center justify-center gap-1.5 mt-5">
              {sections.map((section, sIdx) =>
              <button data-ev-id="ev_9136595bb0"
              key={section.id}
              onClick={() => setActivePage(sIdx)}
              className="rounded-full transition-all duration-300"
              style={{
                width: activePage === sIdx ? 20 : 6,
                height: 6,
                background: activePage === sIdx ?
                SECTION_COLORS[sIdx % SECTION_COLORS.length] :
                'rgba(255,255,255,0.1)'
              }} />
              )}
            </div>
          </div>

          {/* App Detail Screen */}
          {activeApp &&
          <div data-ev-id="ev_17e24e78a5"
          className="absolute inset-0 z-10"
          style={{
            background: `linear-gradient(180deg, ${activeApp.color}06 0%, rgba(0,0,0,0.98) 30%)`,
            ...getAnimStyle(currentAnim, appOpening),
            transition: getAnimTransition(currentAnim)
          }}>
              <AppDetailScreen link={activeApp} onBack={closeApp} anim={currentAnim} />
            </div>
          }
        </div>

        {/* Dock */}
        {!activeApp &&
        <div data-ev-id="ev_5615f17293" className="px-5 pb-1 pt-1">
            <div data-ev-id="ev_cfd70f8d36"
          className="flex items-center justify-around py-2.5 px-3 rounded-3xl"
          style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>
              {sections.map((s) => s.links[0]).filter(Boolean).slice(0, 4).map((link) =>
            <button data-ev-id="ev_fffce2bfb7"
            key={link.id}
            onClick={() => openApp(link)}
            className="w-12 h-12 rounded-[14px] flex items-center justify-center transition-all duration-200 active:scale-90"
            style={{
              background: `linear-gradient(145deg, ${link.color}25, ${link.color}08)`,
              border: `1px solid ${link.color}18`
            }}>
                  <AnimatedIcon icon={link.icon} animation={link.animation} color={link.color} isHovered={false} />
                </button>
            )}
            </div>
          </div>
        }

        {/* Home Indicator */}
        <div data-ev-id="ev_1f90255b1c" className="flex justify-center pb-2 pt-1">
          <div data-ev-id="ev_557c6bb9db"
          className="w-36 h-[5px] rounded-full bg-white/15 cursor-pointer hover:bg-white/25 transition-colors"
          onClick={closeApp} />
        </div>
      </div>

      <style data-ev-id="ev_9015fb0512">{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateX(${activePage === 0 ? '-15px' : '15px'}); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>);

};

/* ═════ App Icon ═════ */
const AppIcon = ({ link, sectionColor, onTap, delay

}: {link: LinkItem;sectionColor: string;onTap: () => void;delay: number;}) => {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <button data-ev-id="ev_bcd66d9f4b"
    className="flex flex-col items-center gap-1.5 group"
    onClick={onTap}
    onMouseDown={() => setPressed(true)}
    onMouseUp={() => setPressed(false)}
    onMouseLeave={() => {setPressed(false);setHovered(false);}}
    onMouseEnter={() => setHovered(true)}
    style={{ animation: `fadeSlide 0.3s ease-out ${delay}ms both` }}>

      <div data-ev-id="ev_4027acc481"
      className="w-[56px] h-[56px] rounded-[15px] flex items-center justify-center transition-all duration-200 relative"
      style={{
        background: `linear-gradient(145deg, ${link.color}28, ${link.color}0a)`,
        boxShadow: pressed ?
        `0 0 25px ${link.color}30, inset 0 0 12px ${link.color}10` :
        hovered ?
        `0 6px 20px ${link.color}18` :
        `0 2px 8px ${link.color}06`,
        border: `1px solid ${link.color}${hovered ? '35' : '18'}`,
        transform: pressed ? 'scale(0.85)' : hovered ? 'scale(1.06)' : 'scale(1)'
      }}>

        <AnimatedIcon
          icon={link.icon}
          animation={link.animation}
          color={link.color}
          isHovered={hovered || pressed} />
      </div>

      <span data-ev-id="ev_d541a85417" className="text-[10px] text-white/60 truncate w-[64px] text-center leading-tight group-hover:text-white/70 transition-colors font-medium">
        {link.title}
      </span>
    </button>);

};

/* ═════ App Detail Screen ═════ */
const AppDetailScreen = ({ link, onBack, anim

}: {link: LinkItem;onBack: () => void;anim: AppAnim;}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div data-ev-id="ev_f6123b4de2" className="flex flex-col h-full px-5 pt-3 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      {/* Back button */}
      <div data-ev-id="ev_909decf552" className="flex items-center justify-between mb-5">
        <button data-ev-id="ev_f4b1bc3902"
        onClick={onBack}
        className="flex items-center gap-1 text-[#007AFF] hover:text-[#007AFF]/70 transition-colors text-[13px] font-medium">
          <ChevronLeft className="w-5 h-5" />
          <span data-ev-id="ev_f1b4b5e453">חזרה</span>
        </button>
      </div>

      {/* App header — App Store style */}
      <div data-ev-id="ev_d4bc915435" className="flex items-center gap-4 mb-5">
        <div data-ev-id="ev_736f812758"
        className="w-[72px] h-[72px] rounded-[20px] flex items-center justify-center flex-shrink-0"
        style={{
          background: `linear-gradient(145deg, ${link.color}30, ${link.color}10)`,
          border: `1.5px solid ${link.color}25`,
          boxShadow: `0 8px 25px ${link.color}12`
        }}>
          <AnimatedIcon icon={link.icon} animation={link.animation} color={link.color} isHovered />
        </div>
        <div data-ev-id="ev_542cc9254f" className="flex-1 min-w-0">
          <h3 data-ev-id="ev_6fc43fe15c" className="text-white/90 text-lg font-bold leading-tight">{link.title}</h3>
          <p data-ev-id="ev_96ff9c444f" className="text-white/60 text-[12px] mt-0.5 leading-snug">{link.subtitle}</p>
          {/* Open button inline */}
          <a data-ev-id="ev_739a09e8fa"
          href={link.url}
          target="_blank" rel="noopener noreferrer"
          aria-label={`${link.title} (נפתח בחלון חדש)`}
          className="inline-block mt-2 rounded-full px-6 py-1.5 text-[12px] font-semibold text-white transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          style={{
            background: hovered ?
            `linear-gradient(135deg, ${link.color}60, ${link.color}40)` :
            `linear-gradient(135deg, ${link.color}40, ${link.color}20)`
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}>
            פתח
          </a>
        </div>
      </div>

      {/* Stats row — App Store style */}
      <div data-ev-id="ev_0a2511f39d" className="flex items-center justify-around py-3 mb-4 border-y border-white/[0.05]">
        <div data-ev-id="ev_398095f58f" className="flex flex-col items-center">
          <div data-ev-id="ev_4b222786c7" className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) =>
            <span data-ev-id="ev_51f74ba8af" key={s} className="text-[9px]" style={{ color: s <= 4 ? '#facc15' : 'rgba(255,255,255,0.12)' }}>★</span>
            )}
          </div>
          <span data-ev-id="ev_abb8519ef6" className="text-[9px] text-white/60 mt-0.5">4.8 • 128 דירוגים</span>
        </div>
        <div data-ev-id="ev_72d2b4629b" className="w-px h-6 bg-white/[0.06]" />
        <div data-ev-id="ev_0db186218e" className="flex flex-col items-center">
          <Globe className="w-4 h-4 text-white/60" />
          <span data-ev-id="ev_0f22bf3552" className="text-[9px] text-white/60 mt-0.5">אינטרנט</span>
        </div>
        <div data-ev-id="ev_099c7b9fb9" className="w-px h-6 bg-white/[0.06]" />
        <div data-ev-id="ev_e23a4e3828" className="flex flex-col items-center">
          <Clock className="w-4 h-4 text-white/60" />
          <span data-ev-id="ev_ec78c1a8ae" className="text-[9px] text-white/60 mt-0.5">מומלץ</span>
        </div>
      </div>

      {/* Description */}
      <div data-ev-id="ev_ab3009cce9" className="mb-4">
        <h4 data-ev-id="ev_946f34841a" className="text-white/60 text-[11px] font-semibold mb-2 tracking-wide">תיאור</h4>
        <div data-ev-id="ev_ca1e048914" className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4">
          <p data-ev-id="ev_0b21c92c6a" className="text-white/60 text-[12.5px] leading-relaxed">{link.description}</p>
        </div>
      </div>

      {/* Info chips */}
      <div data-ev-id="ev_3553ee75fc" className="flex gap-2 flex-wrap mb-5">
        <span data-ev-id="ev_f32b6d5c68"
        className="text-[10px] px-3 py-1.5 rounded-full font-medium"
        style={{ backgroundColor: `${link.color}12`, color: `${link.color}aa` }}>
          AI מומלץ
        </span>
        <span data-ev-id="ev_686af91c96" className="text-[10px] px-3 py-1.5 rounded-full bg-white/[0.04] text-white/60 font-medium">
          nVision ★
        </span>
      </div>

      {/* Screenshots placeholder */}
      <div data-ev-id="ev_f42cd0e3a8" className="mt-1 flex gap-2.5 overflow-x-auto pb-4" dir="ltr" style={{ scrollbarWidth: 'none' }}>
        {[1, 2, 3].map((i) =>
        <div data-ev-id="ev_f7d498465a"
        key={i}
        className="w-[100px] h-[170px] rounded-2xl flex-shrink-0 flex items-center justify-center"
        style={{
          background: `linear-gradient(180deg, ${link.color}06, ${link.color}02)`,
          border: `1px solid ${link.color}0a`
        }}>
            <span data-ev-id="ev_73757fbd9b" className="text-[9px] text-white/60">תצוגה {i}</span>
          </div>
        )}
      </div>
    </div>);

};