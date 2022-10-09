import { Controls } from './game/screens/overworld/control';
import { GameLoop } from './core/gameloop/gameloop';
import { FPSLayer } from './game/screens/fps';

import { MapRenderer } from './game/screens/overworld/map-renderer';
import { Map } from './game/map';
import { Store } from './core/redux/store';
import { TransitionLayer } from './game/transition';
import { GameState, initialState, State } from './game/store/state';
import { BattleRenderer } from '@game/screens/battle/battle-renderer';

const store = new Store<State>(initialState);
const main = async () => {
  const map = new Map();
  await map.load();
  store.apply({ map });
  const controls = new Controls(store);
  const mapRenderer = new MapRenderer(store);
  await mapRenderer.load();
  const transition = new TransitionLayer(store);
  await transition.load();

  const battle = new BattleRenderer(store);
  await battle.load();
  const gl = new GameLoop({
    updaters: [controls, transition],
    renderers: [mapRenderer, new FPSLayer(), transition, battle],
  });
  controls.listen();
  gl.start('screen');
};
main();

(window as any).transition = () => {
  store.apply({ gameState: GameState.TRANSITION });
};
