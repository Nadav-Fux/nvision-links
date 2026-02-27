import type { LucideIcon } from 'lucide-react';
import type { IconAnimation } from '@/data/links';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface AnimatedIconProps {
  icon: LucideIcon;
  animation: IconAnimation;
  color: string;
  /** When true, shows the active glow + animation. Defaults to false. */
  isHovered?: boolean;
  /** Icon size in pixels. When provided, overrides the default Tailwind w-5 h-5 class. */
  size?: number;
}

/**
 * AnimatedIcon — renders a Lucide icon with a CSS hover animation.
 * Keyframes are defined globally in accessibility.css (single definition).
 */
export const AnimatedIcon = ({ icon: Icon, animation, color, isHovered = false, size }: AnimatedIconProps) => {
  const prefersReduced = useReducedMotion();

  const getAnimationStyle = (): React.CSSProperties => {
    if (!isHovered || prefersReduced) return {};

    const animations: Record<IconAnimation, string> = {
      bounce: 'iconBounce 0.6s ease infinite',
      wiggle: 'iconWiggle 0.5s ease infinite',
      'pulse-grow': 'iconPulseGrow 1s ease infinite',
      'spin-slow': 'iconSpinSlow 2s linear infinite',
      float: 'iconFloat 1.5s ease-in-out infinite',
      swing: 'iconSwing 0.8s ease-in-out infinite',
      rubber: 'iconRubber 0.8s ease infinite',
      flash: 'iconFlash 1s ease infinite',
      tilt: 'iconTilt 0.6s ease infinite',
      breathe: 'iconBreathe 1.5s ease-in-out infinite'
    };

    return { animation: animations[animation] };
  };

  return (
    <div data-ev-id="ev_4ea849a3f6" style={getAnimationStyle()}>
      <Icon
        className={size ? 'transition-all duration-300' : 'w-5 h-5 transition-all duration-300'}
        width={size}
        height={size}
        style={{
          color: isHovered ? color : `${color}90`,
          filter: isHovered ? `drop-shadow(0 0 8px ${color}70)` : 'none'
        }} />

    </div>);

};