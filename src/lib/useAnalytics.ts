import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

type EventType = 'page_view' | 'link_click' | 'view_switch';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

/**
 * Fire-and-forget anonymous analytics tracker.
 * Privacy: No cookies, no IPs, no user identifiers — just event counts.
 */
function getTrackUrl(): string | null {
  if (!supabase) return null;
  return `${SUPABASE_URL}/functions/v1/analytics-track`;
}

function getAnonKey(): string | null {
  if (!supabase) return null;
  return SUPABASE_ANON_KEY;
}

/** Send a single event — fire and forget, never throws */
export async function trackEvent(
  event_type: EventType,
  event_target: string = '',
  page_path: string = '/'
): Promise<void> {
  try {
    const url = getTrackUrl();
    const key = getAnonKey();
    if (!url || !key) return;

    const body = JSON.stringify({ event_type, event_target, page_path });

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body,
      // Keep-alive so request survives page navigation
      keepalive: true,
    }).catch(() => {
      // Silently ignore — analytics should never break UX
    });
  } catch {
    // Silently ignore
  }
}

/**
 * Hook: auto-tracks page_view on mount.
 * Returns a trackClick function for link clicks.
 */
export function useAnalytics(pagePath: string = '/') {
  const tracked = useRef(false);

  // Track page view once on mount
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackEvent('page_view', '', pagePath);
  }, [pagePath]);

  // Track link clicks
  const trackClick = useCallback(
    (linkTitle: string) => {
      trackEvent('link_click', linkTitle, pagePath);
    },
    [pagePath]
  );

  // Track view switches
  const trackViewSwitch = useCallback(
    (viewName: string) => {
      trackEvent('view_switch', viewName, pagePath);
    },
    [pagePath]
  );

  return { trackClick, trackViewSwitch };
}
