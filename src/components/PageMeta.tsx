import { useEffect } from 'react';

interface PageMetaProps {
  title: string;
  description: string;
}

export const PageMeta = ({ title, description }: PageMetaProps) => {
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

    // OG title
    let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    const originalOgTitle = ogTitle?.content ?? '';
    if (ogTitle) ogTitle.content = title;

    // OG description
    let ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
    const originalOgDesc = ogDesc?.content ?? '';
    if (ogDesc) ogDesc.content = description;

    return () => {
      document.title = 'nVision Digital AI — קהילת בינה מלאכותית';
      if (metaDesc) metaDesc.content = originalDesc;
      if (ogTitle) ogTitle.content = originalOgTitle;
      if (ogDesc) ogDesc.content = originalOgDesc;
    };
  }, [title, description]);

  return null;
};
