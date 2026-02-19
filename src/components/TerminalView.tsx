import React, { useState, useEffect, useRef } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';

interface TerminalViewProps {
  sections: LinkSection[];
  visible: boolean;
}

/* Terminal-style color palette per section */
const TERM_PALETTE = [
{ rgb: '6,182,212', hex30: 'rgba(6,182,212,0.3)', hex70: 'rgba(6,182,212,0.7)', hex06: 'rgba(6,182,212,0.06)', hex15: 'rgba(6,182,212,0.15)' },
{ rgb: '139,92,246', hex30: 'rgba(139,92,246,0.3)', hex70: 'rgba(139,92,246,0.7)', hex06: 'rgba(139,92,246,0.06)', hex15: 'rgba(139,92,246,0.15)' },
{ rgb: '245,158,11', hex30: 'rgba(245,158,11,0.3)', hex70: 'rgba(245,158,11,0.7)', hex06: 'rgba(245,158,11,0.06)', hex15: 'rgba(245,158,11,0.15)' },
{ rgb: '236,72,153', hex30: 'rgba(236,72,153,0.3)', hex70: 'rgba(236,72,153,0.7)', hex06: 'rgba(236,72,153,0.06)', hex15: 'rgba(236,72,153,0.15)' },
{ rgb: '16,185,129', hex30: 'rgba(16,185,129,0.3)', hex70: 'rgba(16,185,129,0.7)', hex06: 'rgba(16,185,129,0.06)', hex15: 'rgba(16,185,129,0.15)' },
{ rgb: '239,68,68', hex30: 'rgba(239,68,68,0.3)', hex70: 'rgba(239,68,68,0.7)', hex06: 'rgba(239,68,68,0.06)', hex15: 'rgba(239,68,68,0.15)' }] as
const;

type TermPalette = typeof TERM_PALETTE[number];

/* ════ AI Terminal View ════ */
export const TerminalView = ({
  sections,
  visible
}: TerminalViewProps) => {
  const allLinks = sections.flatMap((s) => s.links);

  // Build section offsets for indexing
  let _off = 0;
  const sectionMeta = sections.map((s, sIdx) => {
    const start = _off;
    _off += s.links.length;
    return { ...s, start, palette: TERM_PALETTE[sIdx % TERM_PALETTE.length] };
  });

  // Typing animation: reveal lines progressively
  const totalLines = allLinks.length + 6 + sections.length; // links + headers + ascii + footer
  const [revealed, setRevealed] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;
    setRevealed(0);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setRevealed(i);
      if (i >= totalLines) clearInterval(timer);
    }, 65);
    return () => clearInterval(timer);
  }, [visible, totalLines]);

  // Blinking cursor
  useEffect(() => {
    const t = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(t);
  }, []);

  // Auto-scroll as lines appear
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [revealed]);

  /* ── line counter for sequential reveal ── */
  let lineIdx = 0;
  const show = () => lineIdx++ < revealed;

  return (
    <div data-ev-id="ev_83cd059974"
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      {/* Terminal window */}
      <div data-ev-id="ev_e2921f3dfe"
      className="mx-auto max-w-lg rounded-xl overflow-hidden border border-white/[0.08]"
      style={{
        background: 'rgba(10,10,18,0.97)',
        boxShadow:
        '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(6,182,212,0.03)'
      }}>

        {/* Title bar */}
        <div data-ev-id="ev_2243b5c211" className="flex items-center px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.015]">
          <div data-ev-id="ev_23caa8ac6d" className="flex gap-1.5">
            <div data-ev-id="ev_ea0de6c13c" className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/70" />
            <div data-ev-id="ev_d43ab16d65" className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/70" />
            <div data-ev-id="ev_7d79c29dde" className="w-2.5 h-2.5 rounded-full bg-[#28c840]/70" />
          </div>
          <span data-ev-id="ev_e18b229110" className="flex-1 text-center text-[11px] text-white/25 font-mono">
            nVision@ai:~/community
          </span>
          <div data-ev-id="ev_9a0fe3b690" className="w-12" />
        </div>

        {/* Terminal content */}
        <div data-ev-id="ev_6519d2f756"
        ref={scrollRef}
        className="p-4 font-mono text-[12.5px] leading-[1.65] max-h-[480px] overflow-y-auto space-y-0"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.05) transparent' }}>

          {/* ASCII art header */}
          {show() &&
          <pre data-ev-id="ev_742faf565a" className="text-cyan-400/30 text-[9px] leading-tight mb-2 select-none" dir="ltr">
            {`  ███╗   ██╗██╗   ██╗██╗███████╗██╗ █████╗ ███╗   ██╗
  ████╗  ██║██║   ██║██║██╔════╝██║██╔══██╗████╗  ██║
  ██╔██╗ ██║██║   ██║██║███████╗██║██║  ██║██╔██╗ ██║
  ██║╚██╗██║╚██╗ ██╔╝██║╚════██║██║██║  ██║██║╚██╗██║
  ██║ ╚████║ ╚████╔╝ ██║███████║██║╚█████╔╝██║ ╚████║
  ╚═╝  ╚═══╝  ╚═══╝  ╚═╝╚══════╝╚═╝ ╚════╝ ╚═╝  ╚═══╝`}
            </pre>
          }

          {show() &&
          <div data-ev-id="ev_f70e9ead2a" className="text-white/20 text-[11px] mb-3">
              <span data-ev-id="ev_fdc70a55a3" className="text-cyan-400/50">$</span> neofetch
              <span data-ev-id="ev_6fba96efc6" className="text-white/10"> — </span>
              <span data-ev-id="ev_7932a349b3" className="text-purple-400/40">Community Hub v2.0</span>
              <span data-ev-id="ev_ed2b037b8c" className="text-white/10"> · </span>
              <span data-ev-id="ev_aa8a788912" className="text-white/15">
                {allLinks.length} links loaded
              </span>
            </div>
          }

          {/* Sections rendered dynamically */}
          {sectionMeta.map((sec) =>
          <React.Fragment key={sec.id}>
              {show() &&
            <div data-ev-id="ev_308601829e" className={`${sec.start > 0 ? 'mt-3' : 'mt-1'} mb-2`}>
                  <span data-ev-id="ev_f509b98788" style={{ color: sec.palette.hex30 }}>
                    {'# '}── {sec.emoji} {sec.title} {'─'.repeat(Math.max(2, 30 - sec.title.length))}
                  </span>
                </div>
            }

              {sec.links.map((link, i) =>
            <span data-ev-id="ev_6cdb0b1a97" key={link.id}>
                  {show() &&
              <TerminalLink
                link={link}
                palette={sec.palette}
                index={sec.start + i} />
              }
                </span>
            )}
            </React.Fragment>
          )}

          {/* Footer + cursor */}
          {show() &&
          <div data-ev-id="ev_1bbfcdc0dd" className="mt-3 text-white/10 text-[10px]">
              ────────────────────────────────────
            </div>
          }

          {/* Active cursor line */}
          <div data-ev-id="ev_7bc9c0f3fe" className="mt-1 flex items-center gap-1">
            <span data-ev-id="ev_b29856bc9e" className="text-green-400/50">$</span>
            <span data-ev-id="ev_681b125270"
            className="inline-block w-[7px] h-[14px] bg-green-400/60"
            style={{ opacity: cursorVisible ? 1 : 0 }} />

          </div>
        </div>
      </div>
    </div>);

};

/* ═════ Terminal Link Line ═════ */
const TerminalLink = ({
  link,
  palette,
  index
}: {link: LinkItem;palette: TermPalette;index: number;}) => {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isActive = hovered || expanded;

  return (
    <a data-ev-id="ev_9bd5f74b79"
    href={link.url}
    target="_blank" rel="noopener noreferrer"
    aria-label={`${link.title} — ${link.subtitle} (נפתח בחלון חדש)`}
    className="flex items-center gap-2 py-[5px] px-2 -mx-2 rounded-md transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    style={{
      backgroundColor: isActive ? palette.hex06 : 'transparent'
    }}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => {setHovered(false);setExpanded(false);}}
    onClick={(e: React.MouseEvent) => {if ('ontouchstart' in window && !expanded) {e.preventDefault();setExpanded(true);}}}
    onBlur={() => setExpanded(false)}>

      {/* Prompt symbol */}
      <span data-ev-id="ev_977b6fbd54"
      className="flex-shrink-0 text-xs transition-colors duration-200"
      style={{ color: isActive ? palette.hex70 : palette.hex30 }}>
        ❯
      </span>

      {/* Icon */}
      <div data-ev-id="ev_259f60f851"
      className="flex-shrink-0 w-5 h-5 flex items-center justify-center transition-all duration-200"
      style={{ opacity: isActive ? 1 : 0.5 }}>

        <AnimatedIcon
          icon={link.icon}
          animation={link.animation}
          color={link.color}
          isHovered={hovered} />

      </div>

      {/* Command name (title) */}
      <span data-ev-id="ev_c064c7d30f"
      className="flex-shrink-0 font-semibold transition-colors duration-200"
      style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.65)' }}>
        {link.title}
      </span>

      {/* Separator */}
      <span data-ev-id="ev_99358e9cf0" className="text-white/10 flex-shrink-0">—</span>

      {/* Description */}
      <span data-ev-id="ev_8b39276adf" className="text-white/25 truncate flex-1 text-xs">
        {link.subtitle}
      </span>

      {/* Run indicator on hover */}
      <span data-ev-id="ev_1b04ee74c2"
      className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded transition-all duration-200"
      style={{
        opacity: isActive ? 1 : 0,
        transform: isActive ? 'translateX(0)' : 'translateX(4px)',
        backgroundColor: palette.hex15,
        color: palette.hex70
      }}>
        RUN →
      </span>
    </a>);

};