export type SceneFn = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  mx: number, // mouse X relative to center, -1 to 1
  my: number, // mouse Y relative to center, -1 to 1
  t: number   // time in seconds
) => void;
