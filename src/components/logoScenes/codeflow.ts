import type { SceneFn } from './types';

const CODE_LINES = [
  { text: 'const model = new AI();', indent: 0, color: '139,92,246' },
  { text: 'await model.train(data);', indent: 0, color: '6,182,212' },
  { text: 'const result = model.predict({', indent: 0, color: '139,92,246' },
  { text: '  input: "vibe coding",', indent: 1, color: '168,85,247' },
  { text: '  temperature: 0.7,', indent: 1, color: '168,85,247' },
  { text: '  maxTokens: 1024,', indent: 1, color: '168,85,247' },
  { text: '});', indent: 0, color: '139,92,246' },
  { text: '', indent: 0, color: '6,182,212' },
  { text: 'if (result.confidence > 0.95) {', indent: 0, color: '99,102,241' },
  { text: '  console.log("nVision AI");', indent: 1, color: '34,211,238' },
  { text: '  deploy(result);', indent: 1, color: '6,182,212' },
  { text: '}', indent: 0, color: '99,102,241' },
  { text: '', indent: 0, color: '6,182,212' },
  { text: 'function vibeCode(prompt) {', indent: 0, color: '251,191,36' },
  { text: '  return llm.generate({', indent: 1, color: '6,182,212' },
  { text: '    system: "expert coder",', indent: 2, color: '168,85,247' },
  { text: '    prompt,', indent: 2, color: '168,85,247' },
  { text: '  });', indent: 1, color: '6,182,212' },
  { text: '}', indent: 0, color: '251,191,36' },
];

/** Vibe Code — animated code being typed with syntax highlighting */
export const drawCodeflow: SceneFn = (ctx, w, h, mx, my, t) => {
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) * 0.42;

  // Terminal window border
  const termW = r * 1.6;
  const termH = r * 1.4;
  const termX = cx - termW / 2;
  const termY = cy - termH / 2;

  // Terminal background
  ctx.fillStyle = 'rgba(10,10,20,0.3)';
  ctx.strokeStyle = 'rgba(6,182,212,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(termX, termY, termW, termH, 6);
  ctx.fill();
  ctx.stroke();

  // Title bar
  ctx.fillStyle = 'rgba(6,182,212,0.06)';
  ctx.fillRect(termX, termY, termW, 16);
  ctx.beginPath();
  ctx.moveTo(termX, termY + 16);
  ctx.lineTo(termX + termW, termY + 16);
  ctx.strokeStyle = 'rgba(6,182,212,0.1)';
  ctx.stroke();

  // Traffic lights
  const dotY = termY + 8;
  [['244,114,182'], ['251,191,36'], ['52,211,153']].forEach((c, i) => {
    ctx.beginPath();
    ctx.arc(termX + 12 + i * 10, dotY, 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${c},0.4)`;
    ctx.fill();
  });

  // Title text
  ctx.font = '7px "Orbitron", monospace';
  ctx.fillStyle = 'rgba(6,182,212,0.25)';
  ctx.textAlign = 'center';
  ctx.fillText('vibe-code.ts', cx, dotY + 2);

  // Line numbers + code
  const lineH = 13;
  const codeStartY = termY + 24;
  const visibleChars = Math.floor(t * 25);
  let totalChars = 0;

  ctx.textAlign = 'left';
  CODE_LINES.forEach((line, lineIdx) => {
    const y = codeStartY + lineIdx * lineH;
    if (y > termY + termH - 8) return;

    // Line number
    ctx.font = '8px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillText(`${lineIdx + 1}`.padStart(2, ' '), termX + 6, y);

    // Code text (typed animation)
    const lineChars = line.text.length;
    const charsToShow = Math.max(0, Math.min(lineChars, visibleChars - totalChars));
    totalChars += lineChars;

    if (charsToShow > 0) {
      const shown = line.text.substring(0, charsToShow);
      const indentX = termX + 28 + line.indent * 14;

      ctx.font = '9px "Courier New", monospace';
      ctx.fillStyle = `rgba(${line.color},${0.6 + Math.sin(t + lineIdx * 0.5) * 0.15})`;
      ctx.fillText(shown, indentX, y);

      // Cursor at end of current line being typed
      if (charsToShow < lineChars && charsToShow === visibleChars - (totalChars - lineChars)) {
        const cursorX = indentX + ctx.measureText(shown).width;
        ctx.fillStyle = `rgba(6,182,212,${Math.sin(t * 6) > 0 ? 0.8 : 0.1})`;
        ctx.fillRect(cursorX + 1, y - 9, 6, 11);
      }
    }
  });

  // Blinking cursor at bottom when all typed
  const allChars = CODE_LINES.reduce((sum, l) => sum + l.text.length, 0);
  if (visibleChars >= allChars) {
    const lastVisibleLine = Math.min(CODE_LINES.length - 1, Math.floor((termY + termH - 8 - codeStartY) / lineH));
    const cursorY = codeStartY + (lastVisibleLine + 1) * lineH;
    if (cursorY < termY + termH - 8) {
      ctx.fillStyle = `rgba(6,182,212,${Math.sin(t * 5) > 0 ? 0.7 : 0.1})`;
      ctx.fillRect(termX + 28, cursorY - 9, 6, 11);
    }
  }

  // Ambient particles (floating code fragments)
  for (let i = 0; i < 8; i++) {
    const px = cx + Math.sin(t * 0.5 + i * 1.7) * r * 0.8;
    const py = cy + Math.cos(t * 0.3 + i * 2.3) * r * 0.6;
    ctx.font = '7px monospace';
    ctx.fillStyle = `rgba(6,182,212,${0.06 + Math.sin(t + i * 2) * 0.03})`;
    ctx.fillText(['0', '1', '{', '}', '<', '>', '/', '='][i], px, py);
  }
};
