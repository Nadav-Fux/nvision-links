import type { SceneFn } from './types';

export const drawSoundwave: SceneFn = (ctx, w, h, mx, my, t) => {
  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.min(w, h) * 0.4;
  const rings = 8;

  // Mouse affects distortion
  const mouseAngle = Math.atan2(my, mx);
  const mouseDist = Math.sqrt(mx * mx + my * my);

  for (let ring = 0; ring < rings; ring++) {
    const baseR = (ring / rings) * maxR + maxR * 0.15;
    const segments = 64;
    const phase = t * (2 + ring * 0.3) + ring * 0.5;

    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const freq1 = Math.sin(angle * 3 + phase) * maxR * 0.06;
      const freq2 = Math.sin(angle * 5 - phase * 1.3) * maxR * 0.03;

      // Mouse distortion
      const angleDiff = Math.abs(angle - mouseAngle - Math.PI);
      const distortion = Math.max(0, 1 - angleDiff / 1.5) * mouseDist * maxR * 0.15;

      const r = baseR + freq1 + freq2 + distortion;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    const alpha = 0.15 + (1 - ring / rings) * 0.35;
    const hue = ring % 2 === 0 ? '6, 182, 212' : '139, 92, 246';
    ctx.strokeStyle = `rgba(${hue}, ${alpha})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  // Center
  const pulse = 4 + Math.sin(t * 4) * 2;
  ctx.beginPath();
  ctx.arc(cx, cy, pulse, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(6, 182, 212, 0.7)';
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.shadowBlur = 0;
};
