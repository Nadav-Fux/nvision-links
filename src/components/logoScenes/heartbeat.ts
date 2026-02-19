import type { SceneFn } from './types';

export const drawHeartbeat: SceneFn = (ctx, w, h, mx, my, t) => {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.4;

  // BPM affected by mouse Y
  const bpm = 1.2 + my * 0.5;
  const beatPhase = (t * bpm) % 1;

  // Background grid
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.06)';
  ctx.lineWidth = 0.5;
  const gridSize = r * 0.15;
  for (let x = cx - r; x <= cx + r; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, cy - r); ctx.lineTo(x, cy + r); ctx.stroke();
  }
  for (let y = cy - r; y <= cy + r; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(cx - r, y); ctx.lineTo(cx + r, y); ctx.stroke();
  }

  // EKG line
  const points = 200;
  ctx.beginPath();
  for (let i = 0; i < points; i++) {
    const progress = i / points;
    const x = cx - r * 0.85 + progress * r * 1.7;
    const phase = (progress * 3 + t * bpm * 2) % 1;

    let y = cy;
    // QRS complex
    if (phase > 0.35 && phase < 0.38) {
      y = cy + r * 0.05;
    } else if (phase > 0.38 && phase < 0.42) {
      y = cy - r * 0.45 * Math.sin((phase - 0.38) / 0.04 * Math.PI);
    } else if (phase > 0.42 && phase < 0.45) {
      y = cy + r * 0.12;
    } else if (phase > 0.55 && phase < 0.65) {
      // T wave
      y = cy - r * 0.1 * Math.sin((phase - 0.55) / 0.1 * Math.PI);
    }

    // Mouse distortion
    const dx = x - (cx + mx * r * 0.4);
    const dy = 0;
    const dist = Math.abs(dx);
    if (dist < r * 0.3) {
      y += (1 - dist / (r * 0.3)) * my * r * 0.15;
    }

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 15;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Beat pulse circle
  const beatSize = beatPhase < 0.15
    ? r * 0.15 * (1 + Math.sin(beatPhase / 0.15 * Math.PI) * 0.8)
    : r * 0.15;
  const beatAlpha = beatPhase < 0.15 ? 0.8 : 0.3;

  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.55, beatSize, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(6, 182, 212, ${beatAlpha * 0.2})`;
  ctx.fill();
  ctx.strokeStyle = `rgba(6, 182, 212, ${beatAlpha})`;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // BPM text
  ctx.font = 'bold 14px monospace';
  ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
  ctx.textAlign = 'center';
  const displayBPM = Math.round(60 + bpm * 30);
  ctx.fillText(`${displayBPM} BPM`, cx, cy + r * 0.7);

  // Expanding rings on beat
  if (beatPhase < 0.3) {
    const ringR = beatPhase / 0.3 * r * 0.5;
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(6, 182, 212, ${(1 - beatPhase / 0.3) * 0.3})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
};
