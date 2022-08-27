"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SineDataEmitter = void 0;
/**
 * Generates x,y sine coordinates
 * @example
 ```ts
 const sineDataEmitter = new SineDataEmitter(x?:number);
 sineDataEmitter.currentSet;
 sineDataEmitter.nextSet()
 ```
 */
class SineDataEmitter {
    constructor(x) {
        // JS max number
        this.maxX = 1.7976931348623157 * 10308;
        this.x = 0;
        this._currentSet = {
            x: 0,
            y: 0,
            timestamp: 0,
        };
        this.getSet = () => {
            return {
                x: this.x,
                y: Math.sin(this.x),
                timestamp: new Date().valueOf(),
            };
        };
        this.incrementX = () => {
            const nextX = this.x + 1;
            // reset to zero if at max
            this.x = nextX < this.maxX ? nextX : 0;
            this.currentSet = this.getSet();
        };
        this.nextSet = () => {
            this.incrementX();
            return this.currentSet;
        };
        if (x === this.maxX) {
            throw new Error(`Initial value for x must be less than ${this.maxX}`);
        }
        if (x) {
            this.x = x;
            this.currentSet = this.getSet();
        }
    }
    get currentSet() {
        return this._currentSet;
    }
    set currentSet(newCurrent) {
        this._currentSet = newCurrent;
    }
}
exports.SineDataEmitter = SineDataEmitter;
