import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import {
  ExternalLink, Play, RotateCcw, Copy, Check,
  Sparkles, Settings2, ChevronDown, Zap, MessageSquare,
  Thermometer, Hash, Clock, Bot } from
'lucide-react';

interface AIPlaygroundViewProps {
  sections: LinkSection[];
  visible: boolean;
}

const MODEL_COLORS = ['#10b981', '#8b5cf6', '#f59e0b', '#3b82f6', '#ec4899', '#06b6d4'];

/* Fake prompt/response text for each link */
const fakePrompt = (link: LinkItem) =>
`ספר לי על ${link.title} — מה זה, למה זה שימושי, ואיך להתחיל?`;

const fakeResponse = (link: LinkItem) =>
`${link.title} הוא ${link.subtitle}. ${link.description || `זהו כלי מעולה שעוזר למשתמשים להתקדם בתחום ה-AI. מומלץ לנסות את הקישור לפרטים נוספים.`} → ${link.url}`;

const fakeTokens = (id: string) => {
  const h = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return 120 + h % 400;
};

const fakeLatency = (id: string) => {
  const h = id.charCodeAt(0);
  return (0.3 + h % 20 / 10).toFixed(1);
};

/* ══════════════════════════════════════════════
 *  AI Playground View — OpenAI / Claude Console
 * ══════════════════════════════════════════════ */
export const AIPlaygroundView = ({ sections, visible }: AIPlaygroundViewProps) => {
  const [revealed, setRevealed] = useState(false);
  const [activeModel, setActiveModel] = useState(0);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(512);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [typingText, setTypingText] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(true);
  const typingTimer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setRevealed(true), 200);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const activeSection = sections[activeModel];

  const runCompletion = useCallback((link: LinkItem) => {
    if (runningId) return;
    setRunningId(link.id);
    setTypingText((prev) => ({ ...prev, [link.id]: '' }));

    const fullText = fakeResponse(link);
    let charIdx = 0;

    typingTimer.current = setInterval(() => {
      charIdx += 2;
      if (charIdx >= fullText.length) {
        clearInterval(typingTimer.current);
        setTypingText((prev) => ({ ...prev, [link.id]: fullText }));
        setCompletedIds((prev) => new Set([...prev, link.id]));
        setRunningId(null);
      } else {
        setTypingText((prev) => ({ ...prev, [link.id]: fullText.slice(0, charIdx) }));
      }
    }, 25);
  }, [runningId]);

  const runAll = useCallback(() => {
    if (!activeSection || runningId) return;
    // Auto-complete all sequentially
    const links = activeSection.links.filter((l) => !completedIds.has(l.id));
    if (links.length === 0) return;
    runCompletion(links[0]);
  }, [activeSection, runningId, completedIds, runCompletion]);

  const resetAll = useCallback(() => {
    clearInterval(typingTimer.current);
    setRunningId(null);
    setCompletedIds(new Set());
    setTypingText({});
  }, []);

  const handleCopy = useCallback((id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }, []);

  // Auto-run next after completion
  useEffect(() => {
    if (runningId || !activeSection) return;
    const pending = activeSection.links.filter((l) => !completedIds.has(l.id) && !typingText[l.id]);
    // Don't auto-chain
  }, [runningId, completedIds, activeSection, typingText]);

  const totalTokens = activeSection?.links.reduce((a, l) => a + (completedIds.has(l.id) ? fakeTokens(l.id) : 0), 0) || 0;

  return (
    <div data-ev-id="ev_d57d077980"
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      <div data-ev-id="ev_c0fd705338"
      className="mx-auto max-w-5xl rounded-xl overflow-hidden border border-white/[0.06]"
      style={{
        background: '#0a0a0f',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
      }}>

        <div data-ev-id="ev_60797f9935" className="flex flex-col sm:flex-row" style={{ minHeight: 520 }}>

          {/* ─── Sidebar ─── */}
          <div data-ev-id="ev_77f3dae98f" className="sm:w-56 border-b sm:border-b-0 sm:border-l border-white/[0.06] flex-shrink-0 flex flex-col" style={{ background: '#08080d' }}>
            {/* Logo */}
            <div data-ev-id="ev_9fbafbfbf3" className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span data-ev-id="ev_b641dd5c17" className="text-white/80 text-sm font-bold">nVision AI</span>
              <span data-ev-id="ev_c4e6b8f4b5" className="text-white/60 text-[9px] font-mono mr-auto">playground</span>
            </div>

            {/* Model selector */}
            <div data-ev-id="ev_93748b5973" className="px-3 py-2 border-b border-white/[0.04]">
              <span data-ev-id="ev_ea2ac51795" className="text-white/60 text-[9px] font-mono tracking-wider">מודל</span>
            </div>
            <div data-ev-id="ev_5021a6bd91" className="flex-1 overflow-y-auto scrollbar-hide">
              {sections.map((section, sIdx) => {
                const color = MODEL_COLORS[sIdx % MODEL_COLORS.length];
                return (
                  <button data-ev-id="ev_dec26cd5cf"
                  key={section.id}
                  onClick={() => {setActiveModel(sIdx);resetAll();}}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors text-right ${
                  activeModel === sIdx ?
                  'bg-white/[0.06]' :
                  'hover:bg-white/[0.03]'}`
                  }>

                    <div data-ev-id="ev_d75cf4b2f7"
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
                    style={{ background: color + '20' }}>

                      {section.emoji}
                    </div>
                    <div data-ev-id="ev_95f3406aae" className="flex-1 min-w-0">
                      <div data-ev-id="ev_431f23b524" className={`text-[11px] font-medium truncate ${
                      activeModel === sIdx ? 'text-white/80' : 'text-white/60'}`
                      }>
                        {section.title}
                      </div>
                      <div data-ev-id="ev_e847b205ec" className="text-white/60 text-[9px] font-mono">
                        {section.links.length} endpoints
                      </div>
                    </div>
                    {activeModel === sIdx &&
                    <div data-ev-id="ev_5e67ed0f79" className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                    }
                  </button>);

              })}
            </div>

            {/* Settings panel */}
            <div data-ev-id="ev_79ded46644" className="border-t border-white/[0.06]">
              <button data-ev-id="ev_efc97eef4d"
              onClick={() => setShowSettings(!showSettings)}
              className="w-full flex items-center gap-2 px-3 py-2 text-white/60 hover:text-white/70 transition-colors">

                <Settings2 className="w-3.5 h-3.5" />
                <span data-ev-id="ev_fdf9385e1e" className="text-[10px] font-mono">הגדרות</span>
                <ChevronDown className={`w-3 h-3 mr-auto transition-transform ${showSettings ? '' : '-rotate-90'}`} />
              </button>
              {showSettings &&
              <div data-ev-id="ev_c17a96938e" className="px-3 pb-3 space-y-3">
                  {/* Temperature */}
                  <div data-ev-id="ev_b3fba08cd6">
                    <div data-ev-id="ev_07ae8a63dd" className="flex items-center justify-between mb-1">
                      <span data-ev-id="ev_baef38c660" className="text-white/60 text-[9px] font-mono flex items-center gap-1">
                        <Thermometer className="w-3 h-3" /> Temperature
                      </span>
                      <span data-ev-id="ev_b527043511" className="text-white/60 text-[10px] font-mono font-bold">{temperature}</span>
                    </div>
                    <input data-ev-id="ev_7922ccf172"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-1 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to left, #10b981 ${temperature / 2 * 100}%, rgba(255,255,255,0.06) ${temperature / 2 * 100}%)` }} />

                  </div>
                  {/* Max tokens */}
                  <div data-ev-id="ev_d189c8b15e">
                    <div data-ev-id="ev_74a797d469" className="flex items-center justify-between mb-1">
                      <span data-ev-id="ev_4556e90661" className="text-white/60 text-[9px] font-mono flex items-center gap-1">
                        <Hash className="w-3 h-3" /> Max Tokens
                      </span>
                      <span data-ev-id="ev_e255ce3a96" className="text-white/60 text-[10px] font-mono font-bold">{maxTokens}</span>
                    </div>
                    <input data-ev-id="ev_7bf9f1742e"
                  type="range"
                  min="64"
                  max="4096"
                  step="64"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full h-1 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to left, #8b5cf6 ${maxTokens / 4096 * 100}%, rgba(255,255,255,0.06) ${maxTokens / 4096 * 100}%)` }} />

                  </div>
                </div>
              }
            </div>
          </div>

          {/* ─── Main area ─── */}
          <div data-ev-id="ev_f2d155bfad" className="flex-1 flex flex-col">
            {/* Top bar */}
            <div data-ev-id="ev_c28c95cfad" className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.06]">
              <div data-ev-id="ev_15e65c5005" className="flex items-center gap-2 flex-1">
                <Bot className="w-4 h-4 text-emerald-400" />
                <span data-ev-id="ev_6bed66619f" className="text-white/60 text-xs font-medium">{activeSection?.title}</span>
                <span data-ev-id="ev_c1a71f12e0" className="text-white/60 text-[9px] font-mono">• {activeSection?.links.length} completions</span>
              </div>
              <div data-ev-id="ev_9182e92922" className="flex items-center gap-2">
                <button data-ev-id="ev_84a520097a"
                onClick={resetAll}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono text-white/60 hover:text-white/60 hover:bg-white/[0.04] transition-colors">

                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
                <button data-ev-id="ev_317354f6d2"
                onClick={runAll}
                disabled={!!runningId}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-mono font-bold transition-colors bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-40 disabled:cursor-not-allowed">

                  <Play className="w-3 h-3 fill-emerald-400" />
                  Run
                </button>
              </div>
            </div>

            {/* Completion cards */}
            <div data-ev-id="ev_046103129d" className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3">
              {activeSection?.links.map((link) => {
                const isRunning = runningId === link.id;
                const isCompleted = completedIds.has(link.id);
                const currentText = typingText[link.id];
                const tokens = fakeTokens(link.id);
                const latency = fakeLatency(link.id);
                const color = MODEL_COLORS[activeModel % MODEL_COLORS.length];

                return (
                  <div data-ev-id="ev_613fbc6c5f"
                  key={link.id}
                  className="rounded-lg border overflow-hidden"
                  style={{
                    borderColor: isRunning ? color + '30' : 'rgba(255,255,255,0.04)',
                    background: 'rgba(255,255,255,0.015)'
                  }}>

                    {/* Prompt */}
                    <div data-ev-id="ev_6256219fb8" className="px-3.5 py-2.5 border-b border-white/[0.04] flex items-start gap-2.5">
                      <div data-ev-id="ev_4150c4646e" className="w-6 h-6 rounded-md bg-blue-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MessageSquare className="w-3 h-3 text-blue-400" />
                      </div>
                      <div data-ev-id="ev_4de439ffe3" className="flex-1 min-w-0">
                        <div data-ev-id="ev_4c8b4fce32" className="text-white/60 text-[9px] font-mono mb-0.5">PROMPT</div>
                        <p data-ev-id="ev_9ec3595b40" className="text-white/70 text-[12px] leading-relaxed" dir="rtl">
                          {fakePrompt(link)}
                        </p>
                      </div>
                      {/* Run single */}
                      {!isCompleted && !isRunning &&
                      <button data-ev-id="ev_7b507de7c1"
                      onClick={() => runCompletion(link)}
                      disabled={!!runningId}
                      className="flex-shrink-0 w-7 h-7 rounded-md bg-emerald-500/15 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/25 transition-colors disabled:opacity-30">

                          <Play className="w-3.5 h-3.5 fill-emerald-400" />
                        </button>
                      }
                    </div>

                    {/* Response */}
                    {(isRunning || isCompleted || currentText) &&
                    <div data-ev-id="ev_cccf81c12b" className="px-3.5 py-2.5">
                        <div data-ev-id="ev_58af7e4081" className="flex items-start gap-2.5">
                          <div data-ev-id="ev_a93e55202d"
                        className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: color + '15' }}>

                            <AnimatedIcon icon={link.icon} animation={link.animation} color={link.color} size={13} />
                          </div>
                          <div data-ev-id="ev_66b9b6df0d" className="flex-1 min-w-0">
                            <div data-ev-id="ev_a8dbaafb5e" className="flex items-center gap-2 mb-1">
                              <span data-ev-id="ev_85a987ee04" className="text-[9px] font-mono" style={{ color: color + '80' }}>COMPLETION</span>
                              {isRunning &&
                            <span data-ev-id="ev_255153d70f" className="flex items-center gap-1 text-[9px] font-mono" style={{ color }}>
                                  <span data-ev-id="ev_d9da684bc4" className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                                  generating...
                                </span>
                            }
                            </div>
                            <p data-ev-id="ev_4c3065b0ac" className="text-white/60 text-[12px] leading-relaxed" dir="rtl">
                              {currentText || ''}
                              {isRunning && <span data-ev-id="ev_5918e045c9" className="inline-block w-1.5 h-4 mr-0.5 animate-pulse" style={{ backgroundColor: color }} />}
                            </p>
                          </div>
                        </div>

                        {/* Meta bar */}
                        {isCompleted &&
                      <div data-ev-id="ev_b2bec25cb2" className="flex items-center gap-3 mt-2.5 pt-2 border-t border-white/[0.03]">
                            <span data-ev-id="ev_3572b0acee" className="text-[9px] font-mono text-white/60 flex items-center gap-1">
                              <Hash className="w-2.5 h-2.5" />
                              {tokens} tokens
                            </span>
                            <span data-ev-id="ev_5819c39deb" className="text-[9px] font-mono text-white/60 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {latency}s
                            </span>
                            <span data-ev-id="ev_d98707b82d" className="text-[9px] font-mono text-white/60 flex items-center gap-1">
                              <Thermometer className="w-2.5 h-2.5" />
                              t={temperature}
                            </span>
                            <div data-ev-id="ev_3727b82113" className="flex-1" />
                            <button data-ev-id="ev_7b47626579"
                        onClick={() => handleCopy(link.id, currentText || '')}
                        className="text-white/60 hover:text-white/70 transition-colors">

                              {copiedId === link.id ?
                          <Check className="w-3 h-3 text-emerald-400" /> :
                          <Copy className="w-3 h-3" />
                          }
                            </button>
                            <a data-ev-id="ev_6e9fe682ef"
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${link.title} (נפתח בחלון חדש)`}
                        className="text-white/60 hover:text-white/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">

                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                      }
                      </div>
                    }

                    {/* Idle state */}
                    {!isRunning && !isCompleted && !currentText &&
                    <div data-ev-id="ev_6ac897ccb3" className="px-3.5 py-3 flex items-center gap-2">
                        <div data-ev-id="ev_e693aba465" className="w-6 h-6 rounded-md bg-white/[0.03] flex items-center justify-center flex-shrink-0">
                          <AnimatedIcon icon={link.icon} animation={link.animation} color={link.color} size={13} />
                        </div>
                        <span data-ev-id="ev_c32fcf5477" className="text-white/60 text-[10px] font-mono">לחץ Run להרצת completion</span>
                        <div data-ev-id="ev_8682242344" className="flex-1" />
                        <a data-ev-id="ev_5786737eb4"
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${link.title} (נפתח בחלון חדש)`}
                      className="text-white/60 hover:text-white/70 transition-colors text-[9px] font-mono flex items-center gap-1">

                          <ExternalLink className="w-2.5 h-2.5" />
                          קישור
                        </a>
                      </div>
                    }
                  </div>);

              })}
            </div>

            {/* Bottom stats */}
            <div data-ev-id="ev_97aa3ebd2b" className="px-4 py-2 border-t border-white/[0.06] flex items-center gap-4 text-[9px] font-mono text-white/60">
              <span data-ev-id="ev_2a94e8f503" className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {totalTokens.toLocaleString()} tokens used
              </span>
              <span data-ev-id="ev_802f0b91ad">
                {completedIds.size}/{activeSection?.links.length || 0} completed
              </span>
              <div data-ev-id="ev_13dfdbe04a" className="flex-1" />
              <span data-ev-id="ev_0eaa197cbd">model: {activeSection?.title}</span>
              <span data-ev-id="ev_090dd92284">nVision Playground v1.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default AIPlaygroundView;