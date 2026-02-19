import { useState, useEffect, useRef, useCallback } from 'react';
import { Monitor, Smartphone, X, ExternalLink, RefreshCw } from 'lucide-react';

interface SitePreviewProps {
  open: boolean;
  onClose: () => void;
}

export const SitePreview = ({ open, onClose }: SitePreviewProps) => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [key, setKey] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Auto-focus close button on open
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  // Focus trap
  const handleTrapKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }, []);

  if (!open) return null;

  return (
    <div
      data-ev-id="ev_2c12346cd7"
      className="fixed inset-0 z-[9990] flex"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label="תצוגה מקדימה של האתר"
      onKeyDown={handleTrapKeyDown}
      ref={panelRef}>

      {/* Backdrop */}
      <div data-ev-id="ev_865d118819" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div data-ev-id="ev_4d1d578dbb" className="relative mr-auto w-full max-w-[700px] h-full bg-[#0a0a14] border-r border-white/[0.08] flex flex-col shadow-2xl transition-transform duration-300"
        style={{ animation: 'sitePreviewSlideIn 0.3s ease-out both' }}>
        {/* Header */}
        <div data-ev-id="ev_398e53cba8" className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] flex-shrink-0">
          <div data-ev-id="ev_2c6977564b" className="flex items-center gap-3">
            <h3 data-ev-id="ev_0294a584c8" className="text-white/80 text-sm font-semibold">תצוגה מקדימה</h3>
            <div data-ev-id="ev_e3e76dc555" className="flex items-center bg-white/[0.04] rounded-lg p-0.5 gap-0.5">
              <button data-ev-id="ev_9da5111f80"
              onClick={() => setDevice('desktop')}
              aria-pressed={device === 'desktop'}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all ${
              device === 'desktop' ? 'bg-primary/20 text-primary' : 'text-white/30 hover:text-white/60'}`
              }>
                <Monitor className="w-3 h-3" />
                <span data-ev-id="ev_ffcaecf838" className="hidden sm:inline">מחשב</span>
              </button>
              <button data-ev-id="ev_527a7740d9"
              onClick={() => setDevice('mobile')}
              aria-pressed={device === 'mobile'}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all ${
              device === 'mobile' ? 'bg-primary/20 text-primary' : 'text-white/30 hover:text-white/60'}`
              }>
                <Smartphone className="w-3 h-3" />
                <span data-ev-id="ev_d0dc12d5b2" className="hidden sm:inline">נייד</span>
              </button>
            </div>
          </div>
          <div data-ev-id="ev_49a8b4de5a" className="flex items-center gap-2">
            <button data-ev-id="ev_99188d57ec"
            onClick={() => setKey((k) => k + 1)}
            aria-label="רענן תצוגה מקדימה"
            className="p-1.5 rounded-lg text-white/30 hover:text-white/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <a data-ev-id="ev_a92be84229"
            href="/" target="_blank" rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-white/30 hover:text-white/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="פתח בחלון חדש">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button data-ev-id="ev_4d08b9201f" ref={closeRef} onClick={onClose} aria-label="סגור תצוגה מקדימה"
            className="p-1.5 rounded-lg text-white/30 hover:text-white/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* iframe */}
        <div data-ev-id="ev_998a7637ae" className="flex-1 flex items-center justify-center p-4 overflow-hidden">
          <div data-ev-id="ev_daa6b02a28"
          className={`bg-black rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl transition-all duration-300 ${
          device === 'mobile' ?
          'w-[375px] h-full max-h-[812px] rounded-3xl border-[3px] border-white/[0.12]' :
          'w-full h-full'}`
          }>
            <iframe data-ev-id="ev_8ff8728b1b"
            key={key}
            src="/"
            title="תצוגה מקדימה של האתר"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin" />
          </div>
        </div>
      </div>
    </div>);
};
