import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

export const StatsBar = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div data-ev-id="ev_fb5e3af0d6"
    role="region"
    aria-label="סטטיסטיקות הקהילה"
    className={`flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 md:gap-10 py-4 transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`
    }>

      <div data-ev-id="ev_d536646d63"
      className={`group flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-white/[0.04] transition-[opacity,transform,border-color] duration-500 hover:border-white/[0.08] ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`
      }
      style={{
        transitionDelay: '800ms',
        background: 'linear-gradient(135deg, #22d3ee05, transparent)'
      }}>

        <div data-ev-id="ev_ca9c82b2ea"
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
        aria-hidden="true"
        style={{
          backgroundColor: '#22d3ee10',
          border: '1px solid #22d3ee15'
        }}>

          <TrendingUp
            className="w-4 h-4 sm:w-[18px] sm:h-[18px] transition-colors duration-300"
            style={{ color: '#22d3eecc' }} />

        </div>
        <div data-ev-id="ev_dbad4bf7f1" className="flex flex-col">
          <span data-ev-id="ev_8be32c5185" className="text-sm sm:text-base leading-tight font-bold" style={{ color: '#22d3ee' }}>
            כל יום
          </span>
          <span data-ev-id="ev_21debb7389" className="text-[11px] sm:text-xs text-white/55 leading-tight mt-0.5">
            תכנים חדשים בעולם ה-AI
          </span>
        </div>
      </div>
    </div>);

};