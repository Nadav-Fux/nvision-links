import React, { useState, useEffect, useRef } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { Bot, CheckCheck, ArrowDown, Phone, Video, Search, MoreVertical, Smile, Paperclip, Mic, Send } from 'lucide-react';

interface ChatViewProps {
  sections: LinkSection[];
  visible: boolean;
}

type Message = {
  id: string;
  type: 'bot' | 'user' | 'system' | 'link';
  text?: string;
  link?: LinkItem;
  section?: string;
  sectionEmoji?: string;
  sectionTitle?: string;
  delay: number;
  time?: string;
};

/* ════ WhatsApp-style AI Chat View ════ */
export const ChatView = ({ sections, visible }: ChatViewProps) => {
  const allMessages = buildConversation(sections);
  const [revealedCount, setRevealedCount] = useState(0);
  const [typingVisible, setTypingVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (!visible) return;
    setRevealedCount(0);
    setTypingVisible(false);

    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    let cumDelay = 400;
    allMessages.forEach((msg, i) => {
      if (msg.type === 'bot' || msg.type === 'link') {
        const typingT = setTimeout(() => setTypingVisible(true), cumDelay);
        timeoutsRef.current.push(typingT);
        cumDelay += msg.type === 'link' ? 100 : 350;
      }

      const t = setTimeout(() => {
        setRevealedCount(i + 1);
        setTypingVisible(false);
      }, cumDelay);
      timeoutsRef.current.push(t);

      cumDelay += msg.type === 'link' ? 120 : msg.type === 'user' ? 500 : 180;
    });

    return () => timeoutsRef.current.forEach(clearTimeout);
  }, [visible, allMessages.length]);

  // Auto-scroll
  useEffect(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    });
  }, [revealedCount, typingVisible]);

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div data-ev-id="ev_94d4807a58"
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      {/* WhatsApp-style chat window */}
      <div data-ev-id="ev_95eda9d182"
      className="mx-auto max-w-lg rounded-2xl overflow-hidden border border-white/[0.08]"
      style={{
        background: '#0b141a',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(37,211,102,0.03)'
      }}>

        {/* ═══ WhatsApp Header (dark green) ═══ */}
        <div data-ev-id="ev_b9918dd2cd"
        className="flex items-center gap-2.5 px-3 py-2.5"
        style={{ background: '#1f2c34' }}>

          {/* Back arrow */}
          <button data-ev-id="ev_70d1b7d1e3" className="text-white/60 hover:text-white/70 transition-colors p-1">
            <ArrowDown className="w-5 h-5 rotate-90" />
          </button>

          {/* Avatar */}
          <div data-ev-id="ev_e78254b906" className="relative">
            <div data-ev-id="ev_06f12064fa"
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}>
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div data-ev-id="ev_dc6c55247f" className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25d366] border-2 border-[#1f2c34]" />
          </div>

          {/* Name + status */}
          <div data-ev-id="ev_72c39030b1" className="flex-1 min-w-0">
            <div data-ev-id="ev_b2262d4046" className="text-white/90 text-sm font-medium leading-tight">nVision AI</div>
            <div data-ev-id="ev_faf64d1951" className="text-[#25d366]/70 text-[11px] leading-tight">
              {typingVisible ? 'מקליד...' : 'אונליין'}
            </div>
          </div>

          {/* Action icons */}
          <div data-ev-id="ev_eef9e64f5f" className="flex items-center gap-3">
            <Video className="w-5 h-5 text-white/60" />
            <Phone className="w-5 h-5 text-white/60" />
            <MoreVertical className="w-5 h-5 text-white/60" />
          </div>
        </div>

        {/* ═══ Chat messages area ═══ */}
        <div data-ev-id="ev_707047a8ca"
        ref={scrollRef}
        className="px-3 py-3 space-y-1.5 overflow-y-auto"
        style={{
          minHeight: 420,
          maxHeight: 520,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'p\' width=\'50\' height=\'50\' patternUnits=\'userSpaceOnUse\'%3E%3Ccircle cx=\'25\' cy=\'25\' r=\'1\' fill=\'%23ffffff06\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'200\' height=\'200\' fill=\'%2309111a\'/%3E%3Crect width=\'200\' height=\'200\' fill=\'url(%23p)\'/%3E%3C/svg%3E")',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.05) transparent'
        }}>

          {/* Date pill */}
          <div data-ev-id="ev_42143adeeb" className="flex justify-center mb-3">
            <span data-ev-id="ev_5c39d6030e" className="text-[11px] text-white/60 bg-[#1f2c34] rounded-lg px-3 py-1 shadow-sm">
              היום
            </span>
          </div>

          {/* Encryption notice */}
          <div data-ev-id="ev_2527c2f1bd" className="flex justify-center mb-3">
            <span data-ev-id="ev_3f1066153e" className="text-[10px] text-white/60 bg-[#1a2730] rounded-lg px-3 py-1.5 text-center max-w-[260px] leading-relaxed flex items-center gap-1">
              🔒 הודעות ושיחות מוצפנות מקצה לקצה
            </span>
          </div>

          {allMessages.slice(0, revealedCount).map((msg) => {
            if (msg.type === 'system') {
              return (
                <div data-ev-id="ev_3948948dcb" key={msg.id} className="flex justify-center my-2 animate-in fade-in duration-300">
                  <span data-ev-id="ev_74cb85ad8e" className="text-[10px] text-white/60 bg-[#1f2c34] rounded-lg px-3 py-1">
                    {msg.text}
                  </span>
                </div>);

            }

            if (msg.type === 'user') {
              return (
                <div data-ev-id="ev_8356ddf45e" key={msg.id} className="flex justify-start mb-1 animate-in slide-in-from-left-2 duration-200">
                  <div data-ev-id="ev_2b01fc8bd2"
                  className="max-w-[82%] rounded-xl rounded-bl-[4px] px-3 py-2 relative"
                  style={{ background: '#005c4b' }}>
                    <p data-ev-id="ev_ce8a444616" className="text-[13.5px] text-white/90 leading-relaxed">{msg.text}</p>
                    <div data-ev-id="ev_60ef068429" className="flex items-center justify-end gap-1 mt-0.5 -mb-0.5">
                      <span data-ev-id="ev_77bcb4ca36" className="text-[10px] text-white/60">{msg.time || timeStr}</span>
                      <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                    </div>
                    {/* Tail */}
                    <div data-ev-id="ev_2480dd58a9" className="absolute bottom-0 -left-2 w-0 h-0" style={{
                      borderBottom: '8px solid #005c4b',
                      borderLeft: '8px solid transparent'
                    }} />
                  </div>
                </div>);

            }

            if (msg.type === 'bot') {
              return (
                <div data-ev-id="ev_6c2c572967" key={msg.id} className="flex justify-end mb-1 animate-in slide-in-from-right-2 duration-200">
                  <div data-ev-id="ev_ea4c68c551"
                  className="max-w-[82%] rounded-xl rounded-br-[4px] px-3 py-2 relative"
                  style={{ background: '#1f2c34' }}>
                    <p data-ev-id="ev_f62890d387" className="text-[13.5px] text-white/75 leading-relaxed">{msg.text}</p>
                    <div data-ev-id="ev_e7e7e6d8d3" className="flex items-center justify-end gap-1 mt-0.5 -mb-0.5">
                      <span data-ev-id="ev_f84cbf9e25" className="text-[10px] text-white/60">{msg.time || timeStr}</span>
                    </div>
                    {/* Tail */}
                    <div data-ev-id="ev_b777c2fc5e" className="absolute bottom-0 -right-2 w-0 h-0" style={{
                      borderBottom: '8px solid #1f2c34',
                      borderRight: '8px solid transparent'
                    }} />
                  </div>
                </div>);

            }

            if (msg.type === 'link' && msg.link) {
              return (
                <div data-ev-id="ev_23085246fa" key={msg.id} className="flex justify-end mb-1 animate-in slide-in-from-right-2 duration-200">
                  <ChatLinkBubble link={msg.link} sectionEmoji={msg.sectionEmoji || ''} sectionTitle={msg.sectionTitle || ''} time={msg.time || timeStr} />
                </div>);

            }

            return null;
          })}

          {/* Typing indicator */}
          {typingVisible &&
          <div data-ev-id="ev_c6e5e0a14f" className="flex justify-end animate-in fade-in duration-150">
              <div data-ev-id="ev_69f16b9a30"
            className="rounded-xl rounded-br-[4px] px-4 py-3"
            style={{ background: '#1f2c34' }}>
                <div data-ev-id="ev_e056bf5503" className="flex gap-1.5">
                  <span data-ev-id="ev_c301ff4345" className="w-2 h-2 rounded-full bg-white/25 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.6s' }} />
                  <span data-ev-id="ev_53cfa661da" className="w-2 h-2 rounded-full bg-white/25 animate-bounce" style={{ animationDelay: '150ms', animationDuration: '0.6s' }} />
                  <span data-ev-id="ev_f34ec5f561" className="w-2 h-2 rounded-full bg-white/25 animate-bounce" style={{ animationDelay: '300ms', animationDuration: '0.6s' }} />
                </div>
              </div>
            </div>
          }
        </div>

        {/* ═══ WhatsApp Input Bar ═══ */}
        <div data-ev-id="ev_b2a50984bb"
        className="flex items-center gap-2 px-2 py-2"
        style={{ background: '#1f2c34' }}>

          {/* Emoji button */}
          <button data-ev-id="ev_8a4a738128" className="p-1.5 text-white/60">
            <Smile className="w-5 h-5" />
          </button>

          {/* Text input */}
          <div data-ev-id="ev_3aeb6b5b0b"
          className="flex-1 flex items-center bg-[#2a3942] rounded-full px-4 py-2 gap-2">
            <span data-ev-id="ev_a1d6cc26cc" className="text-white/60 text-[13px] flex-1">כתוב הודעה...</span>
            <Paperclip className="w-4.5 h-4.5 text-white/60 rotate-45" />
          </div>

          {/* Voice/Send button */}
          <div data-ev-id="ev_dfc2d2b24c"
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: '#00a884' }}>
            <Mic className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>);

};

/* ═════ Link Bubble — looks like a shared link ═════ */
const ChatLinkBubble = ({ link, sectionEmoji, sectionTitle, time

}: {link: LinkItem;sectionEmoji: string;sectionTitle: string;time: string;}) => {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isActive = hovered || expanded;

  return (
    <a data-ev-id="ev_2d4e094169"
    href={link.url}
    target="_blank" rel="noopener noreferrer"
    aria-label={`${link.title} — ${link.subtitle} (נפתח בחלון חדש)`}
    className="block max-w-[85%] group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => {setHovered(false);setExpanded(false);}}
    onClick={(e: React.MouseEvent) => {
      if ('ontouchstart' in window && !expanded) {e.preventDefault();setExpanded(true);}
    }}
    onBlur={() => setExpanded(false)}>

      <div data-ev-id="ev_309edb0d6a"
      className="rounded-xl rounded-br-[4px] overflow-hidden transition-all duration-200 relative"
      style={{ background: '#1f2c34' }}>

        {/* Link preview card top — colored strip */}
        <div data-ev-id="ev_ffd8da3795"
        className="h-[3px]"
        style={{ background: `linear-gradient(90deg, ${link.color}80, ${link.color}30, transparent)` }} />

        {/* Link preview content */}
        <div data-ev-id="ev_636b529ade" className="px-3 pt-2 pb-1">
          <div data-ev-id="ev_649fdcb59f" className="flex items-start gap-2.5">
            {/* Icon */}
            <div data-ev-id="ev_d2f9bfab06"
            className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
            style={{
              background: `${link.color}18`,
              boxShadow: isActive ? `0 0 12px ${link.color}20` : 'none'
            }}>
              <AnimatedIcon
                icon={link.icon}
                animation={link.animation}
                color={link.color}
                isHovered={hovered} />
            </div>

            {/* Text */}
            <div data-ev-id="ev_3e2f255346" className="flex-1 min-w-0">
              <div data-ev-id="ev_80312261a4" className="text-white/90 text-[13px] font-semibold leading-tight">{link.title}</div>
              <p data-ev-id="ev_dc27af6b87" className="text-white/60 text-[11.5px] mt-0.5 leading-snug line-clamp-2">{link.subtitle}</p>
            </div>
          </div>

          {/* Category tag */}
          <div data-ev-id="ev_8c30431a65" className="flex items-center justify-between mt-2 pb-1">
            <span data-ev-id="ev_0308ba7e2f"
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${link.color}12`, color: `${link.color}90` }}>
              {sectionEmoji} {sectionTitle}
            </span>

            <div data-ev-id="ev_e893c7852f" className="flex items-center gap-1">
              <span data-ev-id="ev_beefb70152" className="text-[10px] text-white/60">{time}</span>
            </div>
          </div>
        </div>

        {/* Expanded description */}
        {isActive && link.description &&
        <div data-ev-id="ev_ee4de2b3c6" className="px-3 pb-2 animate-in fade-in duration-200">
            <div data-ev-id="ev_450b08e34f" className="h-px bg-white/5 mb-1.5" />
            <p data-ev-id="ev_02b3016925" className="text-white/60 text-[11px] leading-relaxed">{link.description}</p>
            <div data-ev-id="ev_e0630ab036" className="flex items-center gap-1.5 mt-1.5">
              <span data-ev-id="ev_2efaa1467f"
            className="text-[11px] px-2.5 py-1 rounded-full transition-all duration-200 flex items-center gap-1"
            style={{ backgroundColor: `${link.color}20`, color: `${link.color}cc` }}>
                פתח ←
              </span>
            </div>
          </div>
        }

        {/* Tail */}
        <div data-ev-id="ev_12d1254d97" className="absolute bottom-0 -right-2 w-0 h-0" style={{
          borderBottom: '8px solid #1f2c34',
          borderRight: '8px solid transparent'
        }} />
      </div>
    </a>);

};

/* ═════ Build Conversation ═════ */
function buildConversation(sections: LinkSection[]): Message[] {
  const msgs: Message[] = [];
  let id = 0;

  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const time = (offset: number) => {
    const mm = m - offset;
    const hh = mm < 0 ? h - 1 : h;
    const mmFixed = mm < 0 ? 60 + mm : mm;
    return `${String(hh < 0 ? 23 : hh).padStart(2, '0')}:${String(mmFixed).padStart(2, '0')}`;
  };

  let timeOffset = sections.reduce((acc, s) => acc + s.links.length + 2, 5);

  msgs.push({
    id: `m${id++}`, type: 'system',
    text: 'nVision AI הצטרף לצ\'אט',
    delay: 0, time: time(timeOffset--)
  });

  msgs.push({
    id: `m${id++}`, type: 'bot',
    text: 'היי 👋 אני הבוט של nVision Digital AI. מוכן להראות לך את כל מה שיש לנו!',
    delay: 0, time: time(timeOffset--)
  });

  sections.forEach((section, sIdx) => {
    if (sIdx === 0) {
      msgs.push({
        id: `m${id++}`, type: 'user',
        text: `בטח! תתחיל עם ה${section.title} 🙏`,
        delay: 0, time: time(timeOffset--)
      });
    } else {
      msgs.push({
        id: `m${id++}`, type: 'user',
        text: `מעולה! ומה עוד יש? ${section.emoji}`,
        delay: 0, time: time(timeOffset--)
      });
    }

    msgs.push({
      id: `m${id++}`, type: 'bot',
      text: `הנה ${section.emoji} *${section.title}* — לחץ על כל אחד לפתוח 👇`,
      delay: 0, time: time(timeOffset--)
    });

    section.links.forEach((link) => {
      msgs.push({
        id: `m${id++}`, type: 'link',
        link,
        section: section.id,
        sectionEmoji: typeof section.emoji === 'string' ? section.emoji : '',
        sectionTitle: section.title,
        delay: 0, time: time(timeOffset--)
      });
    });
  });

  msgs.push({
    id: `m${id++}`, type: 'bot',
    text: 'זה הכל! 🎉 אם צריך עוד עזרה, תמיד פה. בהצלחה! 🚀',
    delay: 0, time: time(0)
  });

  return msgs;
}