import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { usePublicData } from './usePublicData';

// ── Supabase mock ─────────────────────────────────────────────────────────────
// vi.mock is hoisted to top of file, so factory cannot reference outer variables.
// We store mutable references via a shared object instead.

const mocks = {
  from: vi.fn(),
  channel: vi.fn(),
  on: vi.fn(),
  subscribe: vi.fn(),
  removeChannel: vi.fn(),
};

vi.mock('@/integrations/supabase/client', () => ({
  get supabase() {
    return {
      from: mocks.from,
      channel: mocks.channel,
      removeChannel: mocks.removeChannel,
    };
  },
}));

vi.mock('@/lib/iconMap', () => ({
  getIcon: vi.fn().mockReturnValue(null),
}));

vi.mock('@/components/icons/CommunityIcon', () => ({
  CommunityIcon: () => null,
}));
vi.mock('@/components/icons/CodeIcon', () => ({
  CodeIcon: () => null,
}));
vi.mock('@/components/icons/BrainIcon', () => ({
  BrainIcon: () => null,
}));
vi.mock('@/components/icons/MediaIcon', () => ({
  MediaIcon: () => null,
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

const mockConfig = {
  id: '1',
  site_title: 'nVision',
  site_subtitle: 'AI Community',
  hero_title: 'Hello',
  hero_subtitle: 'World',
  footer_text: 'Footer',
  background_animation: null,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

const mockSections = [
  {
    id: 'community',
    title: 'Community',
    emoji: '👥',
    sort_order: 1,
    is_visible: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
];

const mockLinks = [
  {
    id: 'link-1',
    section_id: 'community',
    title: 'Test Link',
    subtitle: 'Test subtitle',
    description: null,
    url: 'https://example.com',
    icon_name: 'Globe',
    color: '#06b6d4',
    animation: null,
    favicon_url: null,
    affiliate_benefit: null,
    tag: null,
    sort_order: 1,
    is_visible: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
];

function makeQueryBuilder(data: unknown, error: unknown = null) {
  const builder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue({ data, error }),
    single: vi.fn().mockResolvedValue({ data, error }),
  };
  return builder;
}

function setupChannelMock() {
  mocks.on.mockReturnThis();
  mocks.subscribe.mockReturnThis();
  mocks.channel.mockReturnValue({
    on: mocks.on,
    subscribe: mocks.subscribe,
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('usePublicData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupChannelMock();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts in loading state before data resolves', () => {
    // Never-resolving promise keeps loading=true
    mocks.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn(() => new Promise(() => {})),
      single: vi.fn(() => new Promise(() => {})),
    });

    const { result } = renderHook(() => usePublicData());
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.sections).toEqual([]);
    expect(result.current.config).toBeNull();
  });

  it('returns config and sections on successful fetch', async () => {
    mocks.from.mockImplementation((table: string) => {
      if (table === 'site_config') return makeQueryBuilder(mockConfig);
      if (table === 'sections') return makeQueryBuilder(mockSections);
      if (table === 'links') return makeQueryBuilder(mockLinks);
      return makeQueryBuilder(null);
    });

    const { result } = renderHook(() => usePublicData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.config).toEqual(mockConfig);
    expect(result.current.sections).toHaveLength(1);
    expect(result.current.sections[0].id).toBe('community');
    expect(result.current.sections[0].links).toHaveLength(1);
    expect(result.current.sections[0].links[0].title).toBe('Test Link');
  });

  it('sets error state when all 3 retry attempts fail', async () => {
    vi.useFakeTimers();
    const testError = new Error('Network error');

    mocks.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: null, error: testError }),
      single: vi.fn().mockResolvedValue({ data: null, error: testError }),
    });

    const { result } = renderHook(() => usePublicData());

    // First attempt: loading=false is set in finally block
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Network error');

    vi.useRealTimers();
  });

  it('exposes a retry function that re-triggers fetch', async () => {
    let callCount = 0;
    mocks.from.mockImplementation((table: string) => {
      callCount++;
      if (table === 'site_config') return makeQueryBuilder(mockConfig);
      if (table === 'sections') return makeQueryBuilder(mockSections);
      return makeQueryBuilder(mockLinks);
    });

    const { result } = renderHook(() => usePublicData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const countAfterLoad = callCount;

    act(() => {
      result.current.retry();
    });

    await waitFor(() => {
      expect(callCount).toBeGreaterThan(countAfterLoad);
    });
  });

  it('links are only associated with their matching section', async () => {
    const multiLinks = [
      { ...mockLinks[0], section_id: 'community' },
      { ...mockLinks[0], id: 'link-2', section_id: 'other-section', title: 'Other Link' },
    ];

    mocks.from.mockImplementation((table: string) => {
      if (table === 'site_config') return makeQueryBuilder(mockConfig);
      if (table === 'sections') return makeQueryBuilder(mockSections);
      if (table === 'links') return makeQueryBuilder(multiLinks);
      return makeQueryBuilder(null);
    });

    const { result } = renderHook(() => usePublicData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Only community section exists, so only its link is included
    expect(result.current.sections[0].links).toHaveLength(1);
    expect(result.current.sections[0].links[0].title).toBe('Test Link');
  });

  it('subscribes to realtime channels on mount', async () => {
    mocks.from.mockImplementation(() => makeQueryBuilder(null));
    const { result } = renderHook(() => usePublicData());

    // Wait for initial fetch to settle before asserting subscription state
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mocks.channel).toHaveBeenCalledWith('public-data-sync');
    expect(mocks.on).toHaveBeenCalled();
    expect(mocks.subscribe).toHaveBeenCalled();
  });

  it('calls removeChannel on unmount', async () => {
    const fakeChannel = { on: mocks.on, subscribe: mocks.subscribe };
    mocks.channel.mockReturnValue(fakeChannel);
    mocks.from.mockImplementation(() => makeQueryBuilder(null));

    const { unmount } = renderHook(() => usePublicData());

    await waitFor(() => {
      expect(mocks.channel).toHaveBeenCalled();
    });

    unmount();
    expect(mocks.removeChannel).toHaveBeenCalledWith(fakeChannel);
  });
});
