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
            context.translate(x - offset.x, y - offset.y);
            context.rotate(angle);
            context.scale(scale.x, scale.y);
            context.globalAlpha = opacity;
            context.globalCompositeOperation = mode;
            renderable.render(context, camera);
            context.restore();
        });
    }
}
