import type { SceneFn } from './types';

export const drawBlob: SceneFn = (ctx, w, h, mx, my, t) => {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.3;

  // Blob follows mouse smoothly
  const blobX = cx + mx * r * 0.3;
  const blobY = cy + my * r * 0.3;

  // Multiple layered blobs
  for (let layer = 2; layer >= 0; layer--) {
    const layerR = r * (0.6 + layer * 0.2);
    const speed = 1 + layer * 0.3;
    const points = 8;

    ctx.beginPath();
    for (let i = 0; i <= points * 10; i++) {
      const angle = (i / (points * 10)) * Math.PI * 2;

      let radius = layerR;
      // Organic distortion with multiple frequencies
      radius += Math.sin(angle * 3 + t * speed) * r * 0.12;
      radius += Math.cos(angle * 5 - t * speed * 0.7) * r * 0.06;
      radius += Math.sin(angle * 2 + t * speed * 1.3) * r * 0.08;

      // Mouse attraction - blob stretches toward mouse
      const mouseAngle = Math.atan2(my, mx);
      const angleDiff = angle - mouseAngle;
      const mouseInfluence = Math.cos(angleDiff) * 0.15 * Math.sqrt(mx * mx + my * my);
      radius *= 1 + mouseInfluence;

      const x = blobX + Math.cos(angle) * radius;
      const y = blobY + Math.sin(angle) * radius;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    const colors = [
      ['rgba(6, 182, 212, 0.12)', 'rgba(6, 182, 212, 0.25)'],
      ['rgba(139, 92, 246, 0.08)', 'rgba(139, 92, 246, 0.18)'],
      ['rgba(168, 85, 247, 0.05)', 'rgba(168, 85, 247, 0.12)'],
    ];

    ctx.fillStyle = colors[layer][0];
    ctx.fill();
    ctx.strokeStyle = colors[layer][1];
    ctx.lineWidth = 1.5 - layer * 0.3;
    ctx.shadowColor = layer === 0 ? 'rgba(6,182,212,0.3)' : 'transparent';
    ctx.shadowBlur = layer === 0 ? 20 : 0;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Inner glow
  const innerGrad = ctx.createRadialGradient(blobX, blobY, 0, blobX, blobY, r * 0.35);
  innerGrad.addColorStop(0, `rgba(6, 182, 212, ${0.15 + Math.sin(t * 2) * 0.05})`);
  innerGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = innerGrad;
  ctx.beginPath();
  ctx.arc(blobX, blobY, r * 0.35, 0, Math.PI * 2);
  ctx.fill();

  // Floating particles inside
  for (let i = 0; i < 12; i++) {
    const pAngle = (i / 12) * Math.PI * 2 + t * 0.8;
    const pDist = r * (0.15 + Math.sin(t + i * 2) * 0.1);
    const px = blobX + Math.cos(pAngle) * pDist;
    const py = blobY + Math.sin(pAngle) * pDist;
    ctx.beginPath();
    ctx.arc(px, py, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(34, 211, 238, ${0.3 + Math.sin(t * 3 + i) * 0.2})`;
    ctx.fill();
  }
};
