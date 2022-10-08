import { Map } from './map';
import { Point } from './point';

export class Store {
  player = { position: new Point(4, 4), dir: 'down', ticker: 1 };
  map!: Map;
}
