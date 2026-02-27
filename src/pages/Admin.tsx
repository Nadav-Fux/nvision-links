import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { SectionManager } from '@/components/admin/SectionManager';
import { ViewSelector } from '@/components/admin/ViewSelector';
import { DashboardCards } from '@/components/admin/DashboardCards';
import { ExportImport } from '@/components/admin/ExportImport';
import { SiteConfigEditor } from '@/components/admin/SiteConfigEditor';
import { ThemeEditor } from '@/components/admin/ThemeEditor';
import { AuditLog } from '@/components/admin/AuditLog';
import { SitePreview } from '@/components/admin/SitePreview';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { SEOEditor } from '@/components/admin/SEOEditor';
import { QRCodeGenerator } from '@/components/admin/QRCodeGenerator';
import { LinkHealthChecker } from '@/components/admin/LinkHealthChecker';
import { isAdminLoggedIn, clearAdminSession, updateConfig, createSection, updateSection, deleteSection, reorderSections, createLink, updateLink, deleteLink, reorderLinks, fetchLinkStats, duplicateSection, duplicateLink, bulkDeleteLinks, bulkToggleLinks } from '@/lib/adminApi';
import { Link } from 'react-router';
import { LogOut, RefreshCw, ExternalLink, Loader2, LayoutDashboard, Monitor, Wrench, Palette, Film, Rocket } from 'lucide-react';
import { PageMeta } from '@/components/PageMeta';
import { AgentChat } from '@/components/admin/AgentChat';
import { SmartImporter } from '@/components/admin/SmartImporter';
import { TotpSetup } from '@/components/admin/TotpSetup';
import { toast } from 'sonner';
import { useSessionWarning } from '@/lib/useSessionWarning';
import type { Tables } from '@/integrations/supabase/helpers';

type SectionRow = Tables<'sections'>;
type LinkRow = Tables<'links'>;
type ConfigRow = Tables<'site_config'>;

/**
 * Protected admin dashboard — shows login screen if no valid session exists.
 * Manages all CRUD operations for sections, links, config, and theme.
 * Session timeout is monitored via useSessionWarning; auto-logs out on expiry.
 */
const Admin = () => {
  const [authenticated, setAuthenticated] = useState(isAdminLoggedIn());
  const [config, setConfig] = useState<ConfigRow | null>(null);
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [linkStats, setLinkStats] = useState<Record<string, number>>({});

  // Session timeout warning — fires toast when ~2 min remain, logs out on expiry
  useSessionWarning(useCallback(() => setAuthenticated(false), []));

  const fetchData = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const [configRes, sectionsRes, linksRes] = await Promise.all([
    supabase.from('site_config').select('*').single(),
    supabase.from('sections').select('*').order('sort_order'),
    supabase.from('links').select('*').order('sort_order')]);
    if (configRes.data) setConfig(configRes.data);
    if (sectionsRes.data) setSections(sectionsRes.data);
    if (linksRes.data) setLinks(linksRes.data);
    setLoading(false);
    // Fetch link stats in background (non-blocking)
    fetchLinkStats().then((stats) => setLinkStats(stats)).catch(() => {});
  }, []);

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated, fetchData]);

  const handleLogout = () => {
    clearAdminSession();
    setAuthenticated(false);
  };

  if (!authenticated) {
    return (
      <>
        <PageMeta title="Admin Login | nVision Digital AI" description="Admin login page for nVision Digital AI site management." />
        <AdminLogin onSuccess={() => setAuthenticated(true)} />
      </>);

  }

  // ===== Section handlers =====
  const handleCreateSection = async (data: {title: string;emoji: string;}) => {
    setSaving(true);
    try {
      await createSection(data);
      await fetchData();
      toast.success(`סקציה "${data.title}" נוצרה בהצלחה`);
    } catch (err: unknown) {
      toast.error(`שגיאה ביצירת סקציה: ${err instanceof Error ? err.message : String(err)}`);
    }
    setSaving(false);
  };

  const handleUpdateSection = async (id: string, data: Partial<SectionRow>) => {
    setSaving(true);
    try {
      await updateSection(id, data);
      await fetchData();
      toast.success('הסקציה עודכנה');
    } catch (err: unknown) {
      toast.error(`שגיאה בעדכון סקציה: ${err instanceof Error ? err.message : String(err)}`);
    }
    setSaving(false);
  };

  const handleDeleteSection = async (id: string) => {
    setSaving(true);
    try {
      await deleteSection(id);
      await fetchData();
      toast.success('הסקציה נמחקה');
    } catch (err: unknown) {
      toast.error(`שגיאה במחיקת סקציה: ${err instanceof Error ? err.message : String(err)}`);
    }
    setSaving(false);
  };

  const handleMoveSection = async (id: string, direction: 'up' | 'down') => {
    const sorted = [...sections].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((s) => s.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const newOrder = sorted.map((s, i) => {
      if (i === idx) return { id: s.id, sort_order: sorted[swapIdx].sort_order };
      if (i === swapIdx) return { id: s.id, sort_order: sorted[idx].sort_order };
      return { id: s.id, sort_order: s.sort_order };
    });

    setSaving(true);
    try {
      await reorderSections(newOrder);
      await fetchData();
    } catch (err: unknown) {
      toast.error(`שגיאה בסידור סקציות: ${err instanceof Error ? err.message : String(err)}`);
    }
    setSaving(false);
  };

  // ===== Link handlers =====
  const handleCreateLink = async (data: Partial<LinkRow>) => {
    setSaving(true);
    try {
      await createLink(data);
      await fetchData();
      toast.success(`קישור "${data.title}" נוצר בהצלחה`);
    } catch (err: unknown) {
      toast.error(`שגיאה ביצירת קישור: ${err instanceof Error ? err.message : String(err)}`);
    }
    setSaving(false);
  };

  const handleUpdateLink = async (id: string, data: Partial<LinkRow>) => {
    setSaving(true);
    try {
      await updateLink(id, data);
      await fetchData();
      toast.success('הקישור עודכן');
    } catch (err: unknown) {
      toast.error(`שגיאה בעדכון קישור: ${err instanceof Error ? err.message : String(err)}`);
    }
    setSaving(false);
  };

  const handleDeleteLink = async (id: string) => {
    setSaving(true);
    try {
      await deleteLink(id);
      await fetchData();
      toast.success('הקישור נמחק');
    } catch (err: unknown) {
      toast.error(`שגיאה במחיקת קישור: ${err instanceof Error ? err.message : String(err)}`);
    }
    setSaving(false);
  };

  const handleMoveLink = async (id: string, direction: 'up' | 'down', sectionId: string) => {
    const sectionLinks = links.filter((l) => l.section_id === sectionId).sort((a, b) => a.sort_order - b.sort_order);
    const idx = sectionLinks.findIndex((l) => l.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sectionLinks.length) return;

    const newOrder = sectionLinks.map((l, i) => {
      if (i === idx) return { id: l.id, sort_order: sectionLinks[swapIdx].sort_order };
      if (i === swapIdx) return { id: l.id, sort_order: sectionLinks[idx].sort_order };
      return { id: l.id, sort_order: l.sort_order };
    });

    setSaving(true);
    try {
      await reorderLinks(newOrder);
      await fetchData();
    } catch (err: unknown) {
      toast.error(`שגיאה בסידור קישורים: ${err instanceof Error ? err.message : String(err)}`);
    }
    setSaving(false);
  };

  // ===== Duplicate handlers =====
  const handleDuplicateSection = async (id: string) => {
    setSaving(true);
    try {
      await duplicateSection(id);
      await fetchData();
      toast.success('הסקציה שוכפלה בהצלחה');
    } catch (err: unknown) {
      toast.error(`שגיאה בשכפול: ${err instanceof Error ? err.message : String(err)}`);
    }
    setSaving(false);
  };

  const handleDuplicateLink = async (id: string) => {
    setSaving(true);
    try {
      await duplicateLink(id);
      await fetchData();
      toast.success('הקישור שוכפל בהצלחה');
    } catch (err: unknown) {
      toast.error(`שגיאה בשכפול: ${err instanceof Error ? err.message : String(err)}`);
    }
    setSaving(false);
  };

  // ===== Bulk handlers =====
  const handleBulkDeleteLinks = async (ids: string[]) => {
    setSaving(true);
    try {
      await bulkDeleteLinks(ids);
      await fetchData();
      toast.success(`${ids.length} קישורים נמחקו`);
    } catch (err: unknown) {
      toast.error(`שגיאה במחיקה: ${err instanceof Error ? err.message : String(err)}`);
    }
    setSaving(false);
  };

  const handleBulkToggleLinks = async (ids: string[], visible: boolean) => {
    setSaving(true);
    try {
      await bulkToggleLinks(ids, visible);
      await fetchData();
      toast.success(`${ids.length} קישורים ${visible ? 'מוזגים' : 'הוסתרו'}`);
    } catch (err: unknown) {
      toast.error(`שגיאה: ${err instanceof Error ? err.message : String(err)}`);
    }
    setSaving(false);
  };

  // ===== Drag & Drop reorder handlers =====
  const handleReorderSections = async (orderedIds: string[]) => {
    const newOrder = orderedIds.map((id, i) => ({ id, sort_order: i + 1 }));
    setSaving(true);
    try {
      await reorderSections(newOrder);
      await fetchData();
    } catch (err: unknown) {
      toast.error(`שגיאה בסידור סקציות: ${err instanceof Error ? err.message : String(err)}`);
    }
    setSaving(false);
  };

  const handleReorderLinksInSection = async (sectionId: string, orderedIds: string[]) => {
    const newOrder = orderedIds.map((id, i) => ({ id, sort_order: i + 1 }));
    setSaving(true);
    try {
      await reorderLinks(newOrder);
      await fetchData();
    } catch (err: unknown) {
      toast.error(`שגיאה בסידור קישורים: ${err instanceof Error ? err.message : String(err)}`);
    }
    setSaving(false);
  };

  // ===== View handler =====
  const handleViewChange = async (viewId: number) => {
    setSaving(true);
    try {
      await updateConfig({ default_view: viewId, selected_views: [viewId] });
      setConfig((prev) => prev ? { ...prev, default_view: viewId, selected_views: [viewId] } : prev);
      toast.success('תצוגת ברירת מחדל עודכנה');
    } catch (err: unknown) {
      toast.error(`שגיאה בעדכון תצוגה: ${err instanceof Error ? err.message : String(err)}`);
    }
    setSaving(false);
  };

  const handleSelectedViewsChange = (views: number[]) => {
    setConfig((prev) => prev ? { ...prev, selected_views: views, default_view: views[0] ?? 1 } : prev);
  };

  return (
    <div data-ev-id="ev_16ce330db4" dir="rtl" className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0a0a14 0%, #0d0d1a 30%, #0f0a1a 60%, #0a0f14 100%)' }}>
      <PageMeta title="Admin | nVision Digital AI" description="Site management dashboard for nVision Digital AI." />

      {/* Skip Navigation — WCAG 2.4.1 */}
      <a data-ev-id="ev_6e9f4d1caf"
      href="#admin-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg focus:outline-none">

        דלג לתוכן הראשי
      </a>

      <div data-ev-id="ev_825e9d184d" className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Top bar */}
        <header data-ev-id="ev_570f6c4fbb" className="mb-6 space-y-3">
          {/* Title row */}
          <div data-ev-id="ev_eff1438b2c" className="flex items-center justify-between">
            <div data-ev-id="ev_4ae7712f63" className="flex items-center gap-3">
              <LayoutDashboard className="w-5 h-5 text-primary" aria-hidden="true" />
              <h1 data-ev-id="ev_84ba7f9818" className="text-lg font-bold text-white">ניהול האתר</h1>
              <div data-ev-id="ev_53bdeda21d" aria-live="polite" aria-atomic="true">
                {saving &&
                <span data-ev-id="ev_6367994281" className="flex items-center gap-1 text-primary text-xs">
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span data-ev-id="ev_bcd38c1e8f" className="sr-only">שומר שינויים</span>
                  </span>
                }
              </div>
            </div>
            {/* Desktop-only: logout on the right */}
            <button data-ev-id="ev_8fae2686d1"
            onClick={handleLogout}
            aria-label="יציאה מממשק הניהול"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-400/50 hover:text-red-400 text-xs transition-colors border border-red-400/10 hover:border-red-400/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">
              <LogOut className="w-3 h-3" aria-hidden="true" />
              יציאה
            </button>
          </div>

          {/* Actions row — scrollable on mobile */}
          <nav data-ev-id="ev_0f68271d45" aria-label="פעולות ניהול" className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1 scrollbar-hide">
            <ExportImport onImportComplete={fetchData} />
            <Link
              to="/"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/60 hover:text-white/70 text-xs transition-colors border border-white/[0.06] hover:border-white/[0.12] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap flex-shrink-0">
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
              צפה באתר
            </Link>
            <Link
              to="/admin/preview"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-amber-400/40 hover:text-amber-400/70 text-xs transition-colors border border-amber-400/10 hover:border-amber-400/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 whitespace-nowrap flex-shrink-0">
              <Monitor className="w-3 h-3" aria-hidden="true" />
              תצוגה + כלי פיתוח
            </Link>
            <button data-ev-id="ev_48ae9aa2fc"
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/60 hover:text-white/70 text-xs transition-colors border border-white/[0.06] hover:border-white/[0.12] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap flex-shrink-0">
              <Monitor className="w-3 h-3" aria-hidden="true" />
              תצוגה מקדימה
            </button>
            <button data-ev-id="ev_6f058aeb24"
            onClick={fetchData}
            disabled={loading}
            aria-label="רענן נתונים"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/60 hover:text-white/70 text-xs transition-colors border border-white/[0.06] hover:border-white/[0.12] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap flex-shrink-0">
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
              רענן
            </button>
            {/* Mobile-only: logout in action bar */}
            <button data-ev-id="ev_4e330376c2"
            onClick={handleLogout}
            aria-label="יציאה מממשק הניהול"
            className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-400/50 hover:text-red-400 text-xs transition-colors border border-red-400/10 hover:border-red-400/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 whitespace-nowrap flex-shrink-0">
              <LogOut className="w-3 h-3" aria-hidden="true" />
              יציאה
            </button>
          </nav>
        </header>

        {loading ?
        <div data-ev-id="ev_a2802c13d3" className="flex items-center justify-center py-20" role="status">
            <Loader2 className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
            <span data-ev-id="ev_b7f6d4a2c3" className="sr-only">טוען נתונים...</span>
          </div> :

        <main data-ev-id="ev_b79b180b90" id="admin-content" tabIndex={-1} className="outline-none space-y-6">
            {/* Dashboard overview cards */}
            <DashboardCards config={config} sections={sections} links={links} />

            {/* Anonymous Analytics Dashboard */}
            <section data-ev-id="ev_9fcea8049c" aria-labelledby="analytics-heading">
              <h2 data-ev-id="ev_fa5e828330" id="analytics-heading" className="text-white/60 text-sm font-semibold mb-3">
                📊 אנליטיקס אנונימי
              </h2>
              <AnalyticsDashboard />
            </section>

            {/* Site config editor (title + description) */}
            <SiteConfigEditor config={config} onSaved={fetchData} />

            {/* Theme / color scheme editor */}
            <ThemeEditor config={config} onSaved={fetchData} />

            {/* View selector */}
            <ViewSelector
            currentView={config?.default_view ?? 1}
            selectedViews={Array.isArray(config?.selected_views) ? config.selected_views as number[] : [config?.default_view ?? 1]}
            onSelectedViewsChange={handleSelectedViewsChange}
            onSelect={handleViewChange} />


            {/* Section + links manager */}
            <section data-ev-id="ev_dd24436115" aria-labelledby="sections-heading">
              <h2 data-ev-id="ev_9bb88cbd31" id="sections-heading" className="text-white/60 text-sm font-semibold mb-3">
                סקציות וקישורים
              </h2>
              <SectionManager
              sections={sections}
              links={links}
              loading={saving}
              linkStats={linkStats}
              onCreateSection={handleCreateSection}
              onUpdateSection={handleUpdateSection}
              onDeleteSection={handleDeleteSection}
              onMoveSection={handleMoveSection}
              onReorderSections={handleReorderSections}
              onCreateLink={handleCreateLink}
              onUpdateLink={handleUpdateLink}
              onDeleteLink={handleDeleteLink}
              onMoveLink={handleMoveLink}
              onReorderLinks={handleReorderLinksInSection}
              onDuplicateSection={handleDuplicateSection}
              onDuplicateLink={handleDuplicateLink}
              onBulkDeleteLinks={handleBulkDeleteLinks}
              onBulkToggleLinks={handleBulkToggleLinks} />

            </section>

            {/* Smart Importer — AI-powered bulk link import */}
            <section data-ev-id="ev_2ecbf29661" aria-labelledby="smart-import-heading">
              <h2 data-ev-id="ev_a3d4171261" id="smart-import-heading" className="text-white/60 text-sm font-semibold mb-3">
                🤖 ייבוא חכם
              </h2>
              <SmartImporter sections={sections} onImportComplete={fetchData} />
            </section>

            {/* Link Health Checker */}
            <section data-ev-id="ev_1172f115f2" aria-labelledby="link-health-heading">
              <h2 data-ev-id="ev_de07340b4a" id="link-health-heading" className="text-white/60 text-sm font-semibold mb-3">
                🔗 בדיקת קישורים
              </h2>
              <LinkHealthChecker />
            </section>

            {/* SEO / OG Editor */}
            <section data-ev-id="ev_01f9e45f1f" aria-labelledby="seo-heading">
              <h2 data-ev-id="ev_78441b5c63" id="seo-heading" className="text-white/60 text-sm font-semibold mb-3">
                🌐 SEO ושיתוף חברתי
              </h2>
              <SEOEditor config={config} onSaved={fetchData} />
            </section>

            {/* QR Code Generator */}
            <section data-ev-id="ev_03c4e1234d" aria-labelledby="qr-heading">
              <h2 data-ev-id="ev_51ba8dbd41" id="qr-heading" className="text-white/60 text-sm font-semibold mb-3">
                📱 מחולל QR Code
              </h2>
              <QRCodeGenerator />
            </section>

            {/* Dev Tools Section */}
            <section data-ev-id="ev_f6f90f48e5" aria-labelledby="devtools-heading">
              <h2 data-ev-id="ev_bb2d69f27d" id="devtools-heading" className="text-white/60 text-sm font-semibold mb-3">
                🔧 כלי פיתוח
              </h2>
              <div data-ev-id="ev_c468ba4f41" className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-2" dir="rtl">
                <p data-ev-id="ev_548b78292c" className="text-white/60 text-xs mb-3">כלים מתקדמים לעיצוב וכיול האתר</p>
                <div data-ev-id="ev_c9fdf651c4" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Link
                  to="/font-preview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cyan-500/[0.06] border border-cyan-500/15 hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">

                    <Palette className="w-5 h-5 text-cyan-400" aria-hidden="true" />
                    <div data-ev-id="ev_bd707b87c5" className="flex-1 min-w-0">
                      <div data-ev-id="ev_7a28119b5a" className="text-cyan-400/90 text-sm font-medium">בחירת טיפוגרפיה</div>
                      <div data-ev-id="ev_a44f5f0357" className="text-white/60 text-[11px] mt-0.5">בחירה והשוואת פונטים</div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-white/15 group-hover:text-white/70 transition-colors" aria-hidden="true" />
                  </Link>
                  <Link
                  to="/animation-preview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-500/[0.06] border border-purple-500/15 hover:border-purple-500/30 hover:bg-purple-500/10 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400">

                    <Film className="w-5 h-5 text-purple-400" aria-hidden="true" />
                    <div data-ev-id="ev_ad1ab28caf" className="flex-1 min-w-0">
                      <div data-ev-id="ev_86a418b281" className="text-purple-400/90 text-sm font-medium">אנימציות לוגו</div>
                      <div data-ev-id="ev_85527fe164" className="text-white/60 text-[11px] mt-0.5">תצוגה ובחירת אנימציות</div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-white/15 group-hover:text-white/70 transition-colors" aria-hidden="true" />
                  </Link>
                  <Link
                  to="/entrance-preview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/15 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">

                    <Rocket className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                    <div data-ev-id="ev_92b9366758" className="flex-1 min-w-0">
                      <div data-ev-id="ev_a359e024ab" className="text-emerald-400/90 text-sm font-medium">אנימציות כניסה</div>
                      <div data-ev-id="ev_a77885db61" className="text-white/60 text-[11px] mt-0.5">אפקט כניסה לאתר</div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-white/15 group-hover:text-white/70 transition-colors" aria-hidden="true" />
                  </Link>
                  <Link
                  to="/admin/preview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/15 hover:border-amber-500/30 hover:bg-amber-500/10 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">

                    <Wrench className="w-5 h-5 text-amber-400" aria-hidden="true" />
                    <div data-ev-id="ev_c0375494f6" className="flex-1 min-w-0">
                      <div data-ev-id="ev_8d832b9800" className="text-amber-400/90 text-sm font-medium">תצוגה + כלי פיתוח</div>
                      <div data-ev-id="ev_82e1f74a08" className="text-white/60 text-[11px] mt-0.5">צפייה באתר עם כל הכלים</div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-white/15 group-hover:text-white/70 transition-colors" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </section>

            {/* Security — 2FA */}
            <section data-ev-id="ev_d393b9f1c9" aria-labelledby="security-heading">
              <h2 data-ev-id="ev_f2edb2cf81" id="security-heading" className="text-white/60 text-sm font-semibold mb-3">
                🔒 אבטחה — אימות דו-שלבי (2FA)
              </h2>
              <div data-ev-id="ev_037da94166" className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                <TotpSetup />
              </div>
            </section>

            {/* Audit Log */}
            <section data-ev-id="ev_194b7800a2" aria-labelledby="audit-log-heading">
              <h2 data-ev-id="ev_6b082cce89" id="audit-log-heading" className="text-white/60 text-sm font-semibold mb-3">
                דיווגי מערכת
              </h2>
              <AuditLog />
            </section>
          </main>
        }

        {/* AI Agent Chat */}
        {authenticated && <AgentChat onActionPerformed={fetchData} />}

        {/* Site Preview Panel */}
        <SitePreview open={showPreview} onClose={() => setShowPreview(false)} />
      </div>
    </div>);

};

export default Admin;