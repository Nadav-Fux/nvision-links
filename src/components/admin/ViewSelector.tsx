import { useState, useEffect } from 'react';
import { Monitor, Check, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { updateConfig } from '@/lib/adminApi';
import { VIEW_ICONS } from '@/components/icons/ViewIcons';

const VIEW_OPTIONS = [
{ id: 1, name: 'Grid', nameHe: 'רשת', emoji: '📱' },
{ id: 2, name: 'Stack', nameHe: 'ערימה', emoji: '📚' },
{ id: 3, name: 'Flow', nameHe: 'מערבולת', emoji: '🎠' },
{ id: 4, name: 'Orbit', nameHe: 'מסלולים', emoji: '🌍' },
{ id: 5, name: 'Deck', nameHe: 'חפיסת קלפים', emoji: '🃏' },
{ id: 6, name: 'Neural', nameHe: 'נוירוני', emoji: '🧠' },
{ id: 7, name: 'Terminal', nameHe: 'טרמינל', emoji: '🖥️' },
{ id: 8, name: 'Chat', nameHe: 'צ׳אט', emoji: '💬' },
{ id: 9, name: 'IDE', nameHe: 'עורך קוד', emoji: '💻' },
{ id: 10, name: 'Phone', nameHe: 'טלפון', emoji: '📲' },
{ id: 11, name: 'Control', nameHe: 'מרכז פיקוד', emoji: '🚀' },
{ id: 12, name: 'Stars', nameHe: 'כוכבים', emoji: '⭐' },
{ id: 13, name: 'Circuit', nameHe: 'מעגלים', emoji: '⚡' },
{ id: 14, name: 'RPG', nameHe: 'עץ כישורים', emoji: '🎮' },
{ id: 15, name: 'Atoms', nameHe: 'מולקולרי', emoji: '⚛️' },
{ id: 16, name: 'Table', nameHe: 'טבלה מחזורית', emoji: '🧪' },
{ id: 17, name: 'Ocean', nameHe: 'אקווריום', emoji: '🐠' },
{ id: 18, name: 'Radar', nameHe: 'מכ"מ', emoji: '📡' },
{ id: 19, name: 'NN', nameHe: 'רשת עצבית', emoji: '🤖' },
{ id: 20, name: 'Stream', nameHe: 'סטרימינג', emoji: '🎬' },
{ id: 21, name: 'Dash', nameHe: 'דשבורד', emoji: '📊' },
{ id: 22, name: 'Secret', nameHe: 'מסווג', emoji: '🔒' },
{ id: 23, name: 'Spotify', nameHe: 'ספוטיפיי', emoji: '🎵' },
{ id: 24, name: 'News', nameHe: 'עיתון', emoji: '📰' },
{ id: 25, name: 'Metro', nameHe: 'מטרו', emoji: '🚇' },
{ id: 26, name: 'Arcade', nameHe: 'ארקייד', emoji: '🕹️' },
{ id: 27, name: 'Desktop', nameHe: 'שולחן עבודה', emoji: '🖥️' },
{ id: 28, name: 'AI', nameHe: 'בינה מלאכותית', emoji: '🤖' },
{ id: 29, name: 'Holo', nameHe: 'הולוגרמה', emoji: '💎' },
{ id: 30, name: 'MRI', nameHe: 'סריקת מוח', emoji: '🧠' },
{ id: 31, name: 'Prompt', nameHe: 'זרימת פרומפט', emoji: '🔀' },
{ id: 32, name: 'GPU', nameHe: 'מעבד גרפי', emoji: '💻' },
{ id: 33, name: 'Train', nameHe: 'אימון', emoji: '📈' },
{ id: 34, name: 'Robot', nameHe: 'רובוט', emoji: '🤖' },
{ id: 35, name: 'DNA', nameHe: 'סליל DNA', emoji: '🧬' },
{ id: 36, name: 'Satellite', nameHe: 'לוויין', emoji: '🛰️' },
{ id: 37, name: 'Wormhole', nameHe: 'חור תולעת', emoji: '🌀' },
{ id: 38, name: 'Stock', nameHe: 'מניות', emoji: '📊' },
{ id: 39, name: 'Blueprint', nameHe: 'שרטוט', emoji: '📐' },
{ id: 40, name: 'Quantum', nameHe: 'קוונטום', emoji: '⚛️' }];


interface ViewSelectorProps {
  currentView: number;
  selectedViews?: number[];
  onSelect: (viewId: number) => void;
  onSelectedViewsChange?: (views: number[]) => void;
}

export const ViewSelector = ({ currentView, selectedViews: initialSelectedViews, onSelect, onSelectedViewsChange }: ViewSelectorProps) => {
  const [selected, setSelected] = useState<number[]>(initialSelectedViews ?? [currentView]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialSelectedViews) {
      setSelected(initialSelectedViews);
    }
  }, [initialSelectedViews]);

  const isSelected = (id: number) => selected.includes(id);

  const toggleView = (id: number) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        // Don't allow deselecting the last one
        if (prev.length <= 1) return prev;
        return prev.filter((v) => v !== id);
      }
      return [...prev, id];
    });
  };

  const hasChanges = JSON.stringify([...selected].sort()) !== JSON.stringify([...(initialSelectedViews ?? [currentView])].sort());

  const handleSave = async () => {
    setSaving(true);
    try {
      // Set default_view to first selected view for backwards compat
      await updateConfig({
        selected_views: selected,
        default_view: selected[0] ?? 1
      });
      onSelectedViewsChange?.(selected);
      toast.success(`${selected.length} תצוגות נבחרו — מבקרים יראו תצוגה רנדומלית`);
    } catch (err: unknown) {
      toast.error(`שגיאה: ${err instanceof Error ? err.message : String(err)}`);
    }
    setSaving(false);
  };

  return (
    <div data-ev-id="ev_2e0464f604" className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5" dir="rtl">
      <div data-ev-id="ev_6f2bb29e58" className="flex items-center justify-between mb-4">
        <div data-ev-id="ev_f276d46ce9" className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-primary" aria-hidden="true" />
          <h3 data-ev-id="ev_6f728809f3" id="view-selector-label" className="text-white/80 text-sm font-semibold">תצוגות פעילות</h3>
        </div>
        <span data-ev-id="ev_12877432b8" className="text-white/60 text-xs">
          {selected.length === 1 ?
          'מבקרים יראו תמיד את התצוגה הנבחרת' :
          `${selected.length} נבחרו — מבקרים יראו תצוגה רנדומלית`}
        </span>
      </div>

      <div data-ev-id="ev_bac3a45dcf"
      role="group"
      aria-labelledby="view-selector-label"
      className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 lg:gap-3">

        {VIEW_OPTIONS.map((view) => {
          const checked = isSelected(view.id);
          return (
            <button data-ev-id="ev_3de615a210"
            key={view.id}
            aria-pressed={checked}
            aria-label={`תצוגת ${view.name} (${view.nameHe})`}
            onClick={() => toggleView(view.id)}
            className={`relative flex flex-col items-center gap-1 py-2.5 px-1 lg:py-4 lg:px-2 rounded-lg border text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-transparent ${
            checked ?
            'bg-primary/15 border-primary/40 text-primary' :
            'bg-white/[0.02] border-white/[0.06] text-white/60 hover:bg-white/[0.05] hover:text-white/70'}`
            }>

              {/* Checkmark */}
              {checked &&
              <div data-ev-id="ev_e0ed7536ad" className="absolute top-1 left-1 w-4 h-4 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-primary" />
                </div>
              }
              <span data-ev-id="ev_8f7facd048" className="flex items-center justify-center" aria-hidden="true">
                {VIEW_ICONS[view.id] ? VIEW_ICONS[view.id]({ size: 20, className: 'sm:w-6 sm:h-6 lg:w-8 lg:h-8' }) : <span className="text-lg lg:text-2xl">{view.emoji}</span>}
              </span>
              <span data-ev-id="ev_3621765c0a" className="truncate w-full text-center leading-tight">{view.nameHe}</span>
              <span data-ev-id="ev_25cafb7a0d" className={`text-[9px] leading-tight ${checked ? 'text-primary/60' : 'text-white/60'}`}>{view.name}</span>
            </button>);

        })}
      </div>

      {/* Save button */}
      {hasChanges &&
      <div data-ev-id="ev_e72c2f024a" className="mt-4 flex items-center gap-3">
          <button data-ev-id="ev_3a053df4d2"
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            שמור שינויים
          </button>
          <span data-ev-id="ev_7f27ae5fd4" className="text-white/60 text-xs">
            נבחרו: {selected.map((id) => VIEW_OPTIONS.find((v) => v.id === id)?.nameHe).filter(Boolean).join(', ')}
          </span>
        </div>
      }
    </div>);

};