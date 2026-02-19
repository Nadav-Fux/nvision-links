/**
 * Custom SVG icon for the "כלים ותוכנות AI" section.
 * A stylised brain with neural-network nodes — original design.
 */
export const AiToolsIcon = () =>
<svg data-ev-id="ev_cc6d30cdd9"
width="22"
height="22"
viewBox="0 0 24 24"
fill="none"
xmlns="http://www.w3.org/2000/svg"
aria-hidden="true">

    {/* outer brain shape */}
    <path data-ev-id="ev_53c09107d5"
  d="M12 2C7.58 2 4 5.58 4 10c0 2.12.83 4.05 2.18 5.47L12 22l5.82-6.53A7.96 7.96 0 0020 10c0-4.42-3.58-8-8-8z"
  stroke="url(#ai-grad)"
  strokeWidth="1.6"
  strokeLinecap="round"
  strokeLinejoin="round" />

    {/* neural nodes */}
    <circle data-ev-id="ev_32d39b87f7" cx="12" cy="7" r="1.4" fill="#a78bfa" />
    <circle data-ev-id="ev_8c486bda1d" cx="9" cy="11.5" r="1.2" fill="#22d3ee" />
    <circle data-ev-id="ev_b5a1ac5ef5" cx="15" cy="11.5" r="1.2" fill="#22d3ee" />
    <circle data-ev-id="ev_77b8605f73" cx="12" cy="15" r="1" fill="#f472b6" />
    {/* connections */}
    <line data-ev-id="ev_94c9e59fea" x1="12" y1="8.4" x2="9" y2="10.3" stroke="#a78bfa" strokeWidth="0.9" opacity="0.7" />
    <line data-ev-id="ev_e356bee5f1" x1="12" y1="8.4" x2="15" y2="10.3" stroke="#a78bfa" strokeWidth="0.9" opacity="0.7" />
    <line data-ev-id="ev_abe7236db1" x1="9" y1="12.7" x2="12" y2="14" stroke="#22d3ee" strokeWidth="0.9" opacity="0.6" />
    <line data-ev-id="ev_25af4a1500" x1="15" y1="12.7" x2="12" y2="14" stroke="#22d3ee" strokeWidth="0.9" opacity="0.6" />
    <line data-ev-id="ev_ad7ce40cd4" x1="9.2" y1="11.5" x2="13.8" y2="11.5" stroke="#67e8f9" strokeWidth="0.7" opacity="0.4" />
    {/* gradient def */}
    <defs data-ev-id="ev_b17bf7c9b8">
      <linearGradient data-ev-id="ev_67c240644e" id="ai-grad" x1="4" y1="2" x2="20" y2="22">
        <stop data-ev-id="ev_4070520c80" stopColor="#a78bfa" />
        <stop data-ev-id="ev_24f7f3254a" offset="1" stopColor="#22d3ee" />
      </linearGradient>
    </defs>
  </svg>;