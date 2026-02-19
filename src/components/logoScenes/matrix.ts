import type { SceneFn } from './types';

interface Column { x: number; y: number; speed: number; chars: string[]; len: number; }
let columns: Column[] = [];
let lastT = 0;

const AI_CHARS = 'アイウエオカキクケコ01{}[]<>=>+-*AIMLGPTnVision深層学習';

const initCols = (w: number, h: number) => {
  columns = [];
  const charW = 14;
  const count = Math.ceil(w / charW) + 2;
  for (let i = 0; i < count; i++) {
    const len = 8 + Math.floor(Math.random() * 20);
    const chars: string[] = [];
    for (let j = 0; j < len; j++) {
      chars.push(AI_CHARS[Math.floor(Math.random() * AI_CHARS.length)]);
    }
    columns.push({
      x: i * charW,
      y: -Math.random() * h * 1.5,
      speed: 60 + Math.random() * 120,
      chars,
      len,
    });
  }
};

/** The Code — dense AI-themed matrix rain */
export const drawMatrix: SceneFn = (ctx, w, h, mx, my, t) => {
  if (Math.abs(t - lastT) > 1 || columns.length === 0) initCols(w, h);
  const dt = Math.min(t - lastT, 0.05);
  lastT = t;

  ctx.font = '13px "Orbitron", monospace';
  ctx.textAlign = 'center';

  columns.forEach(col => {
    col.y += col.speed * dt;
    if (col.y > h + col.len * 16) {
      col.y = -col.len * 16 - Math.random() * h * 0.5;
      col.speed = 60 + Math.random() * 120;
      // Randomize some chars
      for (let j = 0; j < col.chars.length; j++) {
        if (Math.random() < 0.3) {
          col.chars[j] = AI_CHARS[Math.floor(Math.random() * AI_CHARS.length)];
        }
      }
    }

    col.chars.forEach((ch, j) => {
      const cy = col.y + j * 16;
      if (cy < -16 || cy > h + 16) return;

      const progress = j / col.len;
      const isHead = j === 0;
      const isBright = j < 3;

      if (isHead) {
        // Head char — bright white/cyan
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 12;
      } else if (isBright) {
        ctx.fillStyle = `rgba(6,182,212,${0.85 - j * 0.1})`;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 4;
      } else {
        const fade = Math.max(0, 1 - progress * 1.3);
        ctx.fillStyle = `rgba(6,182,212,${fade * 0.45})`;
        ctx.shadowBlur = 0;
      }

      // Random flicker
      if (Math.random() < 0.005) {
        col.chars[j] = AI_CHARS[Math.floor(Math.random() * AI_CHARS.length)];
      }

      ctx.fillText(ch, col.x, cy);
      ctx.shadowBlur = 0;
    });
  });

  // Subtle overlay glow
  const og = ctx.createLinearGradient(0, 0, 0, h);
  og.addColorStop(0, 'rgba(6,182,212,0.02)');
  og.addColorStop(0.5, 'transparent');
  og.addColorStop(1, 'rgba(6,182,212,0.02)');
  ctx.fillStyle = og;
  ctx.fillRect(0, 0, w, h);
};
