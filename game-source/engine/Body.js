import EventEmitter from 'events';
import {
    Vector2
} from './math.js';
import {
    REACTION_FULL
} from './constants.js';

export default class Body extends EventEmitter {
    constructor ({points, stiffness=1, reaction=REACTION_FULL}) {
        super();

        this.center = new Vector2(0, 0);
        Object.assign(this, {points, stiffness, reaction});
        this._updateCenterOfMass();
        this._updateAabb();

        const {center} = this;
        this.angle = 0;
        this._relativePoints = points.map(point => point.subtract(center));
    }

    update () {
        this._updateCenterOfMass();
        this._updatePoints();
        this._updateAabb();
    }

    place (absolutePosition) {
        const relativePosition = this.center.subtract(absolutePosition);
        this.points.forEach((point) => {
            point.set(point.subtract(relativePosition));
            point.cache.set(point.cache.subtract(relativePosition));
        });
        this._updateCenterOfMass();
    }

    move (offset) {
        this.points.forEach((point) => {
            point.set(point.add(offset));
        });
    }

    stop () {
        this.points.forEach((point) => {
            point.cache.set(point);
        });
    }

    setFriction (friction) {
        this.points.forEach((point) => {
            point.friction = friction;
        });
    }

    setGravity (gravity) {
        this.points.forEach((point) => {
            point.gravity = gravity;
        });
    }

    getVelocity () {
        return this.points.reduce((accumulator, point) => {
            return accumulator.add(point.subtract(point.cache));
        }, new Vector2(0, 0)).length(1 / this.points.length);
    }

    getDeltaAngle (delta, angle) {
        return delta;
    }

    _updateCenterOfMass () {
        const {points} = this;
        const zero = new Vector2(0, 0);
        const center = points
            .reduce((accumulator, point) => accumulator.add(point), zero)
            .length(1 / points.length);
        this.center.set(center);
    }

    _updatePoints () {
        const {points, center} = this;
        let deltaAngle = points.reduce((deltaAngle, point, p) => {
            const currentDisplacement = new Vector2(point.x - center.x, point.y - center.y);
            const previousDisplacement = this._relativePoints[p];
            const cos = currentDisplacement.x * previousDisplacement.x + currentDisplacement.y * previousDisplacement.y;
            const sin = currentDisplacement.y * previousDisplacement.x - currentDisplacement.x * previousDisplacement.y;
            return deltaAngle + Math.atan2(sin, cos);
        }, 0) / points.length;

        deltaAngle = this.getDeltaAngle(deltaAngle, this.angle);
        this.angle += deltaAngle;

        const cos = Math.cos(deltaAngle);
        const sin = Math.sin(deltaAngle);
        points.forEach((point, p) => {
            const displacement = this._relativePoints[p];
            const next = new Vector2(
                cos * displacement.x - sin * displacement.y,
                sin * displacement.x + cos * displacement.y
            );
            displacement.set(next);
            next.set(next.add(center));
            point.set(point.add(next.subtract(point).length(this.stiffness)));
        });
    }

    _updateAabb () {
        const {points} = this;
        const min = points[0].clone();
        const max = min.clone();
        for (let p = 1, pl = points.length; p < pl; p++) {
            const point = points[p];
            min.x = Math.min(point.x, min.x);
            min.y = Math.min(point.y, min.y);
            max.x = Math.max(point.x, max.x);
            max.y = Math.max(point.y, max.y);
        }
        this.min = min;
        this.max = max;
    }
}
