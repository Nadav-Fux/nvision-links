import { useEffect, useRef, useCallback } from 'react';
import type { SceneFn } from '@/components/logoScenes/types';

/**
 * Renders a single logoScene draw function inside a small canvas.
 * Supports mouse interaction + continuous animation loop.
 */
interface Props {
  draw: SceneFn;
  /** Pixel width/height of the canvas (CSS size will match) */
  size?: number;
  /** Whether the canvas is actively animating (pause when off-screen) */
  active?: boolean;
  className?: string;
}

export const ScenePreviewCanvas = ({ draw, size = 220, active = true, className = '' }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const startRef = useRef(Date.now());
  const mouseRef = useRef({ x: 0, y: 0 });

  const onPointer = useCallback((px: number, py: number) => {
    const el = boxRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const d = Math.max(r.width, r.height);
    mouseRef.current = {
      x: Math.max(-1, Math.min(1, (px - cx) / d * 2)),
      y: Math.max(-1, Math.min(1, (py - cy) / d * 2))
    };
  }, []);

  useEffect(() => {
    const mm = (e: MouseEvent) => onPointer(e.clientX, e.clientY);
    const tm = (e: TouchEvent) => {if (e.touches[0]) onPointer(e.touches[0].clientX, e.touches[0].clientY);};
    window.addEventListener('mousemove', mm);
    window.addEventListener('touchmove', tm, { passive: true });
    return () => {window.removeEventListener('mousemove', mm);window.removeEventListener('touchmove', tm);};
  }, [onPointer]);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    cvs.width = size * dpr;
    cvs.height = size * dpr;
    cvs.style.width = `${size}px`;
    cvs.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (!active) {
      // Draw one static frame
      try {draw(ctx, size, size, 0, 0, 0);} catch {/* */}
      return;
    }

    const tick = () => {
      const t = (Date.now() - startRef.current) / 1000;
      ctx.clearRect(0, 0, size, size);
      try {
        draw(ctx, size, size, mouseRef.current.x, mouseRef.current.y, t);
      } catch {/* scene error */}
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw, size, active]);

  return (
    <div data-ev-id="ev_3fdb88a9da" ref={boxRef} className={`relative ${className}`} style={{ width: size, height: size }}>
      <canvas data-ev-id="ev_6bf6f711b0" ref={canvasRef} className="w-full h-full rounded-xl" aria-hidden="true" />
    </div>);

};