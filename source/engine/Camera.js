import {
    Position,
    Size
} from './math.js';

export default class Camera {
    constructor (width, height, x, y) {
        this.size = new Size(width, height);
        this.position = new Position(x, y);
    }

    isIterable () {
        return false;
    }
}
