import {
    Vec2,
    Size
} from './math.js';

export default class Camera {
    constructor (width, height, x, y) {
        this.size = new Size(width, height);
        this.position = new Vec2(x, y);
    }

    isIterable () {
        return false;
    }
}
