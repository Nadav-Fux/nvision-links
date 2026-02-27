import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getIcon } from '@/lib/iconMap';
import type { Tables } from '@/integrations/supabase/helpers';
import type { LinkItem } from '@/data/links';
import { CommunityIcon } from '@/components/icons/CommunityIcon';
import { CodeIcon } from '@/components/icons/CodeIcon';
import { BrainIcon } from '@/components/icons/BrainIcon';
import { MediaIcon } from '@/components/icons/MediaIcon';
import { Globe } from 'lucide-react';

type SectionRow = Tables<'sections'>;
type LinkRow = Tables<'links'>;
type ConfigRow = Tables<'site_config'>;

/**
 * Maps a known section ID to its custom SVG icon component.
 * Falls back to the emoji string when the ID is not in the map.
 */
function getSectionIcon(sectionId: string, fallbackEmoji: string): ReactNode {
  const iconMap: Record<string, ReactNode> = {
    'community': <CommunityIcon size={22} />,
    'vibe-coding': <CodeIcon size={22} />,
    'models-infra': <BrainIcon size={22} />,
    'media': <MediaIcon size={22} />,
    'about': <Globe size={22} className="text-cyan-400" />,
    'על-האתר': <Globe size={22} className="text-cyan-400" />,
  };
  return iconMap[sectionId] ?? fallbackEmoji;
}

/** A section row enriched with its resolved icon and full list of child links. */
export interface SectionWithLinks {
  id: string;
  title: string;
  emoji: ReactNode;
  sort_order: number;
  links: LinkItem[];
}

/** Shape returned by usePublicData. */
export interface PublicData {
  config: ConfigRow | null;
  sections: SectionWithLinks[];
  loading: boolean;
  error: string | null;
  /** Trigger a manual re-fetch after a previous failure. */
  retry: () => void;
}

/** Converts a raw DB link row into the UI-friendly LinkItem shape. */
function toLinkItem(row: LinkRow): LinkItem {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    url: row.url,
    icon: getIcon(row.icon_name),
    color: row.color,
    animation: row.animation as LinkItem['animation'],
    faviconUrl: row.favicon_url || undefined,
    affiliateBenefit: row.affiliate_benefit || undefined,
    tag: (row.tag as LinkItem['tag']) || undefined,
  };
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

/**
 * Fetches site config, sections, and links from Supabase.
 * Retries up to 3 times on failure, then exposes the error for display.
 * Also subscribes to realtime changes so the UI auto-updates without refresh.
 *
 * @returns config, sections with links, loading/error state, and a retry function.
 */
export function usePublicData(): PublicData {
  const [config, setConfig] = useState<ConfigRow | null>(null);
  const [sections, setSections] = useState<SectionWithLinks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchAll = useCallback(async (attempt: number = 0) => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const [configRes, sectionsRes, linksRes] = await Promise.all([
        supabase.from('site_config').select('*').single(),
        supabase.from('sections').select('*').eq('is_visible', true).order('sort_order'),
        supabase.from('links').select('*').eq('is_visible', true).order('sort_order'),
      ]);

      if (configRes.error) throw configRes.error;
      if (sectionsRes.error) throw sectionsRes.error;
      if (linksRes.error) throw linksRes.error;

      setConfig(configRes.data);

      const sectionData: SectionWithLinks[] = (sectionsRes.data || []).map((s: SectionRow) => ({
        id: s.id,
        title: s.title,
        emoji: getSectionIcon(s.id, s.emoji),
        sort_order: s.sort_order,
        links: (linksRes.data || [])
          .filter((l: LinkRow) => l.section_id === s.id)
          .map(toLinkItem),
      }));

      setSections(sectionData);
      setError(null);
    } catch (err: unknown) {
      console.error(`Failed to load public data (attempt ${attempt + 1}):`, err);

      if (attempt < MAX_RETRIES - 1) {
        setTimeout(() => {
          fetchAll(attempt + 1);
        }, RETRY_DELAY_MS * (attempt + 1));
        return;
      }

      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll(0);
  }, [fetchAll, retryCount]);

  // ===== Realtime subscriptions — auto-refetch on changes =====
  useEffect(() => {
    if (!supabase) return;

    const client = supabase;
    const channel = client
      .channel('public-data-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sections' }, () => {
        fetchAll(0);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'links' }, () => {
        fetchAll(0);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_config' }, () => {
        fetchAll(0);
      })
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [fetchAll]);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setRetryCount((c) => c + 1);
  }, []);

  return { config, sections, loading, error, retry };
}
