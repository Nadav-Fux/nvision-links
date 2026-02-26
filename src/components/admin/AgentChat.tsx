import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Send, X, Loader2, Sparkles, ChevronDown, Wrench, CheckCircle, AlertCircle, Trash2, Copy, Check } from 'lucide-react';
import { callAgent } from '@/lib/adminApi';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: {tool: string;args: Record<string, unknown>;result: {success: boolean;error?: string;};}[];
  timestamp: number;
  routing?: {tier: string;executionModel: string;};
}

const TOOL_LABELS: Record<string, string> = {
  list_sections: '📋 רשימת סקציות',
  create_section: '➕ יצירת סקציה',
  update_section: '✏️ עדכון סקציה',
  delete_section: '🗑️ מחיקת סקציה',
  list_links: '📋 רשימת קישורים',
  create_link: '➕ יצירת קישור',
  update_link: '✏️ עדכון קישור',
  delete_link: '🗑️ מחיקת קישור',
  get_site_config: '⚙️ קריאת הגדרות',
  update_site_config: '⚙️ עדכון הגדרות'
};

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
}

interface AgentChatProps {
  onActionPerformed?: () => void;
}

export const AgentChat = ({ onActionPerformed }: AgentChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Keyboard shortcut: Ctrl+K / Cmd+K to toggle chat, Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) {
            // Will focus on next render
            setTimeout(() => inputRef.current?.focus(), 50);
          }
          return !prev;
        });
      }
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const copyMessage = (id: string, content: string) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = content;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch {

      // silently fail
    }setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const clearChat = () => {
    setMessages([]);
    toast.success('ההיסטוריה נמחקה');
  };

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const result = await callAgent(history);

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.reply,
        actions: result.actions,
        timestamp: Date.now(),
        routing: result._routing ? { tier: result._routing.tier, executionModel: result._routing.executionModel } : undefined
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If write actions were performed, notify parent to refresh
      if (result.actions && result.actions.length > 0) {
        const hasWriteAction = result.actions.some(
          (a: { tool: string }) => !a.tool.startsWith('list_') && !a.tool.startsWith('get_')
        );
        if (hasWriteAction) {
          onActionPerformed?.();
          toast.success('הסוכן ביצע שינויים באתר');
        }
      }
    } catch (err: unknown) {
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `❗ שגיאה: ${err instanceof Error ? err.message : 'לא הצלחתי להתחבר לסוכן AI'}`,
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, onActionPerformed]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Floating button when closed
  if (!isOpen) {
    return (
      <button data-ev-id="ev_49872a8312"
      onClick={() => setIsOpen(true)}
      aria-label="פתח סוכן AI (Ctrl+K)"
      className="fixed bottom-6 left-6 z-50 group flex items-center gap-2 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-2xl shadow-primary/25 px-4 hover:px-5 hover:scale-105 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

        <Bot className="w-6 h-6 flex-shrink-0" />
        <span data-ev-id="ev_357695319f" className="text-xs font-medium opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200">
          Ctrl+K
        </span>
        <span data-ev-id="ev_c09fadf528" className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-[#0a0a14] animate-pulse" />
      </button>);

  }

  return (
    <div data-ev-id="ev_19a08c1a82"
    dir="rtl"
    className="fixed bottom-4 left-4 z-50 w-[380px] max-w-[calc(100vw-32px)] h-[560px] max-h-[calc(100vh-32px)] rounded-2xl overflow-hidden flex flex-col"
    style={{
      background: 'linear-gradient(160deg, #0f0f1e 0%, #0a0a14 100%)',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 25px 60px -12px rgba(0,0,0,0.7), 0 0 40px rgba(6,182,212,0.08)'
    }}
    role="dialog"
    aria-label="סוכן AI לניהול"
    aria-modal="true">

      {/* Header */}
      <div data-ev-id="ev_cf51ea4822" className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div data-ev-id="ev_377a5d7a3c" className="flex items-center gap-2.5">
          <div data-ev-id="ev_62b0a4387d" className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
          </div>
          <div data-ev-id="ev_fff67b5941">
            <h3 data-ev-id="ev_7900901b42" className="text-white/90 text-sm font-bold">סוכן ניהול AI</h3>
            <p data-ev-id="ev_3ae3a54357" className="text-white/60 text-[10px]">Smart Routing · מנתב אוטומטי לפי מורכבות</p>
          </div>
        </div>
        <div data-ev-id="ev_448bd3c4e7" className="flex items-center gap-1">
          {messages.length > 0 &&
          <button data-ev-id="ev_3426059a2e"
          onClick={clearChat}
          aria-label="נקה היסטוריה"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-red-400/60 hover:bg-white/[0.04] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

              <Trash2 className="w-3.5 h-3.5" />
            </button>
          }
          <button data-ev-id="ev_57df3964dc"
          onClick={() => setIsOpen(false)}
          aria-label="סגור צ'אט"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white/60 hover:bg-white/[0.06] transition-all">

            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div data-ev-id="ev_36531c32d7"
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
      style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.06) transparent' }}>

        {messages.length === 0 &&
        <div data-ev-id="ev_70671b7ece" className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div data-ev-id="ev_80339f95eb" className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <Bot className="w-8 h-8 text-primary/60" />
            </div>
            <div data-ev-id="ev_b42701cbc1">
              <p data-ev-id="ev_b4a1bd0c8c" className="text-white/60 text-sm font-medium">אהלן, אני הסוכן שלך</p>
              <p data-ev-id="ev_79db7e1696" className="text-white/60 text-xs mt-1 max-w-[240px]">
                אני יכול להוסיף קישורים, ליצור סקציות, לשנות הגדרות ולנהל את האתר
              </p>
            </div>
            <div data-ev-id="ev_3453fd6ba0" className="flex flex-wrap gap-1.5 justify-center mt-2">
              {[
            'הראה לי את כל הסקציות',
            'הוסף קישור ל-Gemini',
            'שנה תצוגת ברירת מחדל'].
            map((hint) =>
            <button data-ev-id="ev_278c345760"
            key={hint}
            onClick={() => {
              setInput(hint);
              inputRef.current?.focus();
            }}
            className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/60 text-[11px] hover:text-white/60 hover:bg-white/[0.08] transition-all">

                  {hint}
                </button>
            )}
            </div>
          </div>
        }

        {messages.map((msg) =>
        <div data-ev-id="ev_ade9161071" key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div data-ev-id="ev_ce91d0d948"
          className={`relative max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed group ${
          msg.role === 'user' ?
          'bg-primary/15 border border-primary/20 text-white/85 rounded-tr-md' :
          'bg-white/[0.05] border border-white/[0.06] text-white/75 rounded-tl-md'}`
          }>

              {/* Action pills */}
              {msg.actions && msg.actions.length > 0 &&
            <div data-ev-id="ev_f9c41abf4b" className="flex flex-wrap gap-1 mb-2">
                  {msg.actions.map((action, i) =>
              <span data-ev-id="ev_3dabb92f87"
              key={i}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${
              action.result.success ?
              'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25' :
              'bg-red-500/20 text-red-300 border border-red-500/30'}`
              }>

                      {action.result.success ?
                <CheckCircle className="w-3 h-3" /> :
                <AlertCircle className="w-3 h-3" />
                }
                      {TOOL_LABELS[action.tool] || action.tool}
                    </span>
              )}
                </div>
            }

              {/* Message text */}
              <div data-ev-id="ev_2894ec87a2" className="whitespace-pre-wrap text-[13px]">{msg.content}</div>

              {/* Timestamp + copy */}
              <div data-ev-id="ev_d3f4c6416d" className="flex items-center justify-between mt-1.5 gap-2">
                <div data-ev-id="ev_f97f5c9ba0" className="flex items-center gap-1.5">
                  <span data-ev-id="ev_8667d2dcdb" className="text-white/60 text-[10px]">{formatTime(msg.timestamp)}</span>
                  {msg.routing &&
                <span data-ev-id="ev_ddba8a139a" className={`text-[9px] px-1.5 py-0.5 rounded-full border ${
                msg.routing.tier === 'simple' ?
                'text-cyan-400/50 border-cyan-400/15 bg-cyan-400/5' :
                'text-purple-400/50 border-purple-400/15 bg-purple-400/5'}`
                }>
                      {msg.routing.tier === 'simple' ? '⚡' : '🧠'} {msg.routing.executionModel?.split('/').pop()?.slice(0, 20)}
                    </span>
                }
                </div>
                {msg.role === 'assistant' &&
              <button data-ev-id="ev_8c019bbe93"
              onClick={() => copyMessage(msg.id, msg.content)}
              aria-label="העתק הודעה"
              className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1.5 rounded text-white/60 hover:text-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

                    {copiedId === msg.id ?
                <Check className="w-3 h-3 text-green-400" /> :

                <Copy className="w-3 h-3" />
                }
                  </button>
              }
              </div>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {loading &&
        <div data-ev-id="ev_ef0bcfb04a" className="flex justify-end">
            <div data-ev-id="ev_b72142e4c5" className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl rounded-tl-md bg-white/[0.05] border border-white/[0.06]">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <div data-ev-id="ev_1f9b5000a6" className="flex items-center gap-1">
                <span data-ev-id="ev_bc6319345c" className="text-white/60 text-xs">חושב</span>
                <Wrench className="w-3 h-3 text-white/60 animate-pulse" />
              </div>
            </div>
          </div>
        }
      </div>

      {/* Input */}
      <div data-ev-id="ev_b783409aec" className="p-3 border-t border-white/[0.06]">
        <div data-ev-id="ev_28608a7b33" className="flex items-end gap-2">
          <textarea data-ev-id="ev_3a99b4c1d8"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="מה לעשות?"
          rows={1}
          disabled={loading}
          aria-label="הודעה לסוכן AI"
          className="flex-1 resize-none bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-white/85 text-sm placeholder:text-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary/40 focus:bg-white/[0.06] transition-all disabled:opacity-50"
          style={{ maxHeight: '80px' }} />

          <button data-ev-id="ev_bad5e18743"
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          aria-label="שלח"
          className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/25 flex items-center justify-center text-primary hover:bg-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0">

            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Quick action pills */}
        {messages.length > 0 && !loading &&
        <div data-ev-id="ev_35bb74a094" className="flex flex-wrap gap-1 mt-2">
            {[
          { label: '📋 סקציות', cmd: 'הראה סקציות' },
          { label: '🔗 קישורים', cmd: 'הראה קישורים' },
          { label: '⚙️ הגדרות', cmd: 'מה ההגדרות הנוכחיות?' }].
          map((a) =>
          <button data-ev-id="ev_30faa1f24e"
          key={a.label}
          onClick={() => {setInput(a.cmd);inputRef.current?.focus();}}
          className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05] text-white/60 text-[10px] hover:text-white/70 hover:bg-white/[0.06] transition-all">

                {a.label}
              </button>
          )}
          </div>
        }
      </div>
    </div>);

};