import {
    Vector2
} from './math.js';

function areBodiesOverlapped (body1, body2) {
    return true &&
        body1.max.x > body2.min.x &&
        body1.min.x < body2.max.x &&
        body1.max.y > body2.min.y &&
        body1.min.y < body2.max.y;
}

function getAabbProjection (axis, points) {
    let min = points[0].dot(axis);
    let max = min;

    for (let p = 1, pl = points.length; p < pl; p++) {
        const point = points[p];
        const value = point.dot(axis);
        if (value < min) {
            min = value;
        } else if (value > max) {
            max = value
        }
    }

    return {min, max};
}

function getDistanceBetweenBodies (body1, body2) {
    return body1.min < body2.min ?
        body2.min - body1.max :
        body1.min - body2.max;
}

export default class Collision {
    constructor (body1, body2) {
        if (!areBodiesOverlapped(body1, body2)) {
            return;
        }

        let depth = Infinity;
        let edge;
        let normal;
        let contact;

        const pl1 = body1.points.length;
        const pl2 = body2.points.length;
        let minDistanceBody;
        for (let p = 0; p < pl1 + pl2; p++) {
            const body = p < pl1 ? body1 : body2;
            const {points} = body;
            const a = p < pl1 ? p : p - pl1;
            const b = (a + 1) % points.length;

            const pointA = points[a];
            const pointB = points[b];
            const axis = new Vector2(
                pointA.y - pointB.y,
                pointB.x - pointA.x
            ).normalize();

            const projection1 = getAabbProjection(axis, body1.points);
            const projection2 = getAabbProjection(axis, body2.points);
            const distance = getDistanceBetweenBodies(projection1, projection2);
            if (distance > 0) {
                return;
            } else if (Math.abs(distance) < depth) {
                depth = Math.abs(distance);
                edge = [pointA, pointB];
                normal = axis;
                minDistanceBody = body;
            }
        }

        if (minDistanceBody !== body2) {
            [body1, body2] = [body2, body1];
        }

        const center = body1.center.subtract(body2.center);
        if (center.dot(normal) < 0) {
            normal = normal.inverse();
        }
        const vector = normal.length(depth);

        let minDistance = Infinity;
        body1.points.forEach((point) => {
            const relativePoint = point.subtract(body1.center);
            const distance = relativePoint.dot(normal);
            if (distance < minDistance) {
                minDistance = distance;
                contact = point;
            }
        });

        this._collision = {body1, body2, edge, vector, contact};
    }

    resolve () {
        const collision = this._collision;
        if (!collision) {
            return;
        }

        const {body1, body2, edge, vector, contact} = collision;
        const [pointA, pointB] = edge;

        let t = Math.abs(pointA.x - pointB.x) > Math.abs(pointA.y - pointB.y) ?
            (contact.x - vector.x - pointA.x) / (pointB.x - pointA.x) :
            (contact.x - vector.y - pointA.y) / (pointB.y - pointA.y);

        t = Math.min(2, t);

        const lambda = 1 / (t * t + (1 - t) * (1 - t));
        const cA = (1 - t) * 0.5 * lambda;
        const cB = t * 0.5 * lambda;
        const cC = 0.5;

        pointA.set(pointA.subtract(vector.length(cA)));
        pointB.set(pointB.subtract(vector.length(cB)));
        contact.set(contact.add(vector.length(cC)));

        body1.emit('collision', body2, collision);
        body2.emit('collision', body1, collision);
    }
}
