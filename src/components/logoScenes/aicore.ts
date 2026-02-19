import type { SceneFn } from './types';

/** AI Core — neural network layers with data flowing input to output */
export const drawAICore: SceneFn = (ctx, w, h, mx, my, t) => {
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) * 0.42;

  // Network structure: 4 layers
  const layers = [4, 7, 7, 3];
  const layerX: number[] = [];
  const layerSpacing = r * 1.2 / (layers.length - 1);
  layers.forEach((_, i) => {
    layerX.push(cx - r * 0.6 + i * layerSpacing);
  });

  // Calculate node positions
  const nodePositions: {x: number; y: number}[][] = [];
  layers.forEach((count, li) => {
    const positions: {x: number; y: number}[] = [];
    const spacing = Math.min(r * 0.14, r * 0.9 / count);
    for (let i = 0; i < count; i++) {
      positions.push({
        x: layerX[li],
        y: cy + (i - (count - 1) / 2) * spacing,
      });
    }
    nodePositions.push(positions);
  });

  // Draw connections between layers
  for (let li = 0; li < layers.length - 1; li++) {
    const srcLayer = nodePositions[li];
    const dstLayer = nodePositions[li + 1];
    srcLayer.forEach((src, si) => {
      dstLayer.forEach((dst, di) => {
        // Weight varies with time
        const weight = 0.3 + Math.sin(t * 0.8 + si * 1.3 + di * 0.9 + li * 2) * 0.3;
        if (weight < 0.15) return;

        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(dst.x, dst.y);
        const isActive = weight > 0.45;
        ctx.strokeStyle = isActive
          ? `rgba(6,182,212,${weight * 0.2})`
          : `rgba(139,92,246,${weight * 0.1})`;
        ctx.lineWidth = weight * 1.5;
        ctx.stroke();
      });
    });
  }

  // Data flow particles along connections
  for (let li = 0; li < layers.length - 1; li++) {
    const srcLayer = nodePositions[li];
    const dstLayer = nodePositions[li + 1];
    for (let p = 0; p < 3; p++) {
      const progress = (t * 0.6 + p * 0.33 + li * 0.25) % 1;
      const si = Math.floor((t * 2 + p + li) % srcLayer.length);
      const di = Math.floor((t * 1.5 + p * 2 + li) % dstLayer.length);
      const src = srcLayer[si];
      const dst = dstLayer[di];
      const px = src.x + (dst.x - src.x) * progress;
      const py = src.y + (dst.y - src.y) * progress;

      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34,211,238,${0.5 * Math.sin(progress * Math.PI)})`;
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 5;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Draw nodes
  const layerColors = ['6,182,212', '139,92,246', '168,85,247', '99,102,241'];
  nodePositions.forEach((layer, li) => {
    layer.forEach((pos, ni) => {
      const activation = 0.3 + Math.sin(t * 2 + ni * 1.5 + li * 2) * 0.3;
      const nodeR = 5 + activation * 3;
      const color = layerColors[li];

      // Outer glow
      ctx.beginPath();
      ctx.arc(pos.x + mx * 5, pos.y + my * 3, nodeR * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${activation * 0.1})`;
      ctx.fill();

      // Node circle
      ctx.beginPath();
      ctx.arc(pos.x + mx * 5, pos.y + my * 3, nodeR, 0, Math.PI * 2);
      const nodeGrad = ctx.createRadialGradient(
        pos.x + mx * 5, pos.y + my * 3, 0,
        pos.x + mx * 5, pos.y + my * 3, nodeR
      );
      nodeGrad.addColorStop(0, `rgba(${color},${0.5 + activation * 0.4})`);
      nodeGrad.addColorStop(1, `rgba(${color},${0.1 + activation * 0.1})`);
      ctx.fillStyle = nodeGrad;
      ctx.fill();
      ctx.strokeStyle = `rgba(${color},${0.3 + activation * 0.3})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });
  });

  // Layer labels
  ctx.font = '6px "Orbitron", monospace';
  ctx.textAlign = 'center';
  const labelNames = ['INPUT', 'HIDDEN 1', 'HIDDEN 2', 'OUTPUT'];
  layerX.forEach((x, i) => {
    ctx.fillStyle = `rgba(${layerColors[i]},0.2)`;
    ctx.fillText(labelNames[i], x, cy + r * 0.48);
  });

  // Title
  ctx.font = '7px "Orbitron", monospace';
  ctx.fillStyle = 'rgba(6,182,212,0.12)';
  ctx.textAlign = 'center';
  ctx.fillText('NEURAL NETWORK ARCHITECTURE', cx, cy - r * 0.48);

  // Accuracy readout
  const accuracy = 92 + Math.sin(t * 0.5) * 5;
  ctx.fillStyle = 'rgba(34,211,238,0.15)';
  ctx.fillText(`ACCURACY: ${accuracy.toFixed(1)}%`, cx, cy + r * 0.55);
};
