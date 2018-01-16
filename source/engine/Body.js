import {
    Vec2
} from './math.js';

export default class Body {
    constructor ({points, stiffness = 1, collidable = true, statical}) {
        statical = !!statical;
        Object.assign(this, {points, stiffness, collidable, statical});
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

    getDeltaAngle (delta, angle) {
        return delta;
    }

    setPosition (absolutePosition) {
        const relativePosition = this.center.subtract(absolutePosition);
        this.points.forEach((point) => {
            point.set(point.subtract(relativePosition));
            point.cache.set(point.cache.subtract(relativePosition));
        });
    }

    _updateCenterOfMass () {
        const {points} = this;
        const zero = new Vec2(0, 0);
        const center = points
            .reduce((accumulator, point) => accumulator.add(point), zero)
            .length(1 / points.length);
        this.center = center;
    }

    _updatePoints () {
        const {points, center} = this;
        let deltaAngle = points.reduce((deltaAngle, point, p) => {
            const currentDisplacement = new Vec2(point.x - center.x, point.y - center.y);
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
            const next = new Vec2(
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
