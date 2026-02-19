import { useState, useEffect, useCallback } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink, Eye, EyeOff, Lock, Unlock, FileText, Stamp, AlertTriangle, Shield } from 'lucide-react';

interface ClassifiedViewProps {
  sections: LinkSection[];
  visible: boolean;
}

const CLEARANCE_LEVELS = ['TOP SECRET', 'SECRET', 'CONFIDENTIAL', 'RESTRICTED', 'CLASSIFIED', 'EYES ONLY'];
const CLEARANCE_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];
const STAMP_ROTATIONS = [-6, 4, -3, 7, -5, 2];

/* Generate a fake case number from link id */
const caseNumber = (id: string) => {
  const h = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return `NV-${h * 17 % 9000 + 1000}-${String.fromCharCode(65 + h % 26)}${String.fromCharCode(65 + h * 3 % 26)}`;
};

/* Fake redacted text: replace some words with black bars */
const redactText = (text: string, level: number): {text: string;redacted: boolean;}[] => {
  const words = text.split(' ');
  const seed = text.length + level;
  return words.map((word, i) => {
    const shouldRedact = (seed + i * 7) % 5 < level;
    return { text: word, redacted: shouldRedact };
  });
};

/* ══════════════════════════════════════════════
 *  Classified / Secret Agent View
 * ══════════════════════════════════════════════ */
export const ClassifiedView = ({ sections, visible }: ClassifiedViewProps) => {
  const [revealed, setRevealed] = useState(false);
  const [declassifiedAll, setDeclassifiedAll] = useState(false);
  const [declassifiedFiles, setDeclassifiedFiles] = useState<Set<string>>(new Set());
  const [activeFolder, setActiveFolder] = useState<number | null>(null);
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setRevealed(true), 300);
      return () => clearTimeout(t);
    }
  }, [visible]);

  // Scan line animation
  useEffect(() => {
    if (!revealed) return;
    const t = setInterval(() => setScanLine((p) => (p + 1) % 100), 50);
    return () => clearInterval(t);
  }, [revealed]);

  const toggleDeclassify = useCallback((id: string) => {
    setDeclassifiedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);else next.add(id);
      return next;
    });
  }, []);

  const isFileVisible = (id: string) => declassifiedAll || declassifiedFiles.has(id);

  const totalFiles = sections.reduce((a, s) => a + s.links.length, 0);
  const declassifiedCount = declassifiedAll ? totalFiles : declassifiedFiles.size;

  const displaySections = activeFolder !== null ? [sections[activeFolder]] : sections;

  return (
    <div data-ev-id="ev_b68c557d98"
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      <div data-ev-id="ev_8c590f67ab"
      className="mx-auto max-w-4xl rounded-xl overflow-hidden border border-amber-900/20 relative"
      style={{
        background: 'linear-gradient(180deg, #1c1a15 0%, #17150f 50%, #12100c 100%)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,200,100,0.03)'
      }}>

        {/* Scan line effect */}
        <div data-ev-id="ev_486a496c71"
        className="absolute left-0 right-0 h-px pointer-events-none z-50 opacity-10"
        style={{
          top: `${scanLine}%`,
          background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.5), transparent)'
        }} />


        {/* Paper texture overlay */}
        <div data-ev-id="ev_4f4f9f7a52" className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4a574' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 5V4zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />


        {/* ─── Header ─── */}
        <div data-ev-id="ev_d5f4c0f748" className="relative px-4 py-3 border-b border-amber-900/15">
          <div data-ev-id="ev_4d2240ed8b" className="flex items-center justify-between">
            <div data-ev-id="ev_49e47abbf8" className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-red-500" />
              <span data-ev-id="ev_c93bdbf603" className="text-red-400/80 text-xs font-mono font-bold tracking-[0.25em]">
                nVISION INTELLIGENCE AGENCY
              </span>
            </div>
            <div data-ev-id="ev_ce1ca068da" className="flex items-center gap-3">
              <span data-ev-id="ev_d0b8adbfcd" className="text-amber-600/40 text-[10px] font-mono">
                FILES: {totalFiles} | DECLASSIFIED: {declassifiedCount}
              </span>
              <button data-ev-id="ev_8152021884"
              onClick={() => setDeclassifiedAll(!declassifiedAll)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-mono font-bold transition-all ${
              declassifiedAll ?
              'bg-green-500/20 text-green-400 border border-green-500/30' :
              'bg-red-500/10 text-red-400/70 border border-red-500/20 hover:bg-red-500/20'}`
              }>

                {declassifiedAll ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                {declassifiedAll ? 'DECLASSIFIED' : 'DECLASSIFY ALL'}
              </button>
            </div>
          </div>
          {/* Warning strip */}
          <div data-ev-id="ev_14e5a527eb" className="mt-2 flex items-center gap-2 px-2 py-1 rounded bg-red-500/[0.06] border border-red-500/10">
            <AlertTriangle className="w-3 h-3 text-red-500/60 flex-shrink-0" />
            <span data-ev-id="ev_928f9bef63" className="text-red-400/50 text-[9px] font-mono">
              WARNING: Unauthorized access to classified materials is a federal offense. All access is logged and monitored.
            </span>
          </div>
        </div>

        {/* ─── Folder tabs ─── */}
        <div data-ev-id="ev_659c88a7eb" className="flex items-center gap-1.5 px-4 py-2 border-b border-amber-900/10 overflow-x-auto scrollbar-hide">
          <button data-ev-id="ev_6319c14aca"
          onClick={() => setActiveFolder(null)}
          className={`px-3 py-1.5 rounded text-[11px] font-mono transition-colors flex-shrink-0 ${
          activeFolder === null ?
          'bg-amber-700/20 text-amber-300 border border-amber-600/30' :
          'text-amber-600/40 hover:text-amber-500/60 border border-transparent'}`
          }>

            🗂️ ALL FILES
          </button>
          {sections.map((section, sIdx) =>
          <button data-ev-id="ev_cff6ba2f50"
          key={section.id}
          onClick={() => setActiveFolder(activeFolder === sIdx ? null : sIdx)}
          className={`px-3 py-1.5 rounded text-[11px] font-mono transition-colors flex-shrink-0 flex items-center gap-1.5 ${
          activeFolder === sIdx ?
          'text-white/90 border' :
          'text-amber-600/40 hover:text-amber-500/60 border border-transparent'}`
          }
          style={{
            borderColor: activeFolder === sIdx ? CLEARANCE_COLORS[sIdx % CLEARANCE_COLORS.length] + '50' : undefined,
            backgroundColor: activeFolder === sIdx ? CLEARANCE_COLORS[sIdx % CLEARANCE_COLORS.length] + '10' : undefined
          }}>

              📁 {section.title}
              <span data-ev-id="ev_2c1d809910" className="text-[9px] opacity-50">[{section.links.length}]</span>
            </button>
          )}
        </div>

        {/* ─── Files ─── */}
        <div data-ev-id="ev_6f349fe9a4" className="p-4 space-y-4">
          {displaySections.map((section, _dsIdx) => {
            const sIdx = activeFolder !== null ? activeFolder : sections.indexOf(section);
            const clearance = CLEARANCE_LEVELS[sIdx % CLEARANCE_LEVELS.length];
            const clearanceColor = CLEARANCE_COLORS[sIdx % CLEARANCE_COLORS.length];
            const stampRot = STAMP_ROTATIONS[sIdx % STAMP_ROTATIONS.length];

            return (
              <div data-ev-id="ev_379673d7d9" key={section.id}>
                {/* Section header — folder label */}
                <div data-ev-id="ev_b5981e0228" className="flex items-center gap-2 mb-3">
                  <div data-ev-id="ev_24f41d27ad" className="w-6 h-px bg-amber-600/20" />
                  <span data-ev-id="ev_4afef0d1ea" className="text-amber-500/50 text-[11px] font-mono font-bold tracking-widest">
                    {section.emoji} {section.title.toUpperCase()}
                  </span>
                  <span data-ev-id="ev_b5191d3e96"
                  className="text-[9px] font-mono font-black px-2 py-0.5 rounded border tracking-wider"
                  style={{
                    color: clearanceColor,
                    borderColor: clearanceColor + '40',
                    background: clearanceColor + '10'
                  }}>

                    {clearance}
                  </span>
                  <div data-ev-id="ev_bb7e95632e" className="flex-1 h-px bg-amber-600/10" />
                </div>

                {/* File cards */}
                <div data-ev-id="ev_d115a15bcb" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {section.links.map((link, lIdx) => {
                    const isOpen = isFileVisible(link.id);
                    const redactionLevel = isOpen ? 0 : 2;
                    const words = redactText(link.description || link.subtitle, redactionLevel);

                    return (
                      <div data-ev-id="ev_576f2e7868"
                      key={link.id}
                      className="relative rounded-lg overflow-hidden border transition-all duration-500 group"
                      style={{
                        borderColor: isOpen ? 'rgba(34,197,94,0.15)' : 'rgba(120,90,50,0.12)',
                        background: isOpen ?
                        'linear-gradient(135deg, rgba(34,197,94,0.03) 0%, rgba(20,18,12,0.98) 100%)' :
                        'linear-gradient(135deg, rgba(30,26,18,0.98) 0%, rgba(20,18,12,0.99) 100%)'
                      }}>

                        {/* Stamp overlay */}
                        {!isOpen &&
                        <div data-ev-id="ev_451a8473b0"
                        className="absolute top-3 right-3 pointer-events-none z-10 select-none"
                        style={{ transform: `rotate(${stampRot + lIdx * 2}deg)` }}>

                            <span data-ev-id="ev_494c941c7b"
                          className="text-sm font-black font-mono tracking-wider px-2 py-0.5 border-2 rounded opacity-30"
                          style={{ color: clearanceColor, borderColor: clearanceColor }}>

                              {clearance}
                            </span>
                          </div>
                        }

                        {/* Paperclip decoration */}
                        <div data-ev-id="ev_7011812d31" className="absolute -top-1 left-6 w-3 h-6 rounded-b border-x border-b opacity-10" style={{ borderColor: 'rgba(200,170,100,0.5)' }} />

                        <div data-ev-id="ev_5350772b90" className="p-3.5">
                          {/* Top line: case number + status */}
                          <div data-ev-id="ev_a416548f6b" className="flex items-center justify-between mb-2">
                            <span data-ev-id="ev_9680dfee14" className="text-amber-600/30 text-[9px] font-mono">
                              CASE: {caseNumber(link.id)}
                            </span>
                            <button data-ev-id="ev_c98e5648b1"
                            onClick={() => toggleDeclassify(link.id)}
                            className={`flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded transition-colors ${
                            isOpen ?
                            'text-green-400/70 bg-green-500/10 hover:bg-green-500/20' :
                            'text-red-400/50 bg-red-500/[0.06] hover:bg-red-500/10'}`
                            }>

                              {isOpen ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                              {isOpen ? 'OPEN' : 'CLASSIFIED'}
                            </button>
                          </div>

                          {/* Subject line */}
                          <div data-ev-id="ev_fc945d2dd8" className="flex items-center gap-2 mb-2">
                            <AnimatedIcon icon={link.icon} animation={link.animation} color={isOpen ? link.color : '#6b5c42'} size={16} />
                            <div data-ev-id="ev_5f5b38c467" className="flex-1 min-w-0">
                              <div data-ev-id="ev_2a6c968860" className={`text-[13px] font-mono font-bold truncate transition-colors ${
                              isOpen ? 'text-white/80' : 'text-amber-200/40'}`
                              }>
                                {isOpen ? link.title :
                                <span data-ev-id="ev_82d03f8341">
                                    {link.title.split('').map((c, ci) =>
                                  <span data-ev-id="ev_5fea796128" key={ci} className={(ci * 3 + lIdx) % 4 === 0 && c !== ' ' ? 'bg-amber-200/20 text-transparent rounded-sm px-px' : ''}>
                                        {c}
                                      </span>
                                  )}
                                  </span>
                                }
                              </div>
                              <div data-ev-id="ev_4552cff316" className="text-amber-600/25 text-[9px] font-mono truncate">
                                SUBJECT: {link.subtitle}
                              </div>
                            </div>
                          </div>

                          {/* Body — redacted or revealed */}
                          <div data-ev-id="ev_580b19936f" className="text-[10px] font-mono leading-relaxed mb-2.5 min-h-[32px]">
                            {words.map((w, wi) =>
                            <span data-ev-id="ev_73d142af82" key={wi}>
                                {w.redacted ?
                              <span data-ev-id="ev_c7c490cea8"
                              className="inline-block bg-amber-200/15 rounded-sm px-1 mx-0.5 text-transparent select-none"
                              style={{ minWidth: w.text.length * 5 }}>

                                    {w.text}
                                  </span> :

                              <span data-ev-id="ev_f9623f4b27" className={isOpen ? 'text-white/50' : 'text-amber-500/30'}>
                                    {w.text}{' '}
                                  </span>
                              }
                              </span>
                            )}
                          </div>

                          {/* Footer: tag + link */}
                          <div data-ev-id="ev_348e80665e" className="flex items-center justify-between">
                            <div data-ev-id="ev_ed0fff4fcf" className="flex items-center gap-2">
                              <FileText className="w-3 h-3 text-amber-600/20" />
                              {link.tag &&
                              <span data-ev-id="ev_caed557cfe" className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ color: link.color, background: link.color + '15' }}>
                                  {link.tag === 'free' ? 'חינם' : link.tag === 'freemium' ? 'Freemium' : 'מבצע'}
                                </span>
                              }
                            </div>
                            {isOpen &&
                            <a data-ev-id="ev_d35f27757c"
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${link.title} (נפתח בחלון חדש)`}
                            className="flex items-center gap-1 text-[9px] font-mono text-green-400/60 hover:text-green-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">

                                <ExternalLink className="w-2.5 h-2.5" />
                                ACCESS FILE
                              </a>
                            }
                          </div>
                        </div>

                        {/* Coffee stain decoration (random placement) */}
                        {lIdx % 3 === 1 &&
                        <div data-ev-id="ev_86b8c846f6"
                        className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full opacity-[0.025] pointer-events-none"
                        style={{ background: `radial-gradient(circle, #8b6914 0%, transparent 70%)` }} />

                        }
                      </div>);

                  })}
                </div>
              </div>);

          })}
        </div>

        {/* ─── Footer ─── */}
        <div data-ev-id="ev_8fe20bc43b" className="px-4 py-2 border-t border-amber-900/10 flex items-center justify-between text-[9px] font-mono text-amber-600/25">
          <span data-ev-id="ev_28c7f69417" className="flex items-center gap-1.5">
            <Lock className="w-2.5 h-2.5" />
            SECURE CHANNEL — ENCRYPTION: AES-256
          </span>
          <span data-ev-id="ev_c996ce2f68">{totalFiles} files in archive</span>
          <span data-ev-id="ev_33cad56c14">nVision Intelligence v2.0</span>
        </div>
      </div>
    </div>);

};

export default ClassifiedView;