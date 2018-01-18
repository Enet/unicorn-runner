import Point from './Point.js';

export default class StaticPoint extends Point {
    integrate () {
        const {cache} = this;
        this.x = cache.x;
        this.y = cache.y;
    }
}
