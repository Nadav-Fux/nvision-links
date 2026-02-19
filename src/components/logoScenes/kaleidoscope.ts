import type { SceneFn } from './types';

export const drawKaleidoscope: SceneFn = (ctx, w, h, mx, my, t) => {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.4;
  const segments = 12;
  const segmentAngle = (Math.PI * 2) / segments;

  // Mouse affects pattern parameters
  const complexity = 3 + Math.abs(mx) * 2;
  const speed = 0.5 + Math.abs(my) * 0.5;

  ctx.save();
  ctx.translate(cx, cy);

  for (let seg = 0; seg < segments; seg++) {
    ctx.save();
    ctx.rotate(segmentAngle * seg);

    // Mirror every other segment
    if (seg % 2 === 1) ctx.scale(1, -1);

    // Draw pattern shapes
    const layers = 5;
    for (let layer = 0; layer < layers; layer++) {
      const layerDist = (layer / layers) * r * 0.85;
      const time = t * speed + layer * 0.3;
      const size = r * 0.08 + Math.sin(time * 2 + layer) * r * 0.03;

      // Petal shapes
      for (let p = 0; p < complexity; p++) {
        const pAngle = (p / complexity) * segmentAngle * 0.4;
        const pDist = layerDist + Math.sin(time + p) * 8;
        const px = Math.cos(pAngle) * pDist;
        const py = Math.sin(pAngle) * pDist;

        ctx.beginPath();
        ctx.ellipse(px, py, size, size * 0.5, pAngle + time, 0, Math.PI * 2);

        const hues = [
          `rgba(6, 182, 212, ${0.08 + layer * 0.03})`,
          `rgba(139, 92, 246, ${0.08 + layer * 0.03})`,
          `rgba(168, 85, 247, ${0.06 + layer * 0.02})`,
          `rgba(34, 211, 238, ${0.06 + layer * 0.02})`,
          `rgba(99, 102, 241, ${0.05 + layer * 0.02})`,
        ];
        ctx.fillStyle = hues[layer % hues.length];
        ctx.fill();

        ctx.strokeStyle = hues[layer % hues.length].replace(/[\d.]+\)$/, `${0.15 + layer * 0.05})`);
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Connection lines
      if (layer > 0) {
        const prevDist = ((layer - 1) / layers) * r * 0.85;
        ctx.beginPath();
        ctx.moveTo(prevDist, 0);
        ctx.lineTo(layerDist, 0);
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.06})`;
        ctx.lineWidth = 0.3;
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  ctx.restore();

  // Center jewel
  const jewelPulse = 5 + Math.sin(t * 3) * 2;
  const jewelGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, jewelPulse * 2);
  jewelGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
  jewelGrad.addColorStop(0.4, 'rgba(6, 182, 212, 0.3)');
  jewelGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = jewelGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, jewelPulse * 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, jewelPulse, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 15;
  ctx.fill();
  ctx.shadowBlur = 0;
};
