export class Point implements IPoint {
  constructor(public x: number, public y: number) {}

  translate(p: IPoint): Point {
    return new Point(this.x + p.x, this.y + p.y);
  }

  scale(factor: number): Point {
    return new Point(this.x * factor, this.y * factor);
  }
}

export interface IPoint {
  x: number;
  y: number;
}
