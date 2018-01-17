import {
    Vector2
} from './math.js';

export default class Point extends Vector2 {
    constructor (x, y) {
        super(x, y);
        this.cache = new Vector2(x, y);
    }

    integrate () {

    }
}
