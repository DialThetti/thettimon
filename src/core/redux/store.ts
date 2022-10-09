export class Store<T> {
  constructor(private state: T) {}

  select<U>(f: (t: T) => U): U {
    return f(this.state);
  }

  apply(fragment: Partial<T>): T {
    this.state = { ...this.state, ...fragment };
    return this.state;
  }
}
