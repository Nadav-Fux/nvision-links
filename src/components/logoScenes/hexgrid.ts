import type { SceneFn } from './types';

/** GPU Cores — AI chip circuit layout with data traces */
export const drawHexgrid: SceneFn = (ctx, w, h, mx, my, t) => {
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) * 0.43;
  const hexR = 18;
  const hexH = hexR * Math.sqrt(3);
  const cols = Math.ceil(w / (hexR * 3)) + 2;
  const rows = Math.ceil(h / hexH) + 2;
  const startX = cx - (cols * hexR * 1.5) / 2;
  const startY = cy - (rows * hexH) / 2;

  // Draw hex grid
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const hx = startX + col * hexR * 3 + (row % 2) * hexR * 1.5;
      const hy = startY + row * hexH;

      const dx = hx - cx, dy = hy - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > r * 1.1) continue;

      const edgeFade = Math.max(0, 1 - dist / r);
      const isActive = Math.sin(t * 2 + hx * 0.05 + hy * 0.03) > 0.3;
      const isCore = dist < r * 0.25;
      const mouseDist = Math.sqrt((hx - (cx + mx * r * 0.3)) ** 2 + (hy - (cy + my * r * 0.2)) ** 2);
      const mouseHighlight = Math.max(0, 1 - mouseDist / (r * 0.3));

      // Hex outline
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
        const px = hx + Math.cos(a) * hexR * 0.9;
        const py = hy + Math.sin(a) * hexR * 0.9;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      if (isCore) {
        // Core processors
        const coreAlpha = 0.08 + Math.sin(t * 3 + hx * 0.1) * 0.05 + mouseHighlight * 0.15;
        ctx.fillStyle = `rgba(6,182,212,${coreAlpha * edgeFade})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(6,182,212,${(0.2 + mouseHighlight * 0.3) * edgeFade})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner dot
        ctx.beginPath();
        ctx.arc(hx, hy, 2 + mouseHighlight * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,211,238,${(0.5 + mouseHighlight * 0.4) * edgeFade})`;
        if (mouseHighlight > 0.3) {
          ctx.shadowColor = '#22d3ee';
          ctx.shadowBlur = 8;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (isActive) {
        ctx.strokeStyle = `rgba(139,92,246,${0.08 * edgeFade})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        // Activity dot
        if (Math.sin(t * 4 + col * 2 + row * 3) > 0.7) {
          ctx.beginPath();
          ctx.arc(hx, hy, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(139,92,246,${0.3 * edgeFade})`;
          ctx.fill();
        }
      } else {
        ctx.strokeStyle = `rgba(255,255,255,${0.02 * edgeFade})`;
        ctx.lineWidth = 0.3;
        ctx.stroke();
      }
    }
  }

  // Data traces (connecting active cores)
  for (let i = 0; i < 8; i++) {
    const traceAngle = (i / 8) * Math.PI * 2 + t * 0.5;
    const d1 = r * 0.08, d2 = r * 0.5;
    const traceProgress = (t * 1.5 + i * 0.5) % 1;
    const tx = cx + Math.cos(traceAngle) * (d1 + (d2 - d1) * traceProgress);
    const ty = cy + Math.sin(traceAngle) * (d1 + (d2 - d1) * traceProgress);
    ctx.beginPath();
    ctx.arc(tx, ty, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(6,182,212,${0.5 * (1 - traceProgress)})`;
    ctx.fill();
  }

  // Center label
  ctx.font = '8px "Orbitron", monospace';
  ctx.fillStyle = 'rgba(6,182,212,0.15)';
  ctx.textAlign = 'center';
  ctx.fillText('GPU CORES', cx, cy + r + 14);
};
