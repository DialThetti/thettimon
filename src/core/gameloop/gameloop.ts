import { SCREEN_RES } from '@game/constants';
import { createRenderContext } from '../util';
import { OnRender } from './onrender';
import { OnUpdate } from './onupdate';

export class GameLoop implements OnUpdate, OnRender {
  private updaters: OnUpdate[] = [];
  private renderers: OnRender[] = [];
  private screen!: CanvasRenderingContext2D;
  private c2d!: CanvasRenderingContext2D;
  constructor(config: { updaters: OnUpdate[]; renderers: OnRender[] }) {
    this.updaters = config.updaters;
    this.renderers = config.renderers;
  }
  onUpdate(): void {
    this.updaters.filter(u => u.isActive()).forEach(u => u.onUpdate());
  }

  onRender(ctx: CanvasRenderingContext2D): void {
    this.renderers.filter(r => r.isActive()).forEach(r => r.onRender(ctx));
  }
  gameLoop(): void {
    const f = () => {
      window.requestAnimationFrame(f);
      this.onUpdate();
      this.onRender(this.c2d);
      this.c2d.drawImage(
        this.screen.canvas,
        0,
        0,
        SCREEN_RES.width,
        SCREEN_RES.height,
        0,
        0,
        this.c2d.canvas.width,
        this.c2d.canvas.height
      );
    };
    f();
  }

  isActive(): boolean {
    return true;
  }
  start(id: string): void {
    const canvas = document.querySelector(`#${id}`) as HTMLCanvasElement;
    this.c2d = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.c2d.imageSmoothingEnabled = false;
    canvas.width = SCREEN_RES.width;
    canvas.height = SCREEN_RES.height;
    this.screen = createRenderContext(SCREEN_RES.width, SCREEN_RES.height);
    this.gameLoop();
  }
}
