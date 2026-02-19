import type { SceneFn } from './types';

/** Plasma Globe — enhanced with inner rings, orbiting sparks, multiple layers */
export const drawPlasma: SceneFn = (ctx, w, h, mx, my, t) => {
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) * 0.4;
  const mouseX = cx + mx * r * 0.55;
  const mouseY = cy + my * r * 0.55;

  // Outer glow
  const outerGlow = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r * 1.1);
  outerGlow.addColorStop(0, 'rgba(139,92,246,0.06)');
  outerGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = outerGlow;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.1, 0, Math.PI * 2);
  ctx.fill();

  // Glass sphere (double outline)
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.9, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(139,92,246,0.14)';
  ctx.lineWidth = 1.8;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.87, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(139,92,246,0.06)';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Internal energy rings
  for (let i = 0; i < 3; i++) {
    const ringT = t * (0.5 + i * 0.3);
    const tilt = 0.3 + i * 0.2;
    ctx.beginPath();
    for (let j = 0; j <= 60; j++) {
      const a = (j / 60) * Math.PI * 2;
      const rx = r * (0.4 + i * 0.15);
      const ry = rx * tilt;
      const px = cx + Math.cos(a + ringT) * rx;
      const py = cy + Math.sin(a + ringT) * ry;
      if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = `rgba(168,85,247,${0.06 - i * 0.015})`;
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }

  // Plasma ball center — brighter
  const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.28);
  coreGrad.addColorStop(0, 'rgba(168,85,247,0.7)');
  coreGrad.addColorStop(0.4, 'rgba(139,92,246,0.3)');
  coreGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.28, 0, Math.PI * 2);
  ctx.fill();

  // 12 Electric arcs toward mouse
  for (let a = 0; a < 12; a++) {
    const baseAngle = (a / 12) * Math.PI * 2 + t * 0.4;
    const targetX = cx + (mouseX - cx) * 0.75 + Math.cos(baseAngle) * r * 0.15;
    const targetY = cy + (mouseY - cy) * 0.75 + Math.sin(baseAngle) * r * 0.15;

    ctx.beginPath();
    ctx.moveTo(cx, cy);

    const segments = 10;
    let px = cx, py = cy;
    for (let s = 1; s <= segments; s++) {
      const progress = s / segments;
      const lerpX = cx + (targetX - cx) * progress;
      const lerpY = cy + (targetY - cy) * progress;
      const jitter = (1 - progress) * r * 0.14;
      const nx = lerpX + Math.sin(t * 15 + a * 7 + s * 3) * jitter;
      const ny = lerpY + Math.cos(t * 13 + a * 5 + s * 4) * jitter;
      ctx.lineTo(nx, ny);
      px = nx; py = ny;
    }

    const hue = a % 4 === 0 ? '6,182,212' : a % 4 === 1 ? '139,92,246' : a % 4 === 2 ? '168,85,247' : '99,102,241';
    const alpha = 0.35 + Math.sin(t * 8 + a * 2) * 0.2;

    // Glow layer
    ctx.strokeStyle = `rgba(${hue},${alpha * 0.3})`;
    ctx.lineWidth = 4;
    ctx.stroke();
    // Core
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    let px2 = cx, py2 = cy;
    for (let s = 1; s <= segments; s++) {
      const progress = s / segments;
      const lerpX = cx + (targetX - cx) * progress;
      const lerpY = cy + (targetY - cy) * progress;
      const jitter = (1 - progress) * r * 0.14;
      const nx = lerpX + Math.sin(t * 15 + a * 7 + s * 3) * jitter;
      const ny = lerpY + Math.cos(t * 13 + a * 5 + s * 4) * jitter;
      ctx.lineTo(nx, ny);
      px2 = nx; py2 = ny;
    }
    ctx.strokeStyle = `rgba(${hue},${alpha})`;
    ctx.lineWidth = 1.2 + Math.sin(t * 6 + a) * 0.5;
    ctx.shadowColor = `rgba(${hue},0.6)`;
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // End spark
    ctx.beginPath();
    ctx.arc(px2, py2, 2.5 + Math.random() * 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${hue},${alpha + 0.2})`;
    ctx.fill();
  }

  // Orbiting sparks around the sphere
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + t * 1.5;
    const d = r * 0.82;
    const sx = cx + Math.cos(a) * d;
    const sy = cy + Math.sin(a) * d * 0.6;
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5 + Math.sin(t * 5 + i * 2) * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(168,85,247,${0.4 + Math.sin(t * 3 + i) * 0.2})`;
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Core pulse — brighter
  const pulse = 7 + Math.sin(t * 5) * 3;
  ctx.beginPath();
  ctx.arc(cx, cy, pulse, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 30;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Glass reflection highlight
  ctx.beginPath();
  ctx.ellipse(cx - r * 0.25, cy - r * 0.3, r * 0.15, r * 0.05, -0.3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.fill();
};
