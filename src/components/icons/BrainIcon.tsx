export const BrainIcon = ({ size = 24 }: {size?: number;}) =>
<svg data-ev-id="ev_83dc798768"
width={size}
height={size}
viewBox="0 0 24 24"
fill="none"
xmlns="http://www.w3.org/2000/svg"
className="inline-block">

    {/* Left hemisphere */}
    <path data-ev-id="ev_09fa4e80fa"
  d="M12 4C9.5 4 7.5 5.5 7 7.5C5.5 7.8 4 9.5 4 11.5C4 13.5 5.2 15 6.5 15.5C6.8 17.5 8.5 19 11 19.5V12"
  stroke="#8b5cf6"
  strokeWidth="1.4"
  strokeLinecap="round"
  fill="#8b5cf6"
  fillOpacity="0.06">

      <animate data-ev-id="ev_fdd3a75280" attributeName="fill-opacity" values="0.06;0.12;0.06" dur="3s" repeatCount="indefinite" />
    </path>

    {/* Right hemisphere */}
    <path data-ev-id="ev_e87cffc8b7"
  d="M12 4C14.5 4 16.5 5.5 17 7.5C18.5 7.8 20 9.5 20 11.5C20 13.5 18.8 15 17.5 15.5C17.2 17.5 15.5 19 13 19.5V12"
  stroke="#ec4899"
  strokeWidth="1.4"
  strokeLinecap="round"
  fill="#ec4899"
  fillOpacity="0.06">

      <animate data-ev-id="ev_896d3f5c37" attributeName="fill-opacity" values="0.06;0.12;0.06" dur="3s" begin="0.3s" repeatCount="indefinite" />
    </path>

    {/* Neural connections */}
    <circle data-ev-id="ev_4d2e09661e" cx="9" cy="9" r="0.7" fill="#06b6d4">
      <animate data-ev-id="ev_45208acd49" attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
    </circle>
    <circle data-ev-id="ev_3826712fbf" cx="15" cy="9" r="0.7" fill="#06b6d4">
      <animate data-ev-id="ev_9511d99c0a" attributeName="opacity" values="0.4;1;0.4" dur="1.8s" begin="0.5s" repeatCount="indefinite" />
    </circle>
    <circle data-ev-id="ev_820c026294" cx="8" cy="13" r="0.7" fill="#fbbf24">
      <animate data-ev-id="ev_2eb482596b" attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="0.2s" repeatCount="indefinite" />
    </circle>
    <circle data-ev-id="ev_b42387b88b" cx="16" cy="13" r="0.7" fill="#fbbf24">
      <animate data-ev-id="ev_5699e60853" attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="0.7s" repeatCount="indefinite" />
    </circle>
    <circle data-ev-id="ev_1d56328ebf" cx="12" cy="11" r="0.8" fill="#22d3ee">
      <animate data-ev-id="ev_672434bb12" attributeName="r" values="0.8;1.2;0.8" dur="2s" repeatCount="indefinite" />
    </circle>

    {/* Synapse lines */}
    <line data-ev-id="ev_a999f35a8e" x1="9" y1="9" x2="12" y2="11" stroke="#06b6d4" strokeWidth="0.4" opacity="0.4">
      <animate data-ev-id="ev_1b579b176c" attributeName="opacity" values="0.2;0.6;0.2" dur="1.8s" repeatCount="indefinite" />
    </line>
    <line data-ev-id="ev_33b3376a13" x1="15" y1="9" x2="12" y2="11" stroke="#06b6d4" strokeWidth="0.4" opacity="0.4">
      <animate data-ev-id="ev_e62f4da949" attributeName="opacity" values="0.2;0.6;0.2" dur="1.8s" begin="0.5s" repeatCount="indefinite" />
    </line>
    <line data-ev-id="ev_06a7ad5a10" x1="8" y1="13" x2="12" y2="11" stroke="#fbbf24" strokeWidth="0.4" opacity="0.4">
      <animate data-ev-id="ev_9f1fe7074c" attributeName="opacity" values="0.2;0.6;0.2" dur="2s" begin="0.2s" repeatCount="indefinite" />
    </line>
    <line data-ev-id="ev_7c95edbc39" x1="16" y1="13" x2="12" y2="11" stroke="#fbbf24" strokeWidth="0.4" opacity="0.4">
      <animate data-ev-id="ev_a1a801dc5f" attributeName="opacity" values="0.2;0.6;0.2" dur="2s" begin="0.7s" repeatCount="indefinite" />
    </line>

    {/* Stem */}
    <path data-ev-id="ev_1e58b43bd3" d="M12 19.5V21.5" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
  </svg>;