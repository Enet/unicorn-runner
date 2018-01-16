import {
    Vec2
} from './math.js';

export default class Debugger {
    constructor (world, camera, context) {
        this._world = world;
        this._camera = camera;
        this._context = context;
    }

    render (context = this._context) {
        const camera = this._camera;
        context.save();
        context.translate(-camera.position.x, -camera.position.y);

        const {bodies} = this._world;
        bodies.forEach((body) => {
            if (body.collidable) {
                this._renderPolygon(context, body.points);
            } else {
                this._renderLine(context, body.points[0], body.points[1]);
            }
        });

        const {width, height} = context.canvas;
        const {top, left, bottom, right} = this._world.bounds;
        this._renderLine(context, new Vec2(camera.position.x, top), new Vec2(camera.position.x + width, top), 'red');
        this._renderLine(context, new Vec2(camera.position.x, bottom), new Vec2(camera.position.x + width, bottom), 'red');
        this._renderLine(context, new Vec2(left, camera.position.y), new Vec2(left, camera.position.y + height), 'red');
        this._renderLine(context, new Vec2(right, camera.position.y), new Vec2(right, camera.position.y + height), 'red');

        context.translate(camera.position.x, camera.position.y);
        context.restore();
    }

    _renderPolygon (context, points, color) {
        context.save();
        context.strokeStyle = color || 'cyan';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(points[points.length - 1].x, points[points.length - 1].y);
        points.forEach((point) => {
            context.lineTo(point.x, point.y);
        });
        context.stroke();
        context.restore();
    }

    _renderLine (context, pointA, pointB, color) {
        context.save();
        context.strokeStyle = color || 'magenta';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(pointA.x, pointA.y);
        context.lineTo(pointB.x, pointB.y);
        context.stroke();
        context.restore();
    }
}
