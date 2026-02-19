import type { SceneFn } from './types';

const CODE_CHARS = '01<>{}[]();=+#AI';

/** Code Helix — binary/code characters flowing in DNA double helix */
export const drawDna: SceneFn = (ctx, w, h, mx, my, t) => {
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) * 0.42;
  const helixR = r * 0.28;
  const helixH = r * 1.3;
  const rungs = 24;

  // Central axis glow
  const axisGrad = ctx.createLinearGradient(0, cy - helixH / 2, 0, cy + helixH / 2);
  axisGrad.addColorStop(0, 'transparent');
  axisGrad.addColorStop(0.3, 'rgba(6,182,212,0.04)');
  axisGrad.addColorStop(0.7, 'rgba(139,92,246,0.04)');
  axisGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = axisGrad;
  ctx.fillRect(cx - helixR * 1.5, cy - helixH / 2, helixR * 3, helixH);

  // Draw helix strands and code rungs
  const strandPoints1: {x: number; y: number; z: number}[] = [];
  const strandPoints2: {x: number; y: number; z: number}[] = [];

  for (let i = 0; i <= rungs * 3; i++) {
    const progress = i / (rungs * 3);
    const y = cy - helixH / 2 + progress * helixH;
    const angle = progress * Math.PI * 6 + t * 2;
    const x1 = cx + Math.cos(angle) * helixR;
    const z1 = Math.sin(angle);
    const x2 = cx + Math.cos(angle + Math.PI) * helixR;
    const z2 = Math.sin(angle + Math.PI);

    strandPoints1.push({x: x1 + mx * 8, y, z: z1});
    strandPoints2.push({x: x2 + mx * 8, y, z: z2});
  }

  // Strand 1 (cyan)
  ctx.beginPath();
  strandPoints1.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.strokeStyle = 'rgba(6,182,212,0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Strand 2 (purple)
  ctx.beginPath();
  strandPoints2.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.strokeStyle = 'rgba(139,92,246,0.45)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Rungs with code characters
  for (let i = 0; i < rungs; i++) {
    const progress = (i + 0.5) / rungs;
    const y = cy - helixH / 2 + progress * helixH;
    const angle = progress * Math.PI * 6 + t * 2;
    const x1 = cx + Math.cos(angle) * helixR + mx * 8;
    const x2 = cx + Math.cos(angle + Math.PI) * helixR + mx * 8;
    const z = Math.sin(angle);
    const alpha = 0.15 + (z + 1) * 0.15;

    // Rung line
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.strokeStyle = `rgba(168,85,247,${alpha})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Code character on rung
    const ch = CODE_CHARS[(i + Math.floor(t * 3)) % CODE_CHARS.length];
    ctx.font = '9px "Orbitron", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = z > 0
      ? `rgba(6,182,212,${0.2 + z * 0.35})`
      : `rgba(139,92,246,${0.15 + (-z) * 0.2})`;
    ctx.fillText(ch, (x1 + x2) / 2, y + 3);

    // Node dots at ends
    [x1, x2].forEach((nx, ni) => {
      const nodeAlpha = alpha * (ni === 0 ? 0.7 : 0.5);
      ctx.beginPath();
      ctx.arc(nx, y, 2 + (z + 1) * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = ni === 0
        ? `rgba(6,182,212,${nodeAlpha})`
        : `rgba(139,92,246,${nodeAlpha})`;
      ctx.fill();
    });
  }

  // Flowing data particles along strands
  for (let i = 0; i < 6; i++) {
    const pt = ((t * 0.8 + i * 0.4) % 1);
    const idx = Math.floor(pt * (strandPoints1.length - 1));
    const p = i % 2 === 0 ? strandPoints1[idx] : strandPoints2[idx];
    if (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? 'rgba(34,211,238,0.7)' : 'rgba(168,85,247,0.6)';
      ctx.shadowColor = i % 2 === 0 ? '#22d3ee' : '#a855f7';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
};
