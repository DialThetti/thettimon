import { Controls } from './game/control';
import { GameLoop } from './core/gameloop/gameloop';
import { FPSLayer } from './fps';

import { MapRenderer } from './game/map-renderer';
import { Map } from './map';
import { Store } from './store';
import { TransitionLayer } from './game/transition';

const store = new Store();
const main = async () => {
  const map = new Map();
  await map.load();
  store.map = map;
  const controls = new Controls(store);
  const mapRenderer = new MapRenderer(store);
  await mapRenderer.load();
  const transition = new TransitionLayer(store);
  await transition.load();

  const gl = new GameLoop({ updaters: [controls, transition], renderers: [mapRenderer, new FPSLayer(), transition] });
  controls.listen();
  gl.start('screen');
};
main();

(window as any).transition = () => {
  store.inBattle = true;
};
