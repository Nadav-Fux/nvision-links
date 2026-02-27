/**
 * Signature for a logo canvas scene draw function.
 * Each scene is called once per animation frame by the Logo component.
 *
 * @param ctx - 2D canvas rendering context (already cleared)
 * @param w - canvas width in pixels
 * @param h - canvas height in pixels
 * @param mx - mouse X relative to center, normalized to [-1, 1]
 * @param my - mouse Y relative to center, normalized to [-1, 1]
 * @param t - elapsed time in seconds since scene start
 */
export type SceneFn = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  mx: number,
  my: number,
  t: number
) => void;
