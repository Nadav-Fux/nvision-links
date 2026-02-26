import { useEffect } from 'react';

interface PageMetaProps {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  metaKeywords?: string;
}

function setMeta(selector: string, value: string | undefined, attr: 'content' = 'content'): string {
  const el = document.querySelector(selector) as HTMLMetaElement | null;
  const original = el?.getAttribute(attr) ?? '';
  if (el && value) el.setAttribute(attr, value);
  return original;
}

export const PageMeta = ({ title, description, ogTitle, ogDescription, ogImageUrl, canonicalUrl, metaKeywords }: PageMetaProps) => {
  useEffect(() => {
    // Title
    document.title = title;

    // Description
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const originalDesc = metaDesc?.content ?? '';
    if (metaDesc) {
      metaDesc.content = description;
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content = description;
      document.head.appendChild(metaDesc);
    }

    // OG title — use explicit ogTitle if set, otherwise fall back to title
    const origOgTitle = setMeta('meta[property="og:title"]', ogTitle || title);

    // OG description — use explicit ogDescription if set, otherwise fall back to description
    const origOgDesc = setMeta('meta[property="og:description"]', ogDescription || description);

    // OG image
    const origOgImage = ogImageUrl ? setMeta('meta[property="og:image"]', ogImageUrl) : '';

    // Twitter meta (keep in sync)
    setMeta('meta[name="twitter:title"]', ogTitle || title);
    setMeta('meta[name="twitter:description"]', ogDescription || description);
    if (ogImageUrl) setMeta('meta[name="twitter:image"]', ogImageUrl);

    // Canonical URL
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const origCanonical = canonicalEl?.href ?? '';
    if (canonicalEl && canonicalUrl) canonicalEl.href = canonicalUrl;

    // Meta keywords
    let keywordsEl = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null;
    const origKeywords = keywordsEl?.content ?? '';
    if (metaKeywords) {
      if (keywordsEl) {
        keywordsEl.content = metaKeywords;
      } else {
        keywordsEl = document.createElement('meta');
        keywordsEl.name = 'keywords';
        keywordsEl.content = metaKeywords;
        document.head.appendChild(keywordsEl);
      }
    }

    return () => {
      document.title = 'nVision Digital AI — קהילת בינה מלאכותית';
      if (metaDesc) metaDesc.content = originalDesc;
      setMeta('meta[property="og:title"]', origOgTitle);
      setMeta('meta[property="og:description"]', origOgDesc);
      if (origOgImage) setMeta('meta[property="og:image"]', origOgImage);
      if (canonicalEl && origCanonical) canonicalEl.href = origCanonical;
      if (keywordsEl) keywordsEl.content = origKeywords;
    };
  }, [title, description, ogTitle, ogDescription, ogImageUrl, canonicalUrl, metaKeywords]);

  return null;
};
