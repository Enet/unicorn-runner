export default class Renderer {
    constructor (context) {
        this._context = context;
    }

    render (scene, context=this._context) {
        const {width, height} = context.canvas;
        context.clearRect(0, 0, width, height);

        const {camera} = scene;
        scene.forEach((renderable) => {
            const position = renderable.position || camera.position;
            const {angle, offset, scale, opacity, mode} = renderable;
            let x = position.x - camera.position.x;
            let y = position.y - camera.position.y;

            context.save();
            context.translate(x, y);

            context.save();
            context.translate(-offset.x, -offset.y);
            context.rotate(angle);
            context.scale(scale.x, scale.y);

            context.globalAlpha = opacity;
            context.globalCompositeOperation = mode;

            renderable.render(context, camera);

            context.globalCompositeOperation = 'source-over';
            context.globalAlpha = 1;

            context.rotate(-angle);
            context.translate(offset.x, offset.y);
            context.restore();

            context.translate(-x, -y);
            context.restore();
        });
    }
}
