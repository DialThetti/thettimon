export class Point implements IPoint {
  constructor(public x: number, public y: number) {}

  translate(p: IPoint): Point {
    return new Point(this.x + p.x, this.y + p.y);
  }

  scale(factor: number): Point {
    return new Point(this.x * factor, this.y * factor);
  }
  floor(): Point {
    return new Point(Math.floor(this.x), Math.floor(this.y));
  }
}

export interface IPoint {
  x: number;
  y: number;
}
