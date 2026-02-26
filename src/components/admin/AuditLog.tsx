import { useState, useEffect, useCallback } from 'react';
import { fetchAuditLog } from '@/lib/adminApi';
import { ScrollText, RefreshCw, Shield, Plus, Trash2, Edit2, ArrowUpDown, Palette, LogIn, Bot, Settings } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/helpers';

type AuditRow = Tables<'audit_log'>;

const ACTION_META: Record<string, { label: string; icon: typeof Shield; color: string }> = {
  admin_login:      { label: 'התחברות', icon: LogIn, color: 'text-green-400' },
  update_config:    { label: 'עדכון הגדרות', icon: Settings, color: 'text-blue-400' },
  create_section:   { label: 'סקציה חדשה', icon: Plus, color: 'text-emerald-400' },
  update_section:   { label: 'עדכון סקציה', icon: Edit2, color: 'text-yellow-400' },
  delete_section:   { label: 'מחיקת סקציה', icon: Trash2, color: 'text-red-400' },
  reorder_sections: { label: 'סידור סקציות', icon: ArrowUpDown, color: 'text-purple-400' },
  create_link:      { label: 'קישור חדש', icon: Plus, color: 'text-emerald-400' },
  update_link:      { label: 'עדכון קישור', icon: Edit2, color: 'text-yellow-400' },
  delete_link:      { label: 'מחיקת קישור', icon: Trash2, color: 'text-red-400' },
  reorder_links:    { label: 'סידור קישורים', icon: ArrowUpDown, color: 'text-purple-400' },
  update_site_config: { label: 'עדכון הגדרות אתר', icon: Settings, color: 'text-blue-400' },
};

const DEFAULT_META = { label: 'פעולה', icon: Shield, color: 'text-white/60' };

/** Resolves action label — supports agent_* prefix (e.g. agent_create_section → "סקציה חדשה (AI)") */
function getActionMeta(action: string) {
  if (ACTION_META[action]) return ACTION_META[action];

  // Agent actions: agent_create_section → look up create_section + add AI badge
  if (action.startsWith('agent_')) {
    const base = action.replace('agent_', '');
    const baseMeta = ACTION_META[base];
    if (baseMeta) return { ...baseMeta, label: `${baseMeta.label} (AI)`, icon: Bot, color: 'text-cyan-400' };
    return { label: `פעולת AI`, icon: Bot, color: 'text-cyan-400' };
  }

  return DEFAULT_META;
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'עכשיו';
  if (mins < 60) return `לפני ${mins} דקות`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `לפני ${hours} שעות`;
  const days = Math.floor(hours / 24);
  return `לפני ${days} ימים`;
}

export const AuditLog = () => {
  const [logs, setLogs] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAuditLog(100);
      setLogs(data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
    setLoading(false);
  }, []);

  useEffect(() => {load();}, [load]);

  return (
    <div data-ev-id="ev_422a92c5db" className="space-y-4" dir="rtl">
      <div data-ev-id="ev_2f2c91d638" className="flex items-center justify-between">
        <div data-ev-id="ev_f7badf17a1" className="flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-primary" aria-hidden="true" />
          <h3 data-ev-id="ev_27ed64cdbe" className="text-white/90 font-semibold text-base">יומן פעולות</h3>
          <span data-ev-id="ev_85dabb8e58" className="text-white/60 text-xs">({logs.length})</span>
        </div>
        <button data-ev-id="ev_b601e3a74d" onClick={load} disabled={loading} aria-label="רענן"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white/70 text-xs transition-all disabled:opacity-40">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span data-ev-id="ev_66afb85a39">רענן</span>
        </button>
      </div>

      {error &&
      <div data-ev-id="ev_2411157df5" className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-300 text-sm">
          {error}
        </div>
      }

      {!loading && logs.length === 0 && !error &&
      <div data-ev-id="ev_ded981a087" className="flex flex-col items-center py-10 gap-2 text-center">
          <ScrollText className="w-8 h-8 text-white/60" />
          <p data-ev-id="ev_a85fdb3dca" className="text-white/60 text-sm">אין פעולות עדיין</p>
        </div>
      }

      <div data-ev-id="ev_15c16c0480" className="space-y-1 max-h-[60vh] overflow-y-auto pr-1 -mr-1">
        {logs.map((log) => {
          const meta = getActionMeta(log.action);
          const Icon = meta.icon;
          const details = log.details as Record<string, unknown> | null;

          return (
            <div data-ev-id="ev_93dad40c58" key={log.id} className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.02] transition-colors group">
              <div data-ev-id="ev_0073c3985a" className={`mt-0.5 ${meta.color}`}>
                <Icon className="w-4 h-4" aria-hidden="true" />
              </div>
              <div data-ev-id="ev_ee7e8fb9c2" className="flex-1 min-w-0">
                <div data-ev-id="ev_0a99c59a41" className="flex items-center gap-2 flex-wrap">
                  <span data-ev-id="ev_7246f5776e" className="text-white/80 text-sm font-medium">{meta.label}</span>
                  {log.entity_type &&
                  <span data-ev-id="ev_d6b11e3509" className="text-white/60 text-xs bg-white/[0.04] px-1.5 py-0.5 rounded">
                      {log.entity_type}{log.entity_id ? ` #${log.entity_id.slice(0, 8)}` : ''}
                    </span>
                  }
                </div>
                {details && Object.keys(details).length > 0 &&
                <p data-ev-id="ev_71a9e5eed3" className="text-white/60 text-xs mt-0.5 truncate max-w-[400px]">
                    {Object.entries(details).map(([k, v]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`).join(' · ')}
                  </p>
                }
              </div>
              <div data-ev-id="ev_84b043b7cc" className="text-white/60 text-xs whitespace-nowrap mt-0.5">
                {relativeTime(log.created_at)}
              </div>
            </div>);

        })}
      </div>
    </div>);

};