import Point from './Point.js';

export default class StaticPoint extends Point {
    constructor () {
        super(...arguments);
        this.statical = true;
    }

    integrate (deltaTime) {
        const {cache} = this;
        this.x = cache.x;
        this.y = cache.y;
    }
}
