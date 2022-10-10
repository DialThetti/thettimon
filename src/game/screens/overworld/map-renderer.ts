import { OnRender } from '@core/gameloop/onrender';
import { loadImage } from '@core/loaders';
import { Map } from '@game/map';
import { Point } from '@core/point';
import { Sprite } from '@core/render/sprite';
import { Store } from '@core/redux/store';
import { getGameState, getMap, getPlayer, getPlayerPosition } from '../../store/selectors';
import { GameState, State } from '../../store/state';
import { SCREEN_RES } from '@game/constants';

const loadResources = async (map: Map): Promise<Sprite[]> =>
  (await Promise.all([loadImage(map.getBackgroundUrl()), loadImage(map.getFrontUrl())])).map(img => new Sprite(img));

export class MapRenderer implements OnRender {
  background!: Sprite;
  foreground!: Sprite;
  playerImg!: HTMLImageElement;
  map!: Map;

  offset = new Point(SCREEN_RES.width / 2 - 12, SCREEN_RES.height / 2 - 12);
  constructor(private store: Store<State>) {}
  async load() {
    [this.background, this.foreground] = await loadResources(this.store.select(getMap));
    this.playerImg = await loadImage('./img/player.png');
  }

  onRender(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, SCREEN_RES.width, SCREEN_RES.height);
    this.background.draw(ctx, this.store.select(getPlayerPosition).scale(-16).translate(this.offset).floor());
    const imgPos = this.playerDir(this.store.select(getPlayer));
    ctx.drawImage(
      this.playerImg,
      imgPos.x,
      imgPos.y,
      24,
      24,
      SCREEN_RES.width / 2 - 12 - 4,
      SCREEN_RES.height / 2 - 24 + 4,
      24,
      24
    );

    this.foreground.draw(ctx, this.store.select(getPlayerPosition).scale(-16).translate(this.offset).floor());
  }

  isActive(): boolean {
    return (
      this.store.select(getGameState) === GameState.TRANSITION ||
      this.store.select(getGameState) === GameState.OVERWORLD
    );
  }

  playerDir = (player: { ticker: number; dir: string }) => {
    const step = [24, 48, 24, 0][Math.floor(4 * (1 - player.ticker ?? 1))];
    switch (player.dir) {
      case 'down':
      default:
        return { x: step, y: 0 };
      case 'left':
        return { x: step, y: 24 };
      case 'right':
        return { x: step, y: 24 * 2 };
      case 'up':
        return { x: step, y: 24 * 3 };
    }
  };
}
