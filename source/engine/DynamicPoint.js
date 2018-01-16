import Point from './Point.js';

export default class DynamicPoint extends Point {
    integrate (deltaTime, world) {
        const {x, y, cache} = this;
        const {gravity, friction} = world;

        const vx = x - cache.x;
        const vy = y - cache.y;
        const deltaTimeSquare = deltaTime * deltaTime;

        this.x += vx * friction.x + gravity.x * deltaTimeSquare;
        this.y += vy * friction.y + gravity.y * deltaTimeSquare;
        cache.x = x;
        cache.y = y;
    }
}
