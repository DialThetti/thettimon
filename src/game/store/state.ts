import { Map } from '@game/map';
import { Point } from '@core/point';

export interface State {
  player: { position: Point; dir: string; ticker: number };
  map: Map;
  gameState: GameState;
}
export enum GameState {
  OVERWORLD,
  TRANSITION,
  BATTLE,
}

export const initialState: State = {
  player: { position: new Point(13, 23), dir: 'down', ticker: 1 },
  map: new Map(''),
  gameState: GameState.OVERWORLD,
};
