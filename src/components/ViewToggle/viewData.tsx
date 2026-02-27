import React from 'react';

/**
 * Metadata for a single view button in the ViewToggle toolbar.
 * ID must match the corresponding entry in VIEW_REGISTRY (or 1 for the inline Grid view).
 */
export interface ViewDef {
  id: number;
  label: string;
  /** Inline SVG icon rendered inside the button. */
  icon: JSX.Element;
  /** Tailwind gradient classes applied to the active-state background. */
  gradient: string;
}

export const views: ViewDef[] = [
{
  id: 1,
  label: 'Grid',
  gradient: 'from-primary to-accent',
  icon:
  <svg data-ev-id="ev_779cf232b6" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <rect data-ev-id="ev_33de72be9e" x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect data-ev-id="ev_47823c17e7" x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect data-ev-id="ev_a5d3a529d0" x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect data-ev-id="ev_dbf7641e53" x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      </svg>

},
{
  id: 2,
  label: 'Stack',
  gradient: 'from-accent to-secondary',
  icon:
  <svg data-ev-id="ev_0baa23e99c" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <rect data-ev-id="ev_59d44e93b0" x="2" y="1" width="10" height="3" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect data-ev-id="ev_84d5af3250" x="1" y="5.5" width="10" height="3" rx="1" stroke="currentColor" strokeWidth="1.2" transform="rotate(-2 6 7)" />
        <rect data-ev-id="ev_3aaf9ab0fe" x="3" y="10" width="10" height="3" rx="1" stroke="currentColor" strokeWidth="1.2" transform="rotate(2 8 11.5)" />
      </svg>

},
{
  id: 3,
  label: 'Flow',
  gradient: 'from-secondary to-primary',
  icon:
  <svg data-ev-id="ev_19932b420a" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <rect data-ev-id="ev_6715bb7905" x="0.5" y="4" width="4" height="6" rx="1" stroke="currentColor" strokeWidth="1" opacity="0.5" transform="skewY(-5)" />
        <rect data-ev-id="ev_bc1551fc87" x="5" y="2.5" width="4" height="9" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect data-ev-id="ev_1e47c73a86" x="9.5" y="4" width="4" height="6" rx="1" stroke="currentColor" strokeWidth="1" opacity="0.5" transform="skewY(5)" />
      </svg>

},
{
  id: 4,
  label: 'Orbit',
  gradient: 'from-primary to-secondary',
  icon:
  <svg data-ev-id="ev_b66658bda2" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <circle data-ev-id="ev_79e828d538" cx="7" cy="7" r="1.5" fill="currentColor" />
        <ellipse data-ev-id="ev_01c3b835bc" cx="7" cy="7" rx="5.5" ry="3" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <circle data-ev-id="ev_2b6ec6bd3d" cx="12" cy="5.5" r="1" fill="currentColor" opacity="0.5" />
        <circle data-ev-id="ev_fa46cddfc6" cx="2.5" cy="8.5" r="0.8" fill="currentColor" opacity="0.4" />
      </svg>

},
{
  id: 5,
  label: 'Deck',
  gradient: 'from-accent to-primary',
  icon:
  <svg data-ev-id="ev_ecacec7ce6" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <rect data-ev-id="ev_b3b1de7c7c" x="3.5" y="0.5" width="8" height="5" rx="1" stroke="currentColor" strokeWidth="0.7" opacity="0.25" />
        <rect data-ev-id="ev_2685acce41" x="2.5" y="2" width="9" height="5.5" rx="1" stroke="currentColor" strokeWidth="0.85" opacity="0.45" />
        <rect data-ev-id="ev_36739335e7" x="1.5" y="4" width="10" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path data-ev-id="ev_e0ca9e5eca" d="M6 10 L8 10" stroke="currentColor" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
      </svg>

},
{
  id: 6,
  label: 'Neural',
  gradient: 'from-primary to-accent',
  icon:
  <svg data-ev-id="ev_a2ce3f528a" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <circle data-ev-id="ev_be732a9197" cx="3" cy="3" r="1.3" stroke="currentColor" strokeWidth="1" />
        <circle data-ev-id="ev_545272ee16" cx="11" cy="3" r="1.3" stroke="currentColor" strokeWidth="1" />
        <circle data-ev-id="ev_24ecb410c3" cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2" />
        <circle data-ev-id="ev_b2907cfc3d" cx="3" cy="11" r="1.3" stroke="currentColor" strokeWidth="1" />
        <circle data-ev-id="ev_5bc7eb04b7" cx="11" cy="11" r="1.3" stroke="currentColor" strokeWidth="1" />
        <line data-ev-id="ev_26d64dfd70" x1="4" y1="3.8" x2="5.8" y2="6.2" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
        <line data-ev-id="ev_50213eb111" x1="10" y1="3.8" x2="8.2" y2="6.2" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
        <line data-ev-id="ev_8b8e8c949a" x1="4" y1="10.2" x2="5.8" y2="7.8" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
        <line data-ev-id="ev_f12856eb17" x1="10" y1="10.2" x2="8.2" y2="7.8" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
      </svg>

},
{
  id: 7,
  label: 'Terminal',
  gradient: 'from-secondary to-accent',
  icon:
  <svg data-ev-id="ev_9da1f0ab8b" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <rect data-ev-id="ev_42b7b80ba0" x="1" y="1.5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.1" />
        <line data-ev-id="ev_03f34871a4" x1="3" y1="4" x2="7" y2="4" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
        <line data-ev-id="ev_1392ff9ec4" x1="3" y1="6.5" x2="9" y2="6.5" stroke="currentColor" strokeWidth="0.9" opacity="0.4" />
        <line data-ev-id="ev_51d651080b" x1="3" y1="9" x2="5.5" y2="9" stroke="currentColor" strokeWidth="0.9" opacity="0.3" />
        <path data-ev-id="ev_486715c34e" d="M1.5 3.2 L12.5 3.2" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      </svg>

},
{
  id: 8,
  label: 'Chat',
  gradient: 'from-green-500 to-cyan-500',
  icon:
  <svg data-ev-id="ev_898ad0abd4" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <path data-ev-id="ev_0e98bc14a1" d="M2 2.5C2 1.67 2.67 1 3.5 1h7C11.33 1 12 1.67 12 2.5v6c0 .83-.67 1.5-1.5 1.5H5l-2.5 2V10H3.5C2.67 10 2 9.33 2 8.5v-6z" stroke="currentColor" strokeWidth="1.1" />
        <circle data-ev-id="ev_7a2541dddb" cx="5" cy="5.5" r="0.6" fill="currentColor" opacity="0.5" />
        <circle data-ev-id="ev_f492411498" cx="7" cy="5.5" r="0.6" fill="currentColor" opacity="0.5" />
        <circle data-ev-id="ev_44802231ad" cx="9" cy="5.5" r="0.6" fill="currentColor" opacity="0.5" />
      </svg>

},
{
  id: 9,
  label: 'IDE',
  gradient: 'from-blue-500 to-purple-500',
  icon:
  <svg data-ev-id="ev_f9e2258bba" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <rect data-ev-id="ev_eb5a5242df" x="1" y="1.5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.1" />
        <line data-ev-id="ev_a4d1c204a5" x1="4.5" y1="1.5" x2="4.5" y2="11.5" stroke="currentColor" strokeWidth="0.7" opacity="0.3" />
        <line data-ev-id="ev_d201808fd1" x1="1" y1="4" x2="13" y2="4" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
        <path data-ev-id="ev_2593cdd91c" d="M6.5 7 L8 8.2 L6.5 9.4" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
      </svg>

},
{
  id: 10,
  label: 'Phone',
  gradient: 'from-pink-500 to-orange-400',
  icon:
  <svg data-ev-id="ev_15f4e07865" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <rect data-ev-id="ev_495f248792" x="3.5" y="0.5" width="7" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.1" />
        <line data-ev-id="ev_4cd41accbb" x1="5.5" y1="11" x2="8.5" y2="11" stroke="currentColor" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
        <rect data-ev-id="ev_94070045e9" x="5" y="3" width="1.5" height="1.5" rx="0.3" fill="currentColor" opacity="0.3" />
        <rect data-ev-id="ev_38f27b4546" x="7.5" y="3" width="1.5" height="1.5" rx="0.3" fill="currentColor" opacity="0.3" />
        <rect data-ev-id="ev_225a024b5a" x="5" y="5.5" width="1.5" height="1.5" rx="0.3" fill="currentColor" opacity="0.3" />
        <rect data-ev-id="ev_df989622ed" x="7.5" y="5.5" width="1.5" height="1.5" rx="0.3" fill="currentColor" opacity="0.3" />
      </svg>

},
{
  id: 11,
  label: 'Control',
  gradient: 'from-green-500 to-cyan-600',
  icon:
  <svg data-ev-id="ev_326dde99ae" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <rect data-ev-id="ev_4ca4c598cf" x="1" y="1" width="5.5" height="4" rx="0.8" stroke="currentColor" strokeWidth="0.9" />
        <rect data-ev-id="ev_839199c32a" x="7.5" y="1" width="5.5" height="4" rx="0.8" stroke="currentColor" strokeWidth="0.9" />
        <rect data-ev-id="ev_a47f4fd985" x="1" y="6" width="12" height="3.5" rx="0.8" stroke="currentColor" strokeWidth="0.9" />
        <line data-ev-id="ev_85f1eeb413" x1="3" y1="11" x2="5" y2="11" stroke="currentColor" strokeWidth="0.7" opacity="0.4" />
        <line data-ev-id="ev_d94d8851f6" x1="7" y1="11" x2="11" y2="11" stroke="currentColor" strokeWidth="0.7" opacity="0.4" />
        <circle data-ev-id="ev_0b4fd6081b" cx="3" cy="3" r="0.7" fill="currentColor" opacity="0.4" />
        <circle data-ev-id="ev_adfe5de2e4" cx="10" cy="3" r="0.7" fill="currentColor" opacity="0.4" />
      </svg>

},
{
  id: 12,
  label: 'Stars',
  gradient: 'from-indigo-500 to-purple-600',
  icon:
  <svg data-ev-id="ev_7c304cfe3f" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <circle data-ev-id="ev_d1e686e630" cx="3.5" cy="4" r="1.2" stroke="currentColor" strokeWidth="0.9" />
        <circle data-ev-id="ev_b6b9a652a1" cx="10" cy="3" r="1" stroke="currentColor" strokeWidth="0.9" />
        <circle data-ev-id="ev_31a9b2b5ee" cx="7" cy="7.5" r="1.4" stroke="currentColor" strokeWidth="0.9" />
        <circle data-ev-id="ev_1a6c056d1b" cx="4" cy="11" r="0.9" stroke="currentColor" strokeWidth="0.9" />
        <circle data-ev-id="ev_7429939efa" cx="11" cy="10" r="1.1" stroke="currentColor" strokeWidth="0.9" />
        <line data-ev-id="ev_2dfd3be737" x1="3.5" y1="4" x2="7" y2="7.5" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <line data-ev-id="ev_a541c9aa0f" x1="7" y1="7.5" x2="10" y2="3" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <line data-ev-id="ev_71ff199343" x1="7" y1="7.5" x2="11" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <line data-ev-id="ev_df2c7dfde7" x1="4" y1="11" x2="7" y2="7.5" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      </svg>

},
{
  id: 13,
  label: 'Circuit',
  gradient: 'from-emerald-500 to-teal-600',
  icon:
  <svg data-ev-id="ev_00742f3831" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <rect data-ev-id="ev_fb03ec3958" x="4" y="4" width="6" height="6" rx="0.8" stroke="currentColor" strokeWidth="1" />
        <line data-ev-id="ev_4bdbbd7b69" x1="5.5" y1="4" x2="5.5" y2="1.5" stroke="currentColor" strokeWidth="0.8" />
        <line data-ev-id="ev_a216041db2" x1="8.5" y1="4" x2="8.5" y2="1.5" stroke="currentColor" strokeWidth="0.8" />
        <line data-ev-id="ev_57d50a7830" x1="5.5" y1="10" x2="5.5" y2="12.5" stroke="currentColor" strokeWidth="0.8" />
        <line data-ev-id="ev_ce12d5c42a" x1="8.5" y1="10" x2="8.5" y2="12.5" stroke="currentColor" strokeWidth="0.8" />
        <line data-ev-id="ev_b1f23cef89" x1="4" y1="5.5" x2="1.5" y2="5.5" stroke="currentColor" strokeWidth="0.8" />
        <line data-ev-id="ev_af8c19084e" x1="4" y1="8.5" x2="1.5" y2="8.5" stroke="currentColor" strokeWidth="0.8" />
        <line data-ev-id="ev_a035e7a5ae" x1="10" y1="5.5" x2="12.5" y2="5.5" stroke="currentColor" strokeWidth="0.8" />
        <line data-ev-id="ev_9e5fa8a21b" x1="10" y1="8.5" x2="12.5" y2="8.5" stroke="currentColor" strokeWidth="0.8" />
        <circle data-ev-id="ev_c13f5264c4" cx="7" cy="7" r="1" fill="currentColor" opacity="0.4" />
      </svg>

},
{
  id: 14,
  label: 'RPG',
  gradient: 'from-yellow-500 to-orange-500',
  icon:
  <svg data-ev-id="ev_9f46f49e28" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <circle data-ev-id="ev_cde9b5cae4" cx="7" cy="2.5" r="1.8" stroke="currentColor" strokeWidth="0.9" />
        <circle data-ev-id="ev_866c2d5835" cx="3" cy="7" r="1.5" stroke="currentColor" strokeWidth="0.9" />
        <circle data-ev-id="ev_66fe838540" cx="11" cy="7" r="1.5" stroke="currentColor" strokeWidth="0.9" />
        <circle data-ev-id="ev_32885e129c" cx="5" cy="11.5" r="1.3" stroke="currentColor" strokeWidth="0.9" />
        <circle data-ev-id="ev_53d4156583" cx="9" cy="11.5" r="1.3" stroke="currentColor" strokeWidth="0.9" />
        <line data-ev-id="ev_5e2267242c" x1="5.5" y1="3.5" x2="4" y2="5.8" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
        <line data-ev-id="ev_1861784de0" x1="8.5" y1="3.5" x2="10" y2="5.8" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
        <line data-ev-id="ev_3d98f6727a" x1="3.8" y1="8.3" x2="5" y2="10.3" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
        <line data-ev-id="ev_616b4d6635" x1="10.2" y1="8.3" x2="9" y2="10.3" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
        <path data-ev-id="ev_b35d23253d" d="M6.2 2.2 L7 1 L7.8 2.2" fill="currentColor" opacity="0.5" />
      </svg>

},
{
  id: 15,
  label: 'Atoms',
  gradient: 'from-teal-400 to-blue-500',
  icon:
  <svg data-ev-id="ev_9984479fe8" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <circle data-ev-id="ev_39693c65be" cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1" />
        <ellipse data-ev-id="ev_474a6850f5" cx="7" cy="7" rx="6" ry="2.5" stroke="currentColor" strokeWidth="0.7" opacity="0.4" />
        <ellipse data-ev-id="ev_80a13ff581" cx="7" cy="7" rx="6" ry="2.5" stroke="currentColor" strokeWidth="0.7" opacity="0.4" transform="rotate(60 7 7)" />
        <ellipse data-ev-id="ev_964c13cd8b" cx="7" cy="7" rx="6" ry="2.5" stroke="currentColor" strokeWidth="0.7" opacity="0.4" transform="rotate(-60 7 7)" />
        <circle data-ev-id="ev_46449e677f" cx="7" cy="7" r="0.8" fill="currentColor" opacity="0.5" />
      </svg>

},
{
  id: 16,
  label: 'Table',
  gradient: 'from-amber-400 to-rose-500',
  icon:
  <svg data-ev-id="ev_126d62a691" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <rect data-ev-id="ev_ff1ee7dd53" x="1" y="1" width="3.5" height="4.5" rx="0.6" stroke="currentColor" strokeWidth="0.8" />
        <rect data-ev-id="ev_c86b72592d" x="5.25" y="1" width="3.5" height="4.5" rx="0.6" stroke="currentColor" strokeWidth="0.8" />
        <rect data-ev-id="ev_3688c7dc74" x="9.5" y="1" width="3.5" height="4.5" rx="0.6" stroke="currentColor" strokeWidth="0.8" />
        <rect data-ev-id="ev_2d7a792ed3" x="1" y="6.5" width="3.5" height="4.5" rx="0.6" stroke="currentColor" strokeWidth="0.8" />
        <rect data-ev-id="ev_90b5b32f36" x="5.25" y="6.5" width="3.5" height="4.5" rx="0.6" stroke="currentColor" strokeWidth="0.8" />
        <rect data-ev-id="ev_7866ebeb18" x="9.5" y="6.5" width="3.5" height="4.5" rx="0.6" stroke="currentColor" strokeWidth="0.8" />
        <text data-ev-id="ev_0e51860803" x="2.75" y="4" textAnchor="middle" fill="currentColor" fontSize="3" fontWeight="bold" opacity="0.5">Nv</text>
        <text data-ev-id="ev_a7ff0fa996" x="7" y="4" textAnchor="middle" fill="currentColor" fontSize="3" fontWeight="bold" opacity="0.5">Ai</text>
      </svg>

},
{
  id: 17,
  label: 'Ocean',
  gradient: 'from-blue-600 to-cyan-400',
  icon:
  <svg data-ev-id="ev_22ee35acae" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <path data-ev-id="ev_d8d583193f" d="M1 7 Q3.5 5 7 7 Q10.5 9 13 7" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <path data-ev-id="ev_e800922606" d="M1 9 Q3.5 7 7 9 Q10.5 11 13 9" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
        <circle data-ev-id="ev_3974cd76b1" cx="4" cy="4" r="1.5" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <circle data-ev-id="ev_579e650472" cx="10" cy="4.5" r="1.2" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        <circle data-ev-id="ev_1e4250c709" cx="7" cy="3" r="1" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        <circle data-ev-id="ev_70c8178dd9" cx="3" cy="11" r="0.5" fill="currentColor" opacity="0.2" />
        <circle data-ev-id="ev_8e2095a1ae" cx="8" cy="12" r="0.4" fill="currentColor" opacity="0.2" />
      </svg>

},
{
  id: 18,
  label: 'Radar',
  gradient: 'from-cyan-500 to-emerald-500',
  icon:
  <svg data-ev-id="ev_66121a2841" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <circle data-ev-id="ev_5bdce639c5" cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="0.9" opacity="0.3" />
        <circle data-ev-id="ev_9ef36d8bf9" cx="7" cy="7" r="3.5" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
        <circle data-ev-id="ev_86823838a9" cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
        <line data-ev-id="ev_89633c51ff" x1="7" y1="7" x2="11.5" y2="3.5" stroke="currentColor" strokeWidth="1.1" opacity="0.7" />
        <circle data-ev-id="ev_8dc1ec4687" cx="7" cy="7" r="0.7" fill="currentColor" opacity="0.6" />
        <circle data-ev-id="ev_a61ef4df3a" cx="9.5" cy="4.5" r="0.8" fill="currentColor" opacity="0.5" />
        <circle data-ev-id="ev_9476fe2d17" cx="4.5" cy="5" r="0.6" fill="currentColor" opacity="0.3" />
      </svg>

},
{
  id: 19,
  label: 'NN',
  gradient: 'from-indigo-400 to-purple-500',
  icon:
  <svg data-ev-id="ev_72279a6096" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <circle data-ev-id="ev_96de8dc1cb" cx="2.5" cy="3.5" r="1.3" stroke="currentColor" strokeWidth="0.9" />
        <circle data-ev-id="ev_07f5b563c9" cx="2.5" cy="7" r="1.3" stroke="currentColor" strokeWidth="0.9" />
        <circle data-ev-id="ev_613723dff1" cx="2.5" cy="10.5" r="1.3" stroke="currentColor" strokeWidth="0.9" />
        <circle data-ev-id="ev_81b79a29a7" cx="7" cy="5" r="1.3" stroke="currentColor" strokeWidth="0.9" />
        <circle data-ev-id="ev_8227982de0" cx="7" cy="9" r="1.3" stroke="currentColor" strokeWidth="0.9" />
        <circle data-ev-id="ev_1d26534bcf" cx="11.5" cy="7" r="1.3" stroke="currentColor" strokeWidth="0.9" />
        <line data-ev-id="ev_72bc035b9a" x1="3.5" y1="3.8" x2="5.8" y2="5" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <line data-ev-id="ev_c8135acd73" x1="3.5" y1="7" x2="5.8" y2="5.3" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <line data-ev-id="ev_e8299f938b" x1="3.5" y1="7" x2="5.8" y2="8.7" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <line data-ev-id="ev_53afe6c0ae" x1="3.5" y1="10.2" x2="5.8" y2="9" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <line data-ev-id="ev_0b2e29f4e6" x1="8.2" y1="5.3" x2="10.2" y2="6.7" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <line data-ev-id="ev_019e0bed19" x1="8.2" y1="8.7" x2="10.2" y2="7.3" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      </svg>

},
{
  id: 20,
  label: 'Stream',
  gradient: 'from-red-600 to-rose-500',
  icon:
  <svg data-ev-id="ev_55a315c0e4" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <rect data-ev-id="ev_ffdb826f7c" x="1" y="2" width="12" height="8" rx="1.2" stroke="currentColor" strokeWidth="1" />
        <polygon data-ev-id="ev_37551e574c" points="5.5,4.5 5.5,8.5 9.5,6.5" fill="currentColor" opacity="0.6" />
        <line data-ev-id="ev_5e3ee335bc" x1="3" y1="12" x2="11" y2="12" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
        <line data-ev-id="ev_e5be36ace6" x1="5" y1="10" x2="5" y2="12" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
        <line data-ev-id="ev_9bf2366f4a" x1="9" y1="10" x2="9" y2="12" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
      </svg>

},
{
  id: 21,
  label: 'Dash',
  gradient: 'from-cyan-500 to-blue-500',
  icon:
  <svg data-ev-id="ev_e9a35cb657" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <rect data-ev-id="ev_232b6d590d" x="1" y="1" width="5" height="3.5" rx="0.7" stroke="currentColor" strokeWidth="0.8" />
        <rect data-ev-id="ev_d335a00e1a" x="8" y="1" width="5" height="3.5" rx="0.7" stroke="currentColor" strokeWidth="0.8" />
        <rect data-ev-id="ev_226143ae8b" x="1" y="6" width="12" height="3" rx="0.7" stroke="currentColor" strokeWidth="0.8" />
        <line data-ev-id="ev_16867180e3" x1="3" y1="7.5" x2="5" y2="7.5" stroke="currentColor" strokeWidth="0.7" opacity="0.4" />
        <line data-ev-id="ev_4c3c833fd1" x1="7" y1="7.5" x2="11" y2="7.5" stroke="currentColor" strokeWidth="0.7" opacity="0.4" />
        <circle data-ev-id="ev_aed7ca89ba" cx="3" cy="2.8" r="0.6" fill="currentColor" opacity="0.4" />
        <rect data-ev-id="ev_5f5492930b" x="1" y="10.5" width="12" height="2.5" rx="0.7" stroke="currentColor" strokeWidth="0.8" />
        <polyline data-ev-id="ev_1bd8ba9acc" points="2.5,12.2 4,11.2 5.5,11.8 7,11 8.5,11.5 10,11 11.5,11.8" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.5" />
      </svg>

},
{
  id: 22,
  label: 'Secret',
  gradient: 'from-amber-700 to-red-600',
  icon:
  <svg data-ev-id="ev_033eec7db3" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <rect data-ev-id="ev_0f7970e93f" x="1.5" y="3" width="11" height="9" rx="0.8" stroke="currentColor" strokeWidth="0.9" />
        <path data-ev-id="ev_3feeb72f85" d="M5 3 V1.5 A2 2 0 0 1 9 1.5 V3" stroke="currentColor" strokeWidth="0.9" fill="none" />
        <circle data-ev-id="ev_53f6c88ff4" cx="7" cy="7.5" r="1.3" stroke="currentColor" strokeWidth="0.8" />
        <line data-ev-id="ev_1909729bf6" x1="7" y1="8.8" x2="7" y2="10" stroke="currentColor" strokeWidth="0.9" />
        <line data-ev-id="ev_3d0b5a5626" x1="3" y1="5.5" x2="11" y2="5.5" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
        <rect data-ev-id="ev_6d633e7d50" x="3.5" y="4" width="3" height="1" rx="0.3" fill="currentColor" opacity="0.15" />
      </svg>

},
{
  id: 23,
  label: 'Spotify',
  gradient: 'from-green-500 to-emerald-600',
  icon:
  <svg data-ev-id="ev_0a0d27dfdf" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <circle data-ev-id="ev_3dafc10485" cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="0.9" />
        <path data-ev-id="ev_314d828209" d="M4 5.5 Q7 4 10 5.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none" />
        <path data-ev-id="ev_67bcb06db3" d="M4.5 7.5 Q7 6.2 9.5 7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
        <path data-ev-id="ev_b89136e14a" d="M5 9.5 Q7 8.5 9 9.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" fill="none" />
      </svg>

},
{
  id: 24,
  label: 'News',
  gradient: 'from-amber-700 to-yellow-600',
  icon:
  <svg data-ev-id="ev_0afe538cca" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <rect data-ev-id="ev_0290c544a7" x="1.5" y="1" width="11" height="12" rx="0.8" stroke="currentColor" strokeWidth="0.9" />
        <line data-ev-id="ev_0c61f5d178" x1="3.5" y1="3.5" x2="10.5" y2="3.5" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
        <line data-ev-id="ev_7b5ba4129d" x1="3.5" y1="5.5" x2="10.5" y2="5.5" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
        <line data-ev-id="ev_41ee528278" x1="3.5" y1="7" x2="6.5" y2="7" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
        <line data-ev-id="ev_4fe4cb150e" x1="7.5" y1="7" x2="10.5" y2="7" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
        <line data-ev-id="ev_6e4908ee33" x1="3.5" y1="8.5" x2="6.5" y2="8.5" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
        <line data-ev-id="ev_8e48d3915d" x1="7.5" y1="8.5" x2="10.5" y2="8.5" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
        <line data-ev-id="ev_68e7b98409" x1="3.5" y1="10" x2="6.5" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
        <line data-ev-id="ev_96a8d18863" x1="7.5" y1="10" x2="10.5" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
        <line data-ev-id="ev_947ad1afa1" x1="7" y1="6.5" x2="7" y2="11" stroke="currentColor" strokeWidth="0.4" opacity="0.15" />
      </svg>

},
{
  id: 25,
  label: 'Metro',
  gradient: 'from-red-500 to-blue-500',
  icon:
  <svg data-ev-id="ev_77ff422c6c" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <line data-ev-id="ev_55f27f76b3" x1="1" y1="4" x2="13" y2="4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
        <line data-ev-id="ev_e07b7e3ef8" x1="1" y1="10" x2="13" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.3" />
        <circle data-ev-id="ev_8833f92145" cx="3" cy="4" r="1.5" fill="currentColor" stroke="currentColor" strokeWidth="0.5" opacity="0.7" />
        <circle data-ev-id="ev_04bbec2bc2" cx="7" cy="4" r="1.5" fill="currentColor" stroke="currentColor" strokeWidth="0.5" opacity="0.7" />
        <circle data-ev-id="ev_d53089ffd9" cx="11" cy="4" r="1.5" fill="currentColor" stroke="currentColor" strokeWidth="0.5" opacity="0.7" />
        <circle data-ev-id="ev_deed858f6e" cx="4" cy="10" r="1.3" fill="currentColor" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
        <circle data-ev-id="ev_f329b8e790" cx="10" cy="10" r="1.3" fill="currentColor" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
        <line data-ev-id="ev_202a9f4761" x1="7" y1="4" x2="4" y2="10" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
        <line data-ev-id="ev_c574cd60c1" x1="7" y1="4" x2="10" y2="10" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
      </svg>

},
{
  id: 26,
  label: 'Arcade',
  gradient: 'from-purple-600 to-yellow-500',
  icon:
  <svg data-ev-id="ev_3b7e9b6288" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <rect data-ev-id="ev_d74c09a073" x="2" y="1" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="0.9" />
        <line data-ev-id="ev_e4e8a7ece4" x1="2" y1="3" x2="12" y2="3" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
        <circle data-ev-id="ev_6bea92edd4" cx="5.5" cy="5.5" r="0.6" fill="currentColor" opacity="0.4" />
        <circle data-ev-id="ev_d782e83a4b" cx="8.5" cy="5.5" r="0.6" fill="currentColor" opacity="0.4" />
        <circle data-ev-id="ev_5bd599a7a1" cx="7" cy="4.5" r="0.6" fill="currentColor" opacity="0.4" />
        <circle data-ev-id="ev_a54cf2d2c7" cx="7" cy="6.5" r="0.6" fill="currentColor" opacity="0.4" />
        <rect data-ev-id="ev_2dc1a98667" x="4" y="10" width="6" height="3" rx="0.8" stroke="currentColor" strokeWidth="0.8" />
        <circle data-ev-id="ev_3bf7bd5a10" cx="5.5" cy="11.5" r="0.7" fill="currentColor" opacity="0.3" />
        <circle data-ev-id="ev_73877d25f8" cx="8.5" cy="11.5" r="0.7" fill="currentColor" opacity="0.3" />
      </svg>

},
{
  id: 27,
  label: 'Desktop',
  gradient: 'from-blue-500 to-indigo-600',
  icon:
  <svg data-ev-id="ev_f8a878c97f" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <rect data-ev-id="ev_779ad270f6" x="1" y="1" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="0.9" />
        <line data-ev-id="ev_7366f4195e" x1="1" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <rect data-ev-id="ev_946754e69e" x="5" y="10.5" width="4" height="0.8" rx="0.4" fill="currentColor" opacity="0.3" />
        <line data-ev-id="ev_5ce8a4167b" x1="7" y1="10" x2="7" y2="10.5" stroke="currentColor" strokeWidth="0.7" opacity="0.3" />
        <rect data-ev-id="ev_e1c0d0316e" x="3" y="3" width="3" height="2.5" rx="0.4" fill="currentColor" opacity="0.15" />
        <rect data-ev-id="ev_96c8866044" x="8" y="3" width="3" height="2.5" rx="0.4" fill="currentColor" opacity="0.1" />
        <rect data-ev-id="ev_6e8d9819cf" x="3" y="2.5" width="1.5" height="0.5" rx="0.2" fill="currentColor" opacity="0.2" />
      </svg>

},
{
  id: 28,
  label: 'AI',
  gradient: 'from-emerald-500 to-cyan-500',
  icon:
  <svg data-ev-id="ev_6cf3cc9f22" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <rect data-ev-id="ev_ed86b7bf37" x="1" y="1.5" width="12" height="11" rx="1.2" stroke="currentColor" strokeWidth="0.9" />
        <line data-ev-id="ev_ea7ced7857" x1="4.5" y1="1.5" x2="4.5" y2="12.5" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
        <circle data-ev-id="ev_2cbdfab2b6" cx="2.8" cy="4" r="0.5" fill="currentColor" opacity="0.3" />
        <circle data-ev-id="ev_494e71812b" cx="2.8" cy="6" r="0.5" fill="currentColor" opacity="0.3" />
        <circle data-ev-id="ev_7d3d794251" cx="2.8" cy="8" r="0.5" fill="currentColor" opacity="0.3" />
        <line data-ev-id="ev_f26919c658" x1="5.5" y1="3.5" x2="4" y2="5.8" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
        <line data-ev-id="ev_1861784de0" x1="8.5" y1="3.5" x2="10" y2="5.8" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
        <line data-ev-id="ev_3d98f6727a" x1="3.8" y1="8.3" x2="5" y2="10.3" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
        <line data-ev-id="ev_616b4d6635" x1="10.2" y1="8.3" x2="9" y2="10.3" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
        <path data-ev-id="ev_b35d23253d" d="M6.2 2.2 L7 1 L7.8 2.2" fill="currentColor" opacity="0.5" />
      </svg>

},
{
  id: 29,
  label: 'Holo',
  gradient: 'from-cyan-400 to-purple-500',
  icon:
  <svg data-ev-id="ev_7faefc207b" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <polygon data-ev-id="ev_ab3bd7d3c5" points="7,0.5 13,4 13,10 7,13.5 1,10 1,4" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.4" />
        <polygon data-ev-id="ev_10f5d038ff" points="7,2.5 11,5 11,9 7,11.5 3,9 3,5" stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.25" />
        <circle data-ev-id="ev_380601d190" cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
        <circle data-ev-id="ev_f04d9c5ce0" cx="7" cy="7" r="0.5" fill="currentColor" opacity="0.5" />
        <line data-ev-id="ev_8c75e3367f" x1="7" y1="0.5" x2="7" y2="2.5" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <line data-ev-id="ev_10036ee9a8" x1="13" y1="4" x2="11" y2="5" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <line data-ev-id="ev_2bac3f1d28" x1="1" y1="4" x2="3" y2="5" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <line data-ev-id="ev_c6652abe2a" x1="7" y1="13.5" x2="7" y2="11.5" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      </svg>

},
{
  id: 30,
  label: 'MRI',
  gradient: 'from-cyan-400 to-pink-500',
  icon:
  <svg data-ev-id="ev_a5e429a93e" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <ellipse data-ev-id="ev_ec9a15249f" cx="7" cy="6.5" rx="5.5" ry="5" stroke="currentColor" strokeWidth="0.9" opacity="0.4" />
        <ellipse data-ev-id="ev_92f871f3a9" cx="7" cy="6" rx="3.5" ry="1.5" stroke="currentColor" strokeWidth="0.6" opacity="0.25" />
        <path data-ev-id="ev_44698918cf" d="M6 6.5 Q7 10 8 6.5" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.2" />
        <circle data-ev-id="ev_32ec39073d" cx="5" cy="4.5" r="1.2" fill="currentColor" opacity="0.2" />
        <circle data-ev-id="ev_6acbad3145" cx="9" cy="5" r="1" fill="currentColor" opacity="0.15" />
        <circle data-ev-id="ev_dba1da2bf2" cx="7" cy="8" r="0.8" fill="currentColor" opacity="0.15" />
        <circle data-ev-id="ev_819e879258" cx="5" cy="4.5" r="0.4" fill="currentColor" opacity="0.5" />
        <circle data-ev-id="ev_f80b496c86" cx="9" cy="5" r="0.3" fill="currentColor" opacity="0.4" />
        <line data-ev-id="ev_83fb11ae00" x1="7" y1="11.5" x2="7" y2="13" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
      </svg>

},
{
  id: 31,
  label: 'Prompt',
  gradient: 'from-violet-400 to-cyan-400',
  icon:
  <svg data-ev-id="ev_1325ffa3c8" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <rect data-ev-id="ev_f21a46744b" x="1" y="2" width="4" height="3" rx="0.8" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
        <rect data-ev-id="ev_eb18d64ece" x="9" y="2" width="4" height="3" rx="0.8" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
        <rect data-ev-id="ev_a3b5cb62b2" x="5" y="9" width="4" height="3" rx="0.8" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
        <path data-ev-id="ev_88c16d5dde" d="M5 3.5 L9 3.5" stroke="currentColor" strokeWidth="0.7" opacity="0.3" />
        <path data-ev-id="ev_25752a958d" d="M7 5 L7 9" stroke="currentColor" strokeWidth="0.7" opacity="0.3" />
        <circle data-ev-id="ev_d8323988b1" cx="7" cy="7" r="0.6" fill="currentColor" opacity="0.4" />
      </svg>

},
{
  id: 32,
  label: 'GPU',
  gradient: 'from-green-400 to-yellow-400',
  icon:
  <svg data-ev-id="ev_70b216907d" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <rect data-ev-id="ev_179920c287" x="2" y="1" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="0.9" opacity="0.4" />
        <rect data-ev-id="ev_b48f0aa275" x="3.5" y="3" width="7" height="2" rx="0.5" fill="currentColor" opacity="0.2" />
        <rect data-ev-id="ev_8f795fae3a" x="3.5" y="6" width="7" height="2" rx="0.5" fill="currentColor" opacity="0.15" />
        <rect data-ev-id="ev_ae37626b54" x="3.5" y="9" width="7" height="2" rx="0.5" fill="currentColor" opacity="0.1" />
        <circle data-ev-id="ev_efa268a7ee" cx="4.5" cy="4" r="0.4" fill="currentColor" opacity="0.5" />
        <circle data-ev-id="ev_3fc18c057c" cx="4.5" cy="7" r="0.4" fill="currentColor" opacity="0.4" />
        <circle data-ev-id="ev_b2a225acc0" cx="4.5" cy="10" r="0.4" fill="currentColor" opacity="0.3" />
      </svg>

},
{
  id: 33,
  label: 'Train',
  gradient: 'from-blue-400 to-emerald-400',
  icon:
  <svg data-ev-id="ev_b9bb64cac5" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <path data-ev-id="ev_a903ac1034" d="M2 10 L4 6 L6 8 L8 3 L10 5 L12 2" stroke="currentColor" strokeWidth="0.9" opacity="0.5" fill="none" />
        <line data-ev-id="ev_d6af57b840" x1="2" y1="12" x2="12" y2="12" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
        <line data-ev-id="ev_fcf8fe4945" x1="2" y1="2" x2="2" y2="12" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
        <circle data-ev-id="ev_91096f7f83" cx="8" cy="3" r="0.6" fill="currentColor" opacity="0.4" />
        <circle data-ev-id="ev_9c693ccbcb" cx="12" cy="2" r="0.6" fill="currentColor" opacity="0.5" />
      </svg>

},
{
  id: 34,
  label: 'Robot',
  gradient: 'from-amber-400 to-orange-500',
  icon:
  <svg data-ev-id="ev_f3a1944cb4" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <rect data-ev-id="ev_d9cb714517" x="3" y="4" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="0.9" opacity="0.4" />
        <circle data-ev-id="ev_546eb4fc16" cx="5.5" cy="7" r="1" fill="currentColor" opacity="0.3" />
        <circle data-ev-id="ev_d560efcdc5" cx="8.5" cy="7" r="1" fill="currentColor" opacity="0.3" />
        <line data-ev-id="ev_4b64c8cd59" x1="7" y1="2" x2="7" y2="4" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
        <circle data-ev-id="ev_46a803e283" cx="7" cy="1.5" r="0.7" fill="currentColor" opacity="0.25" />
        <path data-ev-id="ev_8705ced13b" d="M5 9.5 L9 9.5" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
        <line data-ev-id="ev_55e28ad700" x1="1" y1="7" x2="3" y2="7" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
        <line data-ev-id="ev_0357ef76e1" x1="11" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
      </svg>

},
{
  id: 35,
  label: 'DNA',
  gradient: 'from-cyan-400 to-purple-500',
  icon:
  <svg data-ev-id="ev_f0f7a16467" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <path data-ev-id="ev_6f24408dbf" d="M5 1 Q3 4 5 7 Q7 10 5 13" stroke="currentColor" strokeWidth="0.9" opacity="0.4" fill="none" />
        <path data-ev-id="ev_3f3be4b101" d="M9 1 Q11 4 9 7 Q7 10 9 13" stroke="currentColor" strokeWidth="0.9" opacity="0.4" fill="none" />
        <line data-ev-id="ev_08f1742cf7" x1="5" y1="3" x2="9" y2="3" stroke="currentColor" strokeWidth="0.6" opacity="0.2" />
        <line data-ev-id="ev_a856915181" x1="4.5" y1="5.5" x2="9.5" y2="5.5" stroke="currentColor" strokeWidth="0.6" opacity="0.2" />
        <line data-ev-id="ev_20a60ed839" x1="5" y1="8" x2="9" y2="8" stroke="currentColor" strokeWidth="0.6" opacity="0.2" />
        <line data-ev-id="ev_3298bee98f" x1="5.5" y1="10.5" x2="8.5" y2="10.5" stroke="currentColor" strokeWidth="0.6" opacity="0.2" />
      </svg>

},
{
  id: 36,
  label: 'Satellite',
  gradient: 'from-sky-400 to-indigo-500',
  icon:
  <svg data-ev-id="ev_64860500e5" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <ellipse data-ev-id="ev_0c85d09a81" cx="7" cy="7" rx="5" ry="2" stroke="currentColor" strokeWidth="0.7" opacity="0.2" transform="rotate(-20 7 7)" />
        <ellipse data-ev-id="ev_6010694bc8" cx="7" cy="7" rx="5" ry="2" stroke="currentColor" strokeWidth="0.7" opacity="0.15" transform="rotate(40 7 7)" />
        <circle data-ev-id="ev_76d8737241" cx="7" cy="10" r="2.5" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
        <circle data-ev-id="ev_56ac5d4e63" cx="10" cy="4" r="1" fill="currentColor" opacity="0.3" />
        <circle data-ev-id="ev_57c9215357" cx="4" cy="5" r="0.8" fill="currentColor" opacity="0.25" />
      </svg>

},
{
  id: 37,
  label: 'Wormhole',
  gradient: 'from-purple-400 to-pink-500',
  icon:
  <svg data-ev-id="ev_26fee92340" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <ellipse data-ev-id="ev_2c27210d9a" cx="7" cy="7" rx="5.5" ry="5.5" stroke="currentColor" strokeWidth="0.7" opacity="0.15" />
        <ellipse data-ev-id="ev_00e3a2bb85" cx="7" cy="7" rx="4" ry="4" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
        <ellipse data-ev-id="ev_ae8bd54a43" cx="7" cy="7" rx="2.5" ry="2.5" stroke="currentColor" strokeWidth="0.7" opacity="0.25" />
        <ellipse data-ev-id="ev_42e4a25b4b" cx="7" cy="7" rx="1.2" ry="1.2" stroke="currentColor" strokeWidth="0.7" opacity="0.35" />
        <circle data-ev-id="ev_a282808d2b" cx="7" cy="7" r="0.5" fill="currentColor" opacity="0.5" />
      </svg>

},
{
  id: 38,
  label: 'Stock',
  gradient: 'from-green-500 to-red-400',
  icon:
  <svg data-ev-id="ev_43ad8f2aa5" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <line data-ev-id="ev_489fed60e8" x1="2" y1="12" x2="12" y2="12" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
        <rect data-ev-id="ev_74f330cd55" x="3" y="5" width="1.5" height="7" fill="currentColor" opacity="0.15" />
        <rect data-ev-id="ev_fb2a99d4e7" x="6" y="3" width="1.5" height="9" fill="currentColor" opacity="0.2" />
        <rect data-ev-id="ev_afdd544977" x="9" y="7" width="1.5" height="5" fill="currentColor" opacity="0.15" />
        <line data-ev-id="ev_094fb6428b" x1="3.75" y1="3" x2="3.75" y2="5" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
        <line data-ev-id="ev_4516bc7ad9" x1="6.75" y1="1" x2="6.75" y2="3" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
        <line data-ev-id="ev_5bedfd6fd4" x1="9.75" y1="5" x2="9.75" y2="7" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
      </svg>

},
{
  id: 39,
  label: 'Blueprint',
  gradient: 'from-blue-400 to-blue-600',
  icon:
  <svg data-ev-id="ev_fae9389de8" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <rect data-ev-id="ev_5310519e82" x="1.5" y="1.5" width="11" height="11" stroke="currentColor" strokeWidth="0.7" opacity="0.3" strokeDasharray="2 1" />
        <line data-ev-id="ev_19cf90433d" x1="5" y1="1.5" x2="5" y2="12.5" stroke="currentColor" strokeWidth="0.5" opacity="0.15" strokeDasharray="1 1" />
        <line data-ev-id="ev_e06f609c4f" x1="9" y1="1.5" x2="9" y2="12.5" stroke="currentColor" strokeWidth="0.5" opacity="0.15" strokeDasharray="1 1" />
        <line data-ev-id="ev_00258bdc78" x1="1.5" y1="5" x2="12.5" y2="5" stroke="currentColor" strokeWidth="0.5" opacity="0.15" strokeDasharray="1 1" />
        <line data-ev-id="ev_0678e1716a" x1="1.5" y1="9" x2="12.5" y2="9" stroke="currentColor" strokeWidth="0.5" opacity="0.15" strokeDasharray="1 1" />
        <rect data-ev-id="ev_9ff315f001" x="6" y="6" width="2" height="2" stroke="currentColor" strokeWidth="0.6" opacity="0.25" strokeDasharray="1 0.5" />
      </svg>

},
{
  id: 40,
  label: 'Quantum',
  gradient: 'from-sky-400 to-violet-500',
  icon:
  <svg data-ev-id="ev_947def8e83" width="16" height="16" viewBox="0 0 14 14" fill="none" className="opacity-80">
        <circle data-ev-id="ev_6baa3ef1d2" cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
        <ellipse data-ev-id="ev_4bbc77d3fd" cx="7" cy="7" rx="5" ry="2" stroke="currentColor" strokeWidth="0.6" opacity="0.15" transform="rotate(0 7 7)" />
        <ellipse data-ev-id="ev_0006c0f9ad" cx="7" cy="7" rx="5" ry="2" stroke="currentColor" strokeWidth="0.6" opacity="0.15" transform="rotate(60 7 7)" />
        <ellipse data-ev-id="ev_f1068abd3e" cx="7" cy="7" rx="5" ry="2" stroke="currentColor" strokeWidth="0.6" opacity="0.15" transform="rotate(120 7 7)" />
        <circle data-ev-id="ev_ebe7f8f2b4" cx="7" cy="7" r="1.2" fill="currentColor" opacity="0.3" />
        <circle data-ev-id="ev_9d0f01d3d8" cx="7" cy="2" r="0.7" fill="currentColor" opacity="0.25" />
        <circle data-ev-id="ev_60387b3e99" cx="11" cy="5" r="0.5" fill="currentColor" opacity="0.2" />
        <circle data-ev-id="ev_dabe442806" cx="3" cy="9.5" r="0.5" fill="currentColor" opacity="0.2" />
      </svg>

}];

/** Number of view buttons per row in the toggle bar. */
export const ROW_SIZE = 6;

/** Views split into fixed-size rows for the multi-row toggle layout. */
export const rows: ViewDef[][] = [];
for (let i = 0; i < views.length; i += ROW_SIZE) {
  rows.push(views.slice(i, i + ROW_SIZE));
}
