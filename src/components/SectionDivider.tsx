import type { ReactNode } from 'react';

interface SectionDividerProps {
  title: string;
  emoji: ReactNode;
  visible: boolean;
  delay: number;
  action?: ReactNode;
}

export const SectionDivider = ({ title, emoji, visible, delay, action }: SectionDividerProps) => {
  const html = getSvgForTitle(title);
  
  return (
    <div
      className={`flex items-center gap-4 mb-6 transition-[opacity,transform] duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex-1 h-px bg-gradient-to-l from-primary/20 to-transparent" aria-hidden="true" />
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.06]">
        <h2 className="text-white/80 text-base sm:text-lg font-semibold tracking-wide">
          {title}
        </h2>
        {html && (
          <span
            aria-hidden="true"
            className="flex items-center"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
        {action && (
          <>
            <div className="w-px h-5 bg-white/10 mx-1" aria-hidden="true" />
            {action}
          </>
        )}
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" aria-hidden="true" />
    </div>
  );
};

function getSvgForTitle(title: string): string | null {
  const icons: Record<string, string> = {
    'כלי Vibe Coding': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="3" width="20" height="14" rx="2" stroke="#a78bfa" stroke-width="1.5" fill="#a78bfa" fill-opacity="0.08"/><path d="M8 8L5.5 10.5L8 13" stroke="#06b6d4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/></path><path d="M16 8L18.5 10.5L16 13" stroke="#ec4899" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/></path><line x1="13" y1="7" x2="11" y2="14" stroke="#fbbf24" stroke-width="1.3" stroke-linecap="round" opacity="0.7"/><rect x="11.5" y="10" width="1" height="3" rx="0.5" fill="#22d3ee"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></rect><line x1="12" y1="17" x2="12" y2="19.5" stroke="#a78bfa" stroke-width="1.3" opacity="0.5"/><line x1="8" y1="20" x2="16" y2="20" stroke="#a78bfa" stroke-width="1.3" stroke-linecap="round" opacity="0.5"/><circle cx="20" cy="5" r="0.8" fill="#fbbf24"><animate attributeName="r" values="0.8;1.2;0.8" dur="1.5s" repeatCount="indefinite"/></circle></svg>',
    'מודלים ותשתיות': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4C9.5 4 7.5 5.5 7 7.5C5.5 7.8 4 9.5 4 11.5C4 13.5 5.2 15 6.5 15.5C6.8 17.5 8.5 19 11 19.5V12" stroke="#8b5cf6" stroke-width="1.4" stroke-linecap="round" fill="#8b5cf6" fill-opacity="0.06"><animate attributeName="fill-opacity" values="0.06;0.12;0.06" dur="3s" repeatCount="indefinite"/></path><path d="M12 4C14.5 4 16.5 5.5 17 7.5C18.5 7.8 20 9.5 20 11.5C20 13.5 18.8 15 17.5 15.5C17.2 17.5 15.5 19 13 19.5V12" stroke="#ec4899" stroke-width="1.4" stroke-linecap="round" fill="#ec4899" fill-opacity="0.06"><animate attributeName="fill-opacity" values="0.06;0.12;0.06" dur="3s" begin="0.3s" repeatCount="indefinite"/></path><circle cx="9" cy="9" r="0.7" fill="#06b6d4"><animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite"/></circle><circle cx="15" cy="9" r="0.7" fill="#06b6d4"><animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" begin="0.5s" repeatCount="indefinite"/></circle><circle cx="8" cy="13" r="0.7" fill="#fbbf24"><animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="0.2s" repeatCount="indefinite"/></circle><circle cx="16" cy="13" r="0.7" fill="#fbbf24"><animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="0.7s" repeatCount="indefinite"/></circle><circle cx="12" cy="11" r="0.8" fill="#22d3ee"><animate attributeName="r" values="0.8;1.2;0.8" dur="2s" repeatCount="indefinite"/></circle></svg>',
    'גרפיקה, וידאו ואודיו': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2.5" stroke="#a78bfa" stroke-width="1.3" fill="#a78bfa" fill-opacity="0.05"/><path d="M6 15C8 11 10 9 13 10C16 11 17 8 19 7" stroke="#ec4899" stroke-width="2" stroke-linecap="round" opacity="0.7"><animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite"/></path><circle cx="7" cy="7" r="1.5" fill="#f87171"><animate attributeName="r" values="1.5;1.8;1.5" dur="2s" repeatCount="indefinite"/></circle><circle cx="11" cy="6" r="1.5" fill="#fbbf24"><animate attributeName="r" values="1.5;1.8;1.5" dur="2s" begin="0.3s" repeatCount="indefinite"/></circle><circle cx="15" cy="7.5" r="1.5" fill="#34d399"><animate attributeName="r" values="1.5;1.8;1.5" dur="2s" begin="0.6s" repeatCount="indefinite"/></circle><rect x="17" y="13" width="3" height="2" rx="0.5" fill="#06b6d4" opacity="0.5"><animate attributeName="opacity" values="0.3;0.6;0.3" dur="1.5s" repeatCount="indefinite"/></rect><rect x="17" y="16" width="3" height="2" rx="0.5" fill="#06b6d4" opacity="0.5"><animate attributeName="opacity" values="0.3;0.6;0.3" dur="1.5s" begin="0.3s" repeatCount="indefinite"/></rect></svg>',
    'קהילות וקבוצות': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="2.5" fill="#06b6d4" opacity="0.9"><animate attributeName="r" values="2.5;2.8;2.5" dur="3s" repeatCount="indefinite"/></circle><path d="M8 16.5c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#06b6d4" stroke-width="1.5" stroke-linecap="round" opacity="0.9"/><circle cx="5" cy="10" r="1.8" fill="#8b5cf6" opacity="0.7"><animate attributeName="opacity" values="0.7;0.9;0.7" dur="2.5s" repeatCount="indefinite"/></circle><path d="M2 17c0-1.7 1.3-3 3-3s3 1.3 3 3" stroke="#8b5cf6" stroke-width="1.3" stroke-linecap="round" opacity="0.6"/><circle cx="19" cy="10" r="1.8" fill="#ec4899" opacity="0.7"><animate attributeName="opacity" values="0.7;0.9;0.7" dur="2.8s" repeatCount="indefinite"/></circle><path d="M16 17c0-1.7 1.3-3 3-3s3 1.3 3 3" stroke="#ec4899" stroke-width="1.3" stroke-linecap="round" opacity="0.6"/></svg>',
  };
  return icons[title] || null;
}
