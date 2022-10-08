import { OnUpdate } from '../core/gameloop/onupdate';
import { Store } from '../store';

export const keys: { [key: string]: { pressed: boolean } } = {
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
};

const keyDown = (e: KeyboardEvent) => {
  const k = e.key as string;
  if (keys[k]) {
    keys[k].pressed = true;
  }
};
const keyUp = (e: KeyboardEvent) => {
  const k = e.key as string;
  if (keys[k]) {
    keys[k].pressed = false;
  }
};

export class Controls implements OnUpdate {
  private updateRequest: { type: string; ticker: number } | undefined = undefined;
  playerSpeed = 1 / 32;
  constructor(private store: Store) {}
  listen(): void {
    window.onkeydown = keyDown;
    window.onkeyup = keyUp;
  }

  onUpdate(): void {
    if (this.updateRequest) {
      switch (this.updateRequest.type) {
        case 'up':
          this.store.player.position.y -= this.playerSpeed;
          break;
        case 'down':
          this.store.player.position.y += this.playerSpeed;
          break;
        case 'left':
          this.store.player.position.x -= this.playerSpeed;
          break;
        case 'right':
          this.store.player.position.x += this.playerSpeed;
          break;
      }
      this.store.player.ticker = this.updateRequest.ticker;
      this.updateRequest.ticker -= this.playerSpeed;
      if (this.updateRequest.ticker <= 0) {
        this.updateRequest = undefined;
        this.store.player.ticker = 1;
      }
    } else {
      if (keys.w.pressed) {
        this.store.player.dir = 'up';
        if (!this.store.map.isSolid(this.store.player.position.translate({ x: 0, y: -1 }))) {
          this.updateRequest = { type: 'up', ticker: 1 };
        }
      } else if (keys.a.pressed) {
        this.store.player.dir = 'left';
        if (!this.store.map.isSolid(this.store.player.position.translate({ x: -1, y: 0 }))) {
          this.updateRequest = { type: 'left', ticker: 1 };
        }
      } else if (keys.s.pressed) {
        this.store.player.dir = 'down';
        if (!this.store.map.isSolid(this.store.player.position.translate({ x: 0, y: 1 }))) {
          this.updateRequest = { type: 'down', ticker: 1 };
        }
      } else if (keys.d.pressed) {
        this.store.player.dir = 'right';
        if (!this.store.map.isSolid(this.store.player.position.translate({ x: 1, y: 0 }))) {
          this.updateRequest = { type: 'right', ticker: 1 };
        }
      }
    }
  }
}
