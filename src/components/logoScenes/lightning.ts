import type { SceneFn } from './types';

interface Bolt { points: {x: number; y: number}[]; life: number; maxLife: number; color: string; width: number; branches: {x: number; y: number}[][]; }
let bolts: Bolt[] = [];
let lastT = 0;

const generateBolt = (x1: number, y1: number, x2: number, y2: number, color: string, jag: number): Bolt => {
  const points: {x: number; y: number}[] = [{x: x1, y: y1}];
  const segments = 14 + Math.floor(Math.random() * 8);
  const branches: {x: number; y: number}[][] = [];
  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const mx = x1 + (x2 - x1) * t + (Math.random() - 0.5) * jag;
    const my = y1 + (y2 - y1) * t + (Math.random() - 0.5) * jag * 0.5;
    points.push({x: mx, y: my});
    // Branch from some points
    if (i > 2 && i < segments - 2 && Math.random() < 0.3) {
      const branchLen = 3 + Math.floor(Math.random() * 4);
      const branchPts: {x: number; y: number}[] = [{x: mx, y: my}];
      const angle = Math.atan2(y2 - y1, x2 - x1) + (Math.random() - 0.5) * 1.5;
      for (let b = 1; b <= branchLen; b++) {
        branchPts.push({
          x: mx + Math.cos(angle) * b * jag * 0.15 + (Math.random() - 0.5) * jag * 0.3,
          y: my + Math.sin(angle) * b * jag * 0.15 + (Math.random() - 0.5) * jag * 0.2,
        });
      }
      branches.push(branchPts);
    }
  }
  points.push({x: x2, y: y2});
  return { points, life: 0.5 + Math.random() * 0.3, maxLife: 0.6, color, width: 1.5 + Math.random() * 2.5, branches };
};

/** Synapse Flash — dramatic brain synapses with branching electrical impulses */
export const drawLightning: SceneFn = (ctx, w, h, mx, my, t) => {
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) * 0.42;

  if (Math.abs(t - lastT) > 1) bolts = [];
  const dt = Math.min(t - lastT, 0.05);
  lastT = t;

  // Brain outline — more detailed with hemispheres
  ctx.beginPath();
  for (let i = 0; i <= 50; i++) {
    const a = (i / 50) * Math.PI * 2;
    const bump = 1 + Math.sin(a * 3) * 0.1 + Math.sin(a * 5) * 0.06 + Math.sin(a * 7) * 0.03;
    const bx = cx + Math.cos(a) * r * 0.58 * bump;
    const by = cy + Math.sin(a) * r * 0.48 * bump;
    if (i === 0) ctx.moveTo(bx, by); else ctx.lineTo(bx, by);
  }
  ctx.closePath();
  ctx.strokeStyle = 'rgba(139,92,246,0.1)';
  ctx.lineWidth = 1;
  ctx.stroke();
  // Fill very subtle
  ctx.fillStyle = 'rgba(139,92,246,0.02)';
  ctx.fill();

  // Center divide
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 0.46);
  ctx.bezierCurveTo(cx - 2, cy - r * 0.15, cx + 2, cy + r * 0.15, cx, cy + r * 0.46);
  ctx.strokeStyle = 'rgba(139,92,246,0.07)';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Electric field particles around brain
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2 + t * 0.2;
    const d = r * (0.6 + Math.sin(t + i * 1.3) * 0.05);
    const px = cx + Math.cos(a) * d;
    const py = cy + Math.sin(a) * d * 0.82;
    const alpha = 0.1 + Math.sin(t * 4 + i * 2) * 0.08;
    ctx.beginPath();
    ctx.arc(px, py, 1, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(168,85,247,${alpha})`;
    ctx.fill();
  }

  // Synapse nodes — 18 nodes
  const nodeCount = 18;
  const nodes: {x: number; y: number}[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const a = (i / nodeCount) * Math.PI * 2 + Math.sin(t * 0.3 + i) * 0.15;
    const dist = r * (0.12 + Math.abs(Math.sin(i * 2.3)) * 0.4);
    const nx = cx + Math.cos(a) * dist + mx * 10;
    const ny = cy + Math.sin(a) * dist * 0.82 + my * 6;
    nodes.push({x: nx, y: ny});
    const pulse = 0.3 + Math.sin(t * 3 + i * 1.5) * 0.3;

    // Node glow
    ctx.beginPath();
    ctx.arc(nx, ny, 6 + pulse * 5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(139,92,246,${pulse * 0.12})`;
    ctx.fill();
    // Node dot
    ctx.beginPath();
    ctx.arc(nx, ny, 3 + pulse * 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(168,85,247,${0.45 + pulse * 0.4})`;
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = pulse > 0.4 ? 10 : 0;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Generate bolts more frequently
  if (Math.random() < 0.12) {
    const i1 = Math.floor(Math.random() * nodeCount);
    const i2 = (i1 + 1 + Math.floor(Math.random() * (nodeCount - 2))) % nodeCount;
    const colors = ['6,182,212', '139,92,246', '168,85,247', '99,102,241'];
    bolts.push(generateBolt(
      nodes[i1].x, nodes[i1].y, nodes[i2].x, nodes[i2].y,
      colors[Math.floor(Math.random() * colors.length)], r * 0.3
    ));
  }

  // Draw bolts with branches
  bolts = bolts.filter(b => {
    b.life -= dt;
    if (b.life <= 0) return false;
    const alpha = b.life / b.maxLife;

    // Glow layer
    ctx.beginPath();
    b.points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = `rgba(${b.color},${alpha * 0.2})`;
    ctx.lineWidth = b.width * 3.5;
    ctx.stroke();

    // Core line
    ctx.beginPath();
    b.points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = `rgba(${b.color},${alpha * 0.85})`;
    ctx.shadowColor = `rgba(${b.color},0.6)`;
    ctx.shadowBlur = 12;
    ctx.lineWidth = b.width;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Branches
    b.branches.forEach(branch => {
      ctx.beginPath();
      branch.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = `rgba(${b.color},${alpha * 0.5})`;
      ctx.lineWidth = b.width * 0.5;
      ctx.stroke();
    });

    return true;
  });

  if (bolts.length > 15) bolts.splice(0, bolts.length - 15);

  // Center orb with energy rings
  const orbPulse = 3 + Math.sin(t * 4) * 1.5;
  for (let i = 0; i < 3; i++) {
    const ringR = orbPulse * (3 + i * 2.5);
    ctx.beginPath();
    ctx.arc(cx + mx * 8, cy + my * 5, ringR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(168,85,247,${0.06 - i * 0.015})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(cx + mx * 8, cy + my * 5, orbPulse * 3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(139,92,246,0.06)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + mx * 8, cy + my * 5, orbPulse, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(168,85,247,0.65)';
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 18;
  ctx.fill();
  ctx.shadowBlur = 0;
};
