export const CodeIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block"
  >
    {/* Screen */}
    <rect
      x="2"
      y="3"
      width="20"
      height="14"
      rx="2"
      stroke="#a78bfa"
      strokeWidth="1.5"
      fill="#a78bfa"
      fillOpacity="0.08"
    />

    {/* Code bracket left < */}
    <path
      d="M8 8L5.5 10.5L8 13"
      stroke="#06b6d4"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
    </path>

    {/* Code bracket right > */}
    <path
      d="M16 8L18.5 10.5L16 13"
      stroke="#ec4899"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
    </path>

    {/* Slash / */}
    <line
      x1="13"
      y1="7"
      x2="11"
      y2="14"
      stroke="#fbbf24"
      strokeWidth="1.3"
      strokeLinecap="round"
      opacity="0.7"
    />

    {/* Cursor blink */}
    <rect x="11.5" y="10" width="1" height="3" rx="0.5" fill="#22d3ee">
      <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
    </rect>

    {/* Stand */}
    <line x1="12" y1="17" x2="12" y2="19.5" stroke="#a78bfa" strokeWidth="1.3" opacity="0.5" />
    <line x1="8" y1="20" x2="16" y2="20" stroke="#a78bfa" strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />

    {/* Sparkle */}
    <circle cx="20" cy="5" r="0.8" fill="#fbbf24">
      <animate attributeName="r" values="0.8;1.2;0.8" dur="1.5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
    </circle>
  </svg>
);
