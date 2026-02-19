import type { SceneFn } from './types';

interface Rocket { x: number; y: number; vx: number; vy: number; fuse: number; color: string; type: 'burst' | 'chrysanthemum' | 'spiral' | 'crackle'; }
interface Spark { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string; size: number; trail: boolean; }
let rockets: Rocket[] = [];
let sparks: Spark[] = [];
let lastT = 0;

const COLORS = ['6,182,212', '139,92,246', '168,85,247', '34,211,238', '99,102,241', '251,191,36', '244,114,182', '52,211,153'];
const TYPES: Rocket['type'][] = ['burst', 'chrysanthemum', 'spiral', 'crackle'];

/** Data Burst — massive AI-themed fireworks with varied patterns */
export const drawFireworks: SceneFn = (ctx, w, h, mx, my, t) => {
  const dt = Math.min(t - lastT, 0.05);
  if (Math.abs(t - lastT) > 1) { rockets = []; sparks = []; }
  lastT = t;

  // Ground glow
  const gndGlow = ctx.createLinearGradient(0, h * 0.85, 0, h);
  gndGlow.addColorStop(0, 'transparent');
  gndGlow.addColorStop(1, `rgba(139,92,246,${0.02 + Math.sin(t) * 0.01})`);
  ctx.fillStyle = gndGlow;
  ctx.fillRect(0, h * 0.85, w, h * 0.15);

  // Launch more rockets (higher probability)
  if (Math.random() < 0.09 + Math.abs(mx) * 0.04) {
    rockets.push({
      x: w * (0.15 + Math.random() * 0.7), y: h,
      vx: (Math.random() - 0.5) * 90, vy: -(280 + Math.random() * 220),
      fuse: 0.45 + Math.random() * 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      type: TYPES[Math.floor(Math.random() * TYPES.length)],
    });
  }

  // Update rockets
  rockets = rockets.filter(r => {
    r.x += r.vx * dt;
    r.y += r.vy * dt;
    r.vy += 130 * dt;
    r.fuse -= dt;

    // Rocket trail
    ctx.beginPath();
    ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r.color},0.85)`;
    ctx.shadowColor = `rgba(${r.color},0.6)`;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
    // Trail sparks
    sparks.push({ x: r.x, y: r.y, vx: (Math.random()-0.5)*20, vy: Math.random()*30, life: 0.3, maxLife: 0.3, color: r.color, size: 1, trail: false });

    if (r.fuse <= 0) {
      const count = r.type === 'chrysanthemum' ? 80 : r.type === 'spiral' ? 60 : 55;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + Math.random() * 0.3;
        let speed = 80 + Math.random() * 200;
        let vx = Math.cos(a) * speed;
        let vy = Math.sin(a) * speed;

        if (r.type === 'chrysanthemum') {
          // Longer trails, more uniform
          speed = 100 + Math.random() * 150;
          vx = Math.cos(a) * speed;
          vy = Math.sin(a) * speed;
        } else if (r.type === 'spiral') {
          const spiralA = a + i * 0.15;
          vx = Math.cos(spiralA) * speed * 0.8;
          vy = Math.sin(spiralA) * speed * 0.8;
        }

        const life = r.type === 'chrysanthemum' ? 1.2 + Math.random() * 1 : 0.8 + Math.random() * 1.2;
        sparks.push({
          x: r.x, y: r.y, vx, vy, life, maxLife: life,
          color: Math.random() < 0.25 ? COLORS[Math.floor(Math.random() * COLORS.length)] : r.color,
          size: 1.5 + Math.random() * 2.5,
          trail: r.type === 'chrysanthemum' || Math.random() < 0.5,
        });
      }

      // Ring burst
      for (let i = 0; i < 30; i++) {
        const a = (i / 30) * Math.PI * 2;
        sparks.push({ x: r.x, y: r.y, vx: Math.cos(a) * 220, vy: Math.sin(a) * 220, life: 0.4, maxLife: 0.4, color: r.color, size: 1.2, trail: false });
      }

      // Crackle: secondary mini-explosions after delay
      if (r.type === 'crackle') {
        for (let i = 0; i < 8; i++) {
          const ca = Math.random() * Math.PI * 2;
          const cd = 30 + Math.random() * 60;
          const cx2 = r.x + Math.cos(ca) * cd, cy2 = r.y + Math.sin(ca) * cd;
          for (let j = 0; j < 12; j++) {
            const ba = Math.random() * Math.PI * 2;
            sparks.push({ x: cx2, y: cy2, vx: Math.cos(ba) * (40 + Math.random() * 60), vy: Math.sin(ba) * (40 + Math.random() * 60), life: 0.4 + Math.random() * 0.3, maxLife: 0.5, color: '251,191,36', size: 1.5, trail: false });
          }
        }
      }

      return false;
    }
    return true;
  });

  // Update sparks
  sparks = sparks.filter(s => {
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    s.vy += 65 * dt;
    s.vx *= 0.984;
    s.vy *= 0.984;
    s.life -= dt;
    if (s.life <= 0) return false;

    const alpha = Math.max(0, s.life / s.maxLife);

    if (s.trail) {
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx * dt * 4, s.y - s.vy * dt * 4);
      ctx.strokeStyle = `rgba(${s.color},${alpha * 0.35})`;
      ctx.lineWidth = s.size * 0.6;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size * alpha, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${s.color},${alpha * 0.9})`;
    if (alpha > 0.6) {
      ctx.shadowColor = `rgba(${s.color},0.5)`;
      ctx.shadowBlur = 8;
    }
    ctx.fill();
    ctx.shadowBlur = 0;

    return true;
  });

  if (sparks.length > 1200) sparks.splice(0, sparks.length - 1000);
};
