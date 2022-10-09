import { OnRender } from './core/gameloop/onrender';

export class FPSLayer implements OnRender {
  constructor(private date = new Date().valueOf(), private count = 0, private lastFps = 0) {}

  onRender(ctx: CanvasRenderingContext2D) {
    const d = new Date().valueOf();
    ctx.font = '16px serif';
    ctx.fillStyle = 'red';
    ctx.fillText(`${this.lastFps} FPS`, 0, 16);
    if (this.date + 1000 < d) {
      this.date = d;
      this.lastFps = this.count;
      this.count = 0;
    }
    this.count++;
  }

  isActive(): boolean {
    return true;
  }
}
