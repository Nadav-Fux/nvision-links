import { useState, useRef } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const QR_SIZE = 200;
const DEFAULT_URL = 'https://nvision.digital';

function getQRUrl(text: string, size: number = QR_SIZE): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&format=svg&margin=8&color=06b6d4&bgcolor=0a0a14`;
}

export const QRCodeGenerator = () => {
  const [url, setUrl] = useState(DEFAULT_URL);
  const [copied, setCopied] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const qrUrl = getQRUrl(url || DEFAULT_URL, QR_SIZE * 2);

  const handleDownload = async () => {
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'nvision-qr-code.svg';
      a.click();
      URL.revokeObjectURL(blobUrl);
      toast.success('QR Code הורד בהצלחה');
    } catch {
      toast.error('שגיאה בהורדת QR');
    }
  };

  const handleCopy = async () => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = url || DEFAULT_URL;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('כתובת האתר הועתקה ללוח');
    } catch {
      toast.error('לא ניתן להעתיק');
    }
  };

  return (
    <div data-ev-id="ev_0ec0972396" className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
      <div data-ev-id="ev_cdfe341503" className="flex flex-col sm:flex-row gap-5 items-start">
        {/* QR Preview */}
        <div data-ev-id="ev_a2dc158579" className="flex flex-col items-center gap-3 flex-shrink-0">
          <div data-ev-id="ev_700166b8b7" className="w-[180px] h-[180px] rounded-xl bg-[#0a0a14] border border-white/[0.08] p-3 flex items-center justify-center">
            <img data-ev-id="ev_976a87987a"
            ref={imgRef}
            src={qrUrl}
            alt="QR Code לאתר"
            className="w-full h-full"
            loading="lazy" />

          </div>
          <div data-ev-id="ev_526c9b0357" className="flex gap-2">
            <button data-ev-id="ev_40f59181dd"
            onClick={handleDownload}
            aria-label="הורד QR"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white/70 border border-white/[0.08] hover:border-white/[0.15] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

              <Download className="w-3 h-3" /> הורד
            </button>
            <button data-ev-id="ev_33be4df694"
            onClick={handleCopy}
            aria-label="העתק QR"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white/70 border border-white/[0.08] hover:border-white/[0.15] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'הועתק' : 'העתק'}
            </button>
          </div>
        </div>

        {/* Settings */}
        <div data-ev-id="ev_e223bb39f0" className="flex-1 space-y-3 w-full">
          <div data-ev-id="ev_566f518584">
            <label data-ev-id="ev_76f7bfe3b3" htmlFor="qr-url" className="text-white/50 text-xs font-medium mb-1.5 block">כתובת האתר</label>
            <input data-ev-id="ev_6795b30d42"
            id="qr-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://nvision.digital"
            dir="ltr"
            className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white/80 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary/40 transition-all" />

          </div>
          <p data-ev-id="ev_60a0bd5f8e" className="text-white/25 text-xs leading-relaxed">
            ה QR Code נוצר באופן אוטומטי. אפשר להוריד כ-SVG (איכות גבוהה להדפסה) או להעתיק ללוח.
          </p>
        </div>
      </div>
    </div>);

};