import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink, Star, Zap, Trophy, Gamepad2, ChevronRight } from 'lucide-react';

interface ArcadeViewProps {
  sections: LinkSection[];
  visible: boolean;
}

const LEVEL_COLORS = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];

const fakeScore = (id: string) => {
  const h = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return (h * 137 + 4200) % 99000 + 1000;
};

const fakeRank = (id: string): string => {
  const h = id.charCodeAt(0);
  const ranks = ['S', 'A', 'A', 'B', 'B', 'B', 'C', 'C'];
  return ranks[h % ranks.length];
};

const rankColor = (rank: string) => {
  switch (rank) {
    case 'S':return '#fbbf24';
    case 'A':return '#34d399';
    case 'B':return '#60a5fa';
    default:return '#9ca3af';
  }
};

/* CRT scanline overlay */
const CRTOverlay = () =>
<div data-ev-id="ev_ff94b930f1" className="absolute inset-0 pointer-events-none z-30 rounded-lg overflow-hidden">
    {/* Scanlines */}
    <div data-ev-id="ev_130ccbcdf7"
  className="absolute inset-0 opacity-[0.04]"
  style={{
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)',
    backgroundSize: '100% 2px'
  }} />

    {/* Vignette */}
    <div data-ev-id="ev_c8efc4bc96"
  className="absolute inset-0 opacity-40"
  style={{
    background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.8) 100%)'
  }} />

    {/* Screen curvature highlight */}
    <div data-ev-id="ev_44a8f46485"
  className="absolute inset-0 opacity-[0.03]"
  style={{
    background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)'
  }} />

  </div>;


/* Pixel star decoration */
const PixelStars = () => {
  const stars = Array.from({ length: 20 }, (_, i) => ({
    x: (i * 37 + 13) % 100,
    y: (i * 53 + 7) % 100,
    size: 1 + i % 3,
    delay: i * 0.3
  }));

  return (
    <div data-ev-id="ev_ec6d817693" className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((s, i) =>
      <div data-ev-id="ev_f0a9d64dc4"
      key={i}
      className="absolute rounded-sm animate-pulse"
      style={{
        left: `${s.x}%`,
        top: `${s.y}%`,
        width: s.size,
        height: s.size,
        backgroundColor: 'rgba(255,255,255,0.15)',
        animationDelay: `${s.delay}s`,
        animationDuration: `${2 + i % 3}s`
      }} />

      )}
    </div>);

};

/* ══════════════════════════════════════════════
 *  Arcade View — Retro Arcade Machine
 * ══════════════════════════════════════════════ */
export const ArcadeView = ({ sections, visible }: ArcadeViewProps) => {
  const [revealed, setRevealed] = useState(false);
  const [activeLevel, setActiveLevel] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [coins, setCoins] = useState(0);
  const [showInsertCoin, setShowInsertCoin] = useState(true);
  const [highScoreFlash, setHighScoreFlash] = useState(false);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setRevealed(true), 300);
      return () => clearTimeout(t);
    }
  }, [visible]);

  // Insert coin animation
  useEffect(() => {
    if (!revealed) return;
    const t = setTimeout(() => {
      setShowInsertCoin(false);
      setCoins(99);
    }, 1500);
    return () => clearTimeout(t);
  }, [revealed]);

  // High score flash
  useEffect(() => {
    const t = setInterval(() => setHighScoreFlash((p) => !p), 800);
    return () => clearInterval(t);
  }, []);

  const totalScore = sections.reduce((a, s) => a + s.links.reduce((b, l) => b + fakeScore(l.id), 0), 0);
  const activeSection = sections[activeLevel];

  return (
    <div data-ev-id="ev_a8f2a342ee"
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      {/* Arcade cabinet frame */}
      <div data-ev-id="ev_33957f6c4b" className="mx-auto max-w-3xl">
        {/* Cabinet top */}
        <div data-ev-id="ev_6a5167f02c"
        className="text-center py-2 rounded-t-2xl border-x border-t"
        style={{
          background: 'linear-gradient(180deg, #2d1b4e 0%, #1a0f30 100%)',
          borderColor: '#4a2d7a'
        }}>

          <div data-ev-id="ev_c4129685b7" className="flex items-center justify-center gap-2">
            <Gamepad2 className="w-4 h-4 text-yellow-400" />
            <span data-ev-id="ev_0ba0eb6331"
            className="text-lg font-black tracking-wider"
            style={{
              color: '#fbbf24',
              textShadow: '0 0 10px rgba(251,191,36,0.5), 0 0 20px rgba(251,191,36,0.2)',
              fontFamily: 'monospace'
            }}>

              nVISION ARCADE
            </span>
            <Gamepad2 className="w-4 h-4 text-yellow-400" />
          </div>
        </div>

        {/* Screen area */}
        <div data-ev-id="ev_0b9af80e02"
        className="relative border-x overflow-hidden"
        style={{
          background: '#0a0a12',
          borderColor: '#4a2d7a'
        }}>

          <CRTOverlay />
          <PixelStars />

          {/* Insert coin overlay */}
          {showInsertCoin &&
          <div data-ev-id="ev_e0b5cdb900" className="absolute inset-0 z-40 flex items-center justify-center bg-black/80">
              <div data-ev-id="ev_a6b7c2bd2e" className="text-center">
                <div data-ev-id="ev_74895f7818"
              className="text-2xl font-black font-mono animate-pulse"
              style={{ color: '#fbbf24', textShadow: '0 0 15px rgba(251,191,36,0.6)' }}>

                  INSERT COIN
                </div>
                <div data-ev-id="ev_f41c81930e" className="text-white/30 text-xs font-mono mt-2">PRESS START</div>
              </div>
            </div>
          }

          {/* HUD top bar */}
          <div data-ev-id="ev_f45617231e" className="relative z-10 flex items-center justify-between px-4 py-2 border-b border-purple-500/10">
            <div data-ev-id="ev_d3df35d50f" className="flex items-center gap-3">
              <div data-ev-id="ev_5bfd913fbf" className="flex items-center gap-1">
                <span data-ev-id="ev_79771eb66a" className="text-yellow-400 text-[10px] font-mono font-bold">COINS:</span>
                <span data-ev-id="ev_0d4182f782" className="text-yellow-300 text-xs font-mono font-black">{coins}</span>
              </div>
              <div data-ev-id="ev_7529a2d187" className="flex items-center gap-1">
                <Trophy className="w-3 h-3 text-yellow-500" />
                <span data-ev-id="ev_58fe810d2e" className={`text-xs font-mono font-black ${highScoreFlash ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  {totalScore.toLocaleString()}
                </span>
              </div>
            </div>
            <div data-ev-id="ev_7e86d3a1ca" className="text-[10px] font-mono text-purple-400/50">
              LEVEL {activeLevel + 1}/{sections.length}
            </div>
          </div>

          {/* Level selector */}
          <div data-ev-id="ev_2f320e4067" className="relative z-10 flex items-center gap-1.5 px-4 py-2 border-b border-purple-500/[0.06] overflow-x-auto scrollbar-hide">
            {sections.map((section, sIdx) =>
            <button data-ev-id="ev_e909c15520"
            key={section.id}
            onClick={() => setActiveLevel(sIdx)}
            className={`px-3 py-1.5 rounded text-[11px] font-mono font-bold transition-all flex-shrink-0 flex items-center gap-1.5 ${
            activeLevel === sIdx ?
            'text-black scale-105' :
            'text-white/30 hover:text-white/60 border border-white/[0.06]'}`
            }
            style={{
              backgroundColor: activeLevel === sIdx ? LEVEL_COLORS[sIdx % LEVEL_COLORS.length] : 'transparent',
              boxShadow: activeLevel === sIdx ? `0 0 15px ${LEVEL_COLORS[sIdx % LEVEL_COLORS.length]}40` : undefined
            }}>

                <Star className="w-3 h-3" />
                LEVEL {sIdx + 1}
              </button>
            )}
          </div>

          {/* Level header */}
          {activeSection &&
          <div data-ev-id="ev_20bdeffe65" className="relative z-10 px-4 pt-3 pb-2">
              <div data-ev-id="ev_5f9999e100" className="flex items-center gap-2">
                <span data-ev-id="ev_ad1e0a5831" className="text-lg">{activeSection.emoji}</span>
                <h2 data-ev-id="ev_68761eff5d"
              className="font-black font-mono text-lg"
              style={{
                color: LEVEL_COLORS[activeLevel % LEVEL_COLORS.length],
                textShadow: `0 0 10px ${LEVEL_COLORS[activeLevel % LEVEL_COLORS.length]}40`
              }}>

                  {activeSection.title}
                </h2>
                <div data-ev-id="ev_ad5dca34a7" className="flex-1" />
                <span data-ev-id="ev_a53dbd0461" className="text-white/20 text-[10px] font-mono">
                  {activeSection.links.length} ITEMS
                </span>
              </div>
            </div>
          }

          {/* Items grid */}
          <div data-ev-id="ev_80d7d11dfc" className="relative z-10 px-4 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {activeSection?.links.map((link, lIdx) => {
              const score = fakeScore(link.id);
              const rank = fakeRank(link.id);
              const isSelected = selectedItem === link.id;
              const color = LEVEL_COLORS[activeLevel % LEVEL_COLORS.length];

              return (
                <div data-ev-id="ev_4dc0f5230e"
                key={link.id}
                className={`relative rounded-lg border transition-all duration-200 cursor-pointer group ${
                isSelected ? 'scale-[1.03]' : 'hover:scale-[1.02]'}`
                }
                style={{
                  borderColor: isSelected ? color + '60' : 'rgba(255,255,255,0.05)',
                  background: isSelected ?
                  `linear-gradient(135deg, ${color}12 0%, rgba(10,10,18,0.95) 100%)` :
                  'rgba(255,255,255,0.02)',
                  boxShadow: isSelected ? `0 0 20px ${color}15, inset 0 0 20px ${color}05` : undefined
                }}
                onClick={() => setSelectedItem(isSelected ? null : link.id)}>

                  {/* Rank badge */}
                  <div data-ev-id="ev_db9a2202db"
                  className="absolute top-1.5 left-1.5 w-5 h-5 rounded flex items-center justify-center text-[9px] font-black font-mono"
                  style={{ backgroundColor: rankColor(rank) + '25', color: rankColor(rank) }}>

                    {rank}
                  </div>

                  <div data-ev-id="ev_2896f8cd62" className="p-3 pt-4">
                    {/* Icon */}
                    <div data-ev-id="ev_2fa2c09e83" className="flex justify-center mb-2">
                      <div data-ev-id="ev_087e132565"
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ background: link.color + '15' }}>

                        <AnimatedIcon icon={link.icon} animation={link.animation} color={link.color} size={24} />
                      </div>
                    </div>

                    {/* Name */}
                    <h3 data-ev-id="ev_d7e022094a" className="text-white/80 text-[11px] font-mono font-bold text-center truncate mb-0.5">
                      {link.title}
                    </h3>
                    <p data-ev-id="ev_5033dd9a58" className="text-white/25 text-[9px] font-mono text-center truncate mb-2">
                      {link.subtitle}
                    </p>

                    {/* Score bar */}
                    <div data-ev-id="ev_244fd59407" className="flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-yellow-500/60" />
                      <div data-ev-id="ev_b1600cb57d" className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div data-ev-id="ev_d56021d4df"
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(score / 100000 * 100, 100)}%`,
                          background: `linear-gradient(90deg, ${color}, ${color}80)`,
                          boxShadow: `0 0 6px ${color}40`
                        }} />

                      </div>
                      <span data-ev-id="ev_c3097c1f60" className="text-[8px] font-mono text-white/30 w-10 text-right">
                        {score.toLocaleString()}
                      </span>
                    </div>

                    {/* Tag */}
                    {link.tag &&
                    <div data-ev-id="ev_08a090f3d1" className="mt-1.5 text-center">
                        <span data-ev-id="ev_9ef50f805b"
                      className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded"
                      style={{
                        color: link.tag === 'free' ? '#22c55e' : link.tag === 'deal' ? '#f59e0b' : '#60a5fa',
                        background: link.tag === 'free' ? '#22c55e15' : link.tag === 'deal' ? '#f59e0b15' : '#60a5fa15'
                      }}>

                          {link.tag === 'free' ? '★ FREE' : link.tag === 'deal' ? '⚡ DEAL' : '◆ FREEMIUM'}
                        </span>
                      </div>
                    }
                  </div>

                  {/* Expanded: description + play button */}
                  {isSelected &&
                  <div data-ev-id="ev_11f95cae5a" className="px-3 pb-3 border-t border-white/[0.04] pt-2">
                      <p data-ev-id="ev_fda6ad13fd" className="text-white/40 text-[9px] font-mono leading-relaxed mb-2 line-clamp-2">
                        {link.description || link.subtitle}
                      </p>
                      <a data-ev-id="ev_afe2f1cad3"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.title} (נפתח בחלון חדש)`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded text-[10px] font-mono font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    style={{
                      backgroundColor: color + '25',
                      color: color
                    }}>

                        <ChevronRight className="w-3 h-3" />
                        PLAY NOW
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  }
                </div>);

            })}
          </div>

          {/* High score table */}
          <div data-ev-id="ev_c3385a3489" className="relative z-10 mx-4 mb-4 rounded-lg border border-yellow-500/10 overflow-hidden" style={{ background: 'rgba(251,191,36,0.02)' }}>
            <div data-ev-id="ev_daf87893d8" className="px-3 py-1.5 border-b border-yellow-500/10 flex items-center gap-2">
              <Trophy className="w-3 h-3 text-yellow-500" />
              <span data-ev-id="ev_c7599e308b" className="text-yellow-400/60 text-[10px] font-mono font-bold tracking-wider">HIGH SCORES</span>
            </div>
            <div data-ev-id="ev_30e1bd9002" className="divide-y divide-yellow-500/[0.04]">
              {sections.flatMap((s) => s.links).
              sort((a, b) => fakeScore(b.id) - fakeScore(a.id)).
              slice(0, 5).
              map((link, i) =>
              <div data-ev-id="ev_c58f943b73" key={link.id} className="flex items-center gap-2 px-3 py-1.5">
                    <span data-ev-id="ev_a4247cd085" className={`text-[10px] font-mono font-black w-4 text-center ${
                i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-white/20'}`
                }>
                      {i + 1}
                    </span>
                    <AnimatedIcon icon={link.icon} animation={link.animation} color={link.color} size={12} />
                    <span data-ev-id="ev_ef14460ba6" className="text-white/50 text-[10px] font-mono flex-1 truncate">{link.title}</span>
                    <span data-ev-id="ev_fe7a81f417" className="text-[9px] font-mono font-bold" style={{ color: rankColor(fakeRank(link.id)) }}>
                      {fakeRank(link.id)}
                    </span>
                    <span data-ev-id="ev_fb977c6fc3" className="text-yellow-400/50 text-[10px] font-mono font-bold w-16 text-right">
                      {fakeScore(link.id).toLocaleString()}
                    </span>
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Cabinet bottom — controls area */}
        <div data-ev-id="ev_6317e51196"
        className="rounded-b-2xl border-x border-b px-4 py-3"
        style={{
          background: 'linear-gradient(180deg, #1a0f30 0%, #2d1b4e 100%)',
          borderColor: '#4a2d7a'
        }}>

          <div data-ev-id="ev_10aaec6e3c" className="flex items-center justify-between">
            {/* Joystick decoration */}
            <div data-ev-id="ev_c71fbb973a" className="flex items-center gap-3">
              <div data-ev-id="ev_d21740a545" className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center">
                <div data-ev-id="ev_2827eb7142" className="w-3 h-3 rounded-full bg-gray-500" />
              </div>
              <div data-ev-id="ev_f2c39af1df" className="flex gap-1.5">
                {['#ef4444', '#3b82f6', '#22c55e', '#fbbf24'].map((c, i) =>
                <div data-ev-id="ev_32b71ff7b5" key={i} className="w-5 h-5 rounded-full" style={{ backgroundColor: c, boxShadow: `0 2px 4px ${c}40` }} />
                )}
              </div>
            </div>
            <span data-ev-id="ev_4eff9f5805" className="text-purple-400/30 text-[9px] font-mono">
              nVision Arcade © {new Date().getFullYear()} • {sections.reduce((a, s) => a + s.links.length, 0)} games
            </span>
          </div>
        </div>
      </div>
    </div>);

};

export default ArcadeView;