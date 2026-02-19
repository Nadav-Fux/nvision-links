import type { SceneFn } from './types';

export const drawGeometry: SceneFn = (ctx, w, h, mx, my, t) => {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.36;

  // Mouse affects rotation
  const rotSpeed = 0.3 + mx * 0.15;
  const pulseAmp = 0.05 + Math.abs(my) * 0.1;

  // Flower of life - overlapping circles
  const layers = 3;
  const petals = 6;

  for (let layer = 1; layer <= layers; layer++) {
    const layerR = (layer / layers) * r * 0.55;
    const circleR = layerR * (0.95 + Math.sin(t * 2 + layer) * pulseAmp);

    for (let i = 0; i < petals; i++) {
      const angle = (i / petals) * Math.PI * 2 + t * rotSpeed + layer * 0.2;
      const px = cx + Math.cos(angle) * layerR;
      const py = cy + Math.sin(angle) * layerR;

      ctx.beginPath();
      ctx.arc(px, py, circleR, 0, Math.PI * 2);

      const hue = layer === 1 ? '6, 182, 212' : layer === 2 ? '139, 92, 246' : '168, 85, 247';
      ctx.strokeStyle = `rgba(${hue}, ${0.15 + (layers - layer) * 0.08})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }

  // Center circle
  const centerPulse = r * 0.18 + Math.sin(t * 3) * r * 0.03;
  ctx.beginPath();
  ctx.arc(cx, cy, centerPulse, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Outer boundary
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.85, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
  ctx.lineWidth = 0.5;
  ctx.setLineDash([4, 8]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Rotating triangles
  for (let tri = 0; tri < 2; tri++) {
    const triR = r * (0.5 + tri * 0.2);
    const triRot = t * (tri === 0 ? 0.4 : -0.3) + tri * Math.PI / 6;

    ctx.beginPath();
    for (let i = 0; i <= 3; i++) {
      const angle = triRot + (i / 3) * Math.PI * 2;
      const x = cx + Math.cos(angle) * triR;
      const y = cy + Math.sin(angle) * triR;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = tri === 0 ? 'rgba(6, 182, 212, 0.2)' : 'rgba(168, 85, 247, 0.2)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Vertex dots
    for (let i = 0; i < 3; i++) {
      const angle = triRot + (i / 3) * Math.PI * 2;
      const x = cx + Math.cos(angle) * triR;
      const y = cy + Math.sin(angle) * triR;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = tri === 0 ? 'rgba(6,182,212,0.6)' : 'rgba(168,85,247,0.6)';
      ctx.fill();
    }
  }

  // Mouse-following accent
  const mouseX = cx + mx * r * 0.3;
  const mouseY = cy + my * r * 0.3;
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(34, 211, 238, 0.5)';
  ctx.shadowColor = '#22d3ee';
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Lines from mouse to nearest vertices
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + t * 0.4;
    const vx = cx + Math.cos(angle) * r * 0.5;
    const vy = cy + Math.sin(angle) * r * 0.5;
    const d = Math.sqrt((mouseX - vx) ** 2 + (mouseY - vy) ** 2);
    if (d < r * 0.6) {
      ctx.beginPath();
      ctx.moveTo(mouseX, mouseY);
      ctx.lineTo(vx, vy);
      ctx.strokeStyle = `rgba(34, 211, 238, ${(1 - d / (r * 0.6)) * 0.3})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }
};
