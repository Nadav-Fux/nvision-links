export const MediaIcon = ({ size = 24 }: {size?: number;}) =>
<svg data-ev-id="ev_8848fae54b"
width={size}
height={size}
viewBox="0 0 24 24"
fill="none"
xmlns="http://www.w3.org/2000/svg"
className="inline-block">

    {/* Canvas / frame */}
    <rect data-ev-id="ev_bba848b710"
  x="3" y="3" width="18" height="18" rx="2.5"
  stroke="#a78bfa"
  strokeWidth="1.3"
  fill="#a78bfa"
  fillOpacity="0.05" />


    {/* Brush stroke 1 */}
    <path data-ev-id="ev_d0d0218308"
  d="M6 15C8 11 10 9 13 10C16 11 17 8 19 7"
  stroke="#ec4899"
  strokeWidth="2"
  strokeLinecap="round"
  opacity="0.7">

      <animate data-ev-id="ev_5b8d12e827" attributeName="stroke-dashoffset" from="30" to="0" dur="2s" repeatCount="indefinite" />
      <animate data-ev-id="ev_fae14c213b" attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
    </path>

    {/* Color dots */}
    <circle data-ev-id="ev_2b4d295fd1" cx="7" cy="7" r="1.5" fill="#f87171">
      <animate data-ev-id="ev_f1a6e8461f" attributeName="r" values="1.5;1.8;1.5" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle data-ev-id="ev_37d5b2b65c" cx="11" cy="6" r="1.5" fill="#fbbf24">
      <animate data-ev-id="ev_2d1cadf88e" attributeName="r" values="1.5;1.8;1.5" dur="2s" begin="0.3s" repeatCount="indefinite" />
    </circle>
    <circle data-ev-id="ev_688381ad2d" cx="15" cy="7.5" r="1.5" fill="#34d399">
      <animate data-ev-id="ev_ff9d26b498" attributeName="r" values="1.5;1.8;1.5" dur="2s" begin="0.6s" repeatCount="indefinite" />
    </circle>

    {/* Film strip hint */}
    <rect data-ev-id="ev_2aad1713a8" x="17" y="13" width="3" height="2" rx="0.5" fill="#06b6d4" opacity="0.5">
      <animate data-ev-id="ev_e0f2a78149" attributeName="opacity" values="0.3;0.6;0.3" dur="1.5s" repeatCount="indefinite" />
    </rect>
    <rect data-ev-id="ev_2a544db67b" x="17" y="16" width="3" height="2" rx="0.5" fill="#06b6d4" opacity="0.5">
      <animate data-ev-id="ev_3e8e0f5431" attributeName="opacity" values="0.3;0.6;0.3" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
    </rect>

    {/* Sound wave hint */}
    <line data-ev-id="ev_a646b640f5" x1="6" y1="18" x2="6" y2="19.5" stroke="#8b5cf6" strokeWidth="1" strokeLinecap="round" opacity="0.5">
      <animate data-ev-id="ev_78c25ff1f3" attributeName="y1" values="18;17;18" dur="0.8s" repeatCount="indefinite" />
    </line>
    <line data-ev-id="ev_51d4fbd9c7" x1="8.5" y1="17" x2="8.5" y2="19.5" stroke="#8b5cf6" strokeWidth="1" strokeLinecap="round" opacity="0.5">
      <animate data-ev-id="ev_30c9052dee" attributeName="y1" values="17;16;17" dur="0.8s" begin="0.15s" repeatCount="indefinite" />
    </line>
    <line data-ev-id="ev_0997e9e189" x1="11" y1="18" x2="11" y2="19.5" stroke="#8b5cf6" strokeWidth="1" strokeLinecap="round" opacity="0.5">
      <animate data-ev-id="ev_41cfeff5f5" attributeName="y1" values="18;17;18" dur="0.8s" begin="0.3s" repeatCount="indefinite" />
    </line>
  </svg>;