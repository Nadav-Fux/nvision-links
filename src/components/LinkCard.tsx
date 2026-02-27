import { useState, useRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { IconAnimation, LinkTag } from '@/data/links';
import { ExternalLink, Gift } from 'lucide-react';
import { AnimatedIcon } from '@/components/AnimatedIcon';

const TAG_CONFIG: Record<string, {label: string;bg: string;text: string;border: string;}> = {
  free: { label: 'חינם לגמרי', bg: 'rgba(34,197,94,0.12)', text: '#4ade80', border: 'rgba(34,197,94,0.25)' },
  freemium: { label: 'שימוש מוגבל בחינם', bg: 'rgba(96,165,250,0.10)', text: '#93c5fd', border: 'rgba(96,165,250,0.20)' },
  deal: { label: '🔥 מבצע שווה', bg: 'rgba(251,191,36,0.12)', text: '#fbbf24', border: 'rgba(251,191,36,0.25)' },
  new: { label: '✨ חדש!', bg: 'rgba(236,72,153,0.12)', text: '#f472b6', border: 'rgba(236,72,153,0.25)' },
  popular: { label: '🔥 פופולרי', bg: 'rgba(239,68,68,0.12)', text: '#f87171', border: 'rgba(239,68,68,0.25)' },
  recommended: { label: '⭐ מומלץ', bg: 'rgba(139,92,246,0.12)', text: '#a78bfa', border: 'rgba(139,92,246,0.25)' },
  'coming-soon': { label: 'בקרוב', bg: 'rgba(148,163,184,0.12)', text: '#94a3b8', border: 'rgba(148,163,184,0.25)' },
  beta: { label: 'בטא', bg: 'rgba(6,182,212,0.12)', text: '#22d3ee', border: 'rgba(6,182,212,0.25)' },
  premium: { label: 'פרמיום', bg: 'rgba(212,165,116,0.12)', text: '#d4a574', border: 'rgba(212,165,116,0.25)' },
  'open-source': { label: 'קוד פתוח', bg: 'rgba(16,185,129,0.12)', text: '#34d399', border: 'rgba(16,185,129,0.25)' },
  israeli: { label: '🇮🇱 ישראלי', bg: 'rgba(59,130,246,0.12)', text: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
};

interface LinkCardProps {
  title: string;
  subtitle: string;
  description: string;
  url: string;
  icon: LucideIcon;
  color: string;
  animation: IconAnimation;
  delay: number;
  visible: boolean;
  faviconUrl?: string;
  affiliateBenefit?: string;
  tag?: LinkTag;
}

export const LinkCard = ({ title, subtitle, description, url, icon, color, animation, delay, visible, faviconUrl, affiliateBenefit, tag }: LinkCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [faviconFailed, setFaviconFailed] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    if ('ontouchstart' in window && !isExpanded) {
      e.preventDefault();
      setIsExpanded(true);
      return;
    }
  };

  return (
    <a data-ev-id="ev_f8cdae598a"
    ref={cardRef}
    href={url}
    target="_blank" rel="noopener noreferrer"
    aria-label={`${title} — ${subtitle} (נפתח בחלון חדש)`}
    onClick={handleClick}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => {
      setIsHovered(false);
      setIsExpanded(false);
    }}
    onFocus={() => setIsHovered(true)}
    onBlur={() => {
      setIsHovered(false);
      setIsExpanded(false);
    }}
    onMouseMove={handleMouseMove}
    className={`
        group relative block w-full rounded-2xl cursor-pointer
        transition-[opacity,transform] duration-500 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${isHovered ? 'scale-[1.02]' : 'scale-100'}
      `}
    style={{
      transitionDelay: visible ? `${delay}ms` : '0ms',
      willChange: visible ? 'auto' : 'opacity, transform'
    }}>

      {/* Hover glow behind the card */}
      {isHovered &&
      <div data-ev-id="ev_aa4b2ba4a1"
      className="absolute -inset-1 rounded-2xl blur-lg opacity-100"
      style={{ background: `linear-gradient(135deg, ${color}20, transparent, ${color}15)` }} />
      }

      {/* Card body */}
      <div data-ev-id="ev_6e813cbe82"
      className="relative rounded-2xl overflow-hidden"
      style={{
        borderRight: `2px solid ${isHovered ? color : `${color}30`}`,
        background: isHovered ?
        `linear-gradient(135deg, ${color}08 0%, transparent 60%)` :
        'transparent'
      }}>

        {/* Mouse spotlight */}
        {isHovered &&
        <div data-ev-id="ev_afe5478146"
        className="absolute pointer-events-none"
        style={{
          left: mousePos.x - 100,
          top: mousePos.y - 100,
          width: 200,
          height: 200,
          background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`
        }} />
        }

        {/* Subtle bottom border line */}
        <div data-ev-id="ev_91662ef58a"
        className="absolute bottom-0 right-[2%] left-[2%] h-px"
        style={{
          background: isHovered ?
          `linear-gradient(90deg, transparent, ${color}40, transparent)` :
          `linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)`
        }} />

        {/* Content */}
        <div data-ev-id="ev_e4b09c1a79" className="relative p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4">
          {/* Animated Icon */}
          <div data-ev-id="ev_da29941c82" className="relative flex-shrink-0">
            <div data-ev-id="ev_411d1dc930"
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 ${
            isHovered ? 'scale-110' : ''}`
            }
            style={{
              background: `${color}10`,
              border: `1px solid ${isHovered ? `${color}40` : `${color}15`}`,
              boxShadow: isHovered ?
              `0 0 20px ${color}25` :
              'none'
            }}>

              {faviconUrl && !faviconFailed ?
              <img data-ev-id="ev_7168a1e5e3"
              src={faviconUrl}
              alt={title}
              loading="lazy"
              decoding="async"
              className="w-6 h-6 rounded-md object-contain"
              onError={() => setFaviconFailed(true)} /> :
              null}
              <span data-ev-id="ev_ed2229102e" className={faviconUrl && !faviconFailed ? 'hidden' : ''}>
                <AnimatedIcon
                  icon={icon}
                  animation={animation}
                  color={color}
                  isHovered={isHovered} />
              </span>

            </div>
          </div>

          {/* Text */}
          <div data-ev-id="ev_5fb18d5edd" className="flex-1 min-w-0">
            <div data-ev-id="ev_a3e328b636" className="flex items-center gap-2">
              <span data-ev-id="ev_ae54bbcb49"
              className="font-semibold text-base block truncate transition-colors duration-300"
              style={{ color: isHovered ? color : 'rgba(255,255,255,0.92)' }}>
                {title}
              </span>

              {/* Tag badge */}
              {tag &&
              <span data-ev-id="ev_86b384431f"
              className="flex-shrink-0 text-[11px] font-bold leading-none px-2 py-1 rounded-md whitespace-nowrap"
              style={{
                background: TAG_CONFIG[tag].bg,
                color: TAG_CONFIG[tag].text,
                border: `1px solid ${TAG_CONFIG[tag].border}`
              }}>

                  {TAG_CONFIG[tag].label}
                </span>
              }
            </div>

            <p data-ev-id="ev_76cf47317f"
            className="text-sm mt-0.5 leading-relaxed line-clamp-2 transition-colors duration-300"
            style={{ color: isHovered ? `${color}bb` : 'rgba(255,255,255,0.55)' }}>
              {subtitle}
            </p>

            {/* Affiliate benefit badge — always visible */}
            {affiliateBenefit &&
            <div data-ev-id="ev_6e3531618f" className="flex items-center gap-1.5 mt-1.5">
                <Gift className="w-3.5 h-3.5 text-amber-400/80 flex-shrink-0" aria-hidden="true" />
                <span data-ev-id="ev_86b384431f" className="text-xs leading-snug text-amber-400/90 font-medium">
                  {affiliateBenefit}
                </span>
              </div>
            }

            {/* Description - hover/expand only */}
            <div data-ev-id="ev_ab2044e6cd"
            className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-out ${
            isHovered || isExpanded ? 'max-h-24 opacity-100 mt-1.5' : 'max-h-0 opacity-0'}`
            }>
              <div data-ev-id="ev_6e3531618f"
              className="h-px w-12 mb-1.5"
              style={{ background: `${color}30` }}
              aria-hidden="true" />
              <p data-ev-id="ev_bb12962856" className="text-white/60 text-[13px] leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {/* Arrow */}
          <div data-ev-id="ev_ff80c29190"
          className={`flex-shrink-0 transition-[opacity,transform] duration-300 ${
          isHovered ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'}`
          }
          aria-hidden="true">
            <ExternalLink
              className="w-4 h-4"
              style={{ color: `${color}80` }} />
          </div>
        </div>
      </div>
    </a>);
};