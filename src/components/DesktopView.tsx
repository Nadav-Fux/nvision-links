import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import {
  ExternalLink, X, Minus, Maximize2, Minimize2,
  Search, Wifi, Battery, Volume2, ChevronUp } from
'lucide-react';

interface DesktopViewProps {
  sections: LinkSection[];
  visible: boolean;
}

interface WindowState {
  id: string;
  sectionIdx: number;
  x: number;
  y: number;
  w: number;
  h: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
}

const FOLDER_COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#a855f7', '#ec4899'];

/* ══════════════════════════════════════════════
 *  Desktop / OS View
 * ══════════════════════════════════════════════ */
export const DesktopView = ({ sections, visible }: DesktopViewProps) => {
  const [revealed, setRevealed] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [topZ, setTopZ] = useState(10);
  const [startOpen, setStartOpen] = useState(false);
  const [clock, setClock] = useState('');
  const dragRef = useRef<{wId: string;offsetX: number;offsetY: number;} | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setRevealed(true), 200);
      return () => clearTimeout(t);
    }
  }, [visible]);

  // Clock
  useEffect(() => {
    const update = () => {
      const d = new Date();
      setClock(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`);
    };
    update();
    const t = setInterval(update, 10000);
    return () => clearInterval(t);
  }, []);

  const openWindow = useCallback((sIdx: number) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.sectionIdx === sIdx);
      if (existing) {
        // Bring to front / unminimize
        const newZ = topZ + 1;
        setTopZ(newZ);
        return prev.map((w) => w.id === existing.id ? { ...w, minimized: false, zIndex: newZ } : w);
      }
      const newZ = topZ + 1;
      setTopZ(newZ);
      const baseX = 40 + sIdx * 30 % 200;
      const baseY = 20 + sIdx * 25 % 120;
      return [...prev, {
        id: `win-${sIdx}`,
        sectionIdx: sIdx,
        x: baseX,
        y: baseY,
        w: 380,
        h: 320,
        minimized: false,
        maximized: false,
        zIndex: newZ
      }];
    });
    setStartOpen(false);
  }, [topZ]);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => w.id === id ? { ...w, minimized: true } : w));
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => w.id === id ? { ...w, maximized: !w.maximized } : w));
  }, []);

  const bringToFront = useCallback((id: string) => {
    const newZ = topZ + 1;
    setTopZ(newZ);
    setWindows((prev) => prev.map((w) => w.id === id ? { ...w, zIndex: newZ } : w));
  }, [topZ]);

  // Drag handling
  const handleMouseDown = useCallback((e: React.MouseEvent, wId: string) => {
    const win = windows.find((w) => w.id === wId);
    if (!win || win.maximized) return;
    bringToFront(wId);
    dragRef.current = {
      wId,
      offsetX: e.clientX - win.x,
      offsetY: e.clientY - win.y
    };
  }, [windows, bringToFront]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current) return;
    const { wId, offsetX, offsetY } = dragRef.current;
    const newX = Math.max(0, e.clientX - offsetX);
    const newY = Math.max(0, e.clientY - offsetY);
    setWindows((prev) => prev.map((w) => w.id === wId ? { ...w, x: newX, y: newY } : w));
  }, []);

  const handleMouseUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  return (
    <div data-ev-id="ev_35c528bf1d"
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      <div data-ev-id="ev_c022642690"
      className="mx-auto max-w-5xl rounded-xl overflow-hidden border border-white/[0.08]"
      style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>

        {/* Desktop area */}
        <div data-ev-id="ev_51bce7d99c"
        ref={desktopRef}
        className="relative select-none"
        style={{
          height: 520,
          background: 'linear-gradient(135deg, #0c1929 0%, #1a0a2e 40%, #0d1f3c 70%, #0a1628 100%)',
          cursor: dragRef.current ? 'grabbing' : 'default'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={() => startOpen && setStartOpen(false)}>

          {/* Desktop icons */}
          <div data-ev-id="ev_58e99ff4f5" className="absolute top-3 right-3 flex flex-col gap-3 z-[1]">
            {sections.map((section, sIdx) =>
            <button data-ev-id="ev_c56653d553"
            key={section.id}
            onDoubleClick={() => openWindow(sIdx)}
            onClick={() => openWindow(sIdx)}
            className="flex flex-col items-center gap-1 w-16 py-1.5 rounded-lg hover:bg-white/[0.08] transition-colors group">

                <div data-ev-id="ev_27e6828fbb"
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
              style={{ background: FOLDER_COLORS[sIdx % FOLDER_COLORS.length] + '25' }}>

                  {section.emoji}
                </div>
                <span data-ev-id="ev_5ba7616aa6" className="text-white/70 text-[9px] text-center leading-tight font-medium group-hover:text-white transition-colors line-clamp-2">
                  {section.title}
                </span>
              </button>
            )}
          </div>

          {/* Windows */}
          {windows.map((win) => {
            if (win.minimized) return null;
            const section = sections[win.sectionIdx];
            if (!section) return null;
            const color = FOLDER_COLORS[win.sectionIdx % FOLDER_COLORS.length];

            const style: React.CSSProperties = win.maximized ?
            { top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', zIndex: win.zIndex } :
            { top: win.y, left: win.x, width: win.w, height: win.h, zIndex: win.zIndex };

            return (
              <div data-ev-id="ev_8ff39ecad5"
              key={win.id}
              className="absolute rounded-lg overflow-hidden flex flex-col"
              style={{
                ...style,
                background: 'rgba(22,22,30,0.97)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 15px 40px rgba(0,0,0,0.5)'
              }}
              onMouseDown={() => bringToFront(win.id)}>

                {/* Title bar */}
                <div data-ev-id="ev_325f91cf78"
                className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06] cursor-grab active:cursor-grabbing flex-shrink-0"
                onMouseDown={(e) => handleMouseDown(e, win.id)}
                style={{ background: 'rgba(30,30,40,0.98)' }}>

                  <span data-ev-id="ev_5ee453abce" className="text-xs">{section.emoji}</span>
                  <span data-ev-id="ev_1aaf418262" className="text-white/70 text-[11px] font-medium flex-1 truncate">{section.title}</span>
                  <div data-ev-id="ev_61091e289f" className="flex items-center gap-1">
                    <button data-ev-id="ev_693bb81059"
                    onClick={(e) => {e.stopPropagation();minimizeWindow(win.id);}}
                    className="w-5 h-5 rounded flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white/60 transition-colors">

                      <Minus className="w-3 h-3" />
                    </button>
                    <button data-ev-id="ev_02bf344d7f"
                    onClick={(e) => {e.stopPropagation();toggleMaximize(win.id);}}
                    className="w-5 h-5 rounded flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white/60 transition-colors">

                      {win.maximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                    </button>
                    <button data-ev-id="ev_615501bb4c"
                    onClick={(e) => {e.stopPropagation();closeWindow(win.id);}}
                    className="w-5 h-5 rounded flex items-center justify-center text-white/60 hover:bg-red-500/80 hover:text-white transition-colors">

                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Window content */}
                <div data-ev-id="ev_9ec7679681" className="flex-1 overflow-y-auto scrollbar-hide">
                  {/* Folder header */}
                  <div data-ev-id="ev_a53bce1792" className="px-3 py-2 border-b border-white/[0.04] flex items-center gap-2">
                    <span data-ev-id="ev_ae87489ef9" className="text-white/60 text-[10px] font-mono">
                      nVision &gt; {section.title}
                    </span>
                    <span data-ev-id="ev_6f0ccad2aa" className="text-white/60 text-[10px] font-mono mr-auto">
                      {section.links.length} פריטים
                    </span>
                  </div>

                  {/* Files grid */}
                  <div data-ev-id="ev_8b7e964fa1" className="p-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {section.links.map((link) =>
                    <a data-ev-id="ev_149d134536"
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.title} (נפתח בחלון חדש)`}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-white/[0.06] transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={(e) => e.stopPropagation()}>

                        <div data-ev-id="ev_85e29eb1c8"
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: link.color + '18' }}>

                          <AnimatedIcon icon={link.icon} animation={link.animation} color={link.color} size={20} />
                        </div>
                        <span data-ev-id="ev_9f3cd724d4" className="text-white/60 text-[9px] text-center leading-tight group-hover:text-white/90 transition-colors line-clamp-2 w-full">
                          {link.title}
                        </span>
                        {link.tag &&
                      <span data-ev-id="ev_fc8d794bcf"
                      className="text-[7px] font-bold px-1 py-0.5 rounded"
                      style={{ color: color, background: color + '15' }}>

                            {link.tag === 'free' ? 'חינם' : link.tag === 'deal' ? 'מבצע' : 'Freemium'}
                          </span>
                      }
                      </a>
                    )}
                  </div>
                </div>

                {/* Window status bar */}
                <div data-ev-id="ev_c620a74a9c" className="px-3 py-1 border-t border-white/[0.04] flex items-center gap-2 text-[9px] font-mono text-white/60 flex-shrink-0">
                  <span data-ev-id="ev_1eef3fab2a">{section.links.length} items</span>
                  <span data-ev-id="ev_dc2808feec" className="mr-auto" />
                  <span data-ev-id="ev_099293bb71" style={{ color }}>{section.emoji} {section.title}</span>
                </div>
              </div>);

          })}

          {/* Start menu */}
          {startOpen &&
          <div data-ev-id="ev_5cc3978660"
          className="absolute bottom-12 left-2 w-64 rounded-xl overflow-hidden z-[999]"
          style={{
            background: 'rgba(22,22,30,0.97)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(30px)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
          }}
          onClick={(e) => e.stopPropagation()}>

              {/* Search */}
              <div data-ev-id="ev_b0902f4d80" className="p-3 border-b border-white/[0.06]">
                <div data-ev-id="ev_87ec3639e6" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08]">
                  <Search className="w-3.5 h-3.5 text-white/60" />
                  <span data-ev-id="ev_3d66b5ef45" className="text-white/60 text-[11px]">חיפוש...</span>
                </div>
              </div>
              {/* App list */}
              <div data-ev-id="ev_a9662add82" className="py-1 max-h-[300px] overflow-y-auto scrollbar-hide">
                {sections.map((section, sIdx) =>
              <button data-ev-id="ev_8f28a4c97d"
              key={section.id}
              onClick={() => openWindow(sIdx)}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/[0.06] transition-colors text-right">

                    <div data-ev-id="ev_264af64d68"
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: FOLDER_COLORS[sIdx % FOLDER_COLORS.length] + '25' }}>

                      <span data-ev-id="ev_4207c37090" className="text-sm">{section.emoji}</span>
                    </div>
                    <div data-ev-id="ev_72d95924ef" className="flex-1 min-w-0">
                      <div data-ev-id="ev_158531f1a1" className="text-white/70 text-[11px] font-medium truncate">{section.title}</div>
                      <div data-ev-id="ev_3bede407bd" className="text-white/60 text-[9px]">{section.links.length} פריטים</div>
                    </div>
                  </button>
              )}
              </div>
              {/* Footer */}
              <div data-ev-id="ev_90d4940e4c" className="px-4 py-2 border-t border-white/[0.06] flex items-center gap-2">
                <div data-ev-id="ev_baad13ad8a" className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span data-ev-id="ev_e1fd172799" className="text-[10px]">N</span>
                </div>
                <span data-ev-id="ev_c47128ec5f" className="text-white/60 text-[10px]">nVision User</span>
              </div>
            </div>
          }
        </div>

        {/* Taskbar */}
        <div data-ev-id="ev_2a09b5d13c"
        className="flex items-center gap-1 px-2 py-1.5 border-t"
        style={{
          background: 'rgba(18,18,24,0.98)',
          borderColor: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)'
        }}>

          {/* Start button */}
          <button data-ev-id="ev_8862387e3d"
          onClick={() => setStartOpen(!startOpen)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
          startOpen ? 'bg-white/10' : 'hover:bg-white/[0.06]'}`
          }>

            <svg data-ev-id="ev_6a86b2e56b" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect data-ev-id="ev_f9a8519c96" x="1" y="1" width="6" height="6" rx="1" fill="#3b82f6" opacity="0.8" />
              <rect data-ev-id="ev_666828501c" x="9" y="1" width="6" height="6" rx="1" fill="#22c55e" opacity="0.8" />
              <rect data-ev-id="ev_a137e32732" x="1" y="9" width="6" height="6" rx="1" fill="#f59e0b" opacity="0.8" />
              <rect data-ev-id="ev_ec9c4afd8c" x="9" y="9" width="6" height="6" rx="1" fill="#ef4444" opacity="0.8" />
            </svg>
          </button>

          {/* Separator */}
          <div data-ev-id="ev_0190eb2963" className="w-px h-5 bg-white/[0.06] mx-1" />

          {/* Open windows in taskbar */}
          <div data-ev-id="ev_b0f3cd0b46" className="flex items-center gap-1 flex-1 overflow-x-auto scrollbar-hide">
            {windows.map((win) => {
              const section = sections[win.sectionIdx];
              if (!section) return null;
              const color = FOLDER_COLORS[win.sectionIdx % FOLDER_COLORS.length];
              return (
                <button data-ev-id="ev_c13ae08863"
                key={win.id}
                onClick={() => {
                  if (win.minimized) {
                    const newZ = topZ + 1;
                    setTopZ(newZ);
                    setWindows((prev) => prev.map((w) => w.id === win.id ? { ...w, minimized: false, zIndex: newZ } : w));
                  } else {
                    minimizeWindow(win.id);
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] transition-colors flex-shrink-0 ${
                !win.minimized ? 'bg-white/[0.08] text-white/70' : 'text-white/60 hover:bg-white/[0.04]'}`
                }>

                  <span data-ev-id="ev_39e120c064" className="text-xs">{section.emoji}</span>
                  <span data-ev-id="ev_210c82a4e9" className="max-w-[80px] truncate">{section.title}</span>
                  {!win.minimized &&
                  <div data-ev-id="ev_43606cc164" className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
                  }
                </button>);

            })}
          </div>

          {/* System tray */}
          <div data-ev-id="ev_a010b88171" className="flex items-center gap-2 text-white/60">
            <ChevronUp className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Volume2 className="w-3 h-3" />
            <Battery className="w-3 h-3" />
            <div data-ev-id="ev_8bd226ea87" className="flex flex-col items-end mr-1">
              <span data-ev-id="ev_e8dc07e69b" className="text-[10px] font-mono text-white/60 leading-none">{clock}</span>
              <span data-ev-id="ev_4d05635fb7" className="text-[8px] font-mono text-white/60 leading-none">
                {new Date().toLocaleDateString('he-IL')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default DesktopView;