import Collision from './Collision.js';
import {
    Vector2
} from './math.js';
import {
    REACTION_TRAP
} from './constants.js';

export default class World {
    constructor ({top=-Infinity, left=-Infinity, bottom=Infinity, right=Infinity, gravity, friction}) {
        this.bounds = {top, left, bottom, right};
        this.gravity = gravity || new Vector2(0, 981);
        this.friction = friction || new Vector2(0.98, 0.98);

        this.bodies = {
            all: [],
            static: [],
            dynamic: []
        };
    }

    add (body) {
        const {bodies} = this;
        const index = bodies.all.indexOf(body);
        if (index !== -1) {
            return;
        }
        bodies.all.push(body);
        if (body.static) {
            bodies.static.push(body);
        } else {
            bodies.dynamic.push(body);
        }
    }

    remove (body) {
        const {bodies} = this;
        const index = bodies.all.indexOf(body);
        if (index === -1) {
            return;
        }
        bodies.all.splice(index, 1);
        if (body.static) {
            const index = bodies.static.indexOf(body);
            index !== -1 && bodies.static.splice(index, 1);
        } else {
            const index = bodies.dynamic.indexOf(body);
            index !== -1 && bodies.dynamic.splice(index, 1);
        }
    }

    update (deltaTime, iterationCount=2) {
        this._updateBodies();

        while (iterationCount--) {
            this._collideBodies();
            this._updateBodies();
            this._restrictBodies();
        }

        this._integratePoints(deltaTime);
    }

    _updateBodies () {
        this.bodies.all.forEach(body => body.update());
    }

    _restrictBodies () {
        const {bodies} = this;
        bodies.all.forEach((body) => {
            body.points.forEach((point) => {
                const {x, y} = point;
                const {top, left, bottom, right} = this.bounds;
                point.x = Math.min(right, Math.max(left, x));
                point.y = Math.min(bottom, Math.max(top, y));
            });
        });
    }

    _collideBodies () {
        const {bodies} = this;
        for (let body1 of bodies.dynamic) {
            const candidates = body1.candidates || bodies.all;
            for (let body2 of candidates) {
                if (body1 === body2) {
                    continue;
                }
                if (!body1.reaction || !body2.reaction) {
                    continue;
                }
                const collision = new Collision(body1, body2);
                if (body1.reaction === REACTION_TRAP ||
                    body2.reaction === REACTION_TRAP) {
                    collision.resolve((data) => {
                        body1.emit('collision', body2, data);
                        body2.emit('collision', body1, data);
                    });
                } else {
                    collision.resolve();
                }
            }
        }
    }

    _integratePoints (deltaTime) {
        const {bodies} = this;
        bodies.all.forEach((body) => {
            const {points} = body;
            points.forEach(point => point.integrate(deltaTime, this));
        });
    }

    _sortBodies (body1, body2) {
        return body1.min.x > body2.min.x ? 1 : -1;
    }
}
