import { useEffect } from 'react';
import type { ThemeColors } from '@/components/admin/ThemeEditor';
import { applyThemeToDOM } from '@/components/admin/ThemeEditor';

const DEFAULT_THEME: ThemeColors = {
  primary: '#06b6d4',
  secondary: '#8b5cf6',
  accent: '#a855f7',
};

/**
 * Parses theme_colors from DB config (Json type) into a typed ThemeColors object.
 * Falls back to defaults for any missing or invalid values.
 */
export function parseThemeColors(raw: unknown): ThemeColors {
  if (typeof raw === 'object' && raw !== null) {
    const obj = raw as Record<string, unknown>;
    return {
      primary: typeof obj.primary === 'string' ? obj.primary : DEFAULT_THEME.primary,
      secondary: typeof obj.secondary === 'string' ? obj.secondary : DEFAULT_THEME.secondary,
      accent: typeof obj.accent === 'string' ? obj.accent : DEFAULT_THEME.accent,
    };
  }
  return { ...DEFAULT_THEME };
}

/**
 * Hook: reads theme_colors from site_config and applies them as CSS custom properties.
 * Call once in the main page component, passing config?.theme_colors.
 */
export function useTheme(themeColorsRaw: unknown) {
  useEffect(() => {
    const colors = parseThemeColors(themeColorsRaw);
    applyThemeToDOM(colors);
  }, [themeColorsRaw]);
}
