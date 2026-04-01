import React from "react";

interface IconProps {
  size?: number;
  className?: string;
}

// 1. GridViewIcon — 4 rounded rects in 2x2 grid, staggered fill-opacity pulse
export const GridViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="3" width="8" height="8" rx="2" fill="#06b6d4" fillOpacity="0.4">
      <animate attributeName="fill-opacity" values="0.4;0.8;0.4" dur="2s" begin="0s" repeatCount="indefinite" />
    </rect>
    <rect x="13" y="3" width="8" height="8" rx="2" fill="#06b6d4" fillOpacity="0.4">
      <animate attributeName="fill-opacity" values="0.4;0.8;0.4" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </rect>
    <rect x="3" y="13" width="8" height="8" rx="2" fill="#06b6d4" fillOpacity="0.4">
      <animate attributeName="fill-opacity" values="0.4;0.8;0.4" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </rect>
    <rect x="13" y="13" width="8" height="8" rx="2" fill="#06b6d4" fillOpacity="0.4">
      <animate attributeName="fill-opacity" values="0.4;0.8;0.4" dur="2s" begin="0.9s" repeatCount="indefinite" />
    </rect>
  </svg>
);

// 2. StackViewIcon
export const StackViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="4" width="18" height="3" rx="1.5" stroke="#8b5cf6" strokeWidth="1.4" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0s" repeatCount="indefinite" />
    </rect>
    <rect x="3" y="10" width="18" height="3" rx="1.5" stroke="#8b5cf6" strokeWidth="1.4" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </rect>
    <rect x="3" y="16" width="18" height="3" rx="1.5" stroke="#8b5cf6" strokeWidth="1.4" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </rect>
  </svg>
);

// 3. FlowViewIcon
export const FlowViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 6C4 6 8 6 12 12C16 18 20 18 20 18" stroke="#ec4899" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="0 50">
      <animate attributeName="stroke-dasharray" values="0,50;25,25;0,50" dur="3s" repeatCount="indefinite" />
    </path>
    <circle cx="12" cy="12" r="2" fill="#06b6d4" fillOpacity="0.6">
      <animate attributeName="fill-opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
      <animate attributeName="r" values="2;2.5;2" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// 4. OrbitViewIcon
export const OrbitViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="3" fill="#06b6d4" fillOpacity="0.7">
      <animate attributeName="fill-opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
    </circle>
    <ellipse cx="12" cy="12" rx="9" ry="5" stroke="#a78bfa" strokeWidth="1" opacity="0.5" transform="rotate(-20 12 12)">
      <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2.5s" repeatCount="indefinite" />
    </ellipse>
    <circle cx="20" cy="10" r="1.2" fill="#fbbf24" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" begin="0s" repeatCount="indefinite" />
    </circle>
    <circle cx="4" cy="14" r="1.2" fill="#fbbf24" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" begin="0.6s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// 5. DeckViewIcon
export const DeckViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="6" y="2" width="14" height="16" rx="2" fill="#8b5cf6" fillOpacity="0.15" stroke="#8b5cf6" strokeWidth="0.8">
      <animate attributeName="fill-opacity" values="0.15;0.3;0.15" dur="2s" begin="0s" repeatCount="indefinite" />
    </rect>
    <rect x="4" y="4" width="14" height="16" rx="2" fill="#8b5cf6" fillOpacity="0.25" stroke="#8b5cf6" strokeWidth="0.8">
      <animate attributeName="fill-opacity" values="0.25;0.45;0.25" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </rect>
    <rect x="2" y="6" width="14" height="16" rx="2" fill="#8b5cf6" fillOpacity="0.35" stroke="#8b5cf6" strokeWidth="0.8">
      <animate attributeName="fill-opacity" values="0.35;0.6;0.35" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </rect>
  </svg>
);

// 6. NeuralViewIcon
export const NeuralViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <line x1="6" y1="6" x2="18" y2="6" stroke="#06b6d4" strokeWidth="0.8" opacity="0.5" />
    <line x1="6" y1="6" x2="6" y2="18" stroke="#06b6d4" strokeWidth="0.8" opacity="0.5" />
    <line x1="6" y1="18" x2="18" y2="18" stroke="#06b6d4" strokeWidth="0.8" opacity="0.5" />
    <line x1="18" y1="6" x2="18" y2="18" stroke="#06b6d4" strokeWidth="0.8" opacity="0.5" />
    <line x1="6" y1="6" x2="18" y2="18" stroke="#06b6d4" strokeWidth="0.6" opacity="0.3" />
    <circle cx="6" cy="6" r="2" fill="#8b5cf6" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0s" repeatCount="indefinite" />
    </circle>
    <circle cx="18" cy="6" r="2" fill="#8b5cf6" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </circle>
    <circle cx="6" cy="18" r="2" fill="#8b5cf6" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </circle>
    <circle cx="18" cy="18" r="2" fill="#8b5cf6" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.9s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// 7. TerminalViewIcon
export const TerminalViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="3" width="20" height="18" rx="3" stroke="#34d399" strokeWidth="1.4" fill="#34d399" fillOpacity="0.05">
      <animate attributeName="fill-opacity" values="0.05;0.1;0.05" dur="2.5s" repeatCount="indefinite" />
    </rect>
    <rect x="5" y="8" width="8" height="1.2" rx="0.6" fill="#34d399" opacity="0.7">
      <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </rect>
    <rect x="5" y="12" width="11" height="1.2" rx="0.6" fill="#34d399" opacity="0.7">
      <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </rect>
    <rect x="5" y="16" width="2" height="1.5" rx="0.3" fill="#06b6d4">
      <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" />
    </rect>
  </svg>
);

// 8. ChatViewIcon
export const ChatViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 4h10a2 2 0 012 2v5a2 2 0 01-2 2H8l-3 2.5V13H4a2 2 0 01-2-2V6a2 2 0 012-2z" fill="#06b6d4" fillOpacity="0.3" stroke="#06b6d4" strokeWidth="1">
      <animate attributeName="fill-opacity" values="0.3;0.6;0.3" dur="2s" begin="0s" repeatCount="indefinite" />
    </path>
    <path d="M10 10h10a2 2 0 012 2v5a2 2 0 01-2 2h-1v2.5L16 19h-6a2 2 0 01-2-2v-5a2 2 0 012-2z" fill="#ec4899" fillOpacity="0.3" stroke="#ec4899" strokeWidth="1">
      <animate attributeName="fill-opacity" values="0.3;0.6;0.3" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </path>
  </svg>
);

// 9. IDEViewIcon
export const IDEViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="3" width="20" height="18" rx="2" stroke="#a78bfa" strokeWidth="1.4" fill="none">
      <animate attributeName="stroke-opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />
    </rect>
    <rect x="2" y="3" width="5" height="18" rx="1" fill="#06b6d4" fillOpacity="0.2">
      <animate attributeName="fill-opacity" values="0.2;0.4;0.2" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </rect>
    <rect x="9" y="7" width="10" height="1" rx="0.5" fill="#ec4899" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0s" repeatCount="indefinite" />
    </rect>
    <rect x="9" y="11" width="7" height="1" rx="0.5" fill="#ec4899" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </rect>
    <rect x="9" y="15" width="9" height="1" rx="0.5" fill="#ec4899" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </rect>
  </svg>
);

// 10. PhoneViewIcon
export const PhoneViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="6" y="2" width="12" height="20" rx="3" stroke="#06b6d4" strokeWidth="1.4" fill="#06b6d4" fillOpacity="0.05">
      <animate attributeName="fill-opacity" values="0.05;0.12;0.05" dur="2.5s" repeatCount="indefinite" />
    </rect>
    <rect x="8" y="5" width="8" height="12" rx="1" fill="#06b6d4" fillOpacity="0.15">
      <animate attributeName="fill-opacity" values="0.15;0.3;0.15" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </rect>
    <circle cx="12" cy="3.8" r="0.6" fill="#fbbf24">
      <animate attributeName="r" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// 11. ControlViewIcon
export const ControlViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="3" width="18" height="4" rx="1.5" fill="#ec4899" fillOpacity="0.4">
      <animate attributeName="fill-opacity" values="0.4;0.7;0.4" dur="2s" begin="0s" repeatCount="indefinite" />
    </rect>
    <rect x="3" y="10" width="8" height="11" rx="1.5" fill="#ec4899" fillOpacity="0.3">
      <animate attributeName="fill-opacity" values="0.3;0.6;0.3" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </rect>
    <rect x="13" y="10" width="8" height="11" rx="1.5" fill="#ec4899" fillOpacity="0.3">
      <animate attributeName="fill-opacity" values="0.3;0.6;0.3" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </rect>
    <circle cx="19" cy="5" r="1" fill="#06b6d4">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
      <animate attributeName="r" values="1;1.4;1" dur="1.5s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// 12. StarsViewIcon
export const StarsViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M8 2L9.2 5.8L8 9.6L6.8 5.8Z" fill="#fbbf24" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0s" repeatCount="indefinite" />
    </path>
    <path d="M17 6L18.5 10.5L17 15L15.5 10.5Z" fill="#fbbf24" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </path>
    <path d="M13.5 10.5H20.5" stroke="#a78bfa" strokeWidth="1" opacity="0.4">
      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </path>
    <path d="M8 14L9.5 18L8 22L6.5 18Z" fill="#fbbf24" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </path>
    <path d="M4.5 18H11.5" stroke="#a78bfa" strokeWidth="1" opacity="0.4">
      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </path>
  </svg>
);

// 13. CircuitViewIcon
export const CircuitViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 8H12V4" stroke="#06b6d4" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M12 4V20" stroke="#06b6d4" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M12 16H20" stroke="#06b6d4" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M4 16H8V12H20" stroke="#06b6d4" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="12" cy="8" r="1.5" fill="#34d399" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" begin="0s" repeatCount="indefinite" />
    </circle>
    <circle cx="12" cy="16" r="1.5" fill="#34d399" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" begin="0.3s" repeatCount="indefinite" />
    </circle>
    <circle cx="8" cy="12" r="1.5" fill="#34d399" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" begin="0.6s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// 14. RPGViewIcon
export const RPGViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2L4 6V12C4 16.4 7.3 20.2 12 22C16.7 20.2 20 16.4 20 12V6L12 2Z" stroke="#8b5cf6" strokeWidth="1.4" strokeLinejoin="round" fill="#8b5cf6" fillOpacity="0.08">
      <animate attributeName="fill-opacity" values="0.08;0.2;0.08" dur="2.5s" repeatCount="indefinite" />
    </path>
    <circle cx="12" cy="12" r="2" fill="#fbbf24" opacity="0.7">
      <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// 15. AtomsViewIcon
export const AtomsViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="2.5" fill="#06b6d4" fillOpacity="0.7">
      <animate attributeName="fill-opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
    </circle>
    <ellipse cx="12" cy="12" rx="9" ry="4" stroke="#ec4899" strokeWidth="0.8" opacity="0.5" transform="rotate(30 12 12)">
      <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" begin="0s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="12" cy="12" rx="9" ry="4" stroke="#ec4899" strokeWidth="0.8" opacity="0.5" transform="rotate(-30 12 12)">
      <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" begin="0.6s" repeatCount="indefinite" />
    </ellipse>
    <circle cx="19" cy="8" r="1" fill="#a78bfa" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" begin="0s" repeatCount="indefinite" />
    </circle>
    <circle cx="5" cy="16" r="1" fill="#a78bfa" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" begin="0.6s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// 16. TableViewIcon
export const TableViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M9 2H15V8L19 20C19 21 18 22 17 22H7C6 22 5 21 5 20L9 8V2Z" stroke="#34d399" strokeWidth="1.4" strokeLinejoin="round" fill="#34d399" fillOpacity="0.08">
      <animate attributeName="fill-opacity" values="0.08;0.18;0.08" dur="2.5s" repeatCount="indefinite" />
    </path>
    <line x1="9" y1="2" x2="15" y2="2" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="10" cy="16" r="1" fill="#a78bfa" opacity="0.5">
      <animate attributeName="r" values="1;1.5;1" dur="1.8s" begin="0s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" begin="0s" repeatCount="indefinite" />
    </circle>
    <circle cx="13" cy="13" r="0.8" fill="#a78bfa" opacity="0.5">
      <animate attributeName="r" values="0.8;1.3;0.8" dur="1.8s" begin="0.4s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" begin="0.4s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// 17. OceanViewIcon
export const OceanViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2 8C4 6 6 6 8 8C10 10 12 10 14 8C16 6 18 6 20 8C22 10 22 10 22 10" stroke="#06b6d4" strokeWidth="1.4" strokeLinecap="round" fill="none" strokeOpacity="0.5">
      <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="2s" begin="0s" repeatCount="indefinite" />
    </path>
    <path d="M2 13C4 11 6 11 8 13C10 15 12 15 14 13C16 11 18 11 20 13C22 15 22 15 22 15" stroke="#06b6d4" strokeWidth="1.4" strokeLinecap="round" fill="none" strokeOpacity="0.5">
      <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </path>
    <path d="M2 18C4 16 6 16 8 18C10 20 12 20 14 18C16 16 18 16 20 18C22 20 22 20 22 20" stroke="#3b82f6" strokeWidth="1.4" strokeLinecap="round" fill="none" strokeOpacity="0.5">
      <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </path>
  </svg>
);

// 18. RadarViewIcon — Concentric circles with sweep line
export const RadarViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="10" stroke="#06b6d4" strokeWidth="0.8" opacity="0.3">
      <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2.5s" begin="0s" repeatCount="indefinite" />
    </circle>
    <circle cx="12" cy="12" r="6.5" stroke="#06b6d4" strokeWidth="0.7" opacity="0.25" />
    <circle cx="12" cy="12" r="3" stroke="#06b6d4" strokeWidth="0.7" opacity="0.2" />
    <line x1="12" y1="12" x2="20" y2="6" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" opacity="0.7">
      <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
    </line>
    <circle cx="12" cy="12" r="1" fill="#06b6d4" opacity="0.8" />
    <circle cx="16" cy="8" r="1.2" fill="#fbbf24" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
      <animate attributeName="r" values="1.2;1.6;1.2" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
    </circle>
    <circle cx="8" cy="9" r="0.8" fill="#ec4899" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" begin="0.6s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// 19. NNViewIcon — 3-layer neural network
export const NNViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <line x1="6" y1="5" x2="12" y2="8" stroke="#a78bfa" strokeWidth="0.6" opacity="0.4" />
    <line x1="6" y1="12" x2="12" y2="8" stroke="#a78bfa" strokeWidth="0.6" opacity="0.4" />
    <line x1="6" y1="12" x2="12" y2="16" stroke="#a78bfa" strokeWidth="0.6" opacity="0.4" />
    <line x1="6" y1="19" x2="12" y2="16" stroke="#a78bfa" strokeWidth="0.6" opacity="0.4" />
    <line x1="12" y1="8" x2="18" y2="12" stroke="#a78bfa" strokeWidth="0.6" opacity="0.4" />
    <line x1="12" y1="16" x2="18" y2="12" stroke="#a78bfa" strokeWidth="0.6" opacity="0.4" />
    <circle cx="6" cy="5" r="2" fill="#06b6d4" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0s" repeatCount="indefinite" />
    </circle>
    <circle cx="6" cy="12" r="2" fill="#06b6d4" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.15s" repeatCount="indefinite" />
    </circle>
    <circle cx="6" cy="19" r="2" fill="#06b6d4" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </circle>
    <circle cx="12" cy="8" r="2" fill="#8b5cf6" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.45s" repeatCount="indefinite" />
    </circle>
    <circle cx="12" cy="16" r="2" fill="#8b5cf6" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </circle>
    <circle cx="18" cy="12" r="2" fill="#ec4899" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.75s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// 20. StreamViewIcon — Play button in screen frame
export const StreamViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="3" width="20" height="14" rx="2" stroke="#ec4899" strokeWidth="1.2" fill="#ec4899" fillOpacity="0.06">
      <animate attributeName="fill-opacity" values="0.06;0.14;0.06" dur="2.5s" repeatCount="indefinite" />
    </rect>
    <polygon points="10,7 10,13 16,10" fill="#ec4899" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
    </polygon>
    <line x1="6" y1="20" x2="18" y2="20" stroke="#a78bfa" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    <line x1="9" y1="17" x2="9" y2="20" stroke="#a78bfa" strokeWidth="0.8" opacity="0.3" />
    <line x1="15" y1="17" x2="15" y2="20" stroke="#a78bfa" strokeWidth="0.8" opacity="0.3" />
  </svg>
);

// 21. DashViewIcon — Multi-panel dashboard
export const DashViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="2" width="9" height="6" rx="1.5" fill="#06b6d4" fillOpacity="0.3">
      <animate attributeName="fill-opacity" values="0.3;0.6;0.3" dur="2s" begin="0s" repeatCount="indefinite" />
    </rect>
    <rect x="13" y="2" width="9" height="6" rx="1.5" fill="#8b5cf6" fillOpacity="0.3">
      <animate attributeName="fill-opacity" values="0.3;0.6;0.3" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </rect>
    <rect x="2" y="10" width="20" height="5" rx="1.5" fill="#34d399" fillOpacity="0.25">
      <animate attributeName="fill-opacity" values="0.25;0.5;0.25" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </rect>
    <polyline points="4,13.5 7,11.5 10,12.5 13,11 16,12 19,11 21,12.5" stroke="#34d399" strokeWidth="1" fill="none" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </polyline>
    <rect x="2" y="17" width="20" height="5" rx="1.5" fill="#ec4899" fillOpacity="0.2">
      <animate attributeName="fill-opacity" values="0.2;0.4;0.2" dur="2s" begin="0.9s" repeatCount="indefinite" />
    </rect>
  </svg>
);

// 22. SecretViewIcon — Padlock
export const SecretViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="10" width="16" height="12" rx="2" stroke="#fbbf24" strokeWidth="1.2" fill="#fbbf24" fillOpacity="0.08">
      <animate attributeName="fill-opacity" values="0.08;0.18;0.08" dur="2.5s" repeatCount="indefinite" />
    </rect>
    <path d="M8 10V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V10" stroke="#fbbf24" strokeWidth="1.2" fill="none" />
    <circle cx="12" cy="15" r="2" fill="#ec4899" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
    </circle>
    <line x1="12" y1="17" x2="12" y2="19" stroke="#ec4899" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
  </svg>
);

// 23. SpotifyViewIcon — Circle with audio bars
export const SpotifyViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="10" stroke="#34d399" strokeWidth="1.2" fill="#34d399" fillOpacity="0.06">
      <animate attributeName="fill-opacity" values="0.06;0.14;0.06" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <path d="M7 9C10 7.5 14 7.5 17 9" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0s" repeatCount="indefinite" />
    </path>
    <path d="M8 12.5C10.5 11 13.5 11 16 12.5" stroke="#34d399" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </path>
    <path d="M9 16C11 14.8 13 14.8 15 16" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.4">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </path>
  </svg>
);

// 24. NewsViewIcon — Folded paper with text lines
export const NewsViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="2" width="18" height="20" rx="2" stroke="#fbbf24" strokeWidth="1.2" fill="#fbbf24" fillOpacity="0.06">
      <animate attributeName="fill-opacity" values="0.06;0.14;0.06" dur="2.5s" repeatCount="indefinite" />
    </rect>
    <rect x="6" y="5" width="12" height="2" rx="0.5" fill="#fbbf24" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0s" repeatCount="indefinite" />
    </rect>
    <line x1="6" y1="10" x2="18" y2="10" stroke="#a78bfa" strokeWidth="0.8" opacity="0.4">
      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" begin="0.2s" repeatCount="indefinite" />
    </line>
    <line x1="6" y1="13" x2="14" y2="13" stroke="#a78bfa" strokeWidth="0.8" opacity="0.35" />
    <line x1="6" y1="16" x2="16" y2="16" stroke="#a78bfa" strokeWidth="0.8" opacity="0.3" />
    <line x1="6" y1="19" x2="12" y2="19" stroke="#a78bfa" strokeWidth="0.8" opacity="0.25" />
  </svg>
);

// 25. MetroViewIcon — Transit map with stations
export const MetroViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <line x1="2" y1="7" x2="22" y2="7" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" opacity="0.5">
      <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2.5s" begin="0s" repeatCount="indefinite" />
    </line>
    <line x1="2" y1="17" x2="22" y2="17" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" opacity="0.4">
      <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
    </line>
    <line x1="12" y1="7" x2="7" y2="17" stroke="#a78bfa" strokeWidth="1" opacity="0.3" />
    <line x1="12" y1="7" x2="17" y2="17" stroke="#a78bfa" strokeWidth="1" opacity="0.3" />
    <circle cx="5" cy="7" r="2" fill="#ec4899" opacity="0.7">
      <animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" begin="0s" repeatCount="indefinite" />
    </circle>
    <circle cx="12" cy="7" r="2" fill="#ec4899" opacity="0.7">
      <animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" begin="0.2s" repeatCount="indefinite" />
    </circle>
    <circle cx="19" cy="7" r="2" fill="#ec4899" opacity="0.7">
      <animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" begin="0.4s" repeatCount="indefinite" />
    </circle>
    <circle cx="7" cy="17" r="1.8" fill="#06b6d4" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" begin="0.6s" repeatCount="indefinite" />
    </circle>
    <circle cx="17" cy="17" r="1.8" fill="#06b6d4" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" begin="0.8s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// 26. ArcadeViewIcon — Retro game cabinet
export const ArcadeViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="2" width="16" height="13" rx="2" stroke="#8b5cf6" strokeWidth="1.2" fill="#8b5cf6" fillOpacity="0.06">
      <animate attributeName="fill-opacity" values="0.06;0.14;0.06" dur="2.5s" repeatCount="indefinite" />
    </rect>
    <rect x="6" y="4" width="12" height="7" rx="1" fill="#06b6d4" fillOpacity="0.15">
      <animate attributeName="fill-opacity" values="0.15;0.3;0.15" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </rect>
    <circle cx="9" cy="7.5" r="0.8" fill="#fbbf24" opacity="0.7">
      <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" begin="0s" repeatCount="indefinite" />
    </circle>
    <circle cx="15" cy="7.5" r="0.8" fill="#ec4899" opacity="0.7">
      <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
    </circle>
    <rect x="6" y="17" width="12" height="5" rx="1.5" stroke="#8b5cf6" strokeWidth="1" fill="#8b5cf6" fillOpacity="0.05" />
    <circle cx="9" cy="19.5" r="1.2" fill="#34d399" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" begin="0.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="15" cy="19.5" r="1.2" fill="#ec4899" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" begin="0.7s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// 27. DesktopViewIcon — Monitor with windows
export const DesktopViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="2" width="20" height="14" rx="2" stroke="#3b82f6" strokeWidth="1.2" fill="#3b82f6" fillOpacity="0.06">
      <animate attributeName="fill-opacity" values="0.06;0.14;0.06" dur="2.5s" repeatCount="indefinite" />
    </rect>
    <rect x="4" y="4" width="7" height="5" rx="0.5" fill="#06b6d4" fillOpacity="0.25">
      <animate attributeName="fill-opacity" values="0.25;0.5;0.25" dur="2s" begin="0s" repeatCount="indefinite" />
    </rect>
    <rect x="13" y="4" width="7" height="5" rx="0.5" fill="#8b5cf6" fillOpacity="0.2">
      <animate attributeName="fill-opacity" values="0.2;0.4;0.2" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </rect>
    <line x1="4" y1="12" x2="20" y2="12" stroke="#a78bfa" strokeWidth="0.6" opacity="0.3" />
    <line x1="12" y1="16" x2="12" y2="19" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" />
    <rect x="8" y="19" width="8" height="1.5" rx="0.75" fill="#3b82f6" fillOpacity="0.4" />
  </svg>
);

// 28. AIViewIcon — Robot face / neural brain
export const AIViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="5" width="16" height="14" rx="3" stroke="#34d399" strokeWidth="1.2" fill="#34d399" fillOpacity="0.08">
      <animate attributeName="fill-opacity" values="0.08;0.18;0.08" dur="2.5s" repeatCount="indefinite" />
    </rect>
    <circle cx="9" cy="12" r="1.5" fill="#06b6d4" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0s" repeatCount="indefinite" />
    </circle>
    <circle cx="15" cy="12" r="1.5" fill="#06b6d4" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </circle>
    <path d="M9 16H15" stroke="#a78bfa" strokeWidth="1" strokeLinecap="round" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </path>
    <line x1="12" y1="2" x2="12" y2="5" stroke="#8b5cf6" strokeWidth="1" strokeLinecap="round" />
    <circle cx="12" cy="2" r="1" fill="#fbbf24" opacity="0.7">
      <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite" />
      <animate attributeName="r" values="1;1.4;1" dur="1.5s" repeatCount="indefinite" />
    </circle>
    <line x1="2" y1="13" x2="4" y2="13" stroke="#8b5cf6" strokeWidth="1" strokeLinecap="round" />
    <line x1="20" y1="13" x2="22" y2="13" stroke="#8b5cf6" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

// 29. HoloViewIcon — Hexagonal prism with glow
export const HoloViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <polygon points="12,2 20,6 20,14 12,18 4,14 4,6" stroke="#06b6d4" strokeWidth="1.2" fill="#06b6d4" fillOpacity="0.08">
      <animate attributeName="fill-opacity" values="0.08;0.25;0.08" dur="2.5s" repeatCount="indefinite" />
    </polygon>
    <polygon points="12,5 17,7.5 17,12.5 12,15 7,12.5 7,7.5" stroke="#a78bfa" strokeWidth="0.8" fill="#a78bfa" fillOpacity="0.1">
      <animate attributeName="fill-opacity" values="0.1;0.3;0.1" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </polygon>
    <line x1="12" y1="2" x2="12" y2="5" stroke="#06b6d4" strokeWidth="0.6" opacity="0.5" />
    <line x1="20" y1="6" x2="17" y2="7.5" stroke="#06b6d4" strokeWidth="0.6" opacity="0.5" />
    <line x1="4" y1="6" x2="7" y2="7.5" stroke="#06b6d4" strokeWidth="0.6" opacity="0.5" />
    <line x1="12" y1="18" x2="12" y2="22" stroke="#06b6d4" strokeWidth="0.8" opacity="0.4">
      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </line>
    <ellipse cx="12" cy="22" rx="4" ry="1" fill="#06b6d4" fillOpacity="0.15">
      <animate attributeName="fill-opacity" values="0.15;0.3;0.15" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </ellipse>
  </svg>
);

// 30. MRIViewIcon — Brain scan
export const MRIViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="10" stroke="#ec4899" strokeWidth="1.2" fill="#ec4899" fillOpacity="0.06">
      <animate attributeName="fill-opacity" values="0.06;0.14;0.06" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <path d="M12 4C9 4 7 6 7 8C7 9.5 8 10.5 8 12C8 13.5 7 15 7 16.5C7 18.5 9 20 12 20" stroke="#ec4899" strokeWidth="1" fill="none" opacity="0.5">
      <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" begin="0s" repeatCount="indefinite" />
    </path>
    <path d="M12 4C15 4 17 6 17 8C17 9.5 16 10.5 16 12C16 13.5 17 15 17 16.5C17 18.5 15 20 12 20" stroke="#a78bfa" strokeWidth="1" fill="none" opacity="0.5">
      <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" begin="0.3s" repeatCount="indefinite" />
    </path>
    <line x1="12" y1="4" x2="12" y2="20" stroke="#8b5cf6" strokeWidth="0.6" opacity="0.3" />
    <path d="M9 8C10 9 11 9 12 8C13 9 14 9 15 8" stroke="#fbbf24" strokeWidth="0.8" fill="none" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </path>
  </svg>
);

// 31. PromptViewIcon — Flow boxes with arrows
export const PromptViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="3" width="6" height="4" rx="1" fill="#06b6d4" fillOpacity="0.4">
      <animate attributeName="fill-opacity" values="0.4;0.8;0.4" dur="2s" begin="0s" repeatCount="indefinite" />
    </rect>
    <rect x="2" y="17" width="6" height="4" rx="1" fill="#06b6d4" fillOpacity="0.4">
      <animate attributeName="fill-opacity" values="0.4;0.8;0.4" dur="2s" begin="0.2s" repeatCount="indefinite" />
    </rect>
    <rect x="9" y="10" width="6" height="4" rx="1" fill="#8b5cf6" fillOpacity="0.4">
      <animate attributeName="fill-opacity" values="0.4;0.8;0.4" dur="2s" begin="0.4s" repeatCount="indefinite" />
    </rect>
    <rect x="17" y="10" width="5" height="4" rx="1" fill="#ec4899" fillOpacity="0.4">
      <animate attributeName="fill-opacity" values="0.4;0.8;0.4" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </rect>
    <path d="M8 5L9 5L9 11" stroke="#a78bfa" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.1s" repeatCount="indefinite" />
    </path>
    <path d="M8 19L9 19L9 13" stroke="#a78bfa" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </path>
    <path d="M15 12H17" stroke="#a78bfa" strokeWidth="0.8" strokeLinecap="round" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.5s" repeatCount="indefinite" />
    </path>
  </svg>
);

// 32. GPUViewIcon — Stacked boards with LEDs
export const GPUViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="3" width="18" height="4" rx="1" stroke="#34d399" strokeWidth="1" fill="#34d399" fillOpacity="0.1">
      <animate attributeName="fill-opacity" values="0.1;0.25;0.1" dur="2s" begin="0s" repeatCount="indefinite" />
    </rect>
    <rect x="3" y="10" width="18" height="4" rx="1" stroke="#34d399" strokeWidth="1" fill="#34d399" fillOpacity="0.1">
      <animate attributeName="fill-opacity" values="0.1;0.25;0.1" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </rect>
    <rect x="3" y="17" width="18" height="4" rx="1" stroke="#34d399" strokeWidth="1" fill="#34d399" fillOpacity="0.1">
      <animate attributeName="fill-opacity" values="0.1;0.25;0.1" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </rect>
    <circle cx="6" cy="5" r="0.8" fill="#06b6d4">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" begin="0s" repeatCount="indefinite" />
    </circle>
    <circle cx="9" cy="5" r="0.8" fill="#fbbf24">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" begin="0.2s" repeatCount="indefinite" />
    </circle>
    <circle cx="6" cy="12" r="0.8" fill="#06b6d4">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
    </circle>
    <circle cx="9" cy="12" r="0.8" fill="#fbbf24">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" begin="0.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="6" cy="19" r="0.8" fill="#06b6d4">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" begin="0.6s" repeatCount="indefinite" />
    </circle>
    <circle cx="9" cy="19" r="0.8" fill="#fbbf24">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" begin="0.8s" repeatCount="indefinite" />
    </circle>
    <rect x="14" y="4" width="5" height="0.6" rx="0.3" fill="#34d399" opacity="0.4" />
    <rect x="14" y="11" width="5" height="0.6" rx="0.3" fill="#34d399" opacity="0.4" />
    <rect x="14" y="18" width="5" height="0.6" rx="0.3" fill="#34d399" opacity="0.4" />
  </svg>
);

// 33. TrainViewIcon — Ascending chart
export const TrainViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <line x1="3" y1="21" x2="3" y2="3" stroke="#8b5cf6" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    <line x1="3" y1="21" x2="21" y2="21" stroke="#8b5cf6" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    <path d="M4 18L8 15L12 12L16 7L20 4" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />
    </path>
    <circle cx="4" cy="18" r="1.2" fill="#06b6d4" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0s" repeatCount="indefinite" />
    </circle>
    <circle cx="8" cy="15" r="1.2" fill="#06b6d4" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.2s" repeatCount="indefinite" />
    </circle>
    <circle cx="12" cy="12" r="1.2" fill="#06b6d4" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.4s" repeatCount="indefinite" />
    </circle>
    <circle cx="16" cy="7" r="1.2" fill="#fbbf24" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </circle>
    <circle cx="20" cy="4" r="1.2" fill="#fbbf24" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.8s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// 34. RobotViewIcon — Robot with antenna
export const RobotViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <line x1="12" y1="2" x2="12" y2="5" stroke="#fbbf24" strokeWidth="1" strokeLinecap="round" />
    <circle cx="12" cy="2" r="1" fill="#fbbf24" opacity="0.7">
      <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite" />
      <animate attributeName="r" values="1;1.5;1" dur="1.5s" repeatCount="indefinite" />
    </circle>
    <rect x="6" y="5" width="12" height="8" rx="2" stroke="#06b6d4" strokeWidth="1.2" fill="#06b6d4" fillOpacity="0.08">
      <animate attributeName="fill-opacity" values="0.08;0.18;0.08" dur="2.5s" repeatCount="indefinite" />
    </rect>
    <circle cx="9" cy="9" r="1.2" fill="#ec4899" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0s" repeatCount="indefinite" />
    </circle>
    <circle cx="15" cy="9" r="1.2" fill="#ec4899" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </circle>
    <rect x="7" y="14" width="10" height="6" rx="1.5" stroke="#06b6d4" strokeWidth="1" fill="#06b6d4" fillOpacity="0.06">
      <animate attributeName="fill-opacity" values="0.06;0.14;0.06" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </rect>
    <line x1="4" y1="15" x2="7" y2="17" stroke="#06b6d4" strokeWidth="1" strokeLinecap="round" />
    <line x1="20" y1="15" x2="17" y2="17" stroke="#06b6d4" strokeWidth="1" strokeLinecap="round" />
    <circle cx="12" cy="17" r="1" fill="#34d399" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" begin="0.5s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// 35. DNAViewIcon — Double helix
export const DNAViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M8 2C6 5 6 7 8 10C10 13 10 15 8 18C6 21 6 22 8 22" stroke="#06b6d4" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" begin="0s" repeatCount="indefinite" />
    </path>
    <path d="M16 2C18 5 18 7 16 10C14 13 14 15 16 18C18 21 18 22 16 22" stroke="#ec4899" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" begin="0.3s" repeatCount="indefinite" />
    </path>
    <line x1="8" y1="4" x2="16" y2="4" stroke="#a78bfa" strokeWidth="0.8" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0s" repeatCount="indefinite" />
    </line>
    <line x1="7" y1="7" x2="17" y2="7" stroke="#fbbf24" strokeWidth="0.8" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.2s" repeatCount="indefinite" />
    </line>
    <line x1="9" y1="10" x2="15" y2="10" stroke="#a78bfa" strokeWidth="0.8" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.4s" repeatCount="indefinite" />
    </line>
    <line x1="9" y1="14" x2="15" y2="14" stroke="#fbbf24" strokeWidth="0.8" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </line>
    <line x1="7" y1="17" x2="17" y2="17" stroke="#a78bfa" strokeWidth="0.8" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.8s" repeatCount="indefinite" />
    </line>
    <line x1="8" y1="20" x2="16" y2="20" stroke="#fbbf24" strokeWidth="0.8" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="1.0s" repeatCount="indefinite" />
    </line>
  </svg>
);

// 36. SatelliteViewIcon — Dish with signal waves
export const SatelliteViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="10" cy="14" rx="7" ry="4" stroke="#3b82f6" strokeWidth="1.2" fill="#3b82f6" fillOpacity="0.08" transform="rotate(-30 10 14)">
      <animate attributeName="fill-opacity" values="0.08;0.2;0.08" dur="2.5s" repeatCount="indefinite" />
    </ellipse>
    <line x1="13" y1="11" x2="17" y2="7" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="17" cy="7" r="1" fill="#fbbf24" opacity="0.8">
      <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
    </circle>
    <path d="M18 5C19 4 20 3 21 2" stroke="#06b6d4" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" begin="0s" repeatCount="indefinite" />
    </path>
    <path d="M19.5 6.5C20.5 5.5 21.5 4.5 22.5 3.5" stroke="#06b6d4" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" begin="0.3s" repeatCount="indefinite" />
    </path>
    <path d="M20 8C21 7 22 6 23 5" stroke="#06b6d4" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" begin="0.6s" repeatCount="indefinite" />
    </path>
    <line x1="8" y1="16" x2="6" y2="20" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" />
    <line x1="6" y1="20" x2="3" y2="20" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" />
    <line x1="6" y1="20" x2="9" y2="20" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

// 37. WormholeViewIcon — Spiraling concentric rings
export const WormholeViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="12" cy="12" rx="10" ry="10" stroke="#8b5cf6" strokeWidth="0.8" opacity="0.3">
      <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" begin="0s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="12" cy="12" rx="8" ry="7" stroke="#a78bfa" strokeWidth="0.8" opacity="0.35" transform="rotate(15 12 12)">
      <animate attributeName="opacity" values="0.35;0.65;0.35" dur="3s" begin="0.3s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="12" cy="12" rx="6" ry="5" stroke="#06b6d4" strokeWidth="0.8" opacity="0.4" transform="rotate(30 12 12)">
      <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" begin="0.6s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="12" cy="12" rx="4" ry="3" stroke="#ec4899" strokeWidth="0.8" opacity="0.5" transform="rotate(45 12 12)">
      <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" begin="0.9s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="12" cy="12" rx="2" ry="1.5" stroke="#fbbf24" strokeWidth="0.8" opacity="0.6" transform="rotate(60 12 12)">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" begin="1.2s" repeatCount="indefinite" />
    </ellipse>
    <circle cx="12" cy="12" r="0.8" fill="#fbbf24" opacity="0.8">
      <animate attributeName="r" values="0.8;1.2;0.8" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// 38. StockViewIcon — Candlestick chart
export const StockViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <line x1="4" y1="4" x2="4" y2="20" stroke="#34d399" strokeWidth="0.6" />
    <rect x="2.5" y="8" width="3" height="6" rx="0.5" fill="#34d399" fillOpacity="0.5">
      <animate attributeName="fill-opacity" values="0.5;0.9;0.5" dur="2s" begin="0s" repeatCount="indefinite" />
    </rect>
    <line x1="8.5" y1="3" x2="8.5" y2="18" stroke="#ec4899" strokeWidth="0.6" />
    <rect x="7" y="6" width="3" height="8" rx="0.5" fill="#ec4899" fillOpacity="0.5">
      <animate attributeName="fill-opacity" values="0.5;0.9;0.5" dur="2s" begin="0.2s" repeatCount="indefinite" />
    </rect>
    <line x1="13" y1="5" x2="13" y2="19" stroke="#34d399" strokeWidth="0.6" />
    <rect x="11.5" y="9" width="3" height="5" rx="0.5" fill="#34d399" fillOpacity="0.5">
      <animate attributeName="fill-opacity" values="0.5;0.9;0.5" dur="2s" begin="0.4s" repeatCount="indefinite" />
    </rect>
    <line x1="17.5" y1="2" x2="17.5" y2="16" stroke="#ec4899" strokeWidth="0.6" />
    <rect x="16" y="4" width="3" height="7" rx="0.5" fill="#ec4899" fillOpacity="0.5">
      <animate attributeName="fill-opacity" values="0.5;0.9;0.5" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </rect>
    <line x1="22" y1="6" x2="22" y2="21" stroke="#34d399" strokeWidth="0.6" />
    <rect x="20.5" y="10" width="3" height="6" rx="0.5" fill="#34d399" fillOpacity="0.5">
      <animate attributeName="fill-opacity" values="0.5;0.9;0.5" dur="2s" begin="0.8s" repeatCount="indefinite" />
    </rect>
  </svg>
);

// 39. BlueprintViewIcon — Dashed grid with measurements
export const BlueprintViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="1" stroke="#3b82f6" strokeWidth="1.2" fill="#3b82f6" fillOpacity="0.06">
      <animate attributeName="fill-opacity" values="0.06;0.14;0.06" dur="2.5s" repeatCount="indefinite" />
    </rect>
    <line x1="8" y1="2" x2="8" y2="22" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.3" />
    <line x1="14" y1="2" x2="14" y2="22" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.3" />
    <line x1="2" y1="8" x2="22" y2="8" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.3" />
    <line x1="2" y1="14" x2="22" y2="14" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.3" />
    <rect x="5" y="5" width="8" height="6" rx="0.5" stroke="#06b6d4" strokeWidth="1" fill="none" opacity="0.5">
      <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2s" begin="0s" repeatCount="indefinite" />
    </rect>
    <line x1="5" y1="13" x2="13" y2="13" stroke="#fbbf24" strokeWidth="0.8" strokeLinecap="round" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </line>
    <circle cx="17" cy="17" r="2.5" stroke="#ec4899" strokeWidth="0.8" fill="none" opacity="0.5">
      <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </circle>
    <circle cx="17" cy="17" r="0.5" fill="#ec4899" opacity="0.6" />
  </svg>
);

// 40. QuantumViewIcon — Atom with orbital rings
export const QuantumViewIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#8b5cf6" strokeWidth="0.8" opacity="0.4" transform="rotate(0 12 12)">
      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" begin="0s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#06b6d4" strokeWidth="0.8" opacity="0.4" transform="rotate(60 12 12)">
      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" begin="0.5s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#ec4899" strokeWidth="0.8" opacity="0.4" transform="rotate(120 12 12)">
      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" begin="1.0s" repeatCount="indefinite" />
    </ellipse>
    <circle cx="12" cy="12" r="2" fill="#fbbf24" fillOpacity="0.7">
      <animate attributeName="fill-opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
      <animate attributeName="r" values="2;2.5;2" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="22" cy="12" r="1" fill="#8b5cf6" opacity="0.7">
      <animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" begin="0s" repeatCount="indefinite" />
    </circle>
    <circle cx="7" cy="5" r="1" fill="#06b6d4" opacity="0.7">
      <animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" begin="0.4s" repeatCount="indefinite" />
    </circle>
    <circle cx="7" cy="19" r="1" fill="#ec4899" opacity="0.7">
      <animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" begin="0.8s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// Lookup map: view ID → icon component
export const VIEW_ICONS: Record<number, (props: IconProps) => React.JSX.Element> = {
  1: GridViewIcon,
  2: StackViewIcon,
  3: FlowViewIcon,
  4: OrbitViewIcon,
  5: DeckViewIcon,
  6: NeuralViewIcon,
  7: TerminalViewIcon,
  8: ChatViewIcon,
  9: IDEViewIcon,
  10: PhoneViewIcon,
  11: ControlViewIcon,
  12: StarsViewIcon,
  13: CircuitViewIcon,
  14: RPGViewIcon,
  15: AtomsViewIcon,
  16: TableViewIcon,
  17: OceanViewIcon,
  18: RadarViewIcon,
  19: NNViewIcon,
  20: StreamViewIcon,
  21: DashViewIcon,
  22: SecretViewIcon,
  23: SpotifyViewIcon,
  24: NewsViewIcon,
  25: MetroViewIcon,
  26: ArcadeViewIcon,
  27: DesktopViewIcon,
  28: AIViewIcon,
  29: HoloViewIcon,
  30: MRIViewIcon,
  31: PromptViewIcon,
  32: GPUViewIcon,
  33: TrainViewIcon,
  34: RobotViewIcon,
  35: DNAViewIcon,
  36: SatelliteViewIcon,
  37: WormholeViewIcon,
  38: StockViewIcon,
  39: BlueprintViewIcon,
  40: QuantumViewIcon,
  41: TabsViewIcon,
  42: TabStackViewIcon,
  43: TabCardsViewIcon,
  44: VortexViewIcon,
};

// ═══════ View 41: Tabs ═══════
const TabsViewIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2" y="2" width="6" height="4" rx="1.5" stroke="#06b6d4" strokeWidth="1.5" fill="#06b6d4" fillOpacity="0.15" />
    <rect x="9" y="2" width="6" height="4" rx="1.5" stroke="#a78bfa" strokeWidth="1.5" fill="#a78bfa" fillOpacity="0.1" />
    <rect x="16" y="2" width="6" height="4" rx="1.5" stroke="#8b5cf6" strokeWidth="1" opacity="0.4" />
    <rect x="2" y="8" width="20" height="14" rx="2" stroke="#a78bfa" strokeWidth="1.5" fill="#a78bfa" fillOpacity="0.05">
      <animate attributeName="fill-opacity" values="0.05;0.1;0.05" dur="3s" repeatCount="indefinite" />
    </rect>
    <rect x="4" y="11" width="7" height="2.5" rx="1" fill="#06b6d4" fillOpacity="0.3" />
    <rect x="13" y="11" width="7" height="2.5" rx="1" fill="#ec4899" fillOpacity="0.25" />
    <rect x="4" y="15" width="7" height="2.5" rx="1" fill="#06b6d4" fillOpacity="0.2" />
    <rect x="13" y="15" width="7" height="2.5" rx="1" fill="#ec4899" fillOpacity="0.15" />
  </svg>
);

// ═══════ View 42: TabStack ═══════
const TabStackViewIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="1" width="5" height="3.5" rx="1" stroke="#06b6d4" strokeWidth="1.3" fill="#06b6d4" fillOpacity="0.15" />
    <rect x="9.5" y="1" width="5" height="3.5" rx="1" stroke="#a78bfa" strokeWidth="1.3" fill="#a78bfa" fillOpacity="0.1" />
    <rect x="16" y="1" width="5" height="3.5" rx="1" stroke="#8b5cf6" strokeWidth="1" opacity="0.35" />
    <rect x="3" y="7" width="8" height="3" rx="1" stroke="#a78bfa" strokeWidth="1.2" transform="rotate(-1.5 7 8.5)" fill="#a78bfa" fillOpacity="0.06">
      <animate attributeName="fill-opacity" values="0.06;0.12;0.06" dur="2s" repeatCount="indefinite" />
    </rect>
    <rect x="3" y="11" width="8" height="3" rx="1" stroke="#a78bfa" strokeWidth="1" transform="rotate(1 7 12.5)" opacity="0.5" />
    <rect x="13" y="7" width="8" height="3" rx="1" stroke="#ec4899" strokeWidth="1.2" transform="rotate(1.2 17 8.5)" fill="#ec4899" fillOpacity="0.06">
      <animate attributeName="fill-opacity" values="0.06;0.12;0.06" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </rect>
    <rect x="13" y="11" width="8" height="3" rx="1" stroke="#ec4899" strokeWidth="1" transform="rotate(-0.8 17 12.5)" opacity="0.5" />
    <rect x="3" y="15" width="8" height="3" rx="1" stroke="#a78bfa" strokeWidth="0.8" transform="rotate(-0.5 7 16.5)" opacity="0.3" />
    <rect x="13" y="15" width="8" height="3" rx="1" stroke="#ec4899" strokeWidth="0.8" transform="rotate(0.7 17 16.5)" opacity="0.3" />
  </svg>
);

// ═══════ View 43: TabCards (with vortex transition) ═══════
const TabCardsViewIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="1" width="5" height="3.5" rx="1" stroke="#06b6d4" strokeWidth="1.3" fill="#06b6d4" fillOpacity="0.15" />
    <rect x="9.5" y="1" width="5" height="3.5" rx="1" stroke="#a78bfa" strokeWidth="1.3" fill="#a78bfa" fillOpacity="0.1" />
    <rect x="16" y="1" width="5" height="3.5" rx="1" stroke="#8b5cf6" strokeWidth="1" opacity="0.35" />
    <circle cx="12" cy="20" r="3" stroke="#8b5cf6" strokeWidth="0.8" opacity="0.3">
      <animate attributeName="r" values="3;3.5;3" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="12" cy="20" r="1.2" fill="#a78bfa" fillOpacity="0.5">
      <animate attributeName="fill-opacity" values="0.3;0.6;0.3" dur="1.5s" repeatCount="indefinite" />
    </circle>
    <rect x="3" y="7" width="7" height="3" rx="1" stroke="#a78bfa" strokeWidth="1.2" transform="rotate(-2 6.5 8.5)">
      <animate attributeName="opacity" values="1;0.6;1" dur="3s" repeatCount="indefinite" />
    </rect>
    <rect x="14" y="7" width="7" height="3" rx="1" stroke="#ec4899" strokeWidth="1.2" transform="rotate(1.5 17.5 8.5)">
      <animate attributeName="opacity" values="1;0.6;1" dur="3s" begin="0.5s" repeatCount="indefinite" />
    </rect>
    <rect x="4" y="12" width="7" height="3" rx="1" stroke="#06b6d4" strokeWidth="1" transform="rotate(1 7.5 13.5)" opacity="0.5" />
    <rect x="13" y="12" width="7" height="3" rx="1" stroke="#fbbf24" strokeWidth="1" transform="rotate(-1 16.5 13.5)" opacity="0.5" />
  </svg>
);

// ═══════ View 44: Vortex (sidebar layout) ═══════
const VortexViewIcon = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="1" y="2" width="6" height="4" rx="1" stroke="#8b5cf6" strokeWidth="1.2" fill="#8b5cf6" fillOpacity="0.15">
      <animate attributeName="fill-opacity" values="0.15;0.25;0.15" dur="2s" repeatCount="indefinite" />
    </rect>
    <rect x="1" y="8" width="6" height="4" rx="1" stroke="#8b5cf6" strokeWidth="1" opacity="0.5" />
    <rect x="1" y="14" width="6" height="4" rx="1" stroke="#8b5cf6" strokeWidth="0.8" opacity="0.3" />
    <rect x="1" y="20" width="6" height="3" rx="1" stroke="#8b5cf6" strokeWidth="0.6" opacity="0.2" />
    <rect x="9" y="3" width="13" height="4" rx="1.2" stroke="#a78bfa" strokeWidth="1.2" transform="rotate(-1 15.5 5)" fill="#a78bfa" fillOpacity="0.06">
      <animate attributeName="fill-opacity" values="0.06;0.12;0.06" dur="2.5s" repeatCount="indefinite" />
    </rect>
    <rect x="9" y="9" width="13" height="4" rx="1.2" stroke="#06b6d4" strokeWidth="1.1" transform="rotate(0.8 15.5 11)" fill="#06b6d4" fillOpacity="0.05" />
    <rect x="9" y="15" width="13" height="4" rx="1.2" stroke="#ec4899" strokeWidth="1" transform="rotate(-0.5 15.5 17)" opacity="0.5" />
  </svg>
);
