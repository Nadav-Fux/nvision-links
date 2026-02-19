import { useEffect, useRef, useCallback } from 'react';
import type { TransitionType } from '@/components/logoScenes';

/**
 * Shows a single transition type animating on loop:
 * particles start as text "AI" then scatter and reform.
 */

interface Particle {
  tx: number;ty: number;
  rAngle: number;rDist: number;rSeed: number;
  size: number;isCyan: boolean;
}

const easeIO = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const getScatter = (
p: Particle, type: TransitionType, progress: number, w: number, h: number) =>
{
  const e = easeIO(progress);
  const cx = w / 2,cy = h / 2;
  const R = Math.min(w, h);
  let sx: number, sy: number;
  let alpha = 0.85 * (1 - e * 0.9);

  switch (type) {
    case 'explode':{
        const d = p.rDist * R * 0.6;
        sx = cx + Math.cos(p.rAngle) * d;
        sy = cy + Math.sin(p.rAngle) * d;
        break;
      }
    case 'vortex':{
        const a2 = p.rAngle + e * Math.PI * 3.5;
        const d2 = e * p.rDist * R * 0.5;
        sx = cx + Math.cos(a2) * d2;
        sy = cy + Math.sin(a2) * d2;
        break;
      }
    case 'rain':{
        sx = p.tx + (p.rSeed - 0.5) * 50;
        sy = p.ty + p.rDist * h * 1.1;
        break;
      }
    case 'rise':{
        sx = p.tx + Math.sin(p.rAngle * 4) * 40;
        sy = p.ty - p.rDist * h * 1.1;
        break;
      }
    case 'shatter':{
        const shardA = Math.round(p.rAngle / (Math.PI / 5)) * (Math.PI / 5);
        const d3 = p.rDist * R * 0.5;
        sx = p.tx + Math.cos(shardA) * d3;
        sy = p.ty + Math.sin(shardA) * d3;
        alpha = 0.9 * (1 - e * 0.75);
        break;
      }
    case 'wave':{
        const distC = Math.sqrt((p.tx - cx) ** 2 + (p.ty - cy) ** 2);
        const maxD = R * 0.5 || 1;
        const delay = distC / maxD * 0.45;
        const waveE = easeIO(clamp01(progress * 1.5 - delay));
        sx = cx + (p.tx - cx) * 2.8;
        sy = cy + (p.ty - cy) * 2.8;
        alpha = 0.85 * (1 - waveE * 0.9);
        return { x: lerp(p.tx, sx, waveE), y: lerp(p.ty, sy, waveE), alpha };
      }
  }
  return { x: lerp(p.tx, sx!, e), y: lerp(p.ty, sy!, e), alpha };
};

interface Props {
  type: TransitionType;
  size?: number;
  active?: boolean;
  className?: string;
}

export const TransitionPreviewCanvas = ({ type, size = 200, active = true, className = '' }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const startRef = useRef(Date.now());
  const particlesRef = useRef<Particle[]>([]);
  const initKeyRef = useRef('');

  const initParticles = useCallback((w: number, h: number) => {
    const k = `${w}|${h}`;
    if (initKeyRef.current === k) return;
    initKeyRef.current = k;

    const off = document.createElement('canvas');
    off.width = w;off.height = h;
    const oc = off.getContext('2d');
    if (!oc) return;

    const fs = Math.min(w * 0.35, h * 0.35);
    oc.font = `900 ${fs}px "Orbitron", sans-serif`;
    oc.textAlign = 'center';
    oc.textBaseline = 'middle';
    oc.fillStyle = '#fff';
    oc.fillText('AI', w / 2, h / 2);

    const data = oc.getImageData(0, 0, w, h).data;
    const step = Math.max(2, Math.round(fs / 12));
    const pts: Particle[] = [];
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        if (data[(y * w + x) * 4 + 3] > 80) {
          pts.push({
            tx: x, ty: y,
            rAngle: Math.random() * Math.PI * 2,
            rDist: 0.4 + Math.random() * 0.6,
            rSeed: Math.random(),
            size: step * 0.55 + Math.random() * step * 0.3,
            isCyan: Math.random() > 0.5
          });
        }
      }
    }
    particlesRef.current = pts;
  }, []);

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
    initParticles(size, size);

    if (!active) return;

    // Cycle: assemble 1.5s → hold 1s → scatter 1.5s → hold 0.5s
    const ASSEMBLE = 1500;
    const HOLD_TEXT = 1000;
    const SCATTER = 1500;
    const HOLD_SCATTER = 500;
    const TOTAL = ASSEMBLE + HOLD_TEXT + SCATTER + HOLD_SCATTER;

    const tick = () => {
      const elapsed = (Date.now() - startRef.current) % TOTAL;
      ctx.clearRect(0, 0, size, size);
      const pts = particlesRef.current;

      let scatterProgress: number;

      if (elapsed < ASSEMBLE) {
        // Assembling: scatter progress goes from 1 → 0
        scatterProgress = 1 - elapsed / ASSEMBLE;
      } else if (elapsed < ASSEMBLE + HOLD_TEXT) {
        // Holding as text
        scatterProgress = 0;
      } else if (elapsed < ASSEMBLE + HOLD_TEXT + SCATTER) {
        // Scattering: progress goes from 0 → 1
        scatterProgress = (elapsed - ASSEMBLE - HOLD_TEXT) / SCATTER;
      } else {
        // Hold scattered
        scatterProgress = 1;
      }

      pts.forEach((p) => {
        const { x, y, alpha } = getScatter(p, type, scatterProgress, size, size);
        if (alpha < 0.02) return;
        ctx.fillStyle = p.isCyan ? `rgba(6,182,212,${alpha})` : `rgba(168,85,247,${alpha})`;
        ctx.fillRect(x - p.size / 2, y - p.size / 2, p.size, p.size);
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [type, size, active, initParticles]);

  return (
    <div data-ev-id="ev_acdce78a78" className={`relative ${className}`} style={{ width: size, height: size }}>
      <canvas data-ev-id="ev_3e322ba6e3" ref={canvasRef} className="w-full h-full rounded-xl" aria-hidden="true" />
    </div>);

};