export const SineDataEmitter = class {
  // JS max number
  maxX = 1.7976931348623157 * 10308;
  x = 0;
  _current = {
    x: 0,
    y: 0,
    timestamp: 0,
  };
  constructor(x?: number) {
    if (x === this.maxX) {
      throw new Error(`Initial value for x must be less than ${this.maxX}`);
    }
    if (x) {
      this.x = x;
      this.current = this.getSet();
    }
  }
  getSet = () => {
    return {
      x: this.x,
      y: Math.sin(this.x),
      timestamp: new Date().valueOf(),
    };
  };
  get current() {
    return this._current;
  }
  set current(newCurrent) {
    this._current = newCurrent;
  }
  inc = () => {
    const nextX = this.x + 1;
    // reset to zero if at max
    this.x = nextX < this.maxX ? nextX : 0;
    this.current = this.getSet();
  };
  next = () => {
    this.inc();
    return this.current;
  };
};
