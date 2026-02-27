import type { ReactNode } from 'react';

interface SectionDividerProps {
  title: string;
  emoji: ReactNode;
  visible: boolean;
  delay: number;
  action?: ReactNode;
}

export const SectionDivider = ({ title, emoji, visible, delay, action }: SectionDividerProps) => {
  const icon = getSvgForTitle(title);

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
        {icon && (
          <span aria-hidden="true" className="flex items-center">
            {icon}
          </span>
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

function getSvgForTitle(title: string): ReactNode | null {
  const icons: Record<string, ReactNode> = {
    'כלי Vibe Coding': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="28" height="20" rx="3" stroke="#a78bfa" strokeWidth="2" fill="#a78bfa" fillOpacity="0.1" />
        <path d="M10 11L5 16L10 21" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <animate attributeName="stroke-opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
        </path>
        <path d="M22 11L27 16L22 21" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <animate attributeName="stroke-opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
        </path>
        <line x1="17" y1="10" x2="15" y2="22" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
        <rect x="12" y="15" width="2" height="4" rx="1" fill="#22d3ee">
          <animate attributeName="opacity" values="1;0;1" dur="0.8s" repeatCount="indefinite" />
        </rect>
        <line x1="16" y1="24" x2="16" y2="28" stroke="#a78bfa" strokeWidth="2" opacity="0.6" />
        <line x1="10" y1="28" x2="22" y2="28" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
    'מודלים ותשתיות': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="14" r="10" stroke="#8b5cf6" strokeWidth="2" fill="#8b5cf6" fillOpacity="0.1">
          <animate attributeName="fill-opacity" values="0.1;0.2;0.1" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="12" cy="11" r="2" fill="#06b6d4">
          <animate attributeName="r" values="2;2.5;2" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="20" cy="11" r="2" fill="#ec4899">
          <animate attributeName="r" values="2;2.5;2" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
        </circle>
        <circle cx="16" cy="17" r="2" fill="#fbbf24">
          <animate attributeName="r" values="2;2.5;2" dur="1.5s" begin="0.6s" repeatCount="indefinite" />
        </circle>
        <line x1="12" y1="11" x2="20" y2="11" stroke="#a78bfa" strokeWidth="1.5" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1s" repeatCount="indefinite" />
        </line>
        <line x1="12" y1="11" x2="16" y2="17" stroke="#a78bfa" strokeWidth="1.5" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1s" begin="0.2s" repeatCount="indefinite" />
        </line>
        <line x1="20" y1="11" x2="16" y2="17" stroke="#a78bfa" strokeWidth="1.5" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1s" begin="0.4s" repeatCount="indefinite" />
        </line>
        <path d="M10 26L16 22L22 26" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <circle cx="16" cy="22" r="1.5" fill="#22d3ee">
          <animate attributeName="r" values="1.5;2;1.5" dur="1s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    'גרפיקה, וידאו ואודיו': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="26" height="26" rx="3" stroke="#a78bfa" strokeWidth="2" fill="#a78bfa" fillOpacity="0.05" />
        <circle cx="10" cy="10" r="3" fill="#f87171">
          <animate attributeName="r" values="3;3.5;3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="16" cy="8" r="2.5" fill="#fbbf24">
          <animate attributeName="r" values="2.5;3;2.5" dur="2s" begin="0.3s" repeatCount="indefinite" />
        </circle>
        <circle cx="22" cy="10" r="2" fill="#34d399">
          <animate attributeName="r" values="2;2.5;2" dur="2s" begin="0.6s" repeatCount="indefinite" />
        </circle>
        <path d="M6 22C10 16 14 14 18 15C22 16 24 12 28 10" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round">
          <animate attributeName="stroke-dasharray" values="0,100;50,50;0,100" dur="3s" repeatCount="indefinite" />
        </path>
        <rect x="22" y="18" width="5" height="3" rx="1" fill="#06b6d4" opacity="0.7">
          <animate attributeName="width" values="5;7;5" dur="1.5s" repeatCount="indefinite" />
        </rect>
        <rect x="22" y="23" width="5" height="3" rx="1" fill="#06b6d4" opacity="0.5">
          <animate attributeName="width" values="5;6;5" dur="1.8s" repeatCount="indefinite" />
        </rect>
      </svg>
    ),
    'קהילות וקבוצות': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="10" r="4" fill="#06b6d4">
          <animate attributeName="r" values="4;4.5;4" dur="2s" repeatCount="indefinite" />
        </circle>
        <path d="M10 24c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="6" cy="14" r="3" fill="#8b5cf6">
          <animate attributeName="fill-opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
        </circle>
        <path d="M1 26c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <circle cx="26" cy="14" r="3" fill="#ec4899">
          <animate attributeName="fill-opacity" values="0.7;1;0.7" dur="2s" begin="0.5s" repeatCount="indefinite" />
        </circle>
        <path d="M21 26c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <line x1="10" y1="12" x2="13" y2="10" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.5s" repeatCount="indefinite" />
        </line>
        <line x1="22" y1="12" x2="19" y2="10" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
        </line>
      </svg>
    ),
  };
  return icons[title] || null;
}
