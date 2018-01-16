import Collision from './Collision.js';
import {
    Vec2
} from './math.js';

export default class World {
    constructor ({top = -Infinity, left = -Infinity, bottom = Infinity, right = Infinity, gravity, friction}) {
        this.points = new Set();
        this.bodies = [];
        this.bounds = {top, left, bottom, right};

        this.gravity = gravity || new Vec2(0, 981);
        this.friction = friction || new Vec2(0.98, 0.98);
    }

    add (body) {
        const {bodies} = this;
        const index = bodies.indexOf(body);
        if (index !== -1) {
            return;
        }
        bodies.push(body);
        body.points.forEach((point) => {
            this.points.add(point);
        });
    }

    remove (body) {
        const {bodies} = this;
        const index = bodies.indexOf(body);
        if (index === -1) {
            return;
        }
        body.points.forEach((point) => {
            this.points.delete(point);
        });
        bodies.splice(index, 1);
    }

    update (deltaTime, iterationCount = 5) {
        this._updateBodies();

        while (iterationCount--) {
            this._collideBodies();
            this._updateBodies();
            this._restrictBodies();
        }

        this._integratePoints(deltaTime);
    }

    _updateBodies () {
        this.bodies.forEach(body => !body.statical && body.update());
    }

    _restrictBodies () {
        const {points} = this;
        points.forEach((point) => {
            const {x, y} = point;
            const {top, left, bottom, right} = this.bounds;
            point.x = Math.min(right, Math.max(left, x));
            point.y = Math.min(bottom, Math.max(top, y));
        });
    }

    _collideBodies () {
        const {bodies} = this;
        const bl = bodies.length;
        bodies.sort((body1, body2) => {
            return body1.min.x > body2.min.x ? 1 : -1;
        });

        for (let b = 0; b < bl; b++) {
            const body1 = bodies[b];
            for (let a = b + 1; a < bl; a++) {
                const body2 = bodies[a];
                if (!body1.collidable || !body2.collidable) {
                    continue;
                }
                if (body1.static && body2.static) {
                    continue;
                }
                const collision = new Collision(body1, body2);
                collision.resolve();
            }
        }
    }

    _integratePoints (deltaTime) {
        const {points} = this;
        points.forEach(point => point.integrate(deltaTime, this));
    }
}
