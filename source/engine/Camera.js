import {
    Vector2
} from './math.js';

export default class Camera {
    constructor ({width, height, x=0, y=0}) {
        this.size = new Vector2(width, height);
        this.position = new Vector2(x, y);
    }
}
