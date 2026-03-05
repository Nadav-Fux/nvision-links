import { useState, useRef } from 'react';
import { Link } from 'react-router';
import { Loader2 } from 'lucide-react';
import { ExportImportIcon, ViewSiteIcon, PreviewIcon, RefreshIcon, TypographyIcon, LogoAnimIcon, DevToolsIcon } from '@/components/icons/AdminIcons';
import { supabase } from '@/integrations/supabase/client';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { toast } from 'sonner';

interface QuickActionsProps {
  onRefresh: () => void;
  onPreview: () => void;
  onImportComplete: () => void;
  loading: boolean;
}

interface SiteBackup {
  version: 1;
  exported_at: string;
  config: Record<string, unknown>;
  sections: Record<string, unknown>[];
  links: Record<string, unknown>[];
}

export const QuickActions = ({ onRefresh, onPreview, onImportComplete, loading }: QuickActionsProps) => {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [confirmImport, setConfirmImport] = useState(false);
  const [pendingFile, setPendingFile] = useState<SiteBackup | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // ===== Export =====
  const handleExport = async () => {
    if (!supabase) return;
    setExporting(true);
    try {
      const [configRes, sectionsRes, linksRes] = await Promise.all([
        supabase.from('site_config').select('*').single(),
        supabase.from('sections').select('*').order('sort_order'),
        supabase.from('links').select('*').order('sort_order'),
      ]);

      const backup: SiteBackup = {
        version: 1,
        exported_at: new Date().toISOString(),
        config: configRes.data || {},
        sections: sectionsRes.data || [],
        links: linksRes.data || [],
      };

      const json = JSON.stringify(backup, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nvision-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(`גיבוי יוצא בהצלחה (${sectionsRes.data?.length || 0} סקציות, ${linksRes.data?.length || 0} קישורים)`);
    } catch (err: unknown) {
      toast.error(`שגיאה בייצוא: ${err instanceof Error ? err.message : String(err)}`);
    }
    setExporting(false);
  };

  // ===== Import =====
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as SiteBackup;

        if (!data.version || !data.sections || !data.links) {
          toast.error('קובץ גיבוי לא תקין');
          return;
        }

        setPendingFile(data);
        setConfirmImport(true);
      } catch {
        toast.error('שגיאה בקריאת הקובץ');
      }
    };
    reader.readAsText(file);

    // Reset so same file can be re-selected
    e.target.value = '';
  };

  const executeImport = async () => {
    if (!supabase || !pendingFile) return;
    setConfirmImport(false);
    setImporting(true);

    try {
      // 1. Delete all existing links and sections
      await supabase.from('links').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('sections').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      // 2. Insert sections (without id — let DB generate new ones)
      const sectionIdMap: Record<string, string> = {};

      for (const sec of pendingFile.sections) {
        const oldId = sec.id as string;
        const { data, error } = await supabase
          .from('sections')
          .insert({
            title: sec.title as string,
            emoji: sec.emoji as string,
            sort_order: sec.sort_order as number,
            is_visible: (sec.is_visible as boolean) ?? true,
          })
          .select()
          .single();

        if (error) throw error;
        sectionIdMap[oldId] = data.id;
      }

      // 3. Insert links (mapped to new section IDs)
      for (const link of pendingFile.links) {
        const newSectionId = sectionIdMap[link.section_id as string];
        if (!newSectionId) continue; // orphan link — skip

        const { error } = await supabase.from('links').insert({
          section_id: newSectionId,
          title: link.title as string,
          subtitle: (link.subtitle as string) || '',
          description: (link.description as string) || '',
          url: link.url as string,
          icon_name: (link.icon_name as string) || 'Globe',
          color: (link.color as string) || '#06b6d4',
          animation: (link.animation as string) || 'float',
          sort_order: link.sort_order as number,
          is_visible: (link.is_visible as boolean) ?? true,
        });
        if (error) throw error;
      }

      // 4. Update config if present
      if (pendingFile.config && Object.keys(pendingFile.config).length > 0) {
        const { site_title, site_description, default_view } = pendingFile.config as Record<string, unknown>;
        const updates: Record<string, unknown> = {};
        if (site_title) updates.site_title = site_title;
        if (site_description) updates.site_description = site_description;
        if (default_view) updates.default_view = default_view;

        if (Object.keys(updates).length > 0) {
          await supabase.from('site_config').update(updates).eq('id', 1);
        }
      }

      toast.success(`ייבוא הושלם! ${pendingFile.sections.length} סקציות, ${pendingFile.links.length} קישורים`);
      onImportComplete();
    } catch (err: unknown) {
      toast.error(`שגיאה בייבוא: ${err instanceof Error ? err.message : String(err)}`);
    }

    setPendingFile(null);
    setImporting(false);
  };

  const busy = exporting || importing;

  return (
    <>
      <ConfirmDialog
        open={confirmImport}
        title="ייבוא גיבוי"
        message={`הפעולה תמחק את כל הנתונים הקיימים ותחליף אותם בנתוני הגיבוי (${pendingFile?.sections.length || 0} סקציות, ${pendingFile?.links.length || 0} קישורים). פעולה זו לא ניתנת לביטול!`}
        confirmLabel="ייבא עכשיו"
        variant="warning"
        onConfirm={executeImport}
        onCancel={() => {
          setConfirmImport(false);
          setPendingFile(null);
        }}
      />

      <input
        ref={fileRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="בחר קובץ גיבוי"
      />

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {/* 1. ייצוא (Export) */}
          <button
            onClick={handleExport}
            disabled={busy}
            className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg border border-white/[0.04] hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] transition-all group text-center disabled:opacity-40"
          >
            <div className="flex items-center justify-center">
              {exporting ? (
                <Loader2 className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-cyan-400 animate-spin" />
              ) : (
                <ExportImportIcon size={18} className="sm:w-5 sm:h-5" />
              )}
            </div>
            <span className="text-[9px] sm:text-[10px] text-white/50 group-hover:text-white/70 leading-tight">ייצוא</span>
          </button>

          {/* 2. ייבוא (Import) */}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg border border-white/[0.04] hover:border-violet-400/30 hover:bg-violet-400/[0.06] transition-all group text-center disabled:opacity-40"
          >
            <div className="flex items-center justify-center">
              {importing ? (
                <Loader2 className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-violet-400 animate-spin" />
              ) : (
                <ExportImportIcon size={18} className="sm:w-5 sm:h-5" />
              )}
            </div>
            <span className="text-[9px] sm:text-[10px] text-white/50 group-hover:text-white/70 leading-tight">ייבוא</span>
          </button>

          {/* 3. צפה באתר (View Site) */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg border border-white/[0.04] hover:border-purple-400/30 hover:bg-purple-400/[0.06] transition-all group text-center"
          >
            <div className="flex items-center justify-center">
              <ViewSiteIcon size={18} className="sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] text-white/50 group-hover:text-white/70 leading-tight">צפה באתר</span>
          </Link>

          {/* 4. תצוגה מקדימה (Preview) */}
          <button
            onClick={onPreview}
            className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg border border-white/[0.04] hover:border-pink-400/30 hover:bg-pink-400/[0.06] transition-all group text-center"
          >
            <div className="flex items-center justify-center">
              <PreviewIcon size={18} className="sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] text-white/50 group-hover:text-white/70 leading-tight">תצוגה מקדימה</span>
          </button>

          {/* 5. רענן (Refresh) */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg border border-white/[0.04] hover:border-emerald-400/30 hover:bg-emerald-400/[0.06] transition-all group text-center disabled:opacity-40"
          >
            <div className={`flex items-center justify-center ${loading ? 'animate-spin' : ''}`}>
              <RefreshIcon size={18} className="sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] text-white/50 group-hover:text-white/70 leading-tight">רענן</span>
          </button>

          {/* 6. טיפוגרפיה (Typography) */}
          <Link
            to="/font-preview"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg border border-white/[0.04] hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] transition-all group text-center"
          >
            <div className="flex items-center justify-center">
              <TypographyIcon size={18} className="sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] text-white/50 group-hover:text-white/70 leading-tight">טיפוגרפיה</span>
          </Link>

          {/* 7. אנימציות (Animations) */}
          <Link
            to="/animation-preview"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg border border-white/[0.04] hover:border-purple-400/30 hover:bg-purple-400/[0.06] transition-all group text-center"
          >
            <div className="flex items-center justify-center">
              <LogoAnimIcon size={18} className="sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] text-white/50 group-hover:text-white/70 leading-tight">אנימציות</span>
          </Link>

          {/* 8. כלי פיתוח (Dev Tools) */}
          <Link
            to="/admin/preview"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg border border-white/[0.04] hover:border-amber-400/30 hover:bg-amber-400/[0.06] transition-all group text-center"
          >
            <div className="flex items-center justify-center">
              <DevToolsIcon size={18} className="sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] text-white/50 group-hover:text-white/70 leading-tight">כלי פיתוח</span>
          </Link>
        </div>
      </div>
    </>
  );
};
