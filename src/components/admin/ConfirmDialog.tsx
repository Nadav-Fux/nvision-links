import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'אישור',
  cancelLabel = 'ביטול',
  variant = 'danger',
  onConfirm,
  onCancel
}: ConfirmDialogProps) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus trap + auto-focus cancel button
  useEffect(() => {
    if (open && cancelRef.current) {
      cancelRef.current.focus();
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  const isDanger = variant === 'danger';

  return (
    <div data-ev-id="ev_a0e6e799a3"
    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="confirm-title"
    aria-describedby="confirm-message">

      {/* Backdrop */}
      <div data-ev-id="ev_6c992ff48f"
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
      aria-hidden="true" />


      {/* Dialog */}
      <div data-ev-id="ev_f8c57cd59b"
      dir="rtl"
      className="relative w-full max-w-sm rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      style={{
        background: 'linear-gradient(160deg, #15152a 0%, #0e0e1c 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 25px 60px -12px rgba(0,0,0,0.6)'
      }}>

        {/* Close button */}
        <button data-ev-id="ev_75f5f39693"
        onClick={onCancel}
        aria-label="סגור"
        className="absolute top-3 left-3 w-7 h-7 rounded-lg flex items-center justify-center text-white/60 hover:text-white/70 hover:bg-white/[0.06] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

          <X className="w-3.5 h-3.5" />
        </button>

        <div data-ev-id="ev_003d0faae0" className="p-6">
          {/* Icon */}
          <div data-ev-id="ev_89e7a341bc" className="flex justify-center mb-4">
            <div data-ev-id="ev_2d8f3305dc"
            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
            isDanger ?
            'bg-red-500/10 border border-red-500/20' :
            'bg-yellow-500/10 border border-yellow-500/20'}`
            }>

              <AlertTriangle
                className={`w-6 h-6 ${
                isDanger ? 'text-red-400' : 'text-yellow-400'}`
                }
                aria-hidden="true" />

            </div>
          </div>

          {/* Text */}
          <h2 data-ev-id="ev_8f7f1e6bc4"
          id="confirm-title"
          className="text-white/90 text-base font-bold text-center mb-2">

            {title}
          </h2>
          <p data-ev-id="ev_e1942215ad"
          id="confirm-message"
          className="text-white/60 text-sm text-center leading-relaxed">

            {message}
          </p>

          {/* Buttons */}
          <div data-ev-id="ev_96a4002d5b" className="flex items-center gap-2.5 mt-6">
            <button data-ev-id="ev_7c5454a8b0"
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 ${
            isDanger ?
            'bg-red-500/15 border border-red-500/25 text-red-400 hover:bg-red-500/25 focus-visible:ring-red-400' :
            'bg-yellow-500/15 border border-yellow-500/25 text-yellow-400 hover:bg-yellow-500/25 focus-visible:ring-yellow-400'}`
            }>

              {confirmLabel}
            </button>
            <button data-ev-id="ev_f576e5ffab"
            ref={cancelRef}
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white/80 hover:bg-white/[0.1] text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>);

};