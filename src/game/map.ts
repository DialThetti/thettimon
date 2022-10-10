import { IPoint } from '../core/point';

export enum Event {
  NONE = 0,
  SOLID = 1,
  BATTLE_ZONE_1 = 9,
  BATTLE_ZONE_2 = 10,
  BATTLE_ZONE_3 = 11,
}
export class Map {
  events = { width: 0, events: [] as Event[] };

  constructor(private id: string) {}
  async load() {
    const m: { layers: any[]; tilesets: any[] } = await (await fetch(`./maps/${this.id}.json`)).json();
    const i = m.tilesets.find(a => a.source.endsWith('events.json'))?.firstgid ?? 0;
    const eventLayer = m.layers.find(layer => layer.name === 'events');
    this.events = { width: eventLayer.width, events: eventLayer.data.map((a: number) => (a === 0 ? 0 : a - i + 1)) };
  }
  isSolid(p: IPoint) {
    return this.getEvent(p) === Event.SOLID;
  }

  getEvent(p: IPoint): Event {
    const index = Math.round(p.y) * this.events.width + Math.round(p.x);
    return this.events.events[index];
  }

  getBackgroundUrl(): string {
    return `./img/${this.id}.png`;
  }
  getFrontUrl(): string {
    return `./img/${this.id}_front.png`;
  }
}
