import { OnRender } from '@core/gameloop/onrender';
import { loadImage } from '@core/loaders';
import { Store } from '@core/redux/store';
import { createRenderContext } from '@core/util';
import { SCREEN_RES } from '@game/constants';
import { getGameState } from '@game/store/selectors';
import { GameState, State } from '@game/store/state';

class MonSpriteReg {
  rights: HTMLCanvasElement[] = [];
  lefts: HTMLCanvasElement[] = [];
  size = 64;

  async load() {
    const b = await loadImage('./img/mons.png');
    for (let y = 0; y < b.height / this.size; y++) {
      for (let x = 0; x < b.width / this.size; x++) {
        const c1 = createRenderContext(this.size, this.size);
        c1.drawImage(b, x * this.size, y * this.size, this.size, this.size, 0, 0, this.size, this.size);
        this.rights.push(c1.canvas);
        const c2 = createRenderContext(this.size, this.size);
        this.rights.push(c1.canvas);
        c2.save();
        c2.scale(-1, 1);
        c2.drawImage(b, x * this.size, y * this.size, this.size, this.size, 0, 0, -this.size, this.size);
        c2.restore();
        this.lefts.push(c2.canvas);
      }
    }
  }
  back(id: number): HTMLCanvasElement {
    return this.rights[id - 1];
  }
  left(id: number): HTMLCanvasElement {
    return this.lefts[id - 1];
  }
}
export class BattleRenderer implements OnRender {
  monSpriteReg = new MonSpriteReg();
  constructor(private store: Store<State>) {}
  async load() {
    await this.monSpriteReg.load();
  }
  onRender(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, SCREEN_RES.width, SCREEN_RES.height);
    ctx.strokeStyle = 'black';
    const margin = 16;
    const statBoxWidth = 3 * 32;
    //enemy mon
    //ctx.strokeRect(SCREEN_RES.width - margin - 64, margin, 64, 64);
    ctx.drawImage(this.monSpriteReg.back(1), SCREEN_RES.width - margin - 64, margin, 64, 64);

    ctx.drawImage(this.monSpriteReg.left(2), 0, 0, 64, 64, margin, margin, 64, 64);

    //textBox
    ctx.strokeRect(0, SCREEN_RES.height - 16 * 3, SCREEN_RES.width, 16 * 3);
  }
  isActive(): boolean {
    return this.store.select(getGameState) === GameState.BATTLE;
  }
}
