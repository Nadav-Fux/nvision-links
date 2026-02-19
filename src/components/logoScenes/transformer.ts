import type { SceneFn } from './types';

/** Transformer Attention — multi-head attention visualization with tokens */
export const drawTransformer: SceneFn = (ctx, w, h, mx, my, t) => {
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) * 0.42;

  const tokens = ['The', 'AI', 'model', 'learns', 'from', 'data', 'to', 'predict'];
  const numTokens = tokens.length;
  const tokenSpacing = r * 1.6 / numTokens;
  const startX = cx - (numTokens - 1) * tokenSpacing / 2;
  const topY = cy - r * 0.35;
  const bottomY = cy + r * 0.35;

  // Background grid
  ctx.strokeStyle = 'rgba(6,182,212,0.02)';
  ctx.lineWidth = 0.3;
  for (let i = 0; i < 20; i++) {
    const y = cy - r + (i / 19) * r * 2;
    ctx.beginPath(); ctx.moveTo(cx - r, y); ctx.lineTo(cx + r, y); ctx.stroke();
  }

  // Token positions (top row = input, bottom row = output)
  const tokenPositions: {x: number; topY: number; bottomY: number;}[] = [];
  for (let i = 0; i < numTokens; i++) {
    tokenPositions.push({ x: startX + i * tokenSpacing, topY, bottomY });
  }

  // Attention connections — animated weights
  const activeHead = Math.floor(t * 0.3) % 4;
  const headColors = ['6,182,212', '139,92,246', '168,85,247', '99,102,241'];

  for (let head = 0; head < 4; head++) {
    const headAlpha = head === activeHead ? 1 : 0.2;
    const color = headColors[head];
    const headOffset = (head - 1.5) * 3;

    for (let i = 0; i < numTokens; i++) {
      for (let j = 0; j < numTokens; j++) {
        // Attention weight simulation (varies with time)
        const weight = Math.pow(Math.max(0, Math.sin(t * 0.5 + i * 1.3 + j * 0.7 + head * 2)), 3);
        if (weight < 0.1) continue;

        const alpha = weight * 0.3 * headAlpha;
        const sp = tokenPositions[i];
        const ep = tokenPositions[j];

        ctx.beginPath();
        ctx.moveTo(sp.x + headOffset, sp.topY + 12);
        // Curve through middle
        const midY = (sp.topY + ep.bottomY) / 2 + Math.sin(t + i + j) * 10;
        ctx.quadraticCurveTo(
          (sp.x + ep.x) / 2 + headOffset,
          midY,
          ep.x + headOffset,
          ep.bottomY - 12
        );
        ctx.strokeStyle = `rgba(${color},${alpha})`;
        ctx.lineWidth = weight * 2;
        ctx.stroke();
      }
    }
  }

  // Draw tokens (top — input)
  ctx.font = '9px "Orbitron", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  tokenPositions.forEach((pos, i) => {
    // Box
    const bw = tokenSpacing * 0.8;
    const bh = 18;
    ctx.strokeStyle = `rgba(6,182,212,${0.2 + Math.sin(t * 2 + i) * 0.08})`;
    ctx.lineWidth = 0.8;
    ctx.strokeRect(pos.x - bw / 2, pos.topY - bh / 2, bw, bh);
    // Fill
    ctx.fillStyle = `rgba(6,182,212,${0.04 + Math.sin(t + i * 0.5) * 0.02})`;
    ctx.fillRect(pos.x - bw / 2, pos.topY - bh / 2, bw, bh);
    // Text
    ctx.fillStyle = `rgba(6,182,212,${0.5 + Math.sin(t * 1.5 + i) * 0.2})`;
    ctx.fillText(tokens[i], pos.x, pos.topY);
  });

  // Draw tokens (bottom — output)
  tokenPositions.forEach((pos, i) => {
    const bw = tokenSpacing * 0.8;
    const bh = 18;
    ctx.strokeStyle = `rgba(139,92,246,${0.2 + Math.sin(t * 2 + i + 1) * 0.08})`;
    ctx.lineWidth = 0.8;
    ctx.strokeRect(pos.x - bw / 2, pos.bottomY - bh / 2, bw, bh);
    ctx.fillStyle = `rgba(139,92,246,${0.04 + Math.sin(t + i * 0.5 + 1) * 0.02})`;
    ctx.fillRect(pos.x - bw / 2, pos.bottomY - bh / 2, bw, bh);
    ctx.fillStyle = `rgba(139,92,246,${0.5 + Math.sin(t * 1.5 + i + 1) * 0.2})`;
    ctx.fillText(tokens[i], pos.x, pos.bottomY);
  });

  // Attention head labels
  ctx.font = '6px "Orbitron", monospace';
  const headY = cy;
  for (let h = 0; h < 4; h++) {
    const hx = cx + (h - 1.5) * r * 0.2;
    const isActive = h === activeHead;
    ctx.fillStyle = `rgba(${headColors[h]},${isActive ? 0.5 : 0.15})`;
    ctx.fillText(`H${h + 1}`, hx, headY);
    if (isActive) {
      ctx.beginPath();
      ctx.arc(hx, headY, 12, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${headColors[h]},0.15)`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }

  // Data flow particles along connections
  for (let i = 0; i < 6; i++) {
    const pT = (t * 0.8 + i * 0.3) % 1;
    const srcIdx = Math.floor(i * 1.3) % numTokens;
    const dstIdx = (srcIdx + 1 + Math.floor(i * 0.7)) % numTokens;
    const sp = tokenPositions[srcIdx];
    const ep = tokenPositions[dstIdx];
    const px = sp.x + (ep.x - sp.x) * pT;
    const py = sp.topY + 12 + (ep.bottomY - 12 - sp.topY - 12) * pT + Math.sin(pT * Math.PI) * -15;

    ctx.beginPath();
    ctx.arc(px, py, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(34,211,238,${0.5 * (1 - Math.abs(pT - 0.5) * 2)})`;
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Labels
  ctx.font = '7px "Orbitron", monospace';
  ctx.fillStyle = 'rgba(6,182,212,0.15)';
  ctx.textAlign = 'center';
  ctx.fillText('INPUT EMBEDDINGS', cx, topY - 18);
  ctx.fillStyle = 'rgba(139,92,246,0.15)';
  ctx.fillText('OUTPUT LOGITS', cx, bottomY + 18);
  ctx.fillStyle = 'rgba(6,182,212,0.1)';
  ctx.fillText('MULTI-HEAD ATTENTION', cx, cy + r * 0.48);
};
