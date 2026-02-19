import type { SceneFn } from './types';

interface Blip { angle: number; dist: number; birth: number; label: string; threat: boolean; }
let blips: Blip[] = [];
let lastT = 0;

const MODELS = ['GPT-4', 'LLM', 'CNN', 'GAN', 'BERT', 'CLIP', 'DALL-E', 'YOLO', 'RNN', 'VAE', 'ViT', 'LLaMA', 'Claude'];

/** AI Model Radar — enhanced with threat circles, data panels, double sweep */
export const drawRadar: SceneFn = (ctx, w, h, mx, my, t) => {
  if (!w || !h) return;
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) * 0.44;
  const sweep = (t % 1e6) * 1.8;

  if (Math.abs(t - lastT) > 1) blips = [];
  lastT = t;

  // Background grid
  ctx.strokeStyle = 'rgba(6,182,212,0.03)';
  ctx.lineWidth = 0.3;
  for (let i = -10; i <= 10; i++) {
    const x = cx + (i / 10) * r;
    ctx.beginPath(); ctx.moveTo(x, cy - r); ctx.lineTo(x, cy + r); ctx.stroke();
    const y = cy + (i / 10) * r;
    ctx.beginPath(); ctx.moveTo(cx - r, y); ctx.lineTo(cx + r, y); ctx.stroke();
  }

  // Concentric rings (6)
  for (let i = 1; i <= 6; i++) {
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(1, r * (i / 6)), 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(6,182,212,${0.07 + (6 - i) * 0.012})`;
    ctx.lineWidth = i === 6 ? 1.2 : 0.6;
    ctx.stroke();
  }

  // Cross hairs
  ctx.strokeStyle = 'rgba(6,182,212,0.08)';
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.strokeStyle = 'rgba(6,182,212,0.03)';
    ctx.stroke();
  }

  // Sweep trail (primary)
  const sweepLen = Math.PI * 0.55;
  for (let i = 0; i < 50; i++) {
    const trailA = sweep - (i / 50) * sweepLen;
    const alpha = (1 - i / 50) * 0.2;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(trailA) * r, cy + Math.sin(trailA) * r);
    ctx.strokeStyle = `rgba(6,182,212,${alpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Secondary sweep (opposite, fainter)
  const sweep2 = sweep + Math.PI;
  for (let i = 0; i < 30; i++) {
    const trailA = sweep2 - (i / 30) * sweepLen * 0.7;
    const alpha = (1 - i / 30) * 0.08;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(trailA) * r * 0.7, cy + Math.sin(trailA) * r * 0.7);
    ctx.strokeStyle = `rgba(139,92,246,${alpha})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // Main sweep line
  ctx.beginPath(); ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(sweep) * r, cy + Math.sin(sweep) * r);
  ctx.strokeStyle = 'rgba(6,182,212,0.85)';
  ctx.lineWidth = 1.5;
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Spawn blips
  if (Math.random() < 0.03) {
    blips.push({ angle: sweep + (Math.random() - 0.5) * 0.5, dist: 0.2 + Math.random() * 0.75, birth: t, label: MODELS[Math.floor(Math.random() * MODELS.length)], threat: Math.random() < 0.2 });
  }

  // Draw blips
  blips = blips.filter(b => {
    const age = t - b.birth;
    if (age > 5) return false;
    const alpha = Math.max(0, 1 - age / 5);
    const bx = cx + Math.cos(b.angle) * r * b.dist;
    const by = cy + Math.sin(b.angle) * r * b.dist;

    // Threat circle
    if (b.threat) {
      ctx.beginPath();
      ctx.arc(bx, by, 10 + Math.sin(t * 6) * 2, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(251,191,36,${alpha * 0.3})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(bx, by, 16 + Math.sin(t * 4) * 3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(251,191,36,${alpha * 0.12})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Glow
    ctx.beginPath();
    ctx.arc(bx, by, 6, 0, Math.PI * 2);
    ctx.fillStyle = b.threat ? `rgba(251,191,36,${alpha * 0.15})` : `rgba(6,182,212,${alpha * 0.2})`;
    ctx.fill();
    // Dot
    ctx.beginPath();
    ctx.arc(bx, by, 3, 0, Math.PI * 2);
    ctx.fillStyle = b.threat ? `rgba(251,191,36,${alpha * 0.9})` : `rgba(6,182,212,${alpha * 0.9})`;
    ctx.shadowColor = b.threat ? '#fbbf24' : '#06b6d4';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Label
    if (age < 3.5) {
      ctx.font = '7px "Orbitron", monospace';
      ctx.fillStyle = `rgba(6,182,212,${alpha * 0.6})`;
      ctx.textAlign = 'left';
      ctx.fillText(b.label, bx + 8, by + 3);
    }
    return true;
  });

  // Data panels in corners
  ctx.font = '7px "Orbitron", monospace';
  ctx.fillStyle = 'rgba(6,182,212,0.18)';
  ctx.textAlign = 'left';
  ctx.fillText('MODELS DETECTED: ' + blips.length, cx - r + 5, cy - r + 12);
  ctx.fillText('SWEEP: ' + (Math.round(sweep * 57.3) % 360) + '°', cx - r + 5, cy - r + 22);
  ctx.textAlign = 'right';
  ctx.fillText('AI.RADAR v3.1', cx + r - 5, cy - r + 12);
  const threatCount = blips.filter(b => b.threat).length;
  if (threatCount > 0) ctx.fillText('THREATS: ' + threatCount, cx + r - 5, cy - r + 22);

  // Center dot
  const centerPulse = 3 + Math.sin(t * 3) * 1;
  ctx.beginPath();
  ctx.arc(cx, cy, centerPulse, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(6,182,212,0.5)';
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;
};
