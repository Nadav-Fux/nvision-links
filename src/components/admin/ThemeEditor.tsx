import { useState, useEffect, useId } from 'react';
import { Palette, Save, Loader2, RotateCcw, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { updateConfig } from '@/lib/adminApi';
import type { Tables } from '@/integrations/supabase/helpers';

type ConfigRow = Tables<'site_config'>;

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

const DEFAULT_THEME: ThemeColors = {
  primary: '#06b6d4',
  secondary: '#8b5cf6',
  accent: '#a855f7'
};

interface Preset {
  name: string;
  emoji: string;
  colors: ThemeColors;
}

const PRESETS: Preset[] = [
{
  name: 'Cyber',
  emoji: '🌊',
  colors: { primary: '#06b6d4', secondary: '#8b5cf6', accent: '#a855f7' }
},
{
  name: 'Emerald',
  emoji: '🌿',
  colors: { primary: '#10b981', secondary: '#06b6d4', accent: '#14b8a6' }
},
{
  name: 'Sunset',
  emoji: '🌅',
  colors: { primary: '#f59e0b', secondary: '#ef4444', accent: '#f97316' }
},
{
  name: 'Rose',
  emoji: '🌸',
  colors: { primary: '#ec4899', secondary: '#8b5cf6', accent: '#f472b6' }
},
{
  name: 'Electric',
  emoji: '⚡',
  colors: { primary: '#3b82f6', secondary: '#6366f1', accent: '#8b5cf6' }
},
{
  name: 'Neon',
  emoji: '💚',
  colors: { primary: '#22c55e', secondary: '#eab308', accent: '#84cc16' }
},
{
  name: 'Crimson',
  emoji: '🔥',
  colors: { primary: '#ef4444', secondary: '#f97316', accent: '#dc2626' }
},
{
  name: 'Arctic',
  emoji: '❄️',
  colors: { primary: '#38bdf8', secondary: '#818cf8', accent: '#67e8f9' }
},
{
  name: 'Gold',
  emoji: '✨',
  colors: { primary: '#eab308', secondary: '#a855f7', accent: '#fbbf24' }
}];


function parseThemeColors(raw: unknown): ThemeColors {
  if (typeof raw === 'object' && raw !== null) {
    const obj = raw as Record<string, unknown>;
    return {
      primary: typeof obj.primary === 'string' ? obj.primary : DEFAULT_THEME.primary,
      secondary: typeof obj.secondary === 'string' ? obj.secondary : DEFAULT_THEME.secondary,
      accent: typeof obj.accent === 'string' ? obj.accent : DEFAULT_THEME.accent
    };
  }
  return { ...DEFAULT_THEME };
}

interface ThemeEditorProps {
  config: ConfigRow | null;
  onSaved: () => void;
}

export const ThemeEditor = ({ config, onSaved }: ThemeEditorProps) => {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const savedColors = parseThemeColors(config?.theme_colors);
  const [colors, setColors] = useState<ThemeColors>(savedColors);

  // Sync when config changes externally
  useEffect(() => {
    setColors(parseThemeColors(config?.theme_colors));
  }, [config?.theme_colors]);

  const hasChanges =
  colors.primary !== savedColors.primary ||
  colors.secondary !== savedColors.secondary ||
  colors.accent !== savedColors.accent;

  const setColor = (key: keyof ThemeColors, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  const applyPreset = (preset: Preset) => {
    setColors({ ...preset.colors });
  };

  const reset = () => setColors(savedColors);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateConfig({ theme_colors: colors });
      toast.success('ערכת הצבעים עודכנה');
      // Apply immediately to the page
      applyThemeToDOM(colors);
      onSaved();
    } catch (err: unknown) {
      toast.error(`שגיאה: ${err instanceof Error ? err.message : String(err)}`);
    }
    setSaving(false);
  };

  // Live preview — apply colors to DOM while editing
  useEffect(() => {
    if (open) {
      applyThemeToDOM(colors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors, open]);

  // Restore on close without saving
  const handleClose = () => {
    if (!hasChanges) {
      setOpen(false);
      return;
    }
    applyThemeToDOM(savedColors);
    setColors(savedColors);
    setOpen(false);
  };

  const isPresetActive = (preset: Preset) =>
  colors.primary === preset.colors.primary &&
  colors.secondary === preset.colors.secondary &&
  colors.accent === preset.colors.accent;

  // ── Closed state — compact button ──
  if (!open) {
    return (
      <button data-ev-id="ev_d179f9096b"
      onClick={() => setOpen(true)}
      className="w-full flex items-center gap-3 px-5 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-right hover:bg-white/[0.05] transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

        <div data-ev-id="ev_17864b2ae8" className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {/* Mini color swatch */}
          <div data-ev-id="ev_53b5038f46" className="flex w-full h-full">
            <div data-ev-id="ev_edd7508c70" className="flex-1" style={{ background: savedColors.primary }} />
            <div data-ev-id="ev_8af348250d" className="flex-1" style={{ background: savedColors.secondary }} />
            <div data-ev-id="ev_e40525506a" className="flex-1" style={{ background: savedColors.accent }} />
          </div>
        </div>
        <div data-ev-id="ev_390f1ee158" className="flex-1 min-w-0">
          <div data-ev-id="ev_af58c87818" className="text-white/80 text-sm font-medium">ערכת צבעים</div>
          <div data-ev-id="ev_b54924be43" className="text-white/60 text-xs mt-0.5">
            {PRESETS.find((p) => isPresetActive(p))?.name || 'מותאם אישית'}
          </div>
        </div>
        <span data-ev-id="ev_a8d488ab72" className="text-white/60 text-xs group-hover:text-white/70 transition-colors">ערוך</span>
      </button>);

  }

  // ── Open state — full editor ──
  return (
    <div data-ev-id="ev_b1f71aa072" className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 space-y-5" dir="rtl">
      {/* Header */}
      <div data-ev-id="ev_20eff4317e" className="flex items-center justify-between">
        <div data-ev-id="ev_f4b13e3046" className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" aria-hidden="true" />
          <h3 data-ev-id="ev_fe9ba85352" className="text-white/80 text-sm font-semibold">ערכת צבעים</h3>
        </div>
        <button data-ev-id="ev_c9a574be79"
        onClick={handleClose}
        className="text-white/60 hover:text-white/60 text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">

          סגור
        </button>
      </div>

      {/* Preset themes */}
      <div data-ev-id="ev_421d28c828">
        <label data-ev-id="ev_f49b3aa9e4" className="text-white/60 text-xs mb-2 block">ערכות מוכנות</label>
        <div data-ev-id="ev_6c7a6d3d05" className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
          {PRESETS.map((preset) => {
            const active = isPresetActive(preset);
            return (
              <button data-ev-id="ev_959b832c27"
              key={preset.name}
              onClick={() => applyPreset(preset)}
              aria-pressed={active}
              className={`relative flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg border transition-all text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              active ?
              'border-primary/40 bg-primary/[0.08]' :
              'border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03]'}`
              }>

                {/* Color dots */}
                <div data-ev-id="ev_71aa43ba08" className="flex gap-0.5">
                  <div data-ev-id="ev_981f27141e"
                  className="w-3.5 h-3.5 rounded-full border border-black/20"
                  style={{ background: preset.colors.primary }} />

                  <div data-ev-id="ev_060c175932"
                  className="w-3.5 h-3.5 rounded-full border border-black/20"
                  style={{ background: preset.colors.secondary }} />

                  <div data-ev-id="ev_9724acf216"
                  className="w-3.5 h-3.5 rounded-full border border-black/20"
                  style={{ background: preset.colors.accent }} />

                </div>
                <span data-ev-id="ev_c0a6ec3078" className="text-[10px] text-white/60">
                  {preset.emoji} {preset.name}
                </span>
                {active &&
                <div data-ev-id="ev_b267604798" className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-primary-foreground" />
                  </div>
                }
              </button>);

          })}
        </div>
      </div>

      {/* Custom color pickers */}
      <div data-ev-id="ev_be19443730">
        <label data-ev-id="ev_b298dc7810" className="text-white/60 text-xs mb-2 block">התאמה אישית</label>
        <div data-ev-id="ev_0b1cfc8060" className="grid grid-cols-3 gap-3">
          {[
          { key: 'primary' as const, label: 'ראשי', desc: 'כפתורים, קישורים' },
          { key: 'secondary' as const, label: 'משני', desc: 'הדגשות, גרדיאנט' },
          { key: 'accent' as const, label: 'דגש', desc: 'אפקטים, רקעים' }].
          map(({ key, label, desc }) =>
          <div data-ev-id="ev_a427fcaaf4" key={key} className="flex flex-col items-center gap-2">
              <label data-ev-id="ev_c586d54aac" htmlFor={`${formId}-${key}`} className="text-white/60 text-xs font-medium">
                {label}
              </label>
              <div data-ev-id="ev_3ee5463c9d" className="relative">
                <input data-ev-id="ev_e69d0568cb"
              id={`${formId}-${key}`}
              type="color"
              value={colors[key]}
              onChange={(e) => setColor(key, e.target.value)}
              className="w-12 h-12 rounded-xl border-2 border-white/10 cursor-pointer hover:border-white/25 transition-colors bg-transparent [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-0" />

              </div>
              <span data-ev-id="ev_513b696049" className="text-[10px] text-white/60 text-center leading-tight">{desc}</span>
              <code data-ev-id="ev_0a2e3e1788" className="text-[10px] text-white/60 font-mono">{colors[key]}</code>
            </div>
          )}
        </div>
      </div>

      {/* Live preview strip */}
      <div data-ev-id="ev_6c218b6863">
        <label data-ev-id="ev_517d6f366d" className="text-white/60 text-xs mb-2 block">תצוגה מקדימה</label>
        <div data-ev-id="ev_beebcc1bf3" className="rounded-xl overflow-hidden border border-white/[0.06]">
          {/* Gradient bar */}
          <div data-ev-id="ev_97f082a089"
          className="h-10"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`
          }} />

          {/* Sample elements */}
          <div data-ev-id="ev_49927d7759" className="p-3 flex items-center gap-3 bg-black/20">
            <div data-ev-id="ev_d49dab2849"
            className="px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: colors.primary, color: '#0a0a0f' }}>

              כפתור ראשי
            </div>
            <div data-ev-id="ev_061a69b577"
            className="px-3 py-1.5 rounded-lg text-xs font-medium border"
            style={{ borderColor: colors.secondary, color: colors.secondary }}>

              כפתור משני
            </div>
            <div data-ev-id="ev_aea3245ed6" className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" style={{ color: colors.accent }} />
              <span data-ev-id="ev_aec3fc5caf" className="text-xs" style={{ color: colors.accent }}>דגש</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div data-ev-id="ev_6571668727" className="flex items-center gap-2 pt-1 border-t border-white/[0.06]">
        <button data-ev-id="ev_8206454272"
        onClick={handleSave}
        disabled={!hasChanges || saving}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

          {saving ?
          <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> :

          <Save className="w-3.5 h-3.5" aria-hidden="true" />
          }
          שמור
        </button>
        <button data-ev-id="ev_d27ead8b63"
        onClick={reset}
        disabled={!hasChanges}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white/60 hover:text-white/70 text-sm transition-colors disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          איפוס
        </button>
      </div>
    </div>);

};

/** Apply theme colors to the document root as CSS custom properties */
export function applyThemeToDOM(colors: ThemeColors) {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-secondary', colors.secondary);
  root.style.setProperty('--color-accent', colors.accent);
  root.style.setProperty('--color-ring', colors.primary);
}