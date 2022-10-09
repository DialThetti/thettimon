import { State } from './state';

export const getPlayer = (state: State) => state.player;
export const getPlayerPosition = (state: State) => getPlayer(state).position;

export const getMap = (state: State) => state.map;

export const getGameState = (state: State) => state.gameState;
