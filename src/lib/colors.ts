/**
 * Brand color constants for nVision.
 *
 * These mirror the CSS custom properties in theme.css and capture the hex
 * values that appear most frequently across components. Use these when
 * working in TypeScript/canvas code instead of hard-coding hex strings.
 *
 * NOTE: CSS/Tailwind classes should still reference the theme vars
 * (e.g. `text-primary`, `bg-secondary`). This file is for JS/TS contexts
 * such as canvas drawing, inline styles, and dynamic color logic.
 */

export const BRAND = {
  /** Primary cyan - buttons, links, highlights */
  cyan: '#06b6d4',

  /** Secondary purple */
  purple: '#8b5cf6',

  /** Accent purple (lighter) */
  purpleLight: '#a855f7',

  /** Pink accent */
  pink: '#ec4899',

  /** Amber / warning */
  amber: '#f59e0b',

  /** Red / destructive */
  red: '#ef4444',

  /** Emerald / success */
  green: '#10b981',
} as const;

export const BG = {
  /** Page background */
  base: '#0a0a14',

  /** Primary foreground / deep dark */
  deep: '#0a0a0f',
} as const;

export type BrandColor = (typeof BRAND)[keyof typeof BRAND];
export type BgColor = (typeof BG)[keyof typeof BG];
