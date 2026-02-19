import type { SceneFn } from './types';

interface DataPacket { x: number; y: number; traceIdx: number; progress: number; speed: number; color: string; }
interface Trace { points: {x: number; y: number}[]; }
let traces: Trace[] = [];
let packets: DataPacket[] = [];
let lastKey = '';
let lastT = 0;

const COLORS = ['6,182,212', '139,92,246', '168,85,247', '99,102,241', '34,211,238'];

const initCircuit = (w: number, h: number) => {
  traces = [];
  packets = [];
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) * 0.42;

  // Generate orthogonal traces radiating from center
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const pts: {x: number; y: number}[] = [{x: cx, y: cy}];
    let x = cx, y = cy;
    const steps = 4 + Math.floor(Math.random() * 5);
    for (let s = 0; s < steps; s++) {
      const dist = r * (0.08 + Math.random() * 0.15);
      // Move in cardinal directions, mostly outward
      const outX = Math.cos(angle), outY = Math.sin(angle);
      if (Math.random() < 0.6) {
        // Outward
        x += outX * dist;
        y += outY * dist;
      } else {
        // Perpendicular turn
        const perp = Math.random() < 0.5 ? 1 : -1;
        x += -outY * dist * 0.6 * perp;
        y += outX * dist * 0.6 * perp;
      }
      pts.push({x, y});
    }
    traces.push({ points: pts });

    // Init packets
    packets.push({
      x: cx, y: cy, traceIdx: i,
      progress: Math.random(),
      speed: 0.3 + Math.random() * 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }
};

/** Circuit Board — AI chip with data flowing through PCB traces */
export const drawCircuit: SceneFn = (ctx, w, h, mx, my, t) => {
  const key = `${w}|${h}`;
  if (key !== lastKey || traces.length === 0 || Math.abs(t - lastT) > 2) {
    lastKey = key;
    initCircuit(w, h);
  }
  const dt = Math.min(t - lastT, 0.05);
  lastT = t;

  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) * 0.42;

  // Central chip
  const chipSize = r * 0.15;
  ctx.strokeStyle = 'rgba(6,182,212,0.2)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(cx - chipSize, cy - chipSize, chipSize * 2, chipSize * 2);
  // Chip inner glow
  const chipGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, chipSize);
  chipGlow.addColorStop(0, 'rgba(6,182,212,0.12)');
  chipGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = chipGlow;
  ctx.fillRect(cx - chipSize, cy - chipSize, chipSize * 2, chipSize * 2);

  // Chip label
  ctx.font = '8px "Orbitron", monospace';
  ctx.fillStyle = 'rgba(6,182,212,0.4)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('AI', cx, cy);

  // Draw traces
  traces.forEach((trace, ti) => {
    ctx.beginPath();
    trace.points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    });
    ctx.strokeStyle = `rgba(6,182,212,${0.08 + Math.sin(t + ti) * 0.03})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Junction dots
    trace.points.forEach((p, i) => {
      if (i === 0) return;
      ctx.beginPath();
      ctx.arc(p.x, p.y, i === trace.points.length - 1 ? 2.5 : 1.5, 0, Math.PI * 2);
      ctx.fillStyle = i === trace.points.length - 1
        ? `rgba(139,92,246,${0.3 + Math.sin(t * 2 + ti) * 0.15})`
        : 'rgba(6,182,212,0.15)';
      ctx.fill();
    });

    // Component box at end
    const end = trace.points[trace.points.length - 1];
    const compSize = 6;
    ctx.strokeStyle = `rgba(139,92,246,${0.12 + Math.sin(t * 3 + ti * 2) * 0.06})`;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(end.x - compSize, end.y - compSize, compSize * 2, compSize * 2);
  });

  // Animate data packets
  packets.forEach(p => {
    p.progress += p.speed * dt;
    if (p.progress >= 1) {
      p.progress = 0;
      p.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    const trace = traces[p.traceIdx];
    if (!trace) return;

    // Interpolate position along trace
    const totalLen = trace.points.length - 1;
    const segFloat = p.progress * totalLen;
    const seg = Math.floor(segFloat);
    const segProg = segFloat - seg;
    if (seg >= totalLen) return;

    const p1 = trace.points[seg];
    const p2 = trace.points[seg + 1];
    const px = p1.x + (p2.x - p1.x) * segProg;
    const py = p1.y + (p2.y - p1.y) * segProg;

    // Glow
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},0.15)`;
    ctx.fill();
    // Dot
    ctx.beginPath();
    ctx.arc(px, py, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},0.8)`;
    ctx.shadowColor = `rgba(${p.color},0.6)`;
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // Pin connections around chip edges
  for (let side = 0; side < 4; side++) {
    for (let i = 0; i < 4; i++) {
      const offset = (i - 1.5) * chipSize * 0.4;
      let px: number, py: number, dx: number, dy: number;
      if (side === 0) { px = cx - chipSize; py = cy + offset; dx = -6; dy = 0; }
      else if (side === 1) { px = cx + chipSize; py = cy + offset; dx = 6; dy = 0; }
      else if (side === 2) { px = cx + offset; py = cy - chipSize; dx = 0; dy = -6; }
      else { px = cx + offset; py = cy + chipSize; dx = 0; dy = 6; }
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + dx, py + dy);
      ctx.strokeStyle = 'rgba(6,182,212,0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  // Corner labels
  ctx.font = '6px "Orbitron", monospace';
  ctx.fillStyle = 'rgba(6,182,212,0.12)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('PCB.AI.v1', cx - r + 5, cy - r + 5);
  ctx.textAlign = 'right';
  ctx.fillText('SILICON', cx + r - 5, cy - r + 5);
};
