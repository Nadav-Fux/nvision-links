import type { ReactNode } from 'react';

/** Animated SVG icons for section tabs — matches SectionDivider icons */
export function getSectionIcon(title: string): ReactNode {
  const icons: Record<string, ReactNode> = {
    'קהילות וקבוצות': (
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="10" r="4" fill="#06b6d4"><animate attributeName="r" values="4;4.5;4" dur="2s" repeatCount="indefinite" /></circle>
        <path d="M10 24c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="6" cy="14" r="3" fill="#8b5cf6"><animate attributeName="fill-opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" /></circle>
        <circle cx="26" cy="14" r="3" fill="#ec4899"><animate attributeName="fill-opacity" values="0.7;1;0.7" dur="2s" begin="0.5s" repeatCount="indefinite" /></circle>
      </svg>
    ),
    'כלי Vibe Coding': (
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
        <rect x="2" y="4" width="28" height="20" rx="3" stroke="#a78bfa" strokeWidth="2" fill="#a78bfa" fillOpacity="0.1" />
        <path d="M10 11L5 16L10 21" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><animate attributeName="stroke-opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" /></path>
        <path d="M22 11L27 16L22 21" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><animate attributeName="stroke-opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" /></path>
        <line x1="17" y1="10" x2="15" y2="22" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    'מודלים ותשתיות': (
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="14" r="10" stroke="#8b5cf6" strokeWidth="2" fill="#8b5cf6" fillOpacity="0.1"><animate attributeName="fill-opacity" values="0.1;0.2;0.1" dur="2s" repeatCount="indefinite" /></circle>
        <circle cx="12" cy="11" r="2" fill="#06b6d4"><animate attributeName="r" values="2;2.5;2" dur="1.5s" repeatCount="indefinite" /></circle>
        <circle cx="20" cy="11" r="2" fill="#ec4899"><animate attributeName="r" values="2;2.5;2" dur="1.5s" begin="0.3s" repeatCount="indefinite" /></circle>
        <circle cx="16" cy="17" r="2" fill="#fbbf24"><animate attributeName="r" values="2;2.5;2" dur="1.5s" begin="0.6s" repeatCount="indefinite" /></circle>
      </svg>
    ),
    'גרפיקה, וידאו ואודיו': (
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
        <rect x="3" y="3" width="26" height="26" rx="3" stroke="#a78bfa" strokeWidth="2" fill="#a78bfa" fillOpacity="0.05" />
        <circle cx="10" cy="10" r="3" fill="#f87171"><animate attributeName="r" values="3;3.5;3" dur="2s" repeatCount="indefinite" /></circle>
        <circle cx="16" cy="8" r="2.5" fill="#fbbf24"><animate attributeName="r" values="2.5;3;2.5" dur="2s" begin="0.3s" repeatCount="indefinite" /></circle>
        <circle cx="22" cy="10" r="2" fill="#34d399"><animate attributeName="r" values="2;2.5;2" dur="2s" begin="0.6s" repeatCount="indefinite" /></circle>
      </svg>
    ),
  };
  return icons[title] || null;
}
