import type { SceneFn } from './types';

interface SlashTrail { x: number; y: number; angle: number; life: number; maxLife: number; }
let trails: SlashTrail[] = [];
let lastT = 0;

/** Katana — sharp blade slashes with energy trails */
export const drawKatana: SceneFn = (ctx, w, h, mx, my, t) => {
  const c = w / 2, cy = h / 2;
  const r = Math.min(w, h) * 0.4;
  const dt = Math.min(t - lastT, 0.05);
  if (Math.abs(t - lastT) > 1) trails = [];
  lastT = t;

  // Background: subtle circular arena
  ctx.beginPath();
  ctx.arc(c, cy, r * 0.9, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(139,92,246,0.04)';
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Katana blade
  const bladeAngle = Math.sin(t * 1.2) * 0.4 + mx * 0.3;
  const bladeLen = r * 0.7;
  const handleLen = r * 0.2;

  ctx.save();
  ctx.translate(c, cy);
  ctx.rotate(bladeAngle - Math.PI / 4);

  // Handle (tsuka)
  const handleGrad = ctx.createLinearGradient(0, 0, -handleLen, handleLen * 0.4);
  handleGrad.addColorStop(0, 'rgba(139,92,246,0.5)');
  handleGrad.addColorStop(1, 'rgba(99,102,241,0.2)');
  ctx.beginPath();
  ctx.moveTo(-2, 2);
  ctx.lineTo(-handleLen, handleLen * 0.35);
  ctx.lineTo(-handleLen + 3, handleLen * 0.35 + 3);
  ctx.lineTo(1, 5);
  ctx.closePath();
  ctx.fillStyle = handleGrad;
  ctx.fill();

  // Guard (tsuba)
  ctx.beginPath();
  ctx.ellipse(0, 3, 6, 3, bladeAngle, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(139,92,246,0.4)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(168,85,247,0.5)';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Blade
  const bladeGrad = ctx.createLinearGradient(0, 0, bladeLen, -bladeLen * 0.35);
  bladeGrad.addColorStop(0, 'rgba(200,200,220,0.7)');
  bladeGrad.addColorStop(0.3, 'rgba(6,182,212,0.5)');
  bladeGrad.addColorStop(0.7, 'rgba(6,182,212,0.3)');
  bladeGrad.addColorStop(1, 'rgba(255,255,255,0.8)');

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(bladeLen, -bladeLen * 0.35);
  ctx.lineTo(bladeLen + 4, -bladeLen * 0.35 - 1);
  ctx.lineTo(3, -3);
  ctx.closePath();
  ctx.fillStyle = bladeGrad;
  ctx.fill();

  // Edge glow
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(bladeLen + 4, -bladeLen * 0.35 - 1);
  ctx.strokeStyle = 'rgba(6,182,212,0.6)';
  ctx.lineWidth = 1;
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Hamon (temper line)
  ctx.beginPath();
  for (let i = 0; i <= 20; i++) {
    const p = i / 20;
    const bx = p * bladeLen;
    const by = -p * bladeLen * 0.35;
    const wave = Math.sin(p * Math.PI * 4 + t * 3) * 2;
    if (i === 0) ctx.moveTo(bx + 2 + wave, by - 1);
    else ctx.lineTo(bx + 2 + wave, by - 1);
  }
  ctx.strokeStyle = 'rgba(6,182,212,0.2)';
  ctx.lineWidth = 0.5;
  ctx.stroke();

  ctx.restore();

  // Slash trails
  if (Math.random() < 0.04) {
    const slashAngle = Math.random() * Math.PI * 2;
    trails.push({
      x: c + (Math.random() - 0.5) * r * 0.4,
      y: cy + (Math.random() - 0.5) * r * 0.3,
      angle: slashAngle,
      life: 0.8, maxLife: 0.8,
    });
  }

  trails = trails.filter(tr => {
    tr.life -= dt;
    if (tr.life <= 0) return false;
    const alpha = tr.life / tr.maxLife;
    const len = r * 0.5;

    // Slash line
    ctx.beginPath();
    ctx.moveTo(
      tr.x - Math.cos(tr.angle) * len * 0.5,
      tr.y - Math.sin(tr.angle) * len * 0.5
    );
    ctx.lineTo(
      tr.x + Math.cos(tr.angle) * len * 0.5,
      tr.y + Math.sin(tr.angle) * len * 0.5
    );
    ctx.strokeStyle = `rgba(6,182,212,${alpha * 0.5})`;
    ctx.lineWidth = alpha * 3;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = alpha * 15;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Spark particles at ends
    for (let s = 0; s < 3; s++) {
      const sx = tr.x + Math.cos(tr.angle) * len * 0.5 * (s === 0 ? 1 : -1) + (Math.random() - 0.5) * 10;
      const sy = tr.y + Math.sin(tr.angle) * len * 0.5 * (s === 0 ? 1 : -1) + (Math.random() - 0.5) * 10;
      ctx.beginPath();
      ctx.arc(sx, sy, 1 + Math.random(), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(6,182,212,${alpha * 0.6 * Math.random()})`;
      ctx.fill();
    }

    return true;
  });

  if (trails.length > 8) trails.splice(0, trails.length - 8);

  // Energy kanji characters floating
  const kanjis = ['刀', '武', '氣', '道', '剣'];
  ctx.font = '12px serif';
  ctx.textAlign = 'center';
  for (let i = 0; i < kanjis.length; i++) {
    const ka = (i / kanjis.length) * Math.PI * 2 + t * 0.3;
    const kd = r * (0.75 + Math.sin(t * 0.5 + i * 2) * 0.05);
    const kx = c + Math.cos(ka) * kd;
    const ky = cy + Math.sin(ka) * kd * 0.5;
    ctx.fillStyle = `rgba(139,92,246,${0.1 + Math.sin(t * 2 + i * 1.5) * 0.05})`;
    ctx.fillText(kanjis[i], kx, ky);
  }
};
