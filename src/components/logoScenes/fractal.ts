import type { SceneFn } from './types';

/** Neural Architecture Tree — enhanced: bigger trees, growing effect, more detail */
const drawBranch = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  angle: number, len: number,
  depth: number, maxDepth: number,
  t: number, wind: number,
  growProgress: number,
) => {
  if (depth > maxDepth || len < 1.5) return;
  // Growing effect: only draw if depth is within current growth
  if (depth > growProgress * maxDepth) return;

  const sway = Math.sin(t * 1.2 + depth * 0.5) * wind * 0.14;
  const endAngle = angle + sway;
  const ex = x + Math.cos(endAngle) * len;
  const ey = y + Math.sin(endAngle) * len;
  const progress = depth / maxDepth;

  // Branch line
  const alpha = 0.25 + (1 - progress) * 0.5;
  const width = Math.max(0.4, (1 - progress) * 3.5);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(ex, ey);
  ctx.strokeStyle = progress < 0.4
    ? `rgba(139,92,246,${alpha})`
    : `rgba(6,182,212,${alpha})`;
  ctx.lineWidth = width;
  ctx.stroke();

  // Data packet flowing
  const packetT = (t * 2 + depth * 0.7) % 2;
  if (packetT < 1) {
    const px = x + (ex - x) * packetT;
    const py = y + (ey - y) * packetT;
    ctx.beginPath();
    ctx.arc(px, py, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(34,211,238,${0.6 * (1 - packetT)})`;
    ctx.fill();
  }

  // Junction nodes
  if (depth > 0 && depth < maxDepth - 1) {
    const nodeAlpha = 0.3 + Math.sin(t * 3 + depth * 1.5) * 0.15;
    ctx.beginPath();
    ctx.arc(ex, ey, 2.5 + (1 - progress) * 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(139,92,246,${nodeAlpha})`;
    ctx.fill();
  }

  // Leaf nodes — bigger, more dramatic
  if (depth >= maxDepth - 1) {
    const leafPulse = 0.4 + Math.sin(t * 2.5 + x * 0.03) * 0.3;
    // Outer glow
    ctx.beginPath();
    ctx.arc(ex, ey, 5 + leafPulse * 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(6,182,212,${leafPulse * 0.12})`;
    ctx.fill();
    // Inner dot
    ctx.beginPath();
    ctx.arc(ex, ey, 2.5 + leafPulse * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(34,211,238,${leafPulse})`;
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  const newLen = len * (0.66 + Math.sin(t * 0.7 + depth) * 0.03);
  const spread = 0.42 + wind * 0.06;
  drawBranch(ctx, ex, ey, endAngle - spread, newLen, depth + 1, maxDepth, t, wind, growProgress);
  drawBranch(ctx, ex, ey, endAngle + spread, newLen, depth + 1, maxDepth, t, wind, growProgress);
};

export const drawFractal: SceneFn = (ctx, w, h, mx, my, t) => {
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) * 0.50;
  const wind = mx * 2;

  // Growing: depth increases from 5 to 12 over 8 seconds, then stays
  const growCycle = Math.min(1, (t % 30) / 8);

  // Ground trace — wider
  const grd = ctx.createLinearGradient(cx - r * 0.9, 0, cx + r * 0.9, 0);
  grd.addColorStop(0, 'transparent');
  grd.addColorStop(0.3, 'rgba(139,92,246,0.12)');
  grd.addColorStop(0.5, 'rgba(139,92,246,0.18)');
  grd.addColorStop(0.7, 'rgba(139,92,246,0.12)');
  grd.addColorStop(1, 'transparent');
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.9, cy + r * 0.50);
  ctx.lineTo(cx + r * 0.9, cy + r * 0.50);
  ctx.strokeStyle = grd;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Ground glow
  const groundGlow = ctx.createRadialGradient(cx, cy + r * 0.50, 0, cx, cy + r * 0.50, r * 0.4);
  groundGlow.addColorStop(0, 'rgba(139,92,246,0.08)');
  groundGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = groundGlow;
  ctx.fillRect(cx - r * 0.5, cy + r * 0.35, r, r * 0.3);

  const startY = cy + r * 0.50;

  // Main tree — BIGGER (increased len from 0.4 to 0.46)
  drawBranch(ctx, cx, startY, -Math.PI / 2, r * 0.46, 0, 12, t, wind, growCycle);

  // Side trees — 2 medium ones, bigger than before
  drawBranch(ctx, cx - r * 0.42, startY, -Math.PI / 2 + 0.1, r * 0.28, 0, 9, t + 1, wind * 0.7, growCycle);
  drawBranch(ctx, cx + r * 0.42, startY, -Math.PI / 2 - 0.1, r * 0.28, 0, 9, t + 2, wind * 0.7, growCycle);

  // Additional small trees
  drawBranch(ctx, cx - r * 0.7, startY, -Math.PI / 2 + 0.15, r * 0.16, 0, 7, t + 3, wind * 0.5, growCycle);
  drawBranch(ctx, cx + r * 0.7, startY, -Math.PI / 2 - 0.15, r * 0.16, 0, 7, t + 4, wind * 0.5, growCycle);

  // Root node glow
  const rootGlow = ctx.createRadialGradient(cx, startY, 0, cx, startY, r * 0.22);
  rootGlow.addColorStop(0, 'rgba(139,92,246,0.3)');
  rootGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = rootGlow;
  ctx.beginPath();
  ctx.arc(cx, startY, r * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, startY, 5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(139,92,246,0.75)';
  ctx.shadowColor = '#8b5cf6';
  ctx.shadowBlur = 15;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Label
  ctx.font = '7px "Orbitron", monospace';
  ctx.fillStyle = 'rgba(139,92,246,0.18)';
  ctx.textAlign = 'center';
  ctx.fillText('NEURAL ARCHITECTURE', cx, startY + 16);
};
