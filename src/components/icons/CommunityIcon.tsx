export const CommunityIcon = ({ size = 24 }: {size?: number;}) =>
<svg data-ev-id="ev_3094139bb8"
width={size}
height={size}
viewBox="0 0 24 24"
fill="none"
xmlns="http://www.w3.org/2000/svg"
className="inline-block">

    {/* Center person */}
    <circle data-ev-id="ev_e57f8bba7c" cx="12" cy="8" r="2.5" fill="#06b6d4" opacity="0.9">
      <animate data-ev-id="ev_ae643f85bc" attributeName="r" values="2.5;2.8;2.5" dur="3s" repeatCount="indefinite" />
    </circle>
    <path data-ev-id="ev_372a6cfd7c"
  d="M8 16.5c0-2.2 1.8-4 4-4s4 1.8 4 4"
  stroke="#06b6d4"
  strokeWidth="1.5"
  strokeLinecap="round"
  opacity="0.9" />


    {/* Left person */}
    <circle data-ev-id="ev_ad24c374f5" cx="5" cy="10" r="1.8" fill="#8b5cf6" opacity="0.7">
      <animate data-ev-id="ev_3b5e675179" attributeName="opacity" values="0.7;0.9;0.7" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <path data-ev-id="ev_cd49ee38be"
  d="M2 17c0-1.7 1.3-3 3-3s3 1.3 3 3"
  stroke="#8b5cf6"
  strokeWidth="1.3"
  strokeLinecap="round"
  opacity="0.6" />


    {/* Right person */}
    <circle data-ev-id="ev_211d9689cf" cx="19" cy="10" r="1.8" fill="#ec4899" opacity="0.7">
      <animate data-ev-id="ev_3ee35a5e32" attributeName="opacity" values="0.7;0.9;0.7" dur="2.8s" repeatCount="indefinite" />
    </circle>
    <path data-ev-id="ev_4da58e02f8"
  d="M16 17c0-1.7 1.3-3 3-3s3 1.3 3 3"
  stroke="#ec4899"
  strokeWidth="1.3"
  strokeLinecap="round"
  opacity="0.6" />


    {/* Connection lines */}
    <line data-ev-id="ev_ce04b16ebd" x1="8" y1="11" x2="10" y2="9" stroke="#06b6d4" strokeWidth="0.5" opacity="0.3">
      <animate data-ev-id="ev_0830943990" attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
    </line>
    <line data-ev-id="ev_77ba132454" x1="16" y1="11" x2="14" y2="9" stroke="#ec4899" strokeWidth="0.5" opacity="0.3">
      <animate data-ev-id="ev_e98f48c0e6" attributeName="opacity" values="0.3;0.6;0.3" dur="2.3s" repeatCount="indefinite" />
    </line>
  </svg>;