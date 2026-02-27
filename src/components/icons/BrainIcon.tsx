export const BrainIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 4C9.5 4 7.5 5.5 7 7.5C5.5 7.8 4 9.5 4 11.5C4 13.5 5.2 15 6.5 15.5C6.8 17.5 8.5 19 11 19.5V12"
      stroke="#8b5cf6"
      strokeWidth="1.4"
      strokeLinecap="round"
      fill="#8b5cf6"
      fillOpacity="0.06"
    >
      <animate attributeName="fill-opacity" values="0.06;0.12;0.06" dur="3s" repeatCount="indefinite" />
    </path>
    <path
      d="M12 4C14.5 4 16.5 5.5 17 7.5C18.5 7.8 20 9.5 20 11.5C20 13.5 18.8 15 17.5 15.5C17.2 17.5 15.5 19 13 19.5V12"
      stroke="#ec4899"
      strokeWidth="1.4"
      strokeLinecap="round"
      fill="#ec4899"
      fillOpacity="0.06"
    >
      <animate attributeName="fill-opacity" values="0.06;0.12;0.06" dur="3s" begin="0.3s" repeatCount="indefinite" />
    </path>
    <circle cx="9" cy="9" r="0.7" fill="#06b6d4">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
    </circle>
    <circle cx="15" cy="9" r="0.7" fill="#06b6d4">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" begin="0.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="8" cy="13" r="0.7" fill="#fbbf24">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="0.2s" repeatCount="indefinite" />
    </circle>
    <circle cx="16" cy="13" r="0.7" fill="#fbbf24">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="0.7s" repeatCount="indefinite" />
    </circle>
    <circle cx="12" cy="11" r="0.8" fill="#22d3ee">
      <animate attributeName="r" values="0.8;1.2;0.8" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
);
