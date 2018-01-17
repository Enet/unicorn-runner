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
            const angle = renderable.angle;
            const offset = renderable.offset;
            const opacity = renderable.opacity;
            let x = position.x - camera.position.x;
            let y = position.y - camera.position.y;

            context.save();
            context.translate(x, y);

            context.save();
            context.translate(-offset.x, -offset.y);
            context.rotate(angle);

            context.globalAlpha = opacity;
            renderable.render(context, camera);
            context.globalAlpha = 1;

            context.rotate(-angle);
            context.translate(offset.x, offset.y);
            context.restore();

            context.translate(-x, -y);
            context.restore();
        });
    }
}
