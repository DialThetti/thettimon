import { createRenderContext } from '../util';
import { OnRender } from './onrender';
import { OnUpdate } from './onupdate';

const WIDTH = 240 * 2;
const HEIGHT = 160 * 2;

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
    this.updaters.forEach(r => r.onUpdate());
  }

  onRender(ctx: CanvasRenderingContext2D): void {
    this.renderers.forEach(r => r.onRender(ctx));
  }
  gameLoop(): void {
    const f = () => {
      window.requestAnimationFrame(f);
      this.onUpdate();
      this.onRender(this.c2d);
      this.c2d.drawImage(this.screen.canvas, 0, 0, WIDTH, HEIGHT, 0, 0, this.c2d.canvas.width, this.c2d.canvas.height);
    };
    f();
  }

  start(id: string): void {
    const canvas = document.querySelector(`#${id}`) as HTMLCanvasElement;
    this.c2d = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    this.screen = createRenderContext(WIDTH, HEIGHT);
    this.gameLoop();
  }
}
