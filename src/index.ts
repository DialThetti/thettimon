import { Controls } from './game/control';
import { GameLoop } from './core/gameloop/gameloop';
import { FPSLayer } from './fps';

import { MapRenderer } from './game/map-renderer';
import { Map } from './map';
import { Store } from './store';

const main = async () => {
  const map = new Map();
  await map.load();
  const store = new Store();
  store.map = map;
  const controls = new Controls(store);
  const mapRenderer = new MapRenderer(store);
  await mapRenderer.load();
  const gl = new GameLoop({ updaters: [controls], renderers: [mapRenderer, new FPSLayer()] });
  controls.listen();
  gl.start('screen');
};
main();
