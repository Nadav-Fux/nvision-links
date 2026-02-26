import { Layers, Link2, Eye, Clock } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/helpers';

type SectionRow = Tables<'sections'>;
type LinkRow = Tables<'links'>;
type ConfigRow = Tables<'site_config'>;

const VIEW_NAMES: Record<number, string> = {
  1: 'Grid',
  2: 'Stack',
  3: 'Flow',
  4: 'Orbit',
  5: 'Deck',
  6: 'Neural',
  7: 'Terminal',
  8: 'Chat',
  9: 'IDE',
  10: 'Phone',
  11: 'Control',
  12: 'Stars',
  13: 'Circuit',
  14: 'RPG',
  15: 'Atoms',
  16: 'Table',
  17: 'Ocean'
};

function formatRelativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return 'לא ידוע';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'הרגע';
  if (diffMin < 60) return `לפני ${diffMin} דקות`;
  if (diffHr < 24) return `לפני ${diffHr} שעות`;
  if (diffDays === 1) return 'אתמול';
  return `לפני ${diffDays} ימים`;
}

interface DashboardCardsProps {
  config: ConfigRow | null;
  sections: SectionRow[];
  links: LinkRow[];
}

export const DashboardCards = ({ config, sections, links }: DashboardCardsProps) => {
  const visibleSections = sections.filter((s) => s.is_visible).length;
  const visibleLinks = links.filter((l) => l.is_visible).length;
  const hiddenLinks = links.length - visibleLinks;
  const currentView = config?.default_view ?? 1;

  const cards = [
  {
    icon: Layers,
    label: 'סקציות',
    value: `${visibleSections}`,
    sub: sections.length > visibleSections ? `${sections.length - visibleSections} מוסתרות` : 'הכל גלויות',
    color: '#06b6d4'
  },
  {
    icon: Link2,
    label: 'קישורים',
    value: `${visibleLinks}`,
    sub: hiddenLinks > 0 ? `${hiddenLinks} מוסתרים` : 'הכל גלויים',
    color: '#8b5cf6'
  },
  {
    icon: Eye,
    label: 'תצוגה נוכחית',
    value: VIEW_NAMES[currentView] || `#${currentView}`,
    sub: `תצוגה ${currentView} מתוך 17`,
    color: '#22d3ee'
  },
  {
    icon: Clock,
    label: 'עודכן לאחרונה',
    value: formatRelativeTime(config?.updated_at),
    sub: config?.updated_at ? new Date(config.updated_at).toLocaleDateString('he-IL') : '',
    color: '#a855f7'
  }];


  return (
    <section data-ev-id="ev_343824335b" aria-labelledby="dashboard-heading">
      <h2 data-ev-id="ev_aed4a8a61c" id="dashboard-heading" className="text-white/60 text-sm font-semibold mb-3">סקירה כללית</h2>
      <div data-ev-id="ev_4939ce5a3b" className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {cards.map((card) =>
        <div data-ev-id="ev_4c218bfabb"
        key={card.label}
        className="relative rounded-xl overflow-hidden group"
        style={{
          background: `linear-gradient(135deg, ${card.color}06, transparent)`,
          border: `1px solid ${card.color}12`
        }}>

            <div data-ev-id="ev_f606a8fe1d" className="p-3.5">
              <div data-ev-id="ev_991489958c" className="flex items-center gap-2 mb-2">
                <div data-ev-id="ev_c5fc5520f9"
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: `${card.color}12`,
                border: `1px solid ${card.color}18`
              }}>

                  <card.icon className="w-3.5 h-3.5" style={{ color: card.color }} aria-hidden="true" />
                </div>
                <span data-ev-id="ev_b449a26d68" className="text-white/60 text-xs">{card.label}</span>
              </div>
              <div data-ev-id="ev_2cbf5b1882" className="text-white/90 text-lg font-bold" style={{ color: `${card.color}dd` }}>
                {card.value}
              </div>
              <div data-ev-id="ev_e491164326" className="text-white/60 text-[11px] mt-0.5">{card.sub}</div>
            </div>
          </div>
        )}
      </div>
    </section>);

};