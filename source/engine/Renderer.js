import {
    Vec2
} from './math.js';

export default class Renderer {
    constructor (context) {
        this._context = context;
    }

    render (scene, context = this._context) {
        const {width, height} = context.canvas;
        context.clearRect(0, 0, width, height);

        const {camera} = scene;
        scene.forEach((renderable) => {
            if (typeof renderable.render !== 'function') {
                return;
            }
            const position = renderable.position || camera.position;
            const angle = renderable.angle || 0;
            const offset = renderable.offset || new Vec2(0, 0);
            let x = position.x - camera.position.x;
            let y = position.y - camera.position.y;
            context.save();
            context.translate(x, y);

            context.save();
            context.translate(-offset.x, -offset.y);
            context.rotate(angle);

            renderable.render(context, camera);

            context.rotate(-angle);
            context.translate(offset.x, offset.y);
            context.restore();

            context.translate(-x, -y);
            context.restore();
        }, true);
    }
}
