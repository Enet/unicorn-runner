export default class Renderer {
    constructor (canvasDescriptor) {
        this._canvasDescriptor = canvasDescriptor;
    }

    render (scene, context) {
        const canvasDescriptor = this._canvasDescriptor;
        const {width, height} = canvasDescriptor;
        context = context || canvasDescriptor.context;
        context.clearRect(0, 0, width, height);

        const {camera} = scene;
        scene.forEach((renderable) => {
            if (typeof renderable.render !== 'function') {
                return;
            }

            const area = renderable.area || canvasDescriptor;
            const position = renderable.position || camera.position;
            const bufferNode = document.createElement('canvas');
            bufferNode.width = area.width;
            bufferNode.height = area.height;
            const bufferContext = bufferNode.getContext('2d');

            renderable.render(bufferContext, camera);
            const x = position.x - camera.position.x;
            const y = position.y - camera.position.y;
            context.drawImage(bufferNode, x, y);
        }, true);
    }
}
