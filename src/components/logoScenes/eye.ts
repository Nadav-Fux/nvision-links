import type { SceneFn } from './types';

/** AI Vision Eye — enhanced with HUD, data streams, complex iris */
export const drawEye: SceneFn = (ctx, w, h, mx, my, t) => {
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) * 0.28;

  ctx.save();
  ctx.translate(cx, cy);

  // Outer scanning rings (5 rings, multi-directional)
  for (let i = 0; i < 5; i++) {
    const ringR = r * (1.06 + i * 0.07);
    const rot = t * (0.3 + i * 0.12) * (i % 2 === 0 ? 1 : -1);
    const arcLen = Math.PI * (0.25 + Math.sin(t + i) * 0.1);
    ctx.beginPath();
    ctx.arc(0, 0, ringR, rot, rot + arcLen);
    ctx.strokeStyle = `rgba(6,182,212,${0.14 - i * 0.025})`;
    ctx.lineWidth = i === 0 ? 1.5 : 0.8;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, ringR, rot + Math.PI, rot + Math.PI + arcLen * 0.8);
    ctx.stroke();
    // Tick marks on outer ring
    if (i === 0) {
      for (let j = 0; j < 24; j++) {
        const a = (j / 24) * Math.PI * 2 + rot;
        const len = j % 6 === 0 ? 5 : 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * ringR, Math.sin(a) * ringR);
        ctx.lineTo(Math.cos(a) * (ringR + len), Math.sin(a) * (ringR + len));
        ctx.strokeStyle = `rgba(6,182,212,${j % 6 === 0 ? 0.15 : 0.06})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  // Floating data points orbiting
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + t * 0.4;
    const d = r * (1.15 + Math.sin(t * 1.5 + i * 2) * 0.05);
    const dx = Math.cos(a) * d, dy = Math.sin(a) * d;
    ctx.beginPath();
    ctx.arc(dx, dy, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(6,182,212,${0.3 + Math.sin(t * 2 + i) * 0.2})`;
    ctx.fill();
    // Connection to eye
    ctx.beginPath();
    ctx.moveTo(dx, dy);
    const edgeA = Math.atan2(dy, dx);
    ctx.lineTo(Math.cos(edgeA) * r * 0.95, Math.sin(edgeA) * r * 0.95);
    ctx.strokeStyle = `rgba(6,182,212,${0.04 + Math.sin(t * 3 + i) * 0.02})`;
    ctx.lineWidth = 0.3;
    ctx.stroke();
  }

  // Eye white (sclera) — almond shape
  ctx.beginPath();
  ctx.moveTo(-r * 0.95, 0);
  ctx.bezierCurveTo(-r * 0.5, -r * 0.62, r * 0.5, -r * 0.62, r * 0.95, 0);
  ctx.bezierCurveTo(r * 0.5, r * 0.62, -r * 0.5, r * 0.62, -r * 0.95, 0);
  ctx.closePath();
  const eyeGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.9);
  eyeGrad.addColorStop(0, 'rgba(6,182,212,0.1)');
  eyeGrad.addColorStop(0.7, 'rgba(6,182,212,0.03)');
  eyeGrad.addColorStop(1, 'rgba(6,182,212,0.01)');
  ctx.fillStyle = eyeGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(6,182,212,0.35)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Iris — multi-layered
  const irisR = r * 0.44;
  const px = mx * r * 0.14, py = my * r * 0.1;

  // Iris outer glow
  const irisOuter = ctx.createRadialGradient(px, py, irisR * 0.6, px, py, irisR * 1.1);
  irisOuter.addColorStop(0, 'transparent');
  irisOuter.addColorStop(0.7, 'rgba(6,182,212,0.06)');
  irisOuter.addColorStop(1, 'transparent');
  ctx.fillStyle = irisOuter;
  ctx.beginPath();
  ctx.arc(px, py, irisR * 1.1, 0, Math.PI * 2);
  ctx.fill();

  // Iris main
  const irisGrad = ctx.createRadialGradient(px, py, irisR * 0.15, px, py, irisR);
  irisGrad.addColorStop(0, 'rgba(6,182,212,0.55)');
  irisGrad.addColorStop(0.3, 'rgba(99,102,241,0.4)');
  irisGrad.addColorStop(0.6, 'rgba(139,92,246,0.3)');
  irisGrad.addColorStop(0.85, 'rgba(168,85,247,0.2)');
  irisGrad.addColorStop(1, 'rgba(139,92,246,0.08)');
  ctx.beginPath();
  ctx.arc(px, py, irisR, 0, Math.PI * 2);
  ctx.fillStyle = irisGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(6,182,212,0.4)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Concentric iris rings
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath();
    ctx.arc(px, py, irisR * (0.35 + i * 0.18), 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(6,182,212,${0.08 - i * 0.02})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // Circuit patterns in iris (16 radials)
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + t * 0.35;
    const d1 = irisR * 0.25, d2 = irisR * 0.9;
    ctx.beginPath();
    ctx.moveTo(px + Math.cos(a) * d1, py + Math.sin(a) * d1);
    // Add small bend in the middle
    const midD = irisR * 0.55;
    const bend = (i % 2 === 0 ? 1 : -1) * 2;
    ctx.quadraticCurveTo(
      px + Math.cos(a) * midD + bend, py + Math.sin(a) * midD + bend,
      px + Math.cos(a) * d2, py + Math.sin(a) * d2
    );
    ctx.strokeStyle = `rgba(6,182,212,${0.12 + Math.sin(t * 2 + i) * 0.06})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // Pupil
  const pupilR = irisR * 0.38;
  const pupilPulse = 1 + Math.sin(t * 2.5) * 0.06;
  ctx.beginPath();
  ctx.arc(px, py, pupilR * pupilPulse, 0, Math.PI * 2);
  ctx.fillStyle = '#0a0a14';
  ctx.fill();
  // Inner glow
  ctx.beginPath();
  ctx.arc(px, py, pupilR * 0.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(6,182,212,0.45)';
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 15;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Highlight spots
  ctx.beginPath();
  ctx.arc(px + pupilR * 0.4, py - pupilR * 0.4, pupilR * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(px - pupilR * 0.25, py + pupilR * 0.3, pupilR * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fill();

  // Scanning line sweep
  const scanX = Math.sin(t * 1.5) * r * 0.9;
  ctx.beginPath();
  ctx.moveTo(scanX, -r * 0.58);
  ctx.lineTo(scanX, r * 0.58);
  ctx.strokeStyle = 'rgba(6,182,212,0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();
  const scanGr = ctx.createLinearGradient(scanX - 20, 0, scanX + 20, 0);
  scanGr.addColorStop(0, 'transparent');
  scanGr.addColorStop(0.5, 'rgba(6,182,212,0.08)');
  scanGr.addColorStop(1, 'transparent');
  ctx.fillStyle = scanGr;
  ctx.fillRect(scanX - 20, -r * 0.58, 40, r * 1.16);

  // HUD data readouts
  ctx.font = '8px "Orbitron", monospace';
  ctx.fillStyle = `rgba(6,182,212,${0.22 + Math.sin(t * 3) * 0.08})`;
  ctx.textAlign = 'left';
  ctx.fillText('SCAN', -r * 0.88, -r * 0.46);
  ctx.fillText(`${Math.round(t * 10) % 100}%`, -r * 0.88, -r * 0.34);
  ctx.fillText('IRIS.REC', -r * 0.88, r * 0.36);
  ctx.textAlign = 'right';
  ctx.fillText('AI.VISION', r * 0.88, -r * 0.46);
  ctx.fillText('LOCK: ON', r * 0.88, -r * 0.34);
  ctx.fillText(`T:${(t % 60).toFixed(1)}s`, r * 0.88, r * 0.36);

  // Corner brackets (HUD frame)
  const bLen = 8;
  ctx.strokeStyle = 'rgba(6,182,212,0.12)';
  ctx.lineWidth = 1;
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => {
    const bx = sx * r * 0.92, by = sy * r * 0.52;
    ctx.beginPath();
    ctx.moveTo(bx, by - sy * bLen);
    ctx.lineTo(bx, by);
    ctx.lineTo(bx - sx * bLen, by);
    ctx.stroke();
  });

  ctx.restore();
};
