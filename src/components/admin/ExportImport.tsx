import { useState, useRef } from 'react';
import { Download, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { toast } from 'sonner';

interface ExportImportProps {
  onImportComplete: () => void;
}

interface SiteBackup {
  version: 1;
  exported_at: string;
  config: Record<string, unknown>;
  sections: Record<string, unknown>[];
  links: Record<string, unknown>[];
}

export const ExportImport = ({ onImportComplete }: ExportImportProps) => {
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
      supabase.from('links').select('*').order('sort_order')]
      );

      const backup: SiteBackup = {
        version: 1,
        exported_at: new Date().toISOString(),
        config: configRes.data || {},
        sections: sectionsRes.data || [],
        links: linksRes.data || []
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
        const { data, error } = await supabase.
        from('sections').
        insert({
          title: sec.title as string,
          emoji: sec.emoji as string,
          sort_order: sec.sort_order as number,
          is_visible: sec.is_visible as boolean ?? true
        }).
        select().
        single();

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
          subtitle: link.subtitle as string || '',
          description: link.description as string || '',
          url: link.url as string,
          icon_name: link.icon_name as string || 'Globe',
          color: link.color as string || '#06b6d4',
          animation: link.animation as string || 'float',
          sort_order: link.sort_order as number,
          is_visible: link.is_visible as boolean ?? true
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
        }} />


      <div data-ev-id="ev_c487920208" className="flex items-center gap-2">
        {/* Export */}
        <button data-ev-id="ev_e63d3d5656"
        onClick={handleExport}
        disabled={exporting || importing}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/60 hover:text-white/70 text-xs transition-colors border border-white/[0.06] hover:border-white/[0.12] disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

          {exporting ?
          <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" /> :

          <Download className="w-3 h-3" aria-hidden="true" />
          }
          ייצוא
        </button>

        {/* Import */}
        <button data-ev-id="ev_cef31af84b"
        onClick={() => fileRef.current?.click()}
        disabled={exporting || importing}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/60 hover:text-white/70 text-xs transition-colors border border-white/[0.06] hover:border-white/[0.12] disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

          {importing ?
          <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" /> :

          <Upload className="w-3 h-3" aria-hidden="true" />
          }
          ייבוא
        </button>

        <input data-ev-id="ev_e948e82baf"
        ref={fileRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="בחר קובץ גיבוי" />

      </div>
    </>);

};