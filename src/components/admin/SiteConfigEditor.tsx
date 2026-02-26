import { useState, useEffect } from 'react';
import { Settings, Save, Loader2, RotateCcw, Type, MessageSquareText, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { updateConfig } from '@/lib/adminApi';
import type { Tables } from '@/integrations/supabase/helpers';

type ConfigRow = Tables<'site_config'>;

interface SiteConfigEditorProps {
  config: ConfigRow | null;
  onSaved: () => void;
}

export const SiteConfigEditor = ({ config, onSaved }: SiteConfigEditorProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'welcome' | 'disclaimer'>('general');

  // General
  const [title, setTitle] = useState(config?.site_title ?? '');
  const [description, setDescription] = useState(config?.site_description ?? '');

  // Welcome text
  const [welcomeText, setWelcomeText] = useState(config?.welcome_text ?? '');
  const [welcomeSubtext, setWelcomeSubtext] = useState(config?.welcome_subtext ?? '');
  const [tagline, setTagline] = useState(config?.tagline ?? '');

  // Affiliate disclaimer
  const [disclaimerText, setDisclaimerText] = useState(config?.affiliate_disclaimer_text ?? '');

  const [saving, setSaving] = useState(false);

  // Sync with config when it changes
  useEffect(() => {
    if (config) {
      setTitle(config.site_title ?? '');
      setDescription(config.site_description ?? '');
      setWelcomeText(config.welcome_text ?? '');
      setWelcomeSubtext(config.welcome_subtext ?? '');
      setTagline(config.tagline ?? '');
      setDisclaimerText(config.affiliate_disclaimer_text ?? '');
    }
  }, [config]);

  const reset = () => {
    setTitle(config?.site_title ?? '');
    setDescription(config?.site_description ?? '');
    setWelcomeText(config?.welcome_text ?? '');
    setWelcomeSubtext(config?.welcome_subtext ?? '');
    setTagline(config?.tagline ?? '');
    setDisclaimerText(config?.affiliate_disclaimer_text ?? '');
  };

  const hasChanges =
  title !== (config?.site_title ?? '') ||
  description !== (config?.site_description ?? '') ||
  welcomeText !== (config?.welcome_text ?? '') ||
  welcomeSubtext !== (config?.welcome_subtext ?? '') ||
  tagline !== (config?.tagline ?? '') ||
  disclaimerText !== (config?.affiliate_disclaimer_text ?? '');

  const handleSave = async () => {
    if (!hasChanges) return;
    setSaving(true);
    try {
      await updateConfig({
        site_title: title.trim(),
        site_description: description.trim(),
        welcome_text: welcomeText.trim(),
        welcome_subtext: welcomeSubtext.trim(),
        tagline: tagline.trim(),
        affiliate_disclaimer_text: disclaimerText.trim()
      });
      toast.success('הגדרות האתר עודכנו');
      onSaved();
    } catch (err: unknown) {
      toast.error(`שגיאה: ${err instanceof Error ? err.message : String(err)}`);
    }
    setSaving(false);
  };

  const tabs = [
  { id: 'general' as const, label: 'כללי', icon: Settings },
  { id: 'welcome' as const, label: 'טקסט פתיחה', icon: Type },
  { id: 'disclaimer' as const, label: 'שקיפות', icon: ShieldCheck }];


  if (!open) {
    return (
      <button data-ev-id="ev_22fa55e3e3"
      onClick={() => {reset();setOpen(true);}}
      className="w-full flex items-center gap-3 px-5 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-right hover:bg-white/[0.05] transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

        <div data-ev-id="ev_9702400bbe" className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
          <Settings className="w-4 h-4 text-primary" aria-hidden="true" />
        </div>
        <div data-ev-id="ev_13c554ee8f" className="flex-1 min-w-0">
          <div data-ev-id="ev_0d73787145" className="text-white/80 text-sm font-medium truncate">{config?.site_title || 'nVision Digital AI'}</div>
          <div data-ev-id="ev_0d38aa0c66" className="text-white/60 text-xs truncate mt-0.5">לחץ לערוך כותרת, תיאור, טקסט פתיחה והודעת שקיפות</div>
        </div>
        <span data-ev-id="ev_c539f8e01e" className="text-white/60 text-xs group-hover:text-white/70 transition-colors">ערוך</span>
      </button>);

  }

  return (
    <div data-ev-id="ev_80574d40dc" className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 space-y-4" dir="rtl">
      <div data-ev-id="ev_938be16884" className="flex items-center justify-between">
        <div data-ev-id="ev_38a115e2a0" className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" aria-hidden="true" />
          <h3 data-ev-id="ev_6cfa9342b0" className="text-white/80 text-sm font-semibold">הגדרות האתר</h3>
        </div>
        <button data-ev-id="ev_bcc20395ec"
        onClick={() => setOpen(false)}
        className="text-white/60 hover:text-white/60 text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">

          סגור
        </button>
      </div>

      {/* Tabs */}
      <div data-ev-id="ev_9834ed91bb" className="flex gap-1 border-b border-white/[0.06] pb-1">
        {tabs.map((tab) =>
        <button data-ev-id="ev_72b6c7b4e0"
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        activeTab === tab.id ?
        'bg-primary/10 text-primary border-b-2 border-primary' :
        'text-white/60 hover:text-white/60'}`
        }>

            <tab.icon className="w-3 h-3" aria-hidden="true" />
            {tab.label}
          </button>
        )}
      </div>

      {/* General Tab */}
      {activeTab === 'general' &&
      <div data-ev-id="ev_53e0129e85" className="space-y-3">
          <div data-ev-id="ev_5b0742afc7">
            <label data-ev-id="ev_dcfe78ba72" htmlFor="config-title" className="text-white/60 text-xs mb-1 block">כותרת האתר</label>
            <input data-ev-id="ev_9791d0df69"
          id="config-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="nVision Digital AI"
          className="w-full px-3 py-2 bg-white/[0.06] border border-white/[0.1] rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary/50" />

          </div>
          <div data-ev-id="ev_87c2efc7a8">
            <label data-ev-id="ev_58cb052400" htmlFor="config-desc" className="text-white/60 text-xs mb-1 block">תיאור האתר</label>
            <textarea data-ev-id="ev_ee41f9ee41"
          id="config-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="תיאור קצר של האתר..."
          className="w-full px-3 py-2 bg-white/[0.06] border border-white/[0.1] rounded-lg text-white text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary/50" />

          </div>
        </div>
      }

      {/* Welcome Text Tab */}
      {activeTab === 'welcome' &&
      <div data-ev-id="ev_1fe03cc31d" className="space-y-3">
          <div data-ev-id="ev_e9b04578a8" className="flex items-center gap-2 text-white/60 text-xs">
            <MessageSquareText className="w-3.5 h-3.5" aria-hidden="true" />
            <span data-ev-id="ev_5d8c26f96c">הטקסט שמופיע מתחת הלוגו בעמוד הראשי</span>
          </div>
          <div data-ev-id="ev_2811eabd8b">
            <label data-ev-id="ev_e06059823c" htmlFor="config-welcome" className="text-white/60 text-xs mb-1 block">טקסט פתיחה ראשי</label>
            <textarea data-ev-id="ev_b3ffa74f5a"
          id="config-welcome"
          value={welcomeText}
          onChange={(e) => setWelcomeText(e.target.value)}
          rows={4}
          placeholder="ברוכים הבאים לקהילה..."
          className="w-full px-3 py-2 bg-white/[0.06] border border-white/[0.1] rounded-lg text-white text-sm resize-y focus:outline-none focus:ring-1 focus:ring-primary/50" />

          </div>
          <div data-ev-id="ev_7bcfb57cbb">
            <label data-ev-id="ev_5270f69c5c" htmlFor="config-welcome-sub" className="text-white/60 text-xs mb-1 block">טקסט משני (קטן יותר)</label>
            <textarea data-ev-id="ev_2a00b9576d"
          id="config-welcome-sub"
          value={welcomeSubtext}
          onChange={(e) => setWelcomeSubtext(e.target.value)}
          rows={2}
          placeholder="כאן תמצאו את כל הקהילות..."
          className="w-full px-3 py-2 bg-white/[0.06] border border-white/[0.1] rounded-lg text-white text-sm resize-y focus:outline-none focus:ring-1 focus:ring-primary/50" />

          </div>
          <div data-ev-id="ev_9afe8c524c">
            <label data-ev-id="ev_a8b1d5e96a" htmlFor="config-tagline" className="text-white/60 text-xs mb-1 block">שורת סיסמה (מתחת למשפט פתיחה)</label>
            <input data-ev-id="ev_4c0b61e265"
          id="config-tagline"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="✨ העתיד מתחיל עכשיו"
          className="w-full px-3 py-2 bg-white/[0.06] border border-white/[0.1] rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary/50" />

          </div>
          {/* Preview */}
          <div data-ev-id="ev_fc1f4c1ed7" className="border border-white/[0.06] rounded-xl p-4 bg-white/[0.02]">
            <div data-ev-id="ev_1ec9c0dadf" className="text-white/60 text-[10px] font-medium mb-2">תצוגה מקדימה</div>
            <p data-ev-id="ev_706782d59b" className="text-white/80 text-sm leading-relaxed">{welcomeText || 'טקסט פתיחה ראשי...'}</p>
            {welcomeSubtext &&
          <p data-ev-id="ev_92505c6eac" className="text-white/60 text-xs leading-relaxed mt-2">{welcomeSubtext}</p>
          }
            {tagline &&
          <p data-ev-id="ev_a61bcc35ce" className="text-white/60 text-xs text-center mt-3">{tagline}</p>
          }
          </div>
        </div>
      }

      {/* Disclaimer Tab */}
      {activeTab === 'disclaimer' &&
      <div data-ev-id="ev_8f0761ac60" className="space-y-3">
          <div data-ev-id="ev_315a948625" className="flex items-center gap-2 text-white/60 text-xs">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span data-ev-id="ev_d10db22f1e">הודעת השקיפות שמופיעה בין הסקציות</span>
          </div>
          <div data-ev-id="ev_21ae48f5ee">
            <label data-ev-id="ev_f7f73eb525" htmlFor="config-disclaimer" className="text-white/60 text-xs mb-1 block">טקסט הודעת שקיפות</label>
            <textarea data-ev-id="ev_4fe9389759"
          id="config-disclaimer"
          value={disclaimerText}
          onChange={(e) => setDisclaimerText(e.target.value)}
          rows={4}
          placeholder="חלק מהכלים כאן כוללים קישור הפניה..."
          className="w-full px-3 py-2 bg-white/[0.06] border border-white/[0.1] rounded-lg text-white text-sm resize-y focus:outline-none focus:ring-1 focus:ring-primary/50" />

          </div>
          {/* Preview */}
          <div data-ev-id="ev_323a6008ff" className="border border-amber-500/10 rounded-xl p-4 bg-amber-500/[0.04]">
            <div data-ev-id="ev_c590ce9ac9" className="text-white/60 text-[10px] font-medium mb-2">תצוגה מקדימה</div>
            <p data-ev-id="ev_926462dd3a" className="text-white/60 text-sm leading-relaxed">
              <span data-ev-id="ev_c4de1e4b0d" className="text-white/70 font-medium">שקיפות מלאה</span>{' — '}
              {disclaimerText || 'טקסט הודעת שקיפות...'}
            </p>
          </div>
        </div>
      }

      {/* Actions */}
      <div data-ev-id="ev_e00c1d4651" className="flex items-center gap-2 pt-1">
        <button data-ev-id="ev_9bf1d277c5"
        onClick={handleSave}
        disabled={!hasChanges || saving}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

          {saving ?
          <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> :

          <Save className="w-3.5 h-3.5" aria-hidden="true" />
          }
          שמור
        </button>
        <button data-ev-id="ev_37741b8f1e"
        onClick={reset}
        disabled={!hasChanges}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white/60 hover:text-white/70 text-sm transition-colors disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          איפוס
        </button>
      </div>
    </div>);

};