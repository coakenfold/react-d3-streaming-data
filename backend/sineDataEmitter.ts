/**
 * Generates x,y sine coordinates
 * @example
 ```ts
 const sineDataEmitter = new SineDataEmitter(x?:number);
 sineDataEmitter.currentSet;
 sineDataEmitter.nextSet()
 ```
 */
export class SineDataEmitter {
  // JS max number
  maxX = 1.7976931348623157 * 10308;
  x = 0;
  _currentSet = {
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
      this.currentSet = this.getSet();
    }
  }
  getSet = () => {
    return {
      x: this.x,
      y: Math.sin(this.x),
      timestamp: new Date().valueOf(),
    };
  };
  get currentSet() {
    return this._currentSet;
  }
  set currentSet(newCurrent) {
    this._currentSet = newCurrent;
  }
  incrementX = () => {
    const nextX = this.x + 1;
    // reset to zero if at max
    this.x = nextX < this.maxX ? nextX : 0;
    this.currentSet = this.getSet();
  };
  nextSet = () => {
    this.incrementX();
    return this.currentSet;
  };
}
