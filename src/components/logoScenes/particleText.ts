import type { SceneFn } from './types';

interface TextParticle { tx: number; ty: number; x: number; y: number; size: number; }
let particles: TextParticle[] = [];
let lastKey = '';
let lastT = 0;

/** AI Particles — 'AI' text formed by particles with interactive displacement */
export const drawParticleText: SceneFn = (ctx, w, h, mx, my, t) => {
  const key = `${w}|${h}`;
  if (key !== lastKey || particles.length === 0 || Math.abs(t - lastT) > 2) {
    lastKey = key;
    particles = [];

    const off = document.createElement('canvas');
    off.width = w; off.height = h;
    const oc = off.getContext('2d');
    if (!oc) return;

    // Draw "AI" in large Orbitron font
    const fs = Math.min(w * 0.35, h * 0.55);
    oc.font = `900 ${fs}px "Orbitron", Arial, sans-serif`;
    oc.textAlign = 'center';
    oc.textBaseline = 'middle';
    oc.fillStyle = '#fff';
    oc.fillText('AI', w / 2, h / 2);

    // Also draw a small circuit-like pattern
    oc.font = `400 ${fs * 0.12}px "Orbitron", monospace`;
    oc.fillText('ARTIFICIAL INTELLIGENCE', w / 2, h / 2 + fs * 0.45);

    if (w === 0 || h === 0) return;
    const data = oc.getImageData(0, 0, w, h).data;
    const step = Math.max(3, Math.round(fs / 22));

    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        if (data[(y * w + x) * 4 + 3] > 80) {
          particles.push({
            tx: x, ty: y,
            x: x + (Math.random() - 0.5) * 200,
            y: y + (Math.random() - 0.5) * 200,
            size: step * 0.5 + Math.random() * step * 0.3,
          });
        }
      }
    }
  }
  lastT = t;

  const mouseX = w / 2 + mx * w * 0.3;
  const mouseY = h / 2 + my * h * 0.3;
  const mouseR = Math.min(w, h) * 0.18;

  particles.forEach(p => {
    // Mouse displacement
    const dx = p.tx - mouseX;
    const dy = p.ty - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    let targetX = p.tx;
    let targetY = p.ty;

    if (dist < mouseR && dist > 0) {
      const force = (1 - dist / mouseR) * mouseR * 0.6;
      targetX = p.tx + (dx / dist) * force;
      targetY = p.ty + (dy / dist) * force;
    }

    // Smooth movement
    p.x += (targetX - p.x) * 0.08;
    p.y += (targetY - p.y) * 0.08;

    // Subtle float
    const floatX = Math.sin(t * 1.5 + p.tx * 0.02) * 1.5;
    const floatY = Math.cos(t * 1.2 + p.ty * 0.02) * 1.5;

    // Determine color based on position
    const isLeftHalf = p.tx < w / 2;
    const distFromMouse = Math.max(0, 1 - dist / (mouseR * 2));
    const alpha = 0.5 + distFromMouse * 0.4;

    ctx.fillStyle = isLeftHalf
      ? `rgba(6,182,212,${alpha})`
      : `rgba(139,92,246,${alpha})`;

    ctx.fillRect(
      p.x + floatX - p.size / 2,
      p.y + floatY - p.size / 2,
      p.size, p.size
    );
  });

  // Subtle glow behind text
  const glow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.min(w, h) * 0.35);
  glow.addColorStop(0, 'rgba(6,182,212,0.03)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
};
