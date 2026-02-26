import { useState, useEffect } from 'react';
import { Globe, Save, Loader2, Image, Tag, Link2 } from 'lucide-react';
import { updateConfig } from '@/lib/adminApi';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/helpers';

type ConfigRow = Tables<'site_config'>;

interface SEOEditorProps {
  config: ConfigRow | null;
  onSaved: () => void;
}

export const SEOEditor = ({ config, onSaved }: SEOEditorProps) => {
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImageUrl, setOgImageUrl] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (config) {
      setOgTitle(config.og_title || '');
      setOgDescription(config.og_description || '');
      setOgImageUrl(config.og_image_url || '');
      setMetaKeywords(config.meta_keywords || '');
      setCanonicalUrl(config.canonical_url || '');
    }
  }, [config]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateConfig({
        og_title: ogTitle,
        og_description: ogDescription,
        og_image_url: ogImageUrl,
        meta_keywords: metaKeywords,
        canonical_url: canonicalUrl
      });
      toast.success('הגדרות SEO נשמרו');
      onSaved();
    } catch (err: unknown) {
      toast.error(`שגיאה: ${err instanceof Error ? err.message : String(err)}`);
    }
    setSaving(false);
  };

  const hasChanges = config && (
  ogTitle !== (config.og_title || '') ||
  ogDescription !== (config.og_description || '') ||
  ogImageUrl !== (config.og_image_url || '') ||
  metaKeywords !== (config.meta_keywords || '') ||
  canonicalUrl !== (config.canonical_url || ''));


  return (
    <div data-ev-id="ev_4a2447cf09" className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 space-y-4">
      {/* OG Title */}
      <div data-ev-id="ev_db43581eb5">
        <label data-ev-id="ev_6137a07e95" htmlFor="seo-og-title" className="flex items-center gap-2 text-white/60 text-xs font-medium mb-1.5">
          <Globe className="w-3.5 h-3.5" aria-hidden="true" />
          OG Title (כותרת שיתוף)
        </label>
        <input data-ev-id="ev_05ebb6b4a6"
        id="seo-og-title"
        value={ogTitle}
        onChange={(e) => setOgTitle(e.target.value)}
        placeholder={config?.site_title || 'nVision Digital AI'}
        className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white/80 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary/40 transition-all" />

        <p data-ev-id="ev_0afbc1a780" className="text-white/60 text-[10px] mt-1">הכותרת שתוצג בשיתוף ברשתות חברתיות. אם ריק — ישתמש בכותרת האתר.</p>
      </div>

      {/* OG Description */}
      <div data-ev-id="ev_09f41aaf2b">
        <label data-ev-id="ev_44f9d69b5d" htmlFor="seo-og-desc" className="flex items-center gap-2 text-white/60 text-xs font-medium mb-1.5">
          <Tag className="w-3.5 h-3.5" aria-hidden="true" />
          OG Description (תיאור שיתוף)
        </label>
        <textarea data-ev-id="ev_a22096a68f"
        id="seo-og-desc"
        value={ogDescription}
        onChange={(e) => setOgDescription(e.target.value)}
        placeholder={config?.site_description || ''}
        rows={2}
        className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white/80 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary/40 transition-all resize-none" />

      </div>

      {/* OG Image */}
      <div data-ev-id="ev_44e59df22a">
        <label data-ev-id="ev_cafca0abb0" htmlFor="seo-og-image" className="flex items-center gap-2 text-white/60 text-xs font-medium mb-1.5">
          <Image className="w-3.5 h-3.5" aria-hidden="true" />
          OG Image URL (תמונת שיתוף)
        </label>
        <input data-ev-id="ev_7f7da29a68"
        id="seo-og-image"
        type="url"
        value={ogImageUrl}
        onChange={(e) => setOgImageUrl(e.target.value)}
        placeholder="https://nvision.digital/og-image.png"
        dir="ltr"
        className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white/80 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary/40 transition-all" />

        {ogImageUrl &&
        <div data-ev-id="ev_6ebbf04979" className="mt-2 rounded-lg overflow-hidden border border-white/[0.06] max-w-[300px]">
            <img data-ev-id="ev_f626b98530" src={ogImageUrl} alt="OG Preview" className="w-full h-auto" onError={(e) => {(e.target as HTMLImageElement).style.display = 'none';}} />
          </div>
        }
      </div>

      <div data-ev-id="ev_300cf32a28" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Meta Keywords */}
        <div data-ev-id="ev_1c56fb57e7">
          <label data-ev-id="ev_faff4ff057" htmlFor="seo-keywords" className="flex items-center gap-2 text-white/60 text-xs font-medium mb-1.5">
            <Tag className="w-3.5 h-3.5" aria-hidden="true" />
            Meta Keywords
          </label>
          <input data-ev-id="ev_ec0ddad0b6"
          id="seo-keywords"
          value={metaKeywords}
          onChange={(e) => setMetaKeywords(e.target.value)}
          placeholder="AI, בינה מלאכותית, כלים"
          className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white/80 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary/40 transition-all" />

        </div>

        {/* Canonical URL */}
        <div data-ev-id="ev_4552aa5f8e">
          <label data-ev-id="ev_452e8512e9" htmlFor="seo-canonical" className="flex items-center gap-2 text-white/60 text-xs font-medium mb-1.5">
            <Link2 className="w-3.5 h-3.5" aria-hidden="true" />
            Canonical URL
          </label>
          <input data-ev-id="ev_6aa41c2438"
          id="seo-canonical"
          type="url"
          value={canonicalUrl}
          onChange={(e) => setCanonicalUrl(e.target.value)}
          placeholder="https://nvision.digital"
          dir="ltr"
          className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white/80 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary/40 transition-all" />

        </div>
      </div>

      {/* Save */}
      <div data-ev-id="ev_15d4f43926" className="flex justify-end">
        <button data-ev-id="ev_2a2723e033"
        onClick={handleSave}
        disabled={saving || !hasChanges}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          שמור SEO
        </button>
      </div>
    </div>);

};