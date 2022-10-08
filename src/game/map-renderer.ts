import { OnRender } from 'src/core/gameloop/onrender';
import { loadImage, loadResources } from 'src/core/loaders';
import { Map } from 'src/map';
import { Point } from 'src/point';
import { Sprite } from 'src/sprite';
import { Store } from 'src/store';

const WIDTH = 240 * 2;
const HEIGHT = 160 * 2;

export class MapRenderer implements OnRender {
  background!: Sprite;
  foreground!: Sprite;
  playerImg!: HTMLImageElement;
  map!: Map;

  offset = new Point(WIDTH / 2 - 32, HEIGHT / 2 - 16);
  constructor(private store: Store) {}
  async load() {
    [this.background, this.foreground] = await loadResources();
    this.playerImg = await loadImage('./img/player.png');
    this.map = new Map();
    await this.map.load();
  }

  onRender(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    this.background.draw(ctx, this.store.player.position.scale(-32).translate(this.offset));
    const imgPos = this.playerDir(this.store.player);
    ctx.drawImage(this.playerImg, imgPos.x, imgPos.y, 32, 32, WIDTH / 2 - 32, HEIGHT / 2 - 16, 32, 32);

    this.foreground.draw(ctx, this.store.player.position.scale(-32).translate(this.offset));
  }

  playerDir = (player: { ticker: number; dir: string }) => {
    switch (player.dir) {
      case 'down':
      default:
        return { x: 32 * Math.floor(4 * (1 - player.ticker ?? 1)), y: 0 };
      case 'up':
        return { x: 32 * Math.floor(4 * (1 - player.ticker ?? 1)), y: 32 };
      case 'right':
        return { x: 32 * Math.floor(4 * (1 - player.ticker ?? 1)), y: 64 };
      case 'left':
        return { x: 32 * Math.floor(4 * (1 - player.ticker ?? 1)), y: 96 };
    }
  };
}
