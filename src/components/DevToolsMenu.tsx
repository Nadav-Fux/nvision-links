import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Wrench, X, Palette, Film, Rocket } from 'lucide-react';
import { ViewToggle } from '@/components/ViewToggle';
import { VIEW_LABELS } from '@/lib/viewRegistry';
import { ViewToggleIcon } from '@/components/icons/ViewToggleIcon';

const LINKS = [
{ to: '/font-preview', label: 'בחירת טיפוגרפיה', icon: Palette, color: 'cyan' },
{ to: '/animation-preview', label: 'אנימציות לוגו', icon: Film, color: 'purple' },
{ to: '/entrance-preview', label: 'אנימציות כניסה', icon: Rocket, color: 'emerald' }];


const colorMap: Record<string, {bg: string;border: string;text: string;hoverBg: string;}> = {
  cyan: { bg: 'bg-cyan-500/[0.06]', border: 'border-cyan-500/20', text: 'text-cyan-400', hoverBg: 'hover:bg-cyan-500/15' },
  purple: { bg: 'bg-purple-500/[0.06]', border: 'border-purple-500/20', text: 'text-purple-400', hoverBg: 'hover:bg-purple-500/15' },
  emerald: { bg: 'bg-emerald-500/[0.06]', border: 'border-emerald-500/20', text: 'text-emerald-400', hoverBg: 'hover:bg-emerald-500/15' }
};

interface DevToolsMenuProps {
  activeView?: number;
  onViewChange?: (view: number) => void;
}

export const DevToolsMenu = ({ activeView = 1, onViewChange }: DevToolsMenuProps) => {
  const [open, setOpen] = useState(false);
  const [showViews, setShowViews] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setShowViews(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on route change
  useEffect(() => {
    setOpen(false);
    setShowViews(false);
  }, [location.pathname]);

  const handleViewChange = (view: number) => {
    onViewChange?.(view);
    setShowViews(false);
    setOpen(false);
  };

  return (
    <div data-ev-id="ev_1c98d35301" ref={menuRef} className="fixed top-4 left-4 z-50" dir="rtl">
      {/* Toggle button */}
      <button data-ev-id="ev_9b319a8314"
      onClick={() => setOpen((o) => !o)}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 backdrop-blur-xl shadow-lg ${
      open ?
      'bg-white/10 border border-white/20 text-white rotate-90' :
      'bg-white/[0.04] border border-white/[0.06] text-white/60 hover:text-white/60 hover:border-white/15 hover:bg-white/[0.08]'}`
      }
      aria-label="כלי פיתוח">

        {open ? <X className="w-4 h-4" /> : <Wrench className="w-4 h-4" />}
      </button>

      {/* Dropdown */}
      <div data-ev-id="ev_840f15ca16"
      className={`absolute top-12 left-0 min-w-[220px] rounded-xl border border-white/10 bg-[#0c0d16]/95 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-200 origin-top-left ${
      open ?
      'opacity-100 scale-100 translate-y-0' :
      'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`
      }>

        <div data-ev-id="ev_c9022c6bb8" className="px-3 py-2 border-b border-white/5">
          <span data-ev-id="ev_5bddba7097" className="text-[10px] font-bold text-white/60 tracking-wider">כלי פיתוח</span>
        </div>
        <div data-ev-id="ev_848d02416d" className="p-1.5 space-y-0.5">
          {LINKS.map((link) => {
            const Icon = link.icon;
            const c = colorMap[link.color];
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                isActive ?
                `${c.bg} ${c.border} ${c.text}` :
                `border-transparent text-white/60 hover:text-white/80 ${c.hoverBg}`}`
                }>

                <Icon className="w-4 h-4 flex-shrink-0" />
                <span data-ev-id="ev_1f04ec79a2">{link.label}</span>
              </Link>);
          })}

          {/* View toggle option */}
          {onViewChange &&
          <button data-ev-id="ev_9ff7c913f4"
          onClick={() => setShowViews((v) => !v)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
          showViews ?
          'bg-amber-500/[0.06] border-amber-500/20 text-amber-400' :
          'border-transparent text-white/60 hover:text-white/80 hover:bg-amber-500/15'}`
          }>

              <ViewToggleIcon size={16} />
              <span data-ev-id="ev_9a0650bfb7">שנה תצוגה</span>
              <span data-ev-id="ev_aa35e3128c" className="mr-auto text-[10px] text-white/60">{VIEW_LABELS[activeView] || ''}</span>
            </button>
          }
        </div>

        {/* View picker panel */}
        {showViews && onViewChange &&
        <div data-ev-id="ev_c27a7f6dd4" className="border-t border-white/5 p-2 max-h-[50vh] overflow-y-auto">
            <ViewToggle activeView={activeView} onChange={handleViewChange} />
          </div>
        }

        <div data-ev-id="ev_ce094c8531" className="px-3 py-2 border-t border-white/5">
          <span data-ev-id="ev_77ed81db5b" className="text-[9px] text-white/60">זמני — יוסר לאחר בחירה</span>
        </div>
      </div>
    </div>);
};