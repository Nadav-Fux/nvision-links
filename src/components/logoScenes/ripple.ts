import type { SceneFn } from './types';

let ripples: { x: number; y: number; birth: number }[] = [];
let lastT = 0;

/** Safe arc – guarantees radius >= 0.1, never NaN */
const arc = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, radius: number,
  startAngle: number, endAngle: number,
) => {
  const r = Math.max(0.1, isFinite(radius) ? Math.abs(radius) : 0.1);
  ctx.arc(x, y, r, startAngle, endAngle);
};

export const drawRipple: SceneFn = (ctx, w, h, mx, my, t) => {
  // Guard against bad dimensions
  if (!w || !h || !isFinite(w) || !isFinite(h)) return;

  const cx = w / 2;
  const cy = h / 2;
  const r = Math.max(10, Math.abs(Math.min(w, h) * 0.42));

  // Clear stale ripples on scene reactivation
  if (Math.abs(t - lastT) > 1) ripples = [];
  lastT = t;

  // Auto-generate ripples
  if (Math.floor(t * 2) !== Math.floor((t - 0.016) * 2)) {
    ripples.push({ x: cx + mx * r * 0.3, y: cy + my * r * 0.3, birth: t });
    if (ripples.length > 12) ripples.shift();
  }

  // Center glow
  const glow = ctx.createRadialGradient(cx + mx * 10, cy + my * 10, 0, cx, cy, r);
  glow.addColorStop(0, 'rgba(6, 182, 212, 0.08)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // Draw ripples
  ripples = ripples.filter((rip) => {
    const age = t - rip.birth;
    if (age > 3 || age < 0 || !isFinite(age)) return false;
    const progress = age / 3;
    const ripR = Math.max(0.1, progress * r);
    const alpha = (1 - progress) * 0.6;

    ctx.beginPath();
    arc(ctx, rip.x, rip.y, ripR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
    ctx.lineWidth = 1.5 * (1 - progress);
    ctx.stroke();

    // Second ring
    if (age > 0.15) {
      const p2 = (age - 0.15) / 3;
      const r2 = Math.max(0.1, p2 * r);
      ctx.beginPath();
      arc(ctx, rip.x, rip.y, r2, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(139, 92, 246, ${(1 - p2) * 0.4})`;
      ctx.lineWidth = 1 * (1 - p2);
      ctx.stroke();
    }

    return true;
  });

  // Center pulsing dot
  const pulse = Math.sin(t * 3) * 0.3 + 0.7;
  ctx.beginPath();
  arc(ctx, cx + mx * 8, cy + my * 8, Math.max(0.5, 5 * pulse), 0, Math.PI * 2);
  ctx.fillStyle = `rgba(6, 182, 212, ${pulse * 0.8})`;
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 15;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Cross hairs
  const chAlpha = 0.15 + Math.sin(t * 2) * 0.05;
  ctx.strokeStyle = `rgba(6, 182, 212, ${chAlpha})`;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.6, cy);
  ctx.lineTo(cx + r * 0.6, cy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 0.6);
  ctx.lineTo(cx, cy + r * 0.6);
  ctx.stroke();
};
