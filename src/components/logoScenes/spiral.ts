import type { SceneFn } from './types';

export const drawSpiral: SceneFn = (ctx, w, h, mx, my, t) => {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.4;
  const arms = 3;
  const dots = 60;

  // Mouse affects rotation speed
  const speedMod = 1 + mx * 0.5;
  const tiltY = my * 0.3;

  for (let arm = 0; arm < arms; arm++) {
    const armOffset = (arm / arms) * Math.PI * 2;
    for (let i = 0; i < dots; i++) {
      const progress = i / dots;
      const angle = armOffset + progress * Math.PI * 4 + t * speedMod;
      const dist = progress * r;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist * (1 - Math.abs(tiltY));

      const size = 1 + (1 - progress) * 2;
      const alpha = 0.3 + (1 - progress) * 0.6;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = arm === 0
        ? `rgba(6, 182, 212, ${alpha})`
        : arm === 1
          ? `rgba(139, 92, 246, ${alpha})`
          : `rgba(168, 85, 247, ${alpha})`;
      ctx.fill();

      // Connect to next dot
      if (i > 0) {
        const pAngle = armOffset + ((i - 1) / dots) * Math.PI * 4 + t * speedMod;
        const pDist = ((i - 1) / dots) * r;
        const px = cx + Math.cos(pAngle) * pDist;
        const py = cy + Math.sin(pAngle) * pDist * (1 - Math.abs(tiltY));
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(6, 182, 212, ${alpha * 0.3})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }
    }
  }

  // Center glow
  const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.2);
  cg.addColorStop(0, 'rgba(6, 182, 212, 0.3)');
  cg.addColorStop(1, 'transparent');
  ctx.fillStyle = cg;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Center dot
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#22d3ee';
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 15;
  ctx.fill();
  ctx.shadowBlur = 0;
};
