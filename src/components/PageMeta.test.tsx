import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { PageMeta } from './PageMeta';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getMetaContent(selector: string): string | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  return el.getAttribute('content') ?? el.getAttribute('href');
}

function ensureMeta(property: string, attrName: 'property' | 'name', content: string) {
  let el = document.querySelector(`meta[${attrName}="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, property);
    el.content = content;
    document.head.appendChild(el);
  }
  return el;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('PageMeta', () => {
  const originalTitle = document.title;

  beforeEach(() => {
    // Ensure OG meta tags exist in head (they're typically in index.html)
    ensureMeta('og:title', 'property', 'Original OG Title');
    ensureMeta('og:description', 'property', 'Original OG Desc');
    ensureMeta('description', 'name', 'Original description');
    ensureMeta('twitter:title', 'name', 'Original Twitter Title');
    ensureMeta('twitter:description', 'name', 'Original Twitter Desc');
  });

  afterEach(() => {
    cleanup();
    document.title = originalTitle;
  });

  it('sets the document title', () => {
    render(<PageMeta title="Test Page Title" description="Test description" />);
    expect(document.title).toBe('Test Page Title');
  });

  it('restores the original title on unmount', () => {
    document.title = 'Before';
    const { unmount } = render(<PageMeta title="Temporary Title" description="desc" />);
    expect(document.title).toBe('Temporary Title');
    unmount();
    expect(document.title).toBe('nVision Digital AI — קהילת בינה מלאכותית');
  });

  it('sets meta description', () => {
    render(<PageMeta title="Title" description="My page description" />);
    const meta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    expect(meta?.content).toBe('My page description');
  });

  it('creates meta description if not present', () => {
    // Remove existing description meta
    const existing = document.querySelector('meta[name="description"]');
    existing?.remove();

    render(<PageMeta title="Title" description="New description" />);
    const meta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    expect(meta).toBeTruthy();
    expect(meta.content).toBe('New description');
  });

  it('sets og:title from ogTitle prop', () => {
    render(<PageMeta title="Page Title" description="desc" ogTitle="Custom OG Title" />);
    expect(getMetaContent('meta[property="og:title"]')).toBe('Custom OG Title');
  });

  it('falls back to title for og:title when ogTitle is not provided', () => {
    render(<PageMeta title="Fallback Title" description="desc" />);
    expect(getMetaContent('meta[property="og:title"]')).toBe('Fallback Title');
  });

  it('sets og:description from ogDescription prop', () => {
    render(<PageMeta title="T" description="d" ogDescription="Custom OG Desc" />);
    expect(getMetaContent('meta[property="og:description"]')).toBe('Custom OG Desc');
  });

  it('falls back to description for og:description when not provided', () => {
    render(<PageMeta title="T" description="Fallback Desc" />);
    expect(getMetaContent('meta[property="og:description"]')).toBe('Fallback Desc');
  });

  it('sets twitter:title and twitter:description in sync with OG', () => {
    render(<PageMeta title="Tweet Title" description="Tweet Desc" />);
    expect(getMetaContent('meta[name="twitter:title"]')).toBe('Tweet Title');
    expect(getMetaContent('meta[name="twitter:description"]')).toBe('Tweet Desc');
  });

  it('sets og:image and twitter:image when ogImageUrl is provided', () => {
    ensureMeta('og:image', 'property', '');
    ensureMeta('twitter:image', 'name', '');
    render(
      <PageMeta
        title="T"
        description="D"
        ogImageUrl="https://example.com/image.png"
      />
    );
    expect(getMetaContent('meta[property="og:image"]')).toBe('https://example.com/image.png');
    expect(getMetaContent('meta[name="twitter:image"]')).toBe('https://example.com/image.png');
  });

  it('creates and sets meta keywords when metaKeywords is provided', () => {
    const existing = document.querySelector('meta[name="keywords"]');
    existing?.remove();
    render(<PageMeta title="T" description="D" metaKeywords="ai, machine learning, react" />);
    const meta = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
    expect(meta).toBeTruthy();
    expect(meta.content).toBe('ai, machine learning, react');
  });

  it('returns null (renders nothing visible)', () => {
    const { container } = render(<PageMeta title="T" description="D" />);
    expect(container.firstChild).toBeNull();
  });
});
