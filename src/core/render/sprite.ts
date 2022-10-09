import { IPoint } from '@core/point';

export class Sprite {
  constructor(private img: HTMLImageElement) {}

  public draw(ctx: CanvasRenderingContext2D, position: IPoint): void {
    ctx.drawImage(this.img, position.x, position.y);
  }
}
