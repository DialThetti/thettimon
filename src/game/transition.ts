import { OnRender } from 'src/core/gameloop/onrender';
import { OnUpdate } from 'src/core/gameloop/onupdate';
import { loadImage } from 'src/core/loaders';
import { Store } from 'src/store';

const WIDTH = 240 * 2;
const HEIGHT = 160 * 2;
export class TransitionLayer implements OnRender, OnUpdate {
  transisitons: string[] = [
    'transitions/hexatrc.png',
    'transitions/021-Normal01.png',
    'transitions/022-Normal02.png',
    'transitions/Battle.png',
    'transitions/battle1.png',
    'transitions/battle2.png',
    'transitions/battle3.png',
    'transitions/battle4.png',
  ];
  ticker = 0;
  originals: HTMLCanvasElement[] = [];
  buffer: HTMLCanvasElement = document.createElement('canvas');
  currentTranslation = 0;
  constructor(private store: Store) {}
  async load() {
    for (const t in this.transisitons) {
      console.log(t);
      const transitionAnimation = await loadImage(this.transisitons[t]);
      const o = document.createElement('canvas');
      o.width = transitionAnimation.width;
      o.height = transitionAnimation.height;
      o.getContext('2d')?.drawImage(transitionAnimation, 0, 0);
      this.originals.push(o);
    }
  }
  onUpdate(): void {
    const sleepAfter = 0.2;
    if (this.store.inBattle && this.ticker == 0) {
      this.currentTranslation = Math.floor(Math.random() * this.originals.length);
    }
    if (this.store.inBattle && this.ticker < 1 + sleepAfter) {
      this.ticker += 1 / 120;
    } else if (this.ticker > 1 + sleepAfter) {
      console.log('go');
      this.ticker = 0;
      this.store.inBattle = false;
    } else {
      this.ticker = 0;
    }
  }
  onRender(ctx: CanvasRenderingContext2D): void {
    if (this.ticker > 0) {
      const o = this.originals[this.currentTranslation];
      //
      ctx.drawImage(this.filterByGreyscale(o), 0, 0, o.width, o.height, 0, 0, WIDTH, HEIGHT);
    }
  }

  filterByGreyscale(sourceImageData: HTMLCanvasElement): HTMLCanvasElement {
    const imgData = sourceImageData
      .getContext('2d')
      ?.getImageData(0, 0, sourceImageData.width, sourceImageData.height) as ImageData;
    const src = imgData.data;
    for (let i = 0; i < src.length; i += 4) {
      const [r, g, b, a] = [src[i], src[i + 1], src[i + 2], src[i + 3]];

      src[i] = 0;
      src[i + 1] = 0;
      src[i + 2] = 0;
      const treshold = this.ticker * 255;

      src[i + 3] = treshold > r ? 255 : 0;
    }
    this.buffer.width = sourceImageData.width;
    this.buffer.height = sourceImageData.height;
    this.buffer.getContext('2d')?.putImageData(imgData, 0, 0);
    return this.buffer;
  }
}