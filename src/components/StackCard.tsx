import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { IconAnimation } from '@/data/links';
import { ExternalLink } from 'lucide-react';
import { AnimatedIcon } from '@/components/AnimatedIcon';

interface StackCardProps {
  title: string;
  subtitle: string;
  description: string;
  url: string;
  icon: LucideIcon;
  color: string;
  animation: IconAnimation;
  index: number;
  total: number;
  visible: boolean;
  hoveredIndex: number | null;
  onHover: (hovering: boolean) => void;
}

export const StackCard = ({
  title,
  subtitle,
  description,
  url,
  icon,
  color,
  animation,
  index,
  total,
  visible,
  hoveredIndex,
  onHover
}: StackCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isAnyHovered = hoveredIndex !== null;
  const isOtherHovered = isAnyHovered && hoveredIndex !== index;

  // Alternating rotation for a natural stack feel
  const rotation = index % 2 === 0 ? -1.2 : 1.2;
  const xNudge = index % 2 === 0 ? -4 : 4;

  // When another card is hovered, cards above push up, cards below push down
  let pushY = 0;
  if (isOtherHovered && hoveredIndex !== null) {
    const diff = index - hoveredIndex;
    if (diff < 0) pushY = -12; // cards above: push up
    if (diff > 0) pushY = 18; // cards below: push down
  }

  return (
    <a data-ev-id="ev_52dc565439"
    href={url}
    target="_blank" rel="noopener noreferrer"
    aria-label={`${title} — ${subtitle} (נפתח בחלון חדש)`}
    onMouseEnter={() => {setIsHovered(true);onHover(true);}}
    onMouseLeave={() => {setIsHovered(false);onHover(false);}}
    onFocus={() => {setIsHovered(true);onHover(true);}}
    onBlur={() => {setIsHovered(false);onHover(false);}}
    className={`
        relative block cursor-pointer
        transition-[opacity,transform] ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-2xl
        ${visible ? 'opacity-100' : 'opacity-0 translate-y-12'}
      `}
    style={{
      zIndex: isHovered ? 50 : total - index,
      transitionDuration: '450ms',
      transitionDelay: visible ? `${index * 70}ms` : '0ms',
      transform: isHovered ?
      `translateY(-10px) translateX(0px) rotate(0deg) scale(1.03)` :
      `translateY(${pushY}px) translateX(${isOtherHovered ? xNudge * 0.5 : xNudge}px) rotate(${isOtherHovered ? rotation * 0.3 : rotation}deg)`,
      marginBottom: isHovered ? '8px' : '-10px' // overlap when not hovered
    }}>

      {/* Lift shadow */}
      <div data-ev-id="ev_3445c00127"
      className={`absolute inset-0 rounded-2xl transition-opacity duration-400 pointer-events-none ${
      isHovered ? 'opacity-100' : 'opacity-0'}`
      }
      style={{
        boxShadow: `0 20px 50px ${color}25, 0 8px 24px rgba(0,0,0,0.5)`
      }} />


      {/* Card */}
      <div data-ev-id="ev_1099c67f9f"
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: isHovered ?
        `linear-gradient(145deg, ${color}10 0%, rgba(13,13,22,0.97) 50%)` :
        'rgba(13, 13, 22, 0.92)',
        border: `1px solid ${isHovered ? `${color}45` : 'rgba(255,255,255,0.05)'}`,
        backdropFilter: 'blur(16px)'
      }}>

        {/* Color accent - left bar (RTL = right side visually) */}
        <div data-ev-id="ev_c550ad38cf"
        className="absolute top-2 bottom-2 right-0 w-[2px] rounded-full transition-colors duration-400"
        style={{
          background: isHovered ? color : `${color}25`,
          boxShadow: isHovered ? `0 0 8px ${color}40` : 'none'
        }} />


        {/* Top glow */}
        <div data-ev-id="ev_9cd5f195c2"
        className={`absolute top-0 left-0 right-0 h-px transition-opacity duration-400 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />


        {/* Content */}
        <div data-ev-id="ev_46c27a2ea0" className="relative p-4 pr-5 flex items-center gap-4">
          {/* Icon */}
          <div data-ev-id="ev_73f80d7b6f"
          className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-400 ${
          isHovered ? 'scale-110' : ''}`
          }
          style={{
            background: `${color}${isHovered ? '15' : '08'}`,
            border: `1px solid ${isHovered ? `${color}35` : `${color}10`}`,
            boxShadow: isHovered ? `0 0 20px ${color}18` : 'none'
          }}>

            <AnimatedIcon icon={icon} animation={animation} color={color} isHovered={isHovered} />
          </div>

          {/* Text */}
          <div data-ev-id="ev_dd032260a2" className="flex-1 min-w-0">
            <span data-ev-id="ev_06eb40fceb"
            className="font-semibold text-sm block truncate transition-colors duration-300"
            style={{ color: isHovered ? color : 'rgba(255,255,255,0.85)' }}>

              {title}
            </span>
            <p data-ev-id="ev_e0eb1a2824"
            className="text-xs mt-0.5 leading-relaxed line-clamp-1 transition-colors duration-300"
            style={{ color: isHovered ? `${color}80` : 'rgba(255,255,255,0.25)' }}>

              {subtitle}
            </p>

            {/* Description on hover */}
            <div data-ev-id="ev_ab9ba698b2"
            className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-out ${
            isHovered ? 'max-h-16 opacity-100 mt-1.5' : 'max-h-0 opacity-0'}`
            }>

              <div data-ev-id="ev_2958428365" className="h-px w-10 mb-1.5" style={{ background: `${color}25` }} />
              <p data-ev-id="ev_a569fba6a8" className="text-white/60 text-[11px] leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {/* Arrow */}
          <div data-ev-id="ev_005bc0bfa5"
          className={`flex-shrink-0 transition-[opacity,transform] duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3'}`
          }
          aria-hidden="true">

            <ExternalLink className="w-4 h-4" style={{ color: `${color}50` }} />
          </div>
        </div>
      </div>
    </a>);

};