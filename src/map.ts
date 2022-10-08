import { IPoint, Point } from './point';

enum Events {
  SOLID = 1,
  GRASS = 2,
}
export class Map {
  events = { width: 0, events: [] as Events[] };
  async load() {
    const m: { layers: any[] } = await (await fetch('./maps/tst.json')).json();
    const eventLayer = m.layers.find(layer => layer.name === 'events');
    this.events = { width: eventLayer.width, events: eventLayer.data.map((a: number) => a) };
  }
  isSolid(p: IPoint) {
    const index = Math.round(p.y) * this.events.width + Math.round(p.x);
    return this.events.events[index] === Events.SOLID;
  }
}
