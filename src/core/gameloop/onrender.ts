export interface OnRender {
  onRender(ctx: CanvasRenderingContext2D): void;

  isActive(): boolean;
}
