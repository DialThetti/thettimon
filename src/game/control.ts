import { Event } from 'src/map';
import { OnUpdate } from '../core/gameloop/onupdate';
import { Store } from '../core/redux/store';
import { getGameState, getMap, getPlayer, getPlayerPosition } from './store/selectors';
import { GameState, State } from './store/state';

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
  constructor(private store: Store<State>) {}
  listen(): void {
    window.onkeydown = keyDown;
    window.onkeyup = keyUp;
  }
  isActive(): boolean {
    return true;
  }
  onUpdate(): void {
    if (this.updateRequest) {
      const pos = this.store.select(getPlayerPosition);
      switch (this.updateRequest.type) {
        case 'up':
          pos.y -= this.playerSpeed;
          break;
        case 'down':
          pos.y += this.playerSpeed;
          break;
        case 'left':
          pos.x -= this.playerSpeed;
          break;
        case 'right':
          pos.x += this.playerSpeed;
          break;
      }
      this.store.select(getPlayer).ticker = this.updateRequest.ticker;
      this.updateRequest.ticker -= this.playerSpeed;
      if (this.updateRequest.ticker <= 0) {
        this.updateRequest = undefined;
        this.store.select(getPlayer).ticker = 1;
        this.triggerEvent();
      }
    } else {
      if (this.store.select(getGameState) === GameState.OVERWORLD) {
        this.handleMove();
      } else {
        this.handleBattle();
      }
    }
  }
  handleBattle(): void {}
  handleMove(): void {
    if (keys.w.pressed) {
      this.store.select(getPlayer).dir = 'up';
      if (!this.store.select(getMap).isSolid(this.store.select(getPlayerPosition).translate({ x: 0, y: -1 }))) {
        this.updateRequest = { type: 'up', ticker: 1 };
      }
    } else if (keys.a.pressed) {
      this.store.select(getPlayer).dir = 'left';
      if (!this.store.select(getMap).isSolid(this.store.select(getPlayerPosition).translate({ x: -1, y: 0 }))) {
        this.updateRequest = { type: 'left', ticker: 1 };
      }
    } else if (keys.s.pressed) {
      this.store.select(getPlayer).dir = 'down';
      if (!this.store.select(getMap).isSolid(this.store.select(getPlayerPosition).translate({ x: 0, y: 1 }))) {
        this.updateRequest = { type: 'down', ticker: 1 };
      }
    } else if (keys.d.pressed) {
      this.store.select(getPlayer).dir = 'right';
      if (!this.store.select(getMap).isSolid(this.store.select(getPlayerPosition).translate({ x: 1, y: 0 }))) {
        this.updateRequest = { type: 'right', ticker: 1 };
      }
    }
  }
  triggerEvent(): void {
    if (this.store.select(getMap).getEvent(this.store.select(getPlayerPosition)) === Event.BATTLE_ZONE_1) {
      if (Math.random() < 1 / 10) {
        this.store.apply({ gameState: GameState.TRANSITION });
        console.log('grass');
      }
    }
  }
}
