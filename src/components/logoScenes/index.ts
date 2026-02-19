import type { SceneFn } from './types';
import { drawEye } from './eye';
import { drawRipple } from './ripple';
import { drawNeural } from './neural';
import { drawSpiral } from './spiral';
import { drawSoundwave } from './soundwave';
import { drawHexgrid } from './hexgrid';
import { drawDna } from './dna';
import { drawStarfield } from './starfield';
import { drawMatrix } from './matrix';
import { drawGeometry } from './geometry';
import { drawPlasma } from './plasma';
import { drawHeartbeat } from './heartbeat';
import { drawFractal } from './fractal';
import { drawFireworks } from './fireworks';
import { drawBlob } from './blob';
import { drawLightning } from './lightning';
import { drawRadar } from './radar';
import { drawOrbits } from './orbits';
import { drawParticleText } from './particleText';
import { drawKaleidoscope } from './kaleidoscope';
import { drawCircuit } from './circuit';
import { drawTransformer } from './transformer';
import { drawCodeflow } from './codeflow';
import { drawAICore } from './aicore';
import { drawKatana } from './katana';

export type TransitionType =
  | 'explode' | 'vortex' | 'rain' | 'rise' | 'shatter' | 'wave'
  | 'fade' | 'spiral' | 'glitch' | 'portal' | 'cascade' | 'orbit' | 'zoom';

export interface Scene {
  name: string;
  draw: SceneFn;
  transition: TransitionType;
}

/**
 * ALL scenes — used by AnimationPreview page.
 */
export const scenes: Scene[] = [
  { name: 'Eye',           draw: drawEye,          transition: 'shatter' },
  { name: 'Lightning',     draw: drawLightning,     transition: 'glitch' },
  { name: 'Circuit',       draw: drawCircuit,       transition: 'cascade' },
  { name: 'Plasma',        draw: drawPlasma,        transition: 'explode' },
  { name: 'Transformer',   draw: drawTransformer,   transition: 'fade' },
  { name: 'Fireworks',     draw: drawFireworks,     transition: 'explode' },
  { name: 'AI Core',       draw: drawAICore,        transition: 'portal' },
  { name: 'Starfield',     draw: drawStarfield,     transition: 'zoom' },
  { name: 'Katana',        draw: drawKatana,        transition: 'shatter' },
  { name: 'Neural',        draw: drawNeural,        transition: 'wave' },
  { name: 'CodeFlow',      draw: drawCodeflow,      transition: 'rain' },
  { name: 'Kaleidoscope',  draw: drawKaleidoscope,  transition: 'vortex' },
  { name: 'DNA',           draw: drawDna,           transition: 'spiral' },
  { name: 'Radar',         draw: drawRadar,         transition: 'orbit' },
  { name: 'Fractal',       draw: drawFractal,       transition: 'rise' },
  { name: 'Orbits',        draw: drawOrbits,        transition: 'orbit' },
  { name: 'Heartbeat',     draw: drawHeartbeat,     transition: 'wave' },
  { name: 'Spiral',        draw: drawSpiral,        transition: 'vortex' },
  { name: 'Blob',          draw: drawBlob,          transition: 'fade' },
  { name: 'Geometry',      draw: drawGeometry,      transition: 'glitch' },
  { name: 'Matrix',        draw: drawMatrix,        transition: 'cascade' },
  { name: 'Soundwave',     draw: drawSoundwave,     transition: 'wave' },
  { name: 'ParticleText',  draw: drawParticleText,  transition: 'portal' },
  { name: 'Hexgrid',       draw: drawHexgrid,       transition: 'zoom' },
  { name: 'Ripple',        draw: drawRipple,        transition: 'spiral' },
];

/**
 * ACTIVE scenes — only these cycle on the homepage.
 * Each uses a UNIQUE transition type for maximum variety.
 */
export const activeScenes: Scene[] = [
  { name: 'Eye',           draw: drawEye,          transition: 'shatter' },
  { name: 'Lightning',     draw: drawLightning,     transition: 'glitch' },
  { name: 'Plasma',        draw: drawPlasma,        transition: 'explode' },
  { name: 'Fireworks',     draw: drawFireworks,     transition: 'portal' },
  { name: 'Starfield',     draw: drawStarfield,     transition: 'zoom' },
  { name: 'Radar',         draw: drawRadar,         transition: 'orbit' },
  { name: 'Fractal',       draw: drawFractal,       transition: 'rise' },
  { name: 'Orbits',        draw: drawOrbits,        transition: 'spiral' },
  { name: 'ParticleText',  draw: drawParticleText,  transition: 'wave' },
  { name: 'Katana',        draw: drawKatana,        transition: 'cascade' },
  { name: 'Circuit',       draw: drawCircuit,       transition: 'fade' },
  { name: 'Transformer',   draw: drawTransformer,   transition: 'rain' },
  { name: 'CodeFlow',      draw: drawCodeflow,      transition: 'vortex' },
  { name: 'AI Core',       draw: drawAICore,        transition: 'explode' },
];
