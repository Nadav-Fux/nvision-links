import type { SceneFn } from './types';

interface Star { x: number; y: number; z: number; color: string; }
let stars: Star[] = [];
let lastT = 0;

const STAR_COLORS = ['6,182,212', '139,92,246', '168,85,247', '255,255,255', '244,114,182', '99,102,241'];

const initStars = (w: number, h: number) => {
  stars = [];
  for (let i = 0; i < 500; i++) {
    stars.push({
      x: (Math.random() - 0.5) * w * 3.5,
      y: (Math.random() - 0.5) * h * 3.5,
      z: Math.random() * 1500,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    });
  }
};

/** Hyperspace — enhanced warp with nebula, colors, and star bursts */
export const drawStarfield: SceneFn = (ctx, w, h, mx, my, t) => {
  const cx = w / 2, cy = h / 2;

  if (Math.abs(t - lastT) > 1 || stars.length === 0) initStars(w, h);
  lastT = t;

  const speed = 10 + mx * 5;

  // Nebula clouds (3 translucent colored patches)
  const nebulaColors = [
    { x: cx - w * 0.2, y: cy - h * 0.15, r: w * 0.25, c1: 'rgba(139,92,246,0.04)', c2: 'transparent' },
    { x: cx + w * 0.15, y: cy + h * 0.1, r: w * 0.2, c1: 'rgba(6,182,212,0.03)', c2: 'transparent' },
    { x: cx, y: cy + h * 0.2, r: w * 0.18, c1: 'rgba(244,114,182,0.025)', c2: 'transparent' },
  ];
  nebulaColors.forEach(n => {
    const ng = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
    ng.addColorStop(0, n.c1);
    ng.addColorStop(1, n.c2);
    ctx.fillStyle = ng;
    ctx.fillRect(0, 0, w, h);
  });

  // Center convergence glow
  const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.18);
  cg.addColorStop(0, 'rgba(6,182,212,0.15)');
  cg.addColorStop(0.5, 'rgba(139,92,246,0.06)');
  cg.addColorStop(1, 'transparent');
  ctx.fillStyle = cg;
  ctx.fillRect(0, 0, w, h);

  stars.forEach(star => {
    star.z -= speed;
    if (star.z <= 1) {
      star.x = (Math.random() - 0.5) * w * 3.5;
      star.y = (Math.random() - 0.5) * h * 3.5;
      star.z = 1500;
      star.color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
    }

    const sx = cx + (star.x / star.z) * 500;
    const sy = cy + (star.y / star.z) * 500 + my * 30;
    const depth = 1 - star.z / 1500;
    const sz = Math.max(0.2, depth * 4);
    const alpha = Math.max(0, depth);

    // Long trail
    const prevZ = star.z + speed * 2;
    const psx = cx + (star.x / prevZ) * 500;
    const psy = cy + (star.y / prevZ) * 500 + my * 30;

    const trailGrad = ctx.createLinearGradient(psx, psy, sx, sy);
    trailGrad.addColorStop(0, `rgba(${star.color},0)`);
    trailGrad.addColorStop(1, `rgba(${star.color},${alpha * 0.65})`);
    ctx.beginPath();
    ctx.moveTo(psx, psy);
    ctx.lineTo(sx, sy);
    ctx.strokeStyle = trailGrad;
    ctx.lineWidth = Math.max(0.3, sz * 0.6);
    ctx.stroke();

    // Star dot
    ctx.beginPath();
    ctx.arc(sx, sy, sz, 0, Math.PI * 2);
    const isBright = depth > 0.7;
    ctx.fillStyle = isBright
      ? `rgba(255,255,255,${alpha})`
      : `rgba(${star.color},${alpha * 0.8})`;
    if (isBright) {
      ctx.shadowColor = `rgba(${star.color},0.8)`;
      ctx.shadowBlur = 10;
    }
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // Edge speed lines — more
  for (let i = 0; i < 12; i++) {
    const ea = (i / 12) * Math.PI * 2 + t * 0.2;
    const er = Math.min(w, h) * 0.52;
    const ex = cx + Math.cos(ea) * er;
    const ey = cy + Math.sin(ea) * er * 0.6;
    const len = 18 + Math.sin(t * 3 + i) * 10;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex + Math.cos(ea) * len, ey + Math.sin(ea) * len * 0.6);
    ctx.strokeStyle = `rgba(6,182,212,${0.12 + Math.sin(t * 2 + i * 2) * 0.06})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
};
