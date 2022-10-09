import { OnRender } from '@core/gameloop/onrender';
import { Store } from '@core/redux/store';
import { getGameState } from '@game/store/selectors';
import { GameState, State } from '@game/store/state';

export class BattleRenderer implements OnRender {
  constructor(private store: Store<State>) {}
  async load() {}
  onRender(ctx: CanvasRenderingContext2D): void {}
  isActive(): boolean {
    return this.store.select(getGameState) === GameState.BATTLE;
  }
}
