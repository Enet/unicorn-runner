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
            const area = renderable.area || {width, height};
            const offset = renderable.offset || camera.position;
            const bufferNode = document.createElement('canvas');
            bufferNode.width = area.width;
            bufferNode.height = area.height;
            const bufferContext = bufferNode.getContext('2d');
            renderable.render(bufferContext, camera);
            const x = offset.x - camera.position.x;
            const y = offset.y - camera.position.y;
            context.drawImage(bufferNode, x, y);
        }, true);
    }
}
