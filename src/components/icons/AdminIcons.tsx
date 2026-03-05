import type { ReactNode } from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

/** Bar chart with animated rising bars and pulsing data point */
export const AnalyticsIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2.5" stroke="#8b5cf6" strokeWidth="1.3" fill="#8b5cf6" fillOpacity="0.06" />
    <rect x="6" y="14" width="2.5" height="5" rx="0.8" fill="#06b6d4">
      <animate attributeName="height" values="5;7;5" dur="2s" repeatCount="indefinite" />
      <animate attributeName="y" values="14;12;14" dur="2s" repeatCount="indefinite" />
    </rect>
    <rect x="10.5" y="10" width="2.5" height="9" rx="0.8" fill="#a78bfa">
      <animate attributeName="height" values="9;11;9" dur="2s" begin="0.3s" repeatCount="indefinite" />
      <animate attributeName="y" values="10;8;10" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </rect>
    <rect x="15" y="7" width="2.5" height="12" rx="0.8" fill="#ec4899">
      <animate attributeName="height" values="12;13;12" dur="2s" begin="0.6s" repeatCount="indefinite" />
      <animate attributeName="y" values="7;6;7" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </rect>
    <circle cx="17.5" cy="6" r="1" fill="#fbbf24">
      <animate attributeName="r" values="1;1.4;1" dur="1.5s" repeatCount="indefinite" />
    </circle>
  </svg>
);

/** Globe with orbiting dots for SEO/social sharing */
export const SEOIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke="#06b6d4" strokeWidth="1.3" fill="#06b6d4" fillOpacity="0.06">
      <animate attributeName="fill-opacity" values="0.06;0.12;0.06" dur="3s" repeatCount="indefinite" />
    </circle>
    <ellipse cx="12" cy="12" rx="4" ry="9" stroke="#06b6d4" strokeWidth="1" opacity="0.4" />
    <line x1="3" y1="12" x2="21" y2="12" stroke="#06b6d4" strokeWidth="0.8" opacity="0.3" />
    <line x1="4.5" y1="8" x2="19.5" y2="8" stroke="#06b6d4" strokeWidth="0.6" opacity="0.2" />
    <line x1="4.5" y1="16" x2="19.5" y2="16" stroke="#06b6d4" strokeWidth="0.6" opacity="0.2" />
    <circle cx="18" cy="6" r="1.2" fill="#ec4899">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="6" cy="17" r="1" fill="#fbbf24">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="19" cy="14" r="0.8" fill="#a78bfa">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="1s" repeatCount="indefinite" />
    </circle>
  </svg>
);

/** Download arrow with AI sparkle for smart import */
export const ImportIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2.5" stroke="#a78bfa" strokeWidth="1.3" fill="#a78bfa" fillOpacity="0.06" />
    <path d="M12 7V15" stroke="#06b6d4" strokeWidth="1.8" strokeLinecap="round">
      <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
    </path>
    <path d="M8.5 12.5L12 16L15.5 12.5" stroke="#06b6d4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
    </path>
    <line x1="7" y1="19" x2="17" y2="19" stroke="#a78bfa" strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
    <circle cx="18" cy="5.5" r="1.2" fill="#fbbf24">
      <animate attributeName="r" values="1.2;1.6;1.2" dur="1.2s" repeatCount="indefinite" />
    </circle>
    <circle cx="5.5" cy="7" r="0.7" fill="#ec4899">
      <animate attributeName="r" values="0.7;1;0.7" dur="1.5s" begin="0.4s" repeatCount="indefinite" />
    </circle>
  </svg>
);

/** Chain link with heartbeat pulse for link health checking */
export const LinkHealthIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 13a4 4 0 0 0 4 0l2-2a4 4 0 0 0-5.66-5.66L9 6.68" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round">
      <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
    </path>
    <path d="M14 11a4 4 0 0 0-4 0l-2 2a4 4 0 0 0 5.66 5.66L15 17.32" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round">
      <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
    </path>
    <path d="M4 20L7 17L8.5 19L10.5 15L12.5 18L14 16L16 20" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
      <animate attributeName="stroke-dasharray" values="0,50;25,25;0,50" dur="2.5s" repeatCount="indefinite" />
    </path>
  </svg>
);

/** QR-style grid with scanning line animation */
export const QRIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="#8b5cf6" strokeWidth="1.3" fill="#8b5cf6" fillOpacity="0.08" />
    <rect x="5" y="5" width="3" height="3" rx="0.5" fill="#8b5cf6" />
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="#06b6d4" strokeWidth="1.3" fill="#06b6d4" fillOpacity="0.08" />
    <rect x="16" y="5" width="3" height="3" rx="0.5" fill="#06b6d4" />
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="#ec4899" strokeWidth="1.3" fill="#ec4899" fillOpacity="0.08" />
    <rect x="5" y="16" width="3" height="3" rx="0.5" fill="#ec4899" />
    <rect x="14" y="14" width="2" height="2" rx="0.3" fill="#a78bfa" opacity="0.6" />
    <rect x="17" y="14" width="2" height="2" rx="0.3" fill="#a78bfa" opacity="0.4" />
    <rect x="14" y="17" width="2" height="2" rx="0.3" fill="#a78bfa" opacity="0.4" />
    <rect x="17" y="17" width="4" height="4" rx="0.5" fill="#fbbf24" fillOpacity="0.3">
      <animate attributeName="fill-opacity" values="0.3;0.6;0.3" dur="1.5s" repeatCount="indefinite" />
    </rect>
    <line x1="2" y1="12" x2="22" y2="12" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
      <animate attributeName="y1" values="3;21;3" dur="2.5s" repeatCount="indefinite" />
      <animate attributeName="y2" values="3;21;3" dur="2.5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2.5s" repeatCount="indefinite" />
    </line>
  </svg>
);

/** Wrench/gear with subtle rotation for dev tools */
export const DevToolsIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="3.5" stroke="#fbbf24" strokeWidth="1.3" fill="#fbbf24" fillOpacity="0.08">
      <animate attributeName="fill-opacity" values="0.08;0.15;0.08" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="12" cy="12" r="1.5" fill="#fbbf24" />
    {/* Gear teeth */}
    <line x1="12" y1="3" x2="12" y2="6" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    <line x1="12" y1="18" x2="12" y2="21" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    <line x1="3" y1="12" x2="6" y2="12" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    <line x1="18" y1="12" x2="21" y2="12" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    <line x1="5.6" y1="5.6" x2="7.7" y2="7.7" stroke="#06b6d4" strokeWidth="1.3" strokeLinecap="round" opacity="0.4">
      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite" />
    </line>
    <line x1="16.3" y1="16.3" x2="18.4" y2="18.4" stroke="#06b6d4" strokeWidth="1.3" strokeLinecap="round" opacity="0.4">
      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" begin="0.3s" repeatCount="indefinite" />
    </line>
    <line x1="5.6" y1="18.4" x2="7.7" y2="16.3" stroke="#ec4899" strokeWidth="1.3" strokeLinecap="round" opacity="0.4">
      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" begin="0.6s" repeatCount="indefinite" />
    </line>
    <line x1="16.3" y1="7.7" x2="18.4" y2="5.6" stroke="#ec4899" strokeWidth="1.3" strokeLinecap="round" opacity="0.4">
      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" begin="0.9s" repeatCount="indefinite" />
    </line>
  </svg>
);

/** Shield with lock and pulse animation for security */
export const SecurityIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 3L4 7v5c0 5.25 3.4 10.2 8 12 4.6-1.8 8-6.75 8-12V7l-8-4z" stroke="#34d399" strokeWidth="1.3" fill="#34d399" fillOpacity="0.06">
      <animate attributeName="fill-opacity" values="0.06;0.12;0.06" dur="2.5s" repeatCount="indefinite" />
    </path>
    <rect x="9.5" y="11" width="5" height="4" rx="1" stroke="#06b6d4" strokeWidth="1.2" fill="#06b6d4" fillOpacity="0.1" />
    <path d="M10.5 11V9.5a1.5 1.5 0 0 1 3 0V11" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="12" cy="13" r="0.6" fill="#fbbf24">
      <animate attributeName="r" values="0.6;0.9;0.6" dur="1.5s" repeatCount="indefinite" />
    </circle>
  </svg>
);

/** Section title to admin icon mapping for heading labels */
export const ADMIN_SECTION_ICONS: Record<string, (props: IconProps) => ReactNode> = {
  'אנליטיקס אנונימי': AnalyticsIcon,
  'SEO ושיתוף חברתי': SEOIcon,
  'ייבוא חכם': ImportIcon,
  'בדיקת קישורים': LinkHealthIcon,
  'מחולל QR Code': QRIcon,
  'כלי פיתוח': DevToolsIcon,
  'אבטחה': SecurityIcon,
};

// ---------------------------------------------------------------------------
// Toolbar Icons (QuickActions panel)
// ---------------------------------------------------------------------------

/** Two arrows: up (export) and down (import) with alternating opacity pulse */
export const ExportImportIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Up arrow (export) */}
    <path d="M8 16V6" stroke="#06b6d4" strokeWidth="1.8" strokeLinecap="round">
      <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
    </path>
    <path d="M5 9L8 5L11 9" stroke="#06b6d4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
    </path>
    {/* Down arrow (import) */}
    <path d="M16 8V18" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
    </path>
    <path d="M13 15L16 19L19 15" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
    </path>
  </svg>
);

/** Eye with small globe/circle iris — subtle fill-opacity pulse on iris */
export const ViewSiteIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Eye shape */}
    <path d="M2 12C4 7 8 4.5 12 4.5S20 7 22 12c-2 5-6 7.5-10 7.5S4 17 2 12z" stroke="#8b5cf6" strokeWidth="1.3" fill="#8b5cf6" fillOpacity="0.06" />
    {/* Iris / globe circle */}
    <circle cx="12" cy="12" r="3" fill="#06b6d4" fillOpacity="0.7">
      <animate attributeName="fill-opacity" values="0.7;0.35;0.7" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="12" cy="12" r="1.2" fill="#06b6d4" />
  </svg>
);

/** Monitor/screen with play triangle inside — fill-opacity pulse on play */
export const PreviewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Monitor */}
    <rect x="3" y="4" width="18" height="13" rx="2" stroke="#06b6d4" strokeWidth="1.3" fill="#06b6d4" fillOpacity="0.06" />
    <line x1="9" y1="20" x2="15" y2="20" stroke="#06b6d4" strokeWidth="1.3" strokeLinecap="round" />
    <line x1="12" y1="17" x2="12" y2="20" stroke="#06b6d4" strokeWidth="1.3" strokeLinecap="round" />
    {/* Play triangle */}
    <path d="M10 8.5L15.5 11L10 13.5Z" fill="#ec4899" fillOpacity="0.8">
      <animate attributeName="fill-opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
    </path>
  </svg>
);

/** Circular refresh arrow with animated stroke-dasharray rotation effect */
export const RefreshIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M21 12a9 9 0 1 1-2.63-6.36"
      stroke="#34d399"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <animate attributeName="stroke-dasharray" values="0,60;30,30;60,0" dur="2s" repeatCount="indefinite" />
    </path>
    <path d="M21 4v4h-4" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Letter A with paintbrush line below — stroke-opacity pulse on brush */
export const TypographyIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Letter A */}
    <path d="M12 4L7 18" stroke="#06b6d4" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M12 4L17 18" stroke="#06b6d4" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="9" y1="13" x2="15" y2="13" stroke="#06b6d4" strokeWidth="1.3" strokeLinecap="round" />
    {/* Paintbrush line */}
    <line x1="5" y1="21" x2="19" y2="21" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round">
      <animate attributeName="stroke-opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
    </line>
  </svg>
);

/** Filmstrip frame with sparkle star inside — sparkle r-pulse */
export const LogoAnimIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Filmstrip frame */}
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="#8b5cf6" strokeWidth="1.3" fill="#8b5cf6" fillOpacity="0.06" />
    {/* Notches top */}
    <rect x="6" y="4" width="2" height="3" rx="0.5" fill="#8b5cf6" fillOpacity="0.3" />
    <rect x="11" y="4" width="2" height="3" rx="0.5" fill="#8b5cf6" fillOpacity="0.3" />
    <rect x="16" y="4" width="2" height="3" rx="0.5" fill="#8b5cf6" fillOpacity="0.3" />
    {/* Notches bottom */}
    <rect x="6" y="17" width="2" height="3" rx="0.5" fill="#8b5cf6" fillOpacity="0.3" />
    <rect x="11" y="17" width="2" height="3" rx="0.5" fill="#8b5cf6" fillOpacity="0.3" />
    <rect x="16" y="17" width="2" height="3" rx="0.5" fill="#8b5cf6" fillOpacity="0.3" />
    {/* Sparkle star */}
    <path d="M12 9L12.9 11.1L15 12L12.9 12.9L12 15L11.1 12.9L9 12L11.1 11.1Z" fill="#fbbf24">
      <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
    </path>
  </svg>
);

/** Rocket with exhaust trail dots — staggered opacity pulse on trail */
export const EntranceAnimIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Rocket body (rect) */}
    <rect x="10" y="4" width="4" height="10" rx="2" fill="#34d399" fillOpacity="0.8" />
    {/* Rocket nose (triangle) */}
    <path d="M10 6L12 2L14 6" fill="#34d399" />
    {/* Fins */}
    <path d="M10 12L8 15H10" fill="#34d399" fillOpacity="0.5" />
    <path d="M14 12L16 15H14" fill="#34d399" fillOpacity="0.5" />
    {/* Exhaust trail dots */}
    <circle cx="12" cy="17" r="1" fill="#06b6d4">
      <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite" />
    </circle>
    <circle cx="12" cy="19.5" r="0.8" fill="#22d3ee">
      <animate attributeName="opacity" values="0.7;0.15;0.7" dur="1.2s" begin="0.2s" repeatCount="indefinite" />
    </circle>
    <circle cx="12" cy="21.5" r="0.6" fill="#67e8f9">
      <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// ---------------------------------------------------------------------------
// Dashboard Card Icons
// ---------------------------------------------------------------------------

/** 3 horizontal stacked bars with staggered fill-opacity pulse */
export const SectionsIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="5" width="16" height="3" rx="1.5" fill="#06b6d4">
      <animate attributeName="fill-opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
    </rect>
    <rect x="4" y="11" width="16" height="3" rx="1.5" fill="#06b6d4">
      <animate attributeName="fill-opacity" values="0.3;1;0.3" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </rect>
    <rect x="4" y="17" width="16" height="3" rx="1.5" fill="#06b6d4">
      <animate attributeName="fill-opacity" values="0.3;1;0.3" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </rect>
  </svg>
);

/** Two interlocking oval chain links with stroke-opacity alternating pulse */
export const LinksIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="9" cy="12" rx="5" ry="3.5" stroke="#8b5cf6" strokeWidth="1.5" fill="none">
      <animate attributeName="stroke-opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="15" cy="12" rx="5" ry="3.5" stroke="#a78bfa" strokeWidth="1.5" fill="none">
      <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
    </ellipse>
  </svg>
);

/** Eye with pupil circle — pupil r pulse */
export const CurrentViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2 12C4 7 8 4.5 12 4.5S20 7 22 12c-2 5-6 7.5-10 7.5S4 17 2 12z" stroke="#22d3ee" strokeWidth="1.3" fill="#22d3ee" fillOpacity="0.06" />
    <circle cx="12" cy="12" r="3.5" fill="#22d3ee" fillOpacity="0.15" />
    <circle cx="12" cy="12" r="1.8" fill="#8b5cf6">
      <animate attributeName="r" values="1.8;2.2;1.8" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
);

/** Clock with hour+minute hands — minute hand stroke-opacity pulse */
export const LastUpdatedIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke="#a855f7" strokeWidth="1.3" fill="#a855f7" fillOpacity="0.06" />
    {/* Hour hand */}
    <line x1="12" y1="12" x2="12" y2="7.5" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
    {/* Minute hand */}
    <line x1="12" y1="12" x2="16" y2="12" stroke="#a855f7" strokeWidth="1.2" strokeLinecap="round">
      <animate attributeName="stroke-opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
    </line>
    <circle cx="12" cy="12" r="1" fill="#a855f7" />
  </svg>
);

// ---------------------------------------------------------------------------
// Theme Preset Icons (accept a `color` prop)
// ---------------------------------------------------------------------------

interface ThemeIconProps {
  size?: number;
  color?: string;
  className?: string;
}

/** 3 wavy horizontal lines with flowing stroke-dasharray animation */
export const WaveIcon = ({ size = 20, color = '#06b6d4', className }: ThemeIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2 8C5 5 7 11 12 8S19 5 22 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none">
      <animate attributeName="stroke-dasharray" values="0,40;20,20;40,0;20,20;0,40" dur="3s" repeatCount="indefinite" />
    </path>
    <path d="M2 13C5 10 7 16 12 13S19 10 22 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7">
      <animate attributeName="stroke-dasharray" values="0,40;20,20;40,0;20,20;0,40" dur="3s" begin="0.5s" repeatCount="indefinite" />
    </path>
    <path d="M2 18C5 15 7 21 12 18S19 15 22 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4">
      <animate attributeName="stroke-dasharray" values="0,40;20,20;40,0;20,20;0,40" dur="3s" begin="1s" repeatCount="indefinite" />
    </path>
  </svg>
);

/** Simple leaf shape (ellipse + center vein line) with breathe animation */
export const LeafIcon = ({ size = 20, color = '#06b6d4', className }: ThemeIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="12" cy="11" rx="6" ry="8" fill={color} fillOpacity="0.5" transform="rotate(-30 12 11)">
      <animate attributeName="fill-opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite" />
    </ellipse>
    <path d="M12 5C12 5 10 12 12 19" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.8" />
  </svg>
);

/** Half-circle sun with 4 ray lines — staggered ray opacity pulse */
export const SunIcon = ({ size = 20, color = '#06b6d4', className }: ThemeIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Sun half-circle */}
    <path d="M5 16A7 7 0 0 1 19 16" fill={color} fillOpacity="0.3" />
    <line x1="12" y1="16" x2="12" y2="17" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0" />
    {/* Rays */}
    <line x1="12" y1="3" x2="12" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
    </line>
    <line x1="5.5" y1="5.5" x2="7.5" y2="7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" begin="0.25s" repeatCount="indefinite" />
    </line>
    <line x1="18.5" y1="5.5" x2="16.5" y2="7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" begin="0.5s" repeatCount="indefinite" />
    </line>
    <line x1="3" y1="12" x2="6" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <animate attributeName="opacity" values="1;0.3;1" dur="2s" begin="0.75s" repeatCount="indefinite" />
    </line>
    {/* Horizon line */}
    <line x1="3" y1="16" x2="21" y2="16" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.4" />
  </svg>
);

/** 5 small circles in flower pattern with staggered fill-opacity */
export const FlowerIcon = ({ size = 20, color = '#06b6d4', className }: ThemeIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Center */}
    <circle cx="12" cy="12" r="2" fill={color} />
    {/* Petals */}
    <circle cx="12" cy="7" r="2.2" fill={color} fillOpacity="0.6">
      <animate attributeName="fill-opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="16.7" cy="9.8" r="2.2" fill={color} fillOpacity="0.6">
      <animate attributeName="fill-opacity" values="0.6;0.2;0.6" dur="2s" begin="0.4s" repeatCount="indefinite" />
    </circle>
    <circle cx="15" cy="15.2" r="2.2" fill={color} fillOpacity="0.6">
      <animate attributeName="fill-opacity" values="0.6;0.2;0.6" dur="2s" begin="0.8s" repeatCount="indefinite" />
    </circle>
    <circle cx="9" cy="15.2" r="2.2" fill={color} fillOpacity="0.6">
      <animate attributeName="fill-opacity" values="0.6;0.2;0.6" dur="2s" begin="1.2s" repeatCount="indefinite" />
    </circle>
    <circle cx="7.3" cy="9.8" r="2.2" fill={color} fillOpacity="0.6">
      <animate attributeName="fill-opacity" values="0.6;0.2;0.6" dur="2s" begin="1.6s" repeatCount="indefinite" />
    </circle>
  </svg>
);

/** Lightning bolt with stroke-opacity flash */
export const BoltIcon = ({ size = 20, color = '#06b6d4', className }: ThemeIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M13 2L4.5 13H12L11 22L19.5 11H12L13 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill={color} fillOpacity="0.1">
      <animate attributeName="stroke-opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
    </path>
  </svg>
);

/** Circle with outer glow ring — inner r-pulse, outer ring opacity pulse */
export const GlowIcon = ({ size = 20, color = '#06b6d4', className }: ThemeIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Outer glow ring */}
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1" fill="none" opacity="0.4">
      <animate attributeName="opacity" values="0.4;0.15;0.4" dur="2s" repeatCount="indefinite" />
    </circle>
    {/* Inner circle */}
    <circle cx="12" cy="12" r="4" fill={color} fillOpacity="0.6">
      <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
);

/** Flame / teardrop shape with flicker fill-opacity */
export const FlameIcon = ({ size = 20, color = '#06b6d4', className }: ThemeIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2C12 2 6 10 6 15a6 6 0 0 0 12 0C18 10 12 2 12 2z" fill={color} fillOpacity="0.7">
      <animate attributeName="fill-opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite" />
    </path>
    <path d="M12 10C12 10 9.5 14 9.5 16a2.5 2.5 0 0 0 5 0C14.5 14 12 10 12 10z" fill={color} fillOpacity="0.3" />
  </svg>
);

/** 6-armed snowflake with opacity pulse */
export const SnowflakeIcon = ({ size = 20, color = '#06b6d4', className }: ThemeIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* 3 crossing lines */}
    <line x1="12" y1="3" x2="12" y2="21" stroke={color} strokeWidth="1.3" strokeLinecap="round">
      <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
    </line>
    <line x1="4.2" y1="7.5" x2="19.8" y2="16.5" stroke={color} strokeWidth="1.3" strokeLinecap="round">
      <animate attributeName="opacity" values="1;0.4;1" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </line>
    <line x1="4.2" y1="16.5" x2="19.8" y2="7.5" stroke={color} strokeWidth="1.3" strokeLinecap="round">
      <animate attributeName="opacity" values="1;0.4;1" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </line>
    {/* Small circles at tips */}
    <circle cx="12" cy="3" r="1" fill={color} fillOpacity="0.6" />
    <circle cx="12" cy="21" r="1" fill={color} fillOpacity="0.6" />
    <circle cx="4.2" cy="7.5" r="1" fill={color} fillOpacity="0.6" />
    <circle cx="19.8" cy="16.5" r="1" fill={color} fillOpacity="0.6" />
    <circle cx="4.2" cy="16.5" r="1" fill={color} fillOpacity="0.6" />
    <circle cx="19.8" cy="7.5" r="1" fill={color} fillOpacity="0.6" />
  </svg>
);

/** 4-pointed star with 2 companion dots — star opacity pulse, dots r-pulse */
export const SparkleIcon = ({ size = 20, color = '#06b6d4', className }: ThemeIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* 4-pointed star */}
    <path d="M12 3L13.5 10.5L21 12L13.5 13.5L12 21L10.5 13.5L3 12L10.5 10.5Z" fill={color} fillOpacity="0.7">
      <animate attributeName="fill-opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
    </path>
    {/* Companion dots */}
    <circle cx="18" cy="6" r="1" fill={color}>
      <animate attributeName="r" values="1;1.5;1" dur="2s" begin="0.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="6" cy="18" r="0.8" fill={color}>
      <animate attributeName="r" values="0.8;1.3;0.8" dur="2s" begin="1s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// ---------------------------------------------------------------------------
// Grouped export maps
// ---------------------------------------------------------------------------

export const TOOLBAR_ICONS = { ExportImportIcon, ViewSiteIcon, PreviewIcon, RefreshIcon, TypographyIcon, LogoAnimIcon, EntranceAnimIcon };
export const DASHBOARD_ICONS = { SectionsIcon, LinksIcon, CurrentViewIcon, LastUpdatedIcon };
export const THEME_ICONS = { WaveIcon, LeafIcon, SunIcon, FlowerIcon, BoltIcon, GlowIcon, FlameIcon, SnowflakeIcon, SparkleIcon };
