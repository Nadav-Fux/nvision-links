import { useEffect, useRef, useState, useCallback } from 'react';
import { activeScenes as scenes } from '@/components/logoScenes';
import type { TransitionType } from '@/components/logoScenes';

/* ── Particle ── */
interface Particle {
  tx: number;ty: number; // text position
  rAngle: number; // random angle
  rDist: number; // random distance factor 0.4-1
  rSeed: number; // random 0-1
  size: number;
  isCyan: boolean;
}

/* ── Timing ── */
const P = { TEXT: 3600, DISSOLVE: 1400, SCENE: 4400, REFORM: 1400 };
const CYCLE = P.TEXT + P.DISSOLVE + P.SCENE + P.REFORM;

const easeIO = (t: number) =>
t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/* ── Scatter position per transition type ── */
const getScatter = (
p: Particle, type: TransitionType, progress: number,
w: number, h: number)
: {x: number;y: number;alpha: number;} => {
  const e = easeIO(progress);
  const cx = w / 2,cy = h / 2;
  const R = Math.min(w, h);
  let sx: number, sy: number;
  let alpha = 0.85 * (1 - e * 0.9);

  switch (type) {
    case 'explode':{
        const d = p.rDist * R * 0.65;
        sx = cx + Math.cos(p.rAngle) * d;
        sy = cy + Math.sin(p.rAngle) * d;
        break;
      }
    case 'vortex':{
        const spiralA = p.rAngle + e * Math.PI * 3.5;
        const spiralD = e * p.rDist * R * 0.55;
        sx = cx + Math.cos(spiralA) * spiralD;
        sy = cy + Math.sin(spiralA) * spiralD;
        break;
      }
    case 'rain':{
        sx = p.tx + (p.rSeed - 0.5) * 60;
        sy = p.ty + p.rDist * h * 1.1;
        break;
      }
    case 'rise':{
        sx = p.tx + Math.sin(p.rAngle * 4) * 45;
        sy = p.ty - p.rDist * h * 1.1;
        break;
      }
    case 'shatter':{
        // Quantize angles → shard effect
        const shardA = Math.round(p.rAngle / (Math.PI / 5)) * (Math.PI / 5);
        const d2 = p.rDist * R * 0.55;
        sx = p.tx + Math.cos(shardA) * d2;
        sy = p.ty + Math.sin(shardA) * d2;
        // Shards stay visible longer
        alpha = 0.9 * (1 - e * 0.75);
        break;
      }
    case 'wave':{
        // Ripple from center — inner particles move first
        const distC = Math.sqrt((p.tx - cx) ** 2 + (p.ty - cy) ** 2);
        const maxD = R * 0.5 || 1;
        const delay = distC / maxD * 0.45;
        const waveE = easeIO(clamp01(progress * 1.5 - delay));
        sx = cx + (p.tx - cx) * 2.8;
        sy = cy + (p.ty - cy) * 2.8;
        alpha = 0.85 * (1 - waveE * 0.9);
        return { x: lerp(p.tx, sx, waveE), y: lerp(p.ty, sy, waveE), alpha };
      }
    case 'fade':{
        // Particles stay in place, just fade out with subtle drift
        sx = p.tx + Math.sin(p.rAngle * 3) * e * 15;
        sy = p.ty + Math.cos(p.rAngle * 2) * e * 15;
        alpha = 0.85 * (1 - e);
        break;
      }
    case 'spiral':{
        // Tight inward spiral (opposite of vortex — converge to center)
        const spA = p.rAngle - e * Math.PI * 5;
        const spD = (1 - e) * p.rDist * R * 0.4;
        sx = cx + Math.cos(spA) * spD;
        sy = cy + Math.sin(spA) * spD;
        alpha = 0.8 * (1 - e * 0.85);
        break;
      }
    case 'glitch':{
        // Random displacement jitter that increases
        const jX = (Math.sin(p.rSeed * 100 + progress * 20) * 2 - 1) * R * 0.3 * e;
        const jY = (Math.cos(p.rSeed * 73 + progress * 15) * 2 - 1) * R * 0.2 * e;
        sx = p.tx + jX;
        sy = p.ty + jY;
        // Flickering alpha
        alpha = 0.85 * (1 - e * 0.8) * (0.5 + Math.sin(progress * 30 + p.rSeed * 10) * 0.5);
        break;
      }
    case 'portal':{
        // Sucked into center point
        const portalE = easeIO(Math.min(1, progress * 1.3));
        sx = cx;
        sy = cy;
        alpha = 0.85 * (1 - portalE * 0.95);
        return { x: lerp(p.tx, sx, portalE), y: lerp(p.ty, sy, portalE), alpha };
      }
    case 'cascade':{
        // Sequential left-to-right dissolution
        const normX = p.tx / w;
        const cDelay = normX * 0.6;
        const cE = easeIO(clamp01((progress - cDelay) * 2.5));
        sx = p.tx + cE * 80;
        sy = p.ty + cE * (p.rSeed - 0.5) * 100;
        alpha = 0.85 * (1 - cE * 0.9);
        return { x: lerp(p.tx, sx, cE), y: lerp(p.ty, sy, cE), alpha };
      }
    case 'orbit':{
        // Circular orbit before flying off
        const orbitA = p.rAngle + e * Math.PI * 2;
        const orbitD = e * p.rDist * R * 0.5;
        const drift = Math.max(0, e - 0.6) * R * 0.8;
        sx = cx + Math.cos(orbitA) * (orbitD + drift);
        sy = cy + Math.sin(orbitA) * (orbitD + drift);
        alpha = 0.85 * (1 - e * 0.85);
        break;
      }
    case 'zoom':{
        // Zoom out from center — particles scale outward
        const zDir = Math.atan2(p.ty - cy, p.tx - cx);
        const zDist = Math.sqrt((p.tx - cx) ** 2 + (p.ty - cy) ** 2);
        const zScale = 1 + e * 3;
        sx = cx + Math.cos(zDir) * zDist * zScale;
        sy = cy + Math.sin(zDir) * zDist * zScale;
        alpha = 0.85 * (1 - e * 0.9);
        break;
      }
  }

  return { x: lerp(p.tx, sx, e), y: lerp(p.ty, sy, e), alpha };
};

/* ── Transition accent colors per type ── */
const transAccent: Record<TransitionType, string> = {
  explode: '168,85,247',
  vortex: '99,102,241',
  rain: '6,182,212',
  rise: '251,191,36',
  shatter: '139,92,246',
  wave: '34,211,238',
  fade: '168,85,247',
  spiral: '99,102,241',
  glitch: '6,182,212',
  portal: '139,92,246',
  cascade: '34,211,238',
  orbit: '168,85,247',
  zoom: '251,191,36',
};

/* ══════════════════════════ Component ══════════════════════════ */
export const TextLogoMorph = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const sceneIdxRef = useRef(0);
  const [currentScene, setCurrentScene] = useState(0);
  // Start in REFORM phase so first thing is particles assembling
  const startRef = useRef(Date.now() - (CYCLE - P.REFORM));
  const initKeyRef = useRef('');
  const fontSizeRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  /* ── pointer tracking ── */
  const onPointer = useCallback((px: number, py: number) => {
    const el = boxRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = r.left + r.width / 2;
    const my = r.top + r.height / 2;
    const d = Math.max(r.width, r.height);
    mouseRef.current = {
      x: clamp01((px - mx) / d * 2 + 0.5) * 2 - 1,
      y: clamp01((py - my) / d * 2 + 0.5) * 2 - 1
    };
  }, []);

  useEffect(() => {
    const mm = (e: MouseEvent) => onPointer(e.clientX, e.clientY);
    const tm = (e: TouchEvent) => {if (e.touches[0]) onPointer(e.touches[0].clientX, e.touches[0].clientY);};
    window.addEventListener('mousemove', mm);
    window.addEventListener('touchmove', tm, { passive: true });
    return () => {window.removeEventListener('mousemove', mm);window.removeEventListener('touchmove', tm);};
  }, [onPointer]);

  /* ── sample particles from text ── */
  const initParticles = useCallback((w: number, h: number) => {
    if (w <= 0 || h <= 0) return;
    const k = `${w}|${h}`;
    if (initKeyRef.current === k) return;
    initKeyRef.current = k;

    const off = document.createElement('canvas');
    off.width = w; off.height = h;
    const oc = off.getContext('2d');
    if (!oc) return;

    // Draw multi-line text for particle sampling
    const mainSize = Math.min(w * 0.15, h * 0.32);
    const subSize = mainSize * 0.32;
    const aiSize = mainSize * 0.38;
    const cy = h / 2;

    // "nVision" — large, top line
    oc.font = `900 ${mainSize}px "Orbitron", sans-serif`;
    oc.textAlign = 'center';
    oc.textBaseline = 'middle';
    oc.fillStyle = '#fff';
    oc.fillText('nVision', w / 2, cy - mainSize * 0.22);

    // "DIGITAL" — smaller, spaced, below
    oc.font = `600 ${subSize}px "Orbitron", sans-serif`;
    oc.letterSpacing = `${subSize * 0.5}px`;
    oc.fillText('DIGITAL', w / 2, cy + mainSize * 0.38);

    // "AI" — accent, right side
    oc.font = `900 ${aiSize}px "Orbitron", sans-serif`;
    oc.letterSpacing = '0px';
    oc.fillText('AI', w / 2 + w * 0.23, cy + mainSize * 0.38);

    fontSizeRef.current = mainSize;

    const data = oc.getImageData(0, 0, w, h).data;
    const step = Math.max(3, Math.round(mainSize / 10));
    const pts: Particle[] = [];
    const midX = w / 2;
    const splitY = cy + mainSize * 0.08;

    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        if (data[(y * w + x) * 4 + 3] > 80) {
          pts.push({
            tx: x, ty: y,
            rAngle: Math.random() * Math.PI * 2,
            rDist: 0.4 + Math.random() * 0.6,
            rSeed: Math.random(),
            size: step * 0.55 + Math.random() * step * 0.3,
            isCyan: y < splitY,
          });
        }
      }
    }
    particlesRef.current = pts;
  }, []);

  /* ── main canvas loop ── */
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const p = boxRef.current;
      if (!p) return;
      const w = p.clientWidth, h = p.clientHeight;
      if (w <= 0 || h <= 0) return;
      cvs.width = w * dpr; cvs.height = h * dpr;
      cvs.style.width = `${w}px`; cvs.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w, h };
      initKeyRef.current = '';
      initParticles(w, h);
    };
    resize();
    window.addEventListener('resize', resize);

    /* helpers */
    const paintText = (w: number, h: number, alpha: number, t: number) => {
      const fs = fontSizeRef.current;
      if (!fs) return;
      ctx.save();
      ctx.globalAlpha = alpha;

      const subFs = fs * 0.32;
      const aiFs = fs * 0.38;
      const cy = h / 2;
      const mainY = cy - fs * 0.22;
      const subY = cy + fs * 0.38;

      /* ──── nVision (hero text) ──── */
      ctx.font = `900 ${fs}px "Orbitron", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const tw = ctx.measureText('nVision').width;
      const sx = w / 2 - tw / 2;

      // Layer 1: Deep outer glow
      ctx.shadowColor = 'rgba(6,182,212,0.6)';
      ctx.shadowBlur = 50;
      const mainGrad = ctx.createLinearGradient(sx, mainY - fs * 0.4, sx + tw, mainY + fs * 0.4);
      mainGrad.addColorStop(0, '#22d3ee');
      mainGrad.addColorStop(0.35, '#06b6d4');
      mainGrad.addColorStop(0.6, '#a78bfa');
      mainGrad.addColorStop(1, '#c4b5fd');
      ctx.fillStyle = mainGrad;
      ctx.fillText('nVision', w / 2, mainY);

      // Layer 2: White core for brightness
      ctx.shadowColor = 'rgba(255,255,255,0.4)';
      ctx.shadowBlur = 8;
      const coreGrad = ctx.createLinearGradient(sx, mainY - fs * 0.3, sx, mainY + fs * 0.3);
      coreGrad.addColorStop(0, 'rgba(255,255,255,0.25)');
      coreGrad.addColorStop(0.5, 'rgba(255,255,255,0.08)');
      coreGrad.addColorStop(1, 'rgba(255,255,255,0.15)');
      ctx.fillStyle = coreGrad;
      ctx.fillText('nVision', w / 2, mainY);
      ctx.shadowBlur = 0;

      // Layer 3: Top highlight edge
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, w, mainY);
      ctx.clip();
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillText('nVision', w / 2, mainY - 0.5);
      ctx.restore();

      /* ──── Animated shimmer on nVision ──── */
      const shimmerX = (((t * 0.15) % 1.6) - 0.3) * (tw + 100);
      const shimmerW = tw * 0.25;
      ctx.save();
      // Clip to text bounds roughly
      ctx.beginPath();
      ctx.rect(sx - 10, mainY - fs * 0.5, tw + 20, fs);
      ctx.clip();
      const shimGrad = ctx.createLinearGradient(sx + shimmerX, 0, sx + shimmerX + shimmerW, 0);
      shimGrad.addColorStop(0, 'transparent');
      shimGrad.addColorStop(0.5, 'rgba(255,255,255,0.12)');
      shimGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = shimGrad;
      ctx.font = `900 ${fs}px "Orbitron", sans-serif`;
      ctx.fillText('nVision', w / 2, mainY);
      ctx.restore();

      /* ──── DIGITAL (letter-spaced subtitle) ──── */
      const digitalText = 'D I G I T A L';
      ctx.font = `500 ${subFs}px "Orbitron", sans-serif`;
      const dtw = ctx.measureText(digitalText).width;
      const dsx = w / 2 - dtw / 2 - w * 0.04;

      // Subtle glow
      ctx.shadowColor = 'rgba(139,92,246,0.3)';
      ctx.shadowBlur = 12;
      const subGrad = ctx.createLinearGradient(dsx, 0, dsx + dtw, 0);
      subGrad.addColorStop(0, 'rgba(139,92,246,0.55)');
      subGrad.addColorStop(0.5, 'rgba(168,85,247,0.45)');
      subGrad.addColorStop(1, 'rgba(139,92,246,0.35)');
      ctx.fillStyle = subGrad;
      ctx.textAlign = 'center';
      ctx.fillText(digitalText, w / 2 - w * 0.04, subY);
      ctx.shadowBlur = 0;

      /* ──── AI (accent badge) ──── */
      const aiX = w / 2 + w * 0.18;
      ctx.font = `900 ${aiFs}px "Orbitron", sans-serif`;
      const aiW = ctx.measureText('AI').width;

      // AI background pill
      const pillPad = aiFs * 0.3;
      const pillH = aiFs * 0.9;
      const pillX = aiX - aiW / 2 - pillPad;
      const pillY = subY - pillH / 2;
      const pillW = aiW + pillPad * 2;

      // Pulsing pill glow
      const pulse = 0.7 + Math.sin(t * 3) * 0.3;
      ctx.fillStyle = `rgba(6,182,212,${0.08 * pulse})`;
      ctx.beginPath();
      ctx.roundRect(pillX - 4, pillY - 4, pillW + 8, pillH + 8, pillH / 2 + 4);
      ctx.fill();

      // Pill border
      const pillBorderGrad = ctx.createLinearGradient(pillX, pillY, pillX + pillW, pillY + pillH);
      pillBorderGrad.addColorStop(0, `rgba(6,182,212,${0.4 * pulse})`);
      pillBorderGrad.addColorStop(1, `rgba(139,92,246,${0.3 * pulse})`);
      ctx.strokeStyle = pillBorderGrad;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
      ctx.stroke();

      // Pill fill
      ctx.fillStyle = `rgba(6,182,212,${0.06 * pulse})`;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
      ctx.fill();

      // AI text
      ctx.shadowColor = 'rgba(6,182,212,0.7)';
      ctx.shadowBlur = 15;
      const aiGrad = ctx.createLinearGradient(aiX - aiW / 2, 0, aiX + aiW / 2, 0);
      aiGrad.addColorStop(0, '#22d3ee');
      aiGrad.addColorStop(1, '#06b6d4');
      ctx.fillStyle = aiGrad;
      ctx.textAlign = 'center';
      ctx.fillText('AI', aiX, subY);
      ctx.shadowBlur = 0;

      // AI inner white
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fillText('AI', aiX, subY);

      /* ──── Connecting line between DIGITAL and AI ──── */
      const lineY = subY;
      const lineStartX = w / 2 - w * 0.04 + dtw / 2 + 8;
      const lineEndX = pillX - 6;
      if (lineEndX > lineStartX) {
        const lineGrad = ctx.createLinearGradient(lineStartX, 0, lineEndX, 0);
        lineGrad.addColorStop(0, 'rgba(139,92,246,0.2)');
        lineGrad.addColorStop(0.5, 'rgba(6,182,212,0.15)');
        lineGrad.addColorStop(1, 'rgba(6,182,212,0.3)');
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(lineStartX, lineY);
        ctx.lineTo(lineEndX, lineY);
        ctx.stroke();

        // Dot at junction
        ctx.beginPath();
        ctx.arc(lineStartX, lineY, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139,92,246,0.3)';
        ctx.fill();
      }

      /* ──── Top decorative line ──── */
      const topLineY = mainY - fs * 0.52;
      const topLineGrad = ctx.createLinearGradient(sx - 60, 0, sx + tw + 60, 0);
      topLineGrad.addColorStop(0, 'transparent');
      topLineGrad.addColorStop(0.15, 'rgba(6,182,212,0.15)');
      topLineGrad.addColorStop(0.5, 'rgba(139,92,246,0.1)');
      topLineGrad.addColorStop(0.85, 'rgba(6,182,212,0.15)');
      topLineGrad.addColorStop(1, 'transparent');
      ctx.strokeStyle = topLineGrad;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(sx - 60, topLineY);
      ctx.lineTo(sx + tw + 60, topLineY);
      ctx.stroke();

      /* ──── Bottom accent line ──── */
      const botLineY = subY + subFs * 0.65;
      const botLineGrad = ctx.createLinearGradient(sx - 40, 0, sx + tw + 80, 0);
      botLineGrad.addColorStop(0, 'transparent');
      botLineGrad.addColorStop(0.1, 'rgba(6,182,212,0.3)');
      botLineGrad.addColorStop(0.35, 'rgba(139,92,246,0.25)');
      botLineGrad.addColorStop(0.65, 'rgba(168,85,247,0.15)');
      botLineGrad.addColorStop(0.9, 'rgba(6,182,212,0.2)');
      botLineGrad.addColorStop(1, 'transparent');
      ctx.strokeStyle = botLineGrad;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(sx - 40, botLineY);
      ctx.lineTo(sx + tw + 80, botLineY);
      ctx.stroke();

      // Accent endpoints
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(sx - 44, botLineY, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6,182,212,0.5)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sx + tw + 84, botLineY, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(139,92,246,0.4)';
      ctx.shadowColor = '#8b5cf6';
      ctx.fill();
      ctx.shadowBlur = 0;

      /* ──── Tech brackets ──── */
      ctx.font = `300 ${fs * 0.14}px "Orbitron", monospace`;
      ctx.fillStyle = 'rgba(6,182,212,0.1)';
      ctx.textAlign = 'right';
      ctx.fillText('</', sx - 50, cy);
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(139,92,246,0.08)';
      ctx.fillText('/>', sx + tw + 50, cy);

      /* ──── Corner accents ──── */
      const cornerLen = 12;
      const cAlpha = 0.12 + Math.sin(t * 2) * 0.04;
      ctx.strokeStyle = `rgba(6,182,212,${cAlpha})`;
      ctx.lineWidth = 1;
      // Top-left
      ctx.beginPath();
      ctx.moveTo(sx - 55, topLineY - 2);
      ctx.lineTo(sx - 55, topLineY - 2 - cornerLen);
      ctx.moveTo(sx - 55, topLineY - 2);
      ctx.lineTo(sx - 55 + cornerLen, topLineY - 2);
      ctx.stroke();
      // Top-right
      ctx.strokeStyle = `rgba(139,92,246,${cAlpha})`;
      ctx.beginPath();
      ctx.moveTo(sx + tw + 55, topLineY - 2);
      ctx.lineTo(sx + tw + 55, topLineY - 2 - cornerLen);
      ctx.moveTo(sx + tw + 55, topLineY - 2);
      ctx.lineTo(sx + tw + 55 - cornerLen, topLineY - 2);
      ctx.stroke();
      // Bottom-left
      ctx.strokeStyle = `rgba(6,182,212,${cAlpha})`;
      ctx.beginPath();
      ctx.moveTo(sx - 40, botLineY + 3);
      ctx.lineTo(sx - 40, botLineY + 3 + cornerLen);
      ctx.moveTo(sx - 40, botLineY + 3);
      ctx.lineTo(sx - 40 + cornerLen, botLineY + 3);
      ctx.stroke();
      // Bottom-right
      ctx.strokeStyle = `rgba(139,92,246,${cAlpha})`;
      ctx.beginPath();
      ctx.moveTo(sx + tw + 80, botLineY + 3);
      ctx.lineTo(sx + tw + 80, botLineY + 3 + cornerLen);
      ctx.moveTo(sx + tw + 80, botLineY + 3);
      ctx.lineTo(sx + tw + 80 - cornerLen, botLineY + 3);
      ctx.stroke();

      ctx.restore();
    };

    const paintParticles = (type: TransitionType, progress: number, w: number, h: number) => {
      const pts = particlesRef.current;
      const e = easeIO(progress);
      pts.forEach((p) => {
        const { x, y, alpha } = getScatter(p, type, progress, w, h);
        if (alpha < 0.015) return;

        // Trail effect during scatter
        if (e > 0.1 && e < 0.9) {
          const prevProg = Math.max(0, progress - 0.05);
          const prev = getScatter(p, type, prevProg, w, h);
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(x, y);
          ctx.strokeStyle = p.isCyan ?
            `rgba(6,182,212,${alpha * 0.3})` :
            `rgba(139,92,246,${alpha * 0.25})`;
          ctx.lineWidth = p.size * 0.4;
          ctx.stroke();
        }

        ctx.fillStyle = p.isCyan ?
        `rgba(6,182,212,${alpha})` :
        `rgba(255,255,255,${alpha * 0.85})`;
        ctx.fillRect(x - p.size / 2, y - p.size / 2, p.size, p.size);
      });
    };

    const paintTransitionFX = (
    type: TransitionType, progress: number,
    w: number, h: number, t: number) =>
    {
      const e = easeIO(progress);
      const col = transAccent[type];
      const cx = w / 2,cy = h / 2;

      // CENTER FLASH at peak of transition
      if (progress > 0.3 && progress < 0.7) {
        const flashIntensity = 1 - Math.abs(progress - 0.5) * 5;
        if (flashIntensity > 0) {
          const flashR = Math.min(w, h) * 0.3 * flashIntensity;
          const flashGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, flashR);
          flashGrad.addColorStop(0, `rgba(255,255,255,${flashIntensity * 0.12})`);
          flashGrad.addColorStop(0.3, `rgba(${col},${flashIntensity * 0.08})`);
          flashGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = flashGrad;
          ctx.fillRect(0, 0, w, h);
        }
      }

      // Transition-specific sparkle patterns
      switch (type) {
        case 'vortex':{
            for (let i = 0; i < 24; i++) {
              const a = i / 24 * Math.PI * 2 + t * 2.5;
              const d = e * Math.min(w, h) * 0.38 * (0.3 + i % 3 * 0.25);
              ctx.beginPath();
              ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1.2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${col},${(1 - e) * 0.5})`; 
              ctx.fill();
            }
            // Spiral arm traces
            for (let arm = 0; arm < 3; arm++) {
              ctx.beginPath();
              for (let j = 0; j < 30; j++) {
                const a2 = arm * Math.PI * 2 / 3 + j * 0.2 + t * 2;
                const d2 = e * Math.min(w, h) * 0.02 * j;
                const px = cx + Math.cos(a2) * d2;
                const py = cy + Math.sin(a2) * d2;
                if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
              }
              ctx.strokeStyle = `rgba(${col},${(1 - e) * 0.12})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
            break;
          }
        case 'rain':{
            for (let i = 0; i < 35; i++) {
              const rx = cx + (Math.sin(i * 7 + t) - 0.5) * w * 0.8;
              const ry = cy - h * 0.4 + e * h * (0.3 + i % 5 * 0.15);
              ctx.fillStyle = `rgba(${col},${(1 - e * 0.5) * 0.25})`;
              ctx.fillRect(rx, ry, 1, 4 + e * 8);
            }
            break;
          }
        case 'rise':{
            for (let i = 0; i < 25; i++) {
              const rx = cx + (Math.cos(i * 5 + t) - 0.5) * w * 0.7;
              const ry = cy + h * 0.3 - e * h * (0.2 + i % 4 * 0.12);
              const sz = 1 + Math.sin(t * 3 + i) * 0.5;
              ctx.beginPath();
              ctx.arc(rx, ry, sz, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${col},${(1 - e) * 0.4})`;
              ctx.fill();
            }
            // Rising energy column
            const colW = Math.min(w, h) * 0.05;
            const colGrad = ctx.createLinearGradient(0, cy + h * 0.3, 0, cy - h * e * 0.4);
            colGrad.addColorStop(0, `rgba(${col},${(1 - e) * 0.08})`);
            colGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = colGrad;
            ctx.fillRect(cx - colW / 2, cy - h * e * 0.4, colW, h * 0.3 + h * e * 0.4);
            break;
          }
        case 'shatter':{
            for (let i = 0; i < 12; i++) {
              const a = i / 12 * Math.PI * 2;
              ctx.beginPath();
              ctx.moveTo(cx, cy);
              ctx.lineTo(cx + Math.cos(a) * e * Math.min(w, h) * 0.55, cy + Math.sin(a) * e * Math.min(w, h) * 0.55);
              ctx.strokeStyle = `rgba(${col},${(1 - e) * 0.25})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
            // Shard fragments
            for (let i = 0; i < 6; i++) {
              const sa = i / 6 * Math.PI * 2 + 0.3;
              const sd = e * Math.min(w, h) * 0.3;
              ctx.save();
              ctx.translate(cx + Math.cos(sa) * sd, cy + Math.sin(sa) * sd);
              ctx.rotate(sa + e * 2);
              ctx.fillStyle = `rgba(${col},${(1 - e) * 0.1})`;
              ctx.fillRect(-4, -2, 8, 4);
              ctx.restore();
            }
            break;
          }
        case 'wave':{
            // Multiple expanding rings
            for (let ring = 0; ring < 3; ring++) {
              const ringProgress = Math.max(0, e - ring * 0.15);
              const ringR = ringProgress * Math.min(w, h) * 0.5;
              const ringAlpha = Math.max(0, (1 - ringProgress) * 0.25);
              ctx.beginPath();
              ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(${col},${ringAlpha})`;
              ctx.lineWidth = 2 - ring * 0.5;
              ctx.stroke();
            }
            break;
          }
        case 'fade':{
            // Soft dissolve — expanding glow
            const fadeR = e * Math.min(w, h) * 0.4;
            const fadeGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, fadeR || 1);
            fadeGrad.addColorStop(0, `rgba(${col},${(1 - e) * 0.15})`);
            fadeGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = fadeGrad;
            ctx.fillRect(0, 0, w, h);
            break;
          }
        case 'spiral':{
            // Inward spiral traces
            for (let arm = 0; arm < 4; arm++) {
              ctx.beginPath();
              for (let j = 0; j < 40; j++) {
                const a2 = arm * Math.PI * 0.5 - j * 0.25 - t * 3;
                const d2 = (1 - e) * Math.min(w, h) * 0.015 * j;
                const px = cx + Math.cos(a2) * d2;
                const py = cy + Math.sin(a2) * d2;
                if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
              }
              ctx.strokeStyle = `rgba(${col},${(1 - e) * 0.15})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
            // Center convergence dot
            ctx.beginPath();
            ctx.arc(cx, cy, 3 + e * 5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${col},${e * 0.3})`;
            ctx.fill();
            break;
          }
        case 'glitch':{
            // Horizontal glitch bars
            for (let i = 0; i < 8; i++) {
              const barY = cy + (i - 3.5) * (h * 0.08);
              const barW = Math.sin(t * 20 + i * 5) * w * 0.3 * e;
              const barH = 2 + Math.random() * 3;
              ctx.fillStyle = `rgba(${col},${(1 - e) * 0.2 * Math.random()})`;
              ctx.fillRect(cx - barW / 2, barY, barW, barH);
            }
            // RGB offset lines
            if (e > 0.2) {
              ctx.strokeStyle = `rgba(6,182,212,${(1 - e) * 0.15})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(0, cy + Math.sin(t * 15) * 30);
              ctx.lineTo(w, cy + Math.sin(t * 15 + 2) * 30);
              ctx.stroke();
              ctx.strokeStyle = `rgba(168,85,247,${(1 - e) * 0.12})`;
              ctx.beginPath();
              ctx.moveTo(0, cy + Math.cos(t * 12) * 25);
              ctx.lineTo(w, cy + Math.cos(t * 12 + 1) * 25);
              ctx.stroke();
            }
            break;
          }
        case 'portal':{
            // Sucking vortex at center
            for (let i = 0; i < 5; i++) {
              const portalR = (1 - e) * Math.min(w, h) * (0.1 + i * 0.08);
              ctx.beginPath();
              ctx.arc(cx, cy, portalR, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(${col},${e * 0.15 * (1 - i * 0.15)})`;
              ctx.lineWidth = 1.5 - i * 0.2;
              ctx.stroke();
            }
            // Center bright point
            ctx.beginPath();
            ctx.arc(cx, cy, 4 + e * 8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${e * 0.3})`;
            ctx.shadowColor = `rgba(${col},0.6)`;
            ctx.shadowBlur = e * 20;
            ctx.fill();
            ctx.shadowBlur = 0;
            break;
          }
        case 'cascade':{
            // Vertical sweep line moving left to right
            const sweepX = e * w;
            ctx.beginPath();
            ctx.moveTo(sweepX, 0);
            ctx.lineTo(sweepX, h);
            ctx.strokeStyle = `rgba(${col},${(1 - e) * 0.4})`;
            ctx.lineWidth = 2;
            ctx.shadowColor = `rgba(${col},0.5)`;
            ctx.shadowBlur = 15;
            ctx.stroke();
            ctx.shadowBlur = 0;
            // Trailing glow
            const cascGrad = ctx.createLinearGradient(sweepX - 40, 0, sweepX, 0);
            cascGrad.addColorStop(0, 'transparent');
            cascGrad.addColorStop(1, `rgba(${col},${(1 - e) * 0.06})`);
            ctx.fillStyle = cascGrad;
            ctx.fillRect(sweepX - 40, 0, 40, h);
            break;
          }
        case 'orbit':{
            // Orbiting ring of dots
            for (let i = 0; i < 16; i++) {
              const oa = (i / 16) * Math.PI * 2 + t * 3;
              const od = e * Math.min(w, h) * 0.3;
              const ox = cx + Math.cos(oa) * od;
              const oy = cy + Math.sin(oa) * od;
              ctx.beginPath();
              ctx.arc(ox, oy, 1.5, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${col},${(1 - e) * 0.4})`;
              ctx.fill();
            }
            // Orbit ring
            ctx.beginPath();
            ctx.arc(cx, cy, e * Math.min(w, h) * 0.3, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${col},${(1 - e) * 0.1})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            break;
          }
        case 'zoom':{
            // Zoom lines radiating from center
            for (let i = 0; i < 24; i++) {
              const za = (i / 24) * Math.PI * 2;
              const zd1 = e * Math.min(w, h) * 0.05;
              const zd2 = e * Math.min(w, h) * 0.5;
              ctx.beginPath();
              ctx.moveTo(cx + Math.cos(za) * zd1, cy + Math.sin(za) * zd1);
              ctx.lineTo(cx + Math.cos(za) * zd2, cy + Math.sin(za) * zd2);
              ctx.strokeStyle = `rgba(${col},${(1 - e) * 0.15})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
            break;
          }
        default:{
            // explode — radial burst lines + expanding ring
            for (let i = 0; i < 20; i++) {
              const a = i / 20 * Math.PI * 2 + t;
              const d1 = e * Math.min(w, h) * 0.08;
              const d2 = e * Math.min(w, h) * 0.4;
              ctx.beginPath();
              ctx.moveTo(cx + Math.cos(a) * d1, cy + Math.sin(a) * d1);
              ctx.lineTo(cx + Math.cos(a) * d2, cy + Math.sin(a) * d2);
              ctx.strokeStyle = `rgba(${col},${(1 - e) * 0.25})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
            // Expanding energy ring
            const expR = e * Math.min(w, h) * 0.35;
            ctx.beginPath();
            ctx.arc(cx, cy, expR, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${col},${(1 - e) * 0.2})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
      }
    };

    const drawScene = (
      si: number, w: number, h: number,
      mx: number, my: number, t: number, alpha: number,
    ) => {
      // Scale scenes to fill the canvas at nVision text size
      // Desktop (w/h ~1.9): 1.9*0.85 = 1.6x — Mobile (w/h ~1): 1.3x minimum
      const scaleF = Math.max(1.3, Math.min(1.8, (w / h) * 0.85));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(w / 2, h / 2);
      ctx.scale(scaleF, scaleF);
      ctx.translate(-w / 2, -h / 2);
      try {
        scenes[si].draw(ctx, w, h, mx, my, t);
      } catch {
        // Scene error — skip frame silently
      }
      ctx.restore();
    };

    /* animation loop */
    const tick = () => {
      const now = Date.now();
      const { w, h } = sizeRef.current;
      if (!w) {frameRef.current = requestAnimationFrame(tick);return;}

      const t = (now - startRef.current) / 1000;
      const total = now - startRef.current;
      const cycleN = Math.floor(total / CYCLE);
      const el = total % CYCLE;
      const si = cycleN % scenes.length;
      if (sceneIdxRef.current !== si) {sceneIdxRef.current = si;setCurrentScene(si);}

      const tType = scenes[si].transition;
      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x,my = mouseRef.current.y;

      /* ── TEXT phase ── */
      if (el < P.TEXT) {
        const prog = el / P.TEXT;
        // Radial glow
        const rg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.min(w, h) * 0.6);
        rg.addColorStop(0, 'rgba(6,182,212,0.04)');
        rg.addColorStop(1, 'transparent');
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, w, h);

        paintText(w, h, 1, t);

        // Sparkles orbiting
        for (let i = 0; i < 10; i++) {
          const sa = i / 10 * Math.PI * 2 + t * 0.5;
          const sd = Math.min(w, h) * 0.44 + Math.sin(t * 2 + i * 1.5) * 12;
          ctx.beginPath();
          ctx.arc(w / 2 + Math.cos(sa) * sd, h / 2 + Math.sin(sa) * sd * 0.3, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(6,182,212,${0.12 + Math.sin(t * 3 + i * 2) * 0.08})`;
          ctx.fill();
        }

        /* ── DISSOLVE phase ── */
      } else if (el < P.TEXT + P.DISSOLVE) {
        const prog = (el - P.TEXT) / P.DISSOLVE;

        // Text fading quickly
        if (prog < 0.3) paintText(w, h, 1 - prog / 0.3, t);

        // Particles scattering with scene-specific pattern
        paintParticles(tType, prog, w, h);

        // Transition FX
        paintTransitionFX(tType, prog, w, h, t);

        // Scene fading in
        drawScene(si, w, h, mx, my, t, easeIO(prog));

        /* ── SCENE phase ── */
      } else if (el < P.TEXT + P.DISSOLVE + P.SCENE) {
        drawScene(si, w, h, mx, my, t, 1);

        /* ── REFORM phase ── */
      } else {
        const prog = (el - P.TEXT - P.DISSOLVE - P.SCENE) / P.REFORM;

        // Scene fading out
        drawScene(si, w, h, mx, my, t, 1 - easeIO(prog));

        // Particles converging (reversed)
        paintParticles(tType, 1 - prog, w, h);

        // Transition FX reversed
        paintTransitionFX(tType, 1 - prog, w, h, t);

        // Text fading in
        if (prog > 0.7) paintText(w, h, (prog - 0.7) / 0.3, t);
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    tick();
    return () => {window.removeEventListener('resize', resize);cancelAnimationFrame(frameRef.current);};
  }, [initParticles]);

  return (
    <div data-ev-id="ev_d35aae6b0e" ref={boxRef} className="relative w-full max-w-4xl mx-auto h-[260px] sm:h-[340px] md:h-[420px]">
      {/* Ambient glow */}
      <div data-ev-id="ev_291b19e8c0" className="absolute inset-0 pointer-events-none">
        <div data-ev-id="ev_2ffefb44ba" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <canvas data-ev-id="ev_b1a3dd9eb5" ref={canvasRef} className="relative w-full h-full" aria-hidden="true" />

      {/* Scene indicator pills */}
      <div data-ev-id="ev_9b0ae22246" className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-[3px]">
        {scenes.map((_, i) =>
        <div data-ev-id="ev_e15f1acce0"
        key={i}
        className="rounded-full transition-all duration-500"
        style={{
          width: i === currentScene ? 8 : 3,
          height: 3,
          backgroundColor: i === currentScene ? '#06b6d4' : 'rgba(255,255,255,0.08)',
          boxShadow: i === currentScene ? '0 0 10px #06b6d4' : 'none'
        }} />

        )}
      </div>
    </div>);

};