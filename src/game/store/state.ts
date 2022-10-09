import { Map } from 'src/map';
import { Point } from 'src/point';

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
  player: { position: new Point(4, 4), dir: 'down', ticker: 1 },
  map: new Map(),
  gameState: GameState.OVERWORLD,
};
