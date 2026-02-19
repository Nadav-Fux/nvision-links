import type { SceneFn } from './types';

interface Planet { dist: number; speed: number; size: number; color: string; hasRing: boolean; label: string; moons: {dist: number; speed: number; size: number;}[]; }

const planets: Planet[] = [
  { dist: 0.2, speed: 1.6, size: 10, color: '6,182,212', hasRing: false, label: 'GPT', moons: [{dist: 16, speed: 3.5, size: 2.5}] },
  { dist: 0.35, speed: 1.0, size: 14, color: '139,92,246', hasRing: true, label: 'LLM', moons: [{dist: 22, speed: 2.8, size: 3}, {dist: 30, speed: 2, size: 2}] },
  { dist: 0.52, speed: 0.6, size: 12, color: '168,85,247', hasRing: false, label: 'GAN', moons: [{dist: 18, speed: 2.5, size: 2}] },
  { dist: 0.7, speed: 0.38, size: 16, color: '99,102,241', hasRing: true, label: 'ViT', moons: [{dist: 24, speed: 2.2, size: 3.5}, {dist: 34, speed: 1.5, size: 2.5}] },
  { dist: 0.85, speed: 0.25, size: 11, color: '244,114,182', hasRing: false, label: 'BERT', moons: [{dist: 16, speed: 3, size: 2}] },
];

/** AI Universe — enhanced with bigger planets, asteroid belt, comet, labels */
export const drawOrbits: SceneFn = (ctx, w, h, mx, my, t) => {
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) * 0.46;

  // Starry background
  for (let i = 0; i < 40; i++) {
    const sx = ((i * 173.7 + 50) % w);
    const sy = ((i * 259.3 + 80) % h);
    const twinkle = 0.1 + Math.sin(t * 2 + i * 3) * 0.08;
    ctx.beginPath();
    ctx.arc(sx, sy, 0.5 + Math.sin(t + i) * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${twinkle})`;
    ctx.fill();
  }

  // Central star — bigger, more dramatic
  const starPulse = 1 + Math.sin(t * 2) * 0.18;
  const starGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 25 * starPulse);
  starGrad.addColorStop(0, 'rgba(255,255,255,0.95)');
  starGrad.addColorStop(0.2, 'rgba(6,182,212,0.7)');
  starGrad.addColorStop(0.5, 'rgba(139,92,246,0.3)');
  starGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = starGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 25 * starPulse, 0, Math.PI * 2);
  ctx.fill();
  // Bright core
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 25;
  ctx.fill();
  ctx.shadowBlur = 0;
  // Corona rays
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + t * 0.15;
    const len = 12 + Math.sin(t * 3 + i * 2) * 5;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 10, cy + Math.sin(a) * 10);
    ctx.lineTo(cx + Math.cos(a) * (10 + len), cy + Math.sin(a) * (10 + len));
    ctx.strokeStyle = `rgba(6,182,212,${0.15 + Math.sin(t * 2 + i) * 0.08})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // Asteroid belt between planet 3 and 4
  const beltDist = r * 0.6;
  for (let i = 0; i < 50; i++) {
    const a = (i / 50) * Math.PI * 2 + t * 0.08;
    const jitter = Math.sin(i * 7.3) * r * 0.03;
    const ax = cx + Math.cos(a) * (beltDist + jitter);
    const ay = cy + Math.sin(a) * (beltDist + jitter) * 0.42;
    ctx.beginPath();
    ctx.arc(ax, ay, 0.5 + Math.sin(i * 3.7) * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${0.08 + Math.sin(t + i) * 0.04})`;
    ctx.fill();
  }

  // Orbit paths + planets
  planets.forEach((p, idx) => {
    const orbitR = r * p.dist;
    // Orbit path
    ctx.beginPath();
    ctx.ellipse(cx, cy, orbitR, orbitR * 0.42, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${p.color},0.06)`;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    const pa = t * p.speed;
    const px = cx + Math.cos(pa) * orbitR;
    const py = cy + Math.sin(pa) * orbitR * 0.42;

    // Atmosphere glow
    const atmGrad = ctx.createRadialGradient(px, py, p.size * 0.5, px, py, p.size * 2.5);
    atmGrad.addColorStop(0, `rgba(${p.color},0.15)`);
    atmGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = atmGrad;
    ctx.beginPath();
    ctx.arc(px, py, p.size * 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Ring
    if (p.hasRing) {
      ctx.beginPath();
      ctx.ellipse(px, py, p.size * 2.2, p.size * 0.6, 0.3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${p.color},0.25)`;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(px, py, p.size * 2.6, p.size * 0.7, 0.3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${p.color},0.1)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Planet body with gradient
    const planetGrad = ctx.createRadialGradient(px - p.size * 0.3, py - p.size * 0.3, 0, px, py, p.size);
    planetGrad.addColorStop(0, `rgba(${p.color},0.9)`);
    planetGrad.addColorStop(0.7, `rgba(${p.color},0.6)`);
    planetGrad.addColorStop(1, `rgba(${p.color},0.3)`);
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fillStyle = planetGrad;
    ctx.shadowColor = `rgba(${p.color},0.5)`;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Highlight
    ctx.beginPath();
    ctx.arc(px - p.size * 0.25, py - p.size * 0.25, p.size * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fill();

    // Label
    ctx.font = '6px "Orbitron", monospace';
    ctx.fillStyle = `rgba(${p.color},0.35)`;
    ctx.textAlign = 'center';
    ctx.fillText(p.label, px, py + p.size + 10);

    // Moons
    p.moons.forEach(m => {
      const ma = t * m.speed + idx;
      const mmx = px + Math.cos(ma) * m.dist;
      const mmy = py + Math.sin(ma) * m.dist * 0.5;
      ctx.beginPath();
      ctx.arc(mmx, mmy, m.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},0.5)`;
      ctx.fill();
    });
  });

  // Comet
  const cometA = t * 0.3;
  const cometX = cx + Math.cos(cometA) * r * 0.95;
  const cometY = cy + Math.sin(cometA) * r * 0.3 - r * 0.15;
  // Tail
  const tailLen = 25;
  for (let i = 0; i < tailLen; i++) {
    const tAlpha = (1 - i / tailLen) * 0.4;
    const tx = cometX - Math.cos(cometA) * i * 2.5;
    const ty = cometY - Math.sin(cometA) * i * 0.8;
    ctx.beginPath();
    ctx.arc(tx, ty, 1.5 * (1 - i / tailLen), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(251,191,36,${tAlpha})`;
    ctx.fill();
  }
  // Comet head
  ctx.beginPath();
  ctx.arc(cometX, cometY, 3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.shadowColor = '#fbbf24';
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;
};
