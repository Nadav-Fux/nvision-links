import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat,
  Volume2, Heart, ExternalLink, Music, ListMusic, Clock,
  MoreHorizontal, Search } from
'lucide-react';

interface SpotifyViewProps {
  sections: LinkSection[];
  visible: boolean;
}

const PLAYLIST_COLORS = ['#1db954', '#e8115b', '#1e3264', '#e91429', '#148a08', '#bc5900'];

/* fake duration from link id */
const fakeDuration = (id: string) => {
  const h = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const min = 2 + h % 4;
  const sec = (h * 7 + 13) % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
};

const fakePlays = (id: string) => {
  const h = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return ((h * 123 + 5000) % 50000 + 10000).toLocaleString();
};

/* ════ Equalizer animation bars ════ */
const Equalizer = ({ active, color = '#1db954' }: {active: boolean;color?: string;}) => {
  return (
    <div data-ev-id="ev_c3755c16ff" className="flex items-end gap-[2px] h-3.5 w-4">
      {[0, 1, 2, 3].map((i) =>
      <div data-ev-id="ev_a58c543093"
      key={i}
      className="w-[3px] rounded-full transition-all"
      style={{
        backgroundColor: color,
        height: active ? undefined : '3px',
        animation: active ? `eq-bar ${0.4 + i * 0.15}s ease-in-out infinite alternate` : 'none'
      }} />

      )}
      <style data-ev-id="ev_0ffcb94ab0">{`
        @keyframes eq-bar {
          0% { height: 3px; }
          100% { height: 14px; }
        }
      `}</style>
    </div>);

};

/* ══════════════════════════════════════════════
 *  Spotify / Music Player View
 * ══════════════════════════════════════════════ */
export const SpotifyView = ({ sections, visible }: SpotifyViewProps) => {
  const [revealed, setRevealed] = useState(false);
  const [activePlaylist, setActivePlaylist] = useState(0);
  const [nowPlaying, setNowPlaying] = useState<{link: LinkItem;sectionIdx: number;} | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const progressInterval = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setRevealed(true), 200);
      return () => clearTimeout(t);
    }
  }, [visible]);

  // Auto-select first track
  useEffect(() => {
    if (sections.length > 0 && sections[0].links.length > 0) {
      setNowPlaying({ link: sections[0].links[0], sectionIdx: 0 });
    }
  }, [sections]);

  // Progress bar animation
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress((p) => p >= 100 ? 0 : p + 0.5);
      }, 200);
    } else {
      clearInterval(progressInterval.current);
    }
    return () => clearInterval(progressInterval.current);
  }, [isPlaying]);

  const playTrack = useCallback((link: LinkItem, sIdx: number) => {
    setNowPlaying({ link, sectionIdx: sIdx });
    setIsPlaying(true);
    setProgress(0);
  }, []);

  const toggleLike = useCallback((id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);else next.add(id);
      return next;
    });
  }, []);

  const skipNext = useCallback(() => {
    const allTracks = sections.flatMap((s, si) => s.links.map((l) => ({ link: l, sectionIdx: si })));
    if (!nowPlaying || allTracks.length === 0) return;
    const idx = allTracks.findIndex((t) => t.link.id === nowPlaying.link.id);
    const next = shuffle ?
    allTracks[Math.floor(Math.random() * allTracks.length)] :
    allTracks[(idx + 1) % allTracks.length];
    playTrack(next.link, next.sectionIdx);
  }, [nowPlaying, sections, shuffle, playTrack]);

  const skipPrev = useCallback(() => {
    const allTracks = sections.flatMap((s, si) => s.links.map((l) => ({ link: l, sectionIdx: si })));
    if (!nowPlaying || allTracks.length === 0) return;
    const idx = allTracks.findIndex((t) => t.link.id === nowPlaying.link.id);
    const prev = allTracks[(idx - 1 + allTracks.length) % allTracks.length];
    playTrack(prev.link, prev.sectionIdx);
  }, [nowPlaying, sections, playTrack]);

  const activeSection = sections[activePlaylist];
  const filteredLinks = searchQuery ?
  activeSection?.links.filter((l) =>
  l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  l.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  ) :
  activeSection?.links;

  return (
    <div data-ev-id="ev_0c2566656d"
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      <div data-ev-id="ev_114054532d"
      className="mx-auto max-w-4xl rounded-xl overflow-hidden border border-white/[0.04]"
      style={{
        background: '#121212',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)'
      }}>

        <div data-ev-id="ev_349ea1e3e5" className="flex flex-col sm:flex-row" style={{ minHeight: 480 }}>
          {/* ─── Sidebar: Playlists ─── */}
          <div data-ev-id="ev_bdc1a124a6" className="sm:w-56 border-b sm:border-b-0 sm:border-l border-white/[0.06] flex-shrink-0" style={{ background: '#000000' }}>
            {/* Logo */}
            <div data-ev-id="ev_eb5a1e0aec" className="px-4 py-3 flex items-center gap-2">
              <Music className="w-5 h-5 text-[#1db954]" />
              <span data-ev-id="ev_6a2062ca9e" className="text-white font-bold text-sm">nVision Music</span>
            </div>

            {/* Nav */}
            <div data-ev-id="ev_886bd70c1c" className="px-2 pb-2 space-y-0.5">
              <button data-ev-id="ev_2797cb0ff9" className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-white/60 hover:text-white text-sm transition-colors">
                <Search className="w-4 h-4" />
                חיפוש
              </button>
              <button data-ev-id="ev_9e8852ac2e" className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-white/60 hover:text-white text-sm transition-colors">
                <ListMusic className="w-4 h-4" />
                הספרייה
              </button>
            </div>

            {/* Playlists */}
            <div data-ev-id="ev_da7fe6c06b" className="px-2 pt-2 border-t border-white/[0.06]">
              <span data-ev-id="ev_08ff2e4c1d" className="px-3 text-white/30 text-[10px] font-bold tracking-wider">פלייליסטים</span>
              <div data-ev-id="ev_37bd8997e9" className="mt-2 space-y-0.5 max-h-[280px] overflow-y-auto scrollbar-hide">
                {sections.map((section, sIdx) =>
                <button data-ev-id="ev_644a9807af"
                key={section.id}
                onClick={() => setActivePlaylist(sIdx)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors text-right ${
                activePlaylist === sIdx ?
                'bg-white/10 text-white' :
                'text-white/50 hover:text-white/80'}`
                }>

                    {/* Playlist cover */}
                    <div data-ev-id="ev_690523952f"
                  className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 text-xs"
                  style={{
                    background: `linear-gradient(135deg, ${PLAYLIST_COLORS[sIdx % PLAYLIST_COLORS.length]}40, ${PLAYLIST_COLORS[sIdx % PLAYLIST_COLORS.length]}15)`
                  }}>

                      {section.emoji}
                    </div>
                    <div data-ev-id="ev_4b31c8e4b5" className="flex-1 min-w-0 text-right">
                      <div data-ev-id="ev_2e02422426" className="truncate text-[12px] font-medium">{section.title}</div>
                      <div data-ev-id="ev_f1927000fd" className="text-white/25 text-[10px]">{section.links.length} שירים</div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ─── Main content: Track list ─── */}
          <div data-ev-id="ev_78452b0f76" className="flex-1 flex flex-col">
            {/* Playlist header */}
            {activeSection &&
            <div data-ev-id="ev_7ca2b3166d"
            className="p-5 flex items-end gap-4"
            style={{
              background: `linear-gradient(180deg, ${PLAYLIST_COLORS[activePlaylist % PLAYLIST_COLORS.length]}25 0%, #121212 100%)`
            }}>

                <div data-ev-id="ev_f7d37238de"
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xl text-3xl sm:text-4xl"
              style={{
                background: `linear-gradient(135deg, ${PLAYLIST_COLORS[activePlaylist % PLAYLIST_COLORS.length]}50, ${PLAYLIST_COLORS[activePlaylist % PLAYLIST_COLORS.length]}20)`
              }}>

                  {activeSection.emoji}
                </div>
                <div data-ev-id="ev_0916a4b1b0" className="flex-1 min-w-0">
                  <span data-ev-id="ev_2e0e536b44" className="text-white/40 text-[10px] font-bold tracking-wider">פלייליסט</span>
                  <h2 data-ev-id="ev_baf5e46ad0" className="text-white text-xl sm:text-2xl font-extrabold mt-0.5 truncate">{activeSection.title}</h2>
                  <div data-ev-id="ev_72f9409f98" className="text-white/40 text-xs mt-1">
                    nVision Music · {activeSection.links.length} שירים
                  </div>
                </div>
              </div>
            }

            {/* Controls + Search */}
            <div data-ev-id="ev_e01009effc" className="flex items-center gap-3 px-5 pb-3">
              <button data-ev-id="ev_d96f521e3e"
              onClick={() => {
                if (activeSection && activeSection.links.length > 0) {
                  playTrack(activeSection.links[0], activePlaylist);
                }
              }}
              className="w-10 h-10 rounded-full bg-[#1db954] hover:bg-[#1ed760] flex items-center justify-center transition-colors shadow-lg">

                <Play className="w-5 h-5 text-black fill-black ml-0.5" />
              </button>
              <div data-ev-id="ev_99ef96e7dc" className="flex-1" />
              <div data-ev-id="ev_b2c5d6c2b5" className="relative">
                <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input data-ev-id="ev_d2d434fd46"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חפש בפלייליסט..."
                className="w-40 sm:w-48 bg-white/[0.06] border border-white/[0.08] rounded-full py-1.5 pr-8 pl-3 text-[11px] text-white/70 placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-colors" />

              </div>
            </div>

            {/* Track list header */}
            <div data-ev-id="ev_e9bd3de4d6" className="flex items-center gap-3 px-5 py-1.5 border-b border-white/[0.06] text-[10px] font-mono text-white/25">
              <span data-ev-id="ev_0778840315" className="w-6 text-center">#</span>
              <span data-ev-id="ev_097da5be13" className="flex-1">שם</span>
              <span data-ev-id="ev_76cf9ca189" className="w-20 hidden sm:block text-center">השמעות</span>
              <span data-ev-id="ev_24c2d3c302" className="w-10 text-center"><Clock className="w-3 h-3 inline" /></span>
              <span data-ev-id="ev_9cba364cf7" className="w-6" />
            </div>

            {/* Tracks */}
            <div data-ev-id="ev_8ae5a40abe" className="flex-1 overflow-y-auto scrollbar-hide">
              {filteredLinks?.map((link, lIdx) => {
                const isNP = nowPlaying?.link.id === link.id;
                const isLiked = liked.has(link.id);
                return (
                  <div data-ev-id="ev_ee6ad4b439"
                  key={link.id}
                  className={`flex items-center gap-3 px-5 py-2 transition-colors group cursor-pointer ${
                  isNP ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]'}`
                  }
                  onClick={() => playTrack(link, activePlaylist)}>

                    {/* # / Equalizer / Play */}
                    <div data-ev-id="ev_6fb0efe681" className="w-6 text-center flex-shrink-0">
                      {isNP && isPlaying ?
                      <Equalizer active={true} /> :

                      <span data-ev-id="ev_3a79c7ea73" className={`text-[11px] font-mono group-hover:hidden ${
                      isNP ? 'text-[#1db954]' : 'text-white/30'}`
                      }>
                          {lIdx + 1}
                        </span>
                      }
                      {!(isNP && isPlaying) &&
                      <Play className="w-3.5 h-3.5 text-white hidden group-hover:block mx-auto fill-white" />
                      }
                    </div>

                    {/* Icon + Title */}
                    <div data-ev-id="ev_aa55b43756" className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div data-ev-id="ev_a609c07273"
                      className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
                      style={{ background: link.color + '20' }}>

                        <AnimatedIcon icon={link.icon} animation={link.animation} color={link.color} size={16} />
                      </div>
                      <div data-ev-id="ev_d31e22c279" className="min-w-0 flex-1">
                        <div data-ev-id="ev_9dc3664a01" className={`text-[12px] font-medium truncate ${
                        isNP ? 'text-[#1db954]' : 'text-white/80'}`
                        }>
                          {link.title}
                        </div>
                        <div data-ev-id="ev_7745b26022" className="text-white/35 text-[10px] truncate">
                          {link.subtitle}
                        </div>
                      </div>
                    </div>

                    {/* Like */}
                    <button data-ev-id="ev_ba5067ca06"
                    onClick={(e) => {e.stopPropagation();toggleLike(link.id);}}
                    className={`flex-shrink-0 transition-colors ${
                    isLiked ? 'text-[#1db954]' : 'text-transparent group-hover:text-white/25 hover:!text-white/60'}`
                    }>

                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#1db954]' : ''}`} />
                    </button>

                    {/* Plays */}
                    <span data-ev-id="ev_dc001e7d50" className="w-20 text-[10px] text-white/25 font-mono text-center hidden sm:block">
                      {fakePlays(link.id)}
                    </span>

                    {/* Duration */}
                    <span data-ev-id="ev_0d3b43b0ed" className="w-10 text-[10px] text-white/30 font-mono text-center flex-shrink-0">
                      {fakeDuration(link.id)}
                    </span>

                    {/* More + Open */}
                    <a data-ev-id="ev_54d75f445c"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.title} (נפתח בחלון חדש)`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-shrink-0 text-white/0 group-hover:text-white/30 hover:!text-white/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">

                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>);

              })}

              {filteredLinks?.length === 0 &&
              <div data-ev-id="ev_bad5fd98d2" className="text-center py-10 text-white/20 text-sm">
                  לא נמצאו שירים
                </div>
              }
            </div>
          </div>
        </div>

        {/* ─── Now Playing Bar ─── */}
        <div data-ev-id="ev_2aa5662409" className="border-t border-white/[0.06] px-4 py-2.5 flex items-center gap-4" style={{ background: '#181818' }}>
          {/* Left: Track info */}
          <div data-ev-id="ev_0cf64ccca0" className="flex items-center gap-3 w-48 flex-shrink-0">
            {nowPlaying &&
            <>
                <div data-ev-id="ev_3e40ec9298"
              className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: nowPlaying.link.color + '20' }}>

                  <AnimatedIcon icon={nowPlaying.link.icon} animation={isPlaying ? nowPlaying.link.animation : 'breathe'} color={nowPlaying.link.color} size={18} />
                </div>
                <div data-ev-id="ev_c8b11b5dc9" className="min-w-0">
                  <a data-ev-id="ev_fa91ebfe3e"
                href={nowPlaying.link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${nowPlaying.link.title} (נפתח בחלון חדש)`}
                className="text-white/80 text-[11px] font-medium truncate block hover:underline">

                    {nowPlaying.link.title}
                  </a>
                  <div data-ev-id="ev_3f41bef4ff" className="text-white/35 text-[9px] truncate">{nowPlaying.link.subtitle}</div>
                </div>
                <button data-ev-id="ev_d0dbcbe058"
              onClick={() => nowPlaying && toggleLike(nowPlaying.link.id)}
              className={`flex-shrink-0 ${
              liked.has(nowPlaying.link.id) ? 'text-[#1db954]' : 'text-white/25 hover:text-white/60'} transition-colors`
              }>

                  <Heart className={`w-3.5 h-3.5 ${nowPlaying && liked.has(nowPlaying.link.id) ? 'fill-[#1db954]' : ''}`} />
                </button>
              </>
            }
          </div>

          {/* Center: Controls + Progress */}
          <div data-ev-id="ev_079dbb990a" className="flex-1 flex flex-col items-center gap-1">
            <div data-ev-id="ev_7d87a43f05" className="flex items-center gap-4">
              <button data-ev-id="ev_860252c9b1"
              onClick={() => setShuffle(!shuffle)}
              className={`transition-colors ${shuffle ? 'text-[#1db954]' : 'text-white/30 hover:text-white/60'}`}>

                <Shuffle className="w-3.5 h-3.5" />
              </button>
              <button data-ev-id="ev_80612bed24" onClick={skipPrev} className="text-white/50 hover:text-white transition-colors">
                <SkipBack className="w-4 h-4 fill-current" />
              </button>
              <button data-ev-id="ev_19d1c7e724"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform">

                {isPlaying ?
                <Pause className="w-4 h-4 text-black fill-black" /> :
                <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                }
              </button>
              <button data-ev-id="ev_681c96d0df" onClick={skipNext} className="text-white/50 hover:text-white transition-colors">
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
              <button data-ev-id="ev_41ddabeba4"
              onClick={() => setRepeat(!repeat)}
              className={`transition-colors ${repeat ? 'text-[#1db954]' : 'text-white/30 hover:text-white/60'}`}>

                <Repeat className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* Progress bar */}
            <div data-ev-id="ev_4c93198c93" className="flex items-center gap-2 w-full max-w-md">
              <span data-ev-id="ev_d2700fc195" className="text-[9px] font-mono text-white/30 w-8 text-right">
                {Math.floor(progress / 100 * 3)}:{(Math.floor(progress / 100 * 60) % 60).toString().padStart(2, '0')}
              </span>
              <div data-ev-id="ev_7852e23f13"
              className="flex-1 h-1 rounded-full bg-white/10 cursor-pointer group relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setProgress((e.clientX - rect.left) / rect.width * 100);
              }}>

                <div data-ev-id="ev_5f5f76f445"
                className="h-full rounded-full bg-white/60 group-hover:bg-[#1db954] transition-colors relative"
                style={{ width: `${progress}%` }}>

                  <div data-ev-id="ev_a94b601b55" className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: '100%', marginLeft: -6 }} />
                </div>
              </div>
              <span data-ev-id="ev_994ff2842e" className="text-[9px] font-mono text-white/30 w-8">
                {nowPlaying ? fakeDuration(nowPlaying.link.id) : '0:00'}
              </span>
            </div>
          </div>

          {/* Right: Volume */}
          <div data-ev-id="ev_7751ea07f5" className="flex items-center gap-2 w-32 flex-shrink-0 justify-end">
            <Volume2 className="w-3.5 h-3.5 text-white/40" />
            <div data-ev-id="ev_e4d6784b81"
            className="w-20 h-1 rounded-full bg-white/10 cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setVolume(Math.round((e.clientX - rect.left) / rect.width * 100));
            }}>

              <div data-ev-id="ev_289ecb8eb6"
              className="h-full rounded-full bg-white/50 group-hover:bg-[#1db954] transition-colors"
              style={{ width: `${volume}%` }} />

            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default SpotifyView;