import {
    Vec2
} from './math.js';

export default class Point extends Vec2 {
    constructor (x, y) {
        super(x, y);
        this.cache = new Vec2(x, y);
    }

    integrate () {

    }
}
