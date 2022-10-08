import { Point } from './point';

export class Sprite {
  constructor(private img: HTMLImageElement) {}

  public draw(ctx: CanvasRenderingContext2D, position: { x: number; y: number }): void {
    ctx.drawImage(
      this.img,

      position.x,
      position.y
    );
  }
}
