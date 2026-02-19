import { useState, useEffect } from 'react';
import { isAdminLoggedIn } from '@/lib/adminApi';
import { Link, useNavigate } from 'react-router';
import { DevToolsMenu } from '@/components/DevToolsMenu';
import { ViewProvider, useViewContext } from '@/lib/viewContext';
import Index from '@/pages/Index';
import { ArrowRight, Shield } from 'lucide-react';
import { PageMeta } from '@/components/PageMeta';

const AdminPreviewContent = () => {
  const navigate = useNavigate();
  const { activeView, setActiveView } = useViewContext();

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/admin');
    }
  }, [navigate]);

  if (!isAdminLoggedIn()) return null;

  return (
    <div data-ev-id="ev_a5d740851f" className="relative">
      <PageMeta title="Admin Preview | nVision Digital AI" description="Admin-only site preview with dev tools." />

      {/* Admin bar */}
      <div data-ev-id="ev_9e42293a75" className="fixed top-0 left-0 right-0 z-[60] bg-amber-500/10 border-b border-amber-500/20 backdrop-blur-xl">
        <div data-ev-id="ev_355e2b26f7" className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between" dir="rtl">
          <div data-ev-id="ev_d8a3c7e8be" className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span data-ev-id="ev_31c5df4688" className="text-amber-400/80 text-xs font-medium">מצב תצוגה מקדימה — רק למנהל</span>
          </div>
          <Link
            to="/admin"
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-amber-400/60 hover:text-amber-400 text-xs border border-amber-400/15 hover:border-amber-400/30 transition-colors">

            <ArrowRight className="w-3 h-3" aria-hidden="true" />
            חזרה לניהול
          </Link>
        </div>
      </div>

      {/* Dev tools menu */}
      <DevToolsMenu activeView={activeView} onViewChange={setActiveView} />

      {/* The actual site, pushed down for admin bar */}
      <div data-ev-id="ev_bf06d629d1" className="pt-10">
        <Index viewOverride={activeView} />
      </div>
    </div>);

};

const AdminPreview = () =>
<ViewProvider>
    <AdminPreviewContent />
  </ViewProvider>;


export default AdminPreview;