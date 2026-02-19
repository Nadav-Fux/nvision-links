import type { SceneFn } from './types';

interface Node { x: number; y: number; layer: number; }
let nodes: Node[] = [];
let lastT = 0;

const initNodes = (w: number, h: number) => {
  nodes = [];
  const layers = [4, 7, 9, 7, 4]; // input → hidden → output
  const layerSpacing = w * 0.7 / (layers.length - 1);
  const startX = w * 0.15;

  layers.forEach((count, li) => {
    const layerH = h * 0.7;
    const spacing = layerH / (count + 1);
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: startX + li * layerSpacing,
        y: h * 0.15 + spacing * (i + 1),
        layer: li,
      });
    }
  });
};

/** Deep Learning Network — layered neural net with pulsing data flow */
export const drawNeural: SceneFn = (ctx, w, h, mx, my, t) => {
  if (Math.abs(t - lastT) > 1 || nodes.length === 0) initNodes(w, h);
  lastT = t;

  const layers = [4, 7, 9, 7, 4];

  // Draw connections first (behind nodes)
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (n.layer >= layers.length - 1) continue;

    // Connect to next layer
    for (let j = 0; j < nodes.length; j++) {
      const m = nodes[j];
      if (m.layer !== n.layer + 1) continue;

      // Data pulse traveling along connection
      const pulsePhase = (t * 1.5 + i * 0.3 + j * 0.2) % 3;
      const pulseActive = pulsePhase < 1;
      const pulseT = pulseActive ? pulsePhase : 0;

      // Connection line
      const alpha = pulseActive ? 0.12 + pulseT * 0.15 : 0.04;
      ctx.beginPath();
      ctx.moveTo(n.x, n.y);
      ctx.lineTo(m.x, m.y);
      ctx.strokeStyle = pulseActive
        ? `rgba(6,182,212,${alpha})`
        : `rgba(139,92,246,${alpha})`;
      ctx.lineWidth = pulseActive ? 1.2 : 0.4;
      ctx.stroke();

      // Data packet
      if (pulseActive) {
        const px = n.x + (m.x - n.x) * pulseT;
        const py = n.y + (m.y - n.y) * pulseT;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34,211,238,0.7)';
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }

  // Draw nodes
  nodes.forEach((n, i) => {
    const activation = 0.4 + Math.sin(t * 2.5 + i * 0.7 + n.layer * 1.2) * 0.3;
    const isMiddle = n.layer === 2;
    const nodeSize = isMiddle ? 6 : 4 + activation * 2;

    // Node glow
    ctx.beginPath();
    ctx.arc(n.x + mx * 5, n.y + my * 3, nodeSize + 4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(6,182,212,${activation * 0.12})`;
    ctx.fill();

    // Node body
    ctx.beginPath();
    ctx.arc(n.x + mx * 5, n.y + my * 3, nodeSize, 0, Math.PI * 2);
    const isActive = activation > 0.55;
    ctx.fillStyle = isActive
      ? `rgba(6,182,212,${activation})`
      : `rgba(139,92,246,${activation * 0.7})`;
    if (isActive) {
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 10;
    }
    ctx.fill();
    ctx.shadowBlur = 0;

    // Inner dot
    ctx.beginPath();
    ctx.arc(n.x + mx * 5, n.y + my * 3, nodeSize * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${activation * 0.6})`;
    ctx.fill();
  });

  // Layer labels
  ctx.font = '8px "Orbitron", monospace';
  ctx.fillStyle = 'rgba(6,182,212,0.15)';
  ctx.textAlign = 'center';
  const labels = ['INPUT', 'HIDDEN', 'DEEP', 'HIDDEN', 'OUTPUT'];
  const layerSpacing = w * 0.7 / (layers.length - 1);
  labels.forEach((label, i) => {
    ctx.fillText(label, w * 0.15 + i * layerSpacing, h * 0.08);
  });
};
