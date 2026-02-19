import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

/**
 * GPU-accelerated spotlight beams using direct DOM manipulation.
 * No React re-renders — all animation happens via transform/opacity.
 */

interface BeamConfig {
  position: 'top' | 'bottom';
  align: 'left' | 'center' | 'right';
  color: string;
  colorFade: string;
  width: number;
  height: number;
  blur: number;
  baseOpacity: number;
  freqMultiplier: number;
  phaseOffset: number;
  swingDegrees: number;
}

const BEAMS: BeamConfig[] = [
// Top-left — wide cyan, STRONG
{
  position: 'top', align: 'left',
  color: 'rgba(6,182,212,0.40)', colorFade: 'rgba(6,182,212,0.08)',
  width: 300, height: 500, blur: 12, baseOpacity: 1,
  freqMultiplier: 0.35, phaseOffset: 0, swingDegrees: 26
},
// Top-center — bright white
{
  position: 'top', align: 'center',
  color: 'rgba(255,255,255,0.18)', colorFade: 'rgba(255,255,255,0.04)',
  width: 260, height: 440, blur: 14, baseOpacity: 0.9,
  freqMultiplier: 0.22, phaseOffset: 1.5, swingDegrees: 12
},
// Top-right — wide purple, STRONG
{
  position: 'top', align: 'right',
  color: 'rgba(139,92,246,0.38)', colorFade: 'rgba(139,92,246,0.08)',
  width: 300, height: 500, blur: 12, baseOpacity: 1,
  freqMultiplier: 0.32, phaseOffset: 2, swingDegrees: -24
},
// Bottom-left — cyan upward
{
  position: 'bottom', align: 'left',
  color: 'rgba(6,182,212,0.30)', colorFade: 'rgba(6,182,212,0.06)',
  width: 250, height: 400, blur: 14, baseOpacity: 1,
  freqMultiplier: 0.42, phaseOffset: 1, swingDegrees: 20
},
// Bottom-center — accent purple
{
  position: 'bottom', align: 'center',
  color: 'rgba(168,85,247,0.20)', colorFade: 'rgba(168,85,247,0.04)',
  width: 220, height: 360, blur: 16, baseOpacity: 0.85,
  freqMultiplier: 0.28, phaseOffset: 4, swingDegrees: 10
},
// Bottom-right — purple upward
{
  position: 'bottom', align: 'right',
  color: 'rgba(139,92,246,0.28)', colorFade: 'rgba(139,92,246,0.06)',
  width: 250, height: 400, blur: 14, baseOpacity: 1,
  freqMultiplier: 0.38, phaseOffset: 3, swingDegrees: -18
}];


export const Spotlights = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const startRef = useRef(Date.now());
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return; // No animation when reduced motion is preferred

    const container = containerRef.current;
    if (!container) return;

    const beamEls = container.querySelectorAll<HTMLElement>('[data-beam]');
    const flareEls = container.querySelectorAll<HTMLElement>('[data-flare]');
    const glowEls = container.querySelectorAll<HTMLElement>('[data-glow]');

    const tick = () => {
      const t = (Date.now() - startRef.current) / 1000;

      beamEls.forEach((el, i) => {
        const b = BEAMS[i];
        if (!b) return;
        const rot = Math.sin(t * b.freqMultiplier + b.phaseOffset) * b.swingDegrees;
        // Pulsing opacity for more dynamic feel
        const pulse = b.baseOpacity * (0.75 + Math.sin(t * 0.8 + b.phaseOffset) * 0.25);
        el.style.transform = `rotate(${rot}deg)`;
        el.style.opacity = `${pulse}`;
      });

      flareEls.forEach((el, i) => {
        const pulse = 0.5 + Math.sin(t * 2.5 + i * 1.7) * 0.4;
        el.style.opacity = `${pulse}`;
      });

      glowEls.forEach((el, i) => {
        const opc = 0.6 + Math.sin(t * 0.5 + i * 2) * 0.3;
        el.style.opacity = `${opc}`;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [prefersReduced]);

  return (
    <div data-ev-id="ev_27bfcf56da"
    ref={containerRef}
    className="absolute inset-0 pointer-events-none overflow-visible"
    style={{ zIndex: 2 }}
    aria-hidden="true">


      {/* Beam cones */}
      {BEAMS.map((b, i) => {
        const isTop = b.position === 'top';
        const clipPath = isTop ?
        'polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)' :
        'polygon(0% 0%, 100% 0%, 65% 100%, 35% 100%)';
        const origin = isTop ? '50% 0%' : '50% 100%';
        const gradient = isTop ?
        `linear-gradient(to bottom, ${b.color}, ${b.colorFade} 50%, transparent 100%)` :
        `linear-gradient(to top, ${b.color}, ${b.colorFade} 50%, transparent 100%)`;

        const posStyle: React.CSSProperties = {
          width: `${b.width}px`,
          height: `${b.height}px`
        };
        if (isTop) {posStyle.top = '-100px';} else {posStyle.bottom = '-80px';}
        if (b.align === 'left') {posStyle.left = '0%';} else
        if (b.align === 'right') {posStyle.right = '0%';} else
        {posStyle.left = '50%';posStyle.marginLeft = `-${b.width / 2}px`;}

        return (
          <div data-ev-id="ev_8de7286009"
          key={i}
          data-beam
          className="absolute will-change-transform"
          style={{
            ...posStyle,
            clipPath,
            transformOrigin: origin,
            background: gradient,
            filter: `blur(${b.blur}px)`,
            opacity: b.baseOpacity
          }} />);


      })}

      {/* Flare dots at beam sources */}
      {BEAMS.map((b, i) => {
        const isTop = b.position === 'top';
        const flareColors = ['#06b6d4', '#ffffff', '#8b5cf6', '#06b6d4', '#a855f7', '#8b5cf6'];
        const glow = flareColors[i] || '#fff';
        const size = isTop ? 18 : 14;

        const posStyle: React.CSSProperties = {
          width: `${size}px`,
          height: `${size}px`
        };
        if (isTop) {posStyle.top = '-6px';} else {posStyle.bottom = '-6px';}
        if (b.align === 'left') {posStyle.left = `calc(0% + ${b.width / 2 - size / 2}px)`;} else
        if (b.align === 'right') {posStyle.right = `calc(0% + ${b.width / 2 - size / 2}px)`;} else
        {posStyle.left = '50%';posStyle.marginLeft = `-${size / 2}px`;}

        return (
          <div data-ev-id="ev_3d6e0cf779"
          key={`flare-${i}`}
          data-flare
          className="absolute rounded-full will-change-[opacity]"
          style={{
            ...posStyle,
            background: `radial-gradient(circle, ${glow}, transparent 65%)`,
            filter: 'blur(4px)',
            opacity: 0.6
          }} />);


      })}

      {/* Secondary wide glow halos behind beams */}
      {BEAMS.filter((_, i) => i % 2 === 0).map((b, i) => {
        const isTop = b.position === 'top';
        const posStyle: React.CSSProperties = {
          width: `${b.width * 1.8}px`,
          height: `${b.height * 0.5}px`
        };
        if (isTop) {posStyle.top = '-40px';} else {posStyle.bottom = '-30px';}
        if (b.align === 'left') {posStyle.left = `-${b.width * 0.2}px`;} else
        if (b.align === 'right') {posStyle.right = `-${b.width * 0.2}px`;} else
        {posStyle.left = '50%';posStyle.marginLeft = `-${b.width * 0.9}px`;}

        return (
          <div data-ev-id="ev_9822ddfe20"
          key={`halo-${i}`}
          data-glow
          className="absolute rounded-full will-change-[opacity]"
          style={{
            ...posStyle,
            background: `radial-gradient(ellipse, ${b.color.replace(/[\d.]+\)$/, '0.12)')}, transparent 70%)`,
            filter: 'blur(30px)',
            opacity: 0.5
          }} />);


      })}

      {/* Horizontal ambient glow bands — stronger */}
      <div data-ev-id="ev_911853425a"
      data-glow
      className="absolute top-[30%] left-[2%] right-[2%] h-[2px]"
      style={{
        background: 'linear-gradient(90deg, transparent 5%, rgba(6,182,212,0.15) 30%, rgba(139,92,246,0.15) 70%, transparent 95%)',
        filter: 'blur(6px)',
        opacity: 0.7
      }} />

      <div data-ev-id="ev_f47c99c93b"
      data-glow
      className="absolute top-[68%] left-[5%] right-[5%] h-[2px]"
      style={{
        background: 'linear-gradient(90deg, transparent 5%, rgba(139,92,246,0.12) 30%, rgba(6,182,212,0.12) 70%, transparent 95%)',
        filter: 'blur(6px)',
        opacity: 0.6
      }} />

    </div>);

};