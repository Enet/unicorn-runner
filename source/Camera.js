import {
    Vec2
} from 'math.js';

export default class Camera {
    constructor (width, height, x, y) {
        this.size = new Vec2(width, height);
        this.position = new Vec2(x, y);
    }
}
