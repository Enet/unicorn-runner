import Background from 'backgrounds/Background.js';

const gradientDescription = new Map();
gradientDescription.set(0, '#0714BC');
gradientDescription.set(0.25, '#0730EF');
gradientDescription.set(1, '#268BEF');

export default class StaticBackground extends Background {
    render (context, camera) {
        this._renderGradient(context);
        this._renderGrass(context, camera);
    }

    _renderGradient (context) {
        const {width, height} = context.canvas;
        const gradient = context.createLinearGradient(0, 0, 0, width);
        gradientDescription.forEach((color, position) => {
            gradient.addColorStop(position, color);
        });
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
    }

    _renderGrass (context, camera) {
        const {height} = context.canvas;
        const {ground, back, front} = this.images;

        const groundX = -camera.position.x / 0.8;
        const layerX = -camera.position.x / 1.2;
        const layerY = -camera.position.y / 20 + 15;

        for (let i = 0; i < 30; i++) {
            context.drawImage(back, layerX + ground.width * i + 600, layerY + height - back.height + 1);
            context.drawImage(ground, groundX + ground.width * i, layerY + height - ground.height + 1);
            context.drawImage(front, layerX + ground.width * i + 100, layerY + height - front.height + 1);
        }
    }
}
