import Background from 'backgrounds/Background.js';

const gradientDescriptor = new Map();
gradientDescriptor.set(0, '#0714BC');
gradientDescriptor.set(0.25, '#0730EF');
gradientDescriptor.set(1, '#268BEF');

export default class StaticBackground extends Background {
    render (context, camera) {
        this._renderGradient(context);
        this._renderGrass(context, camera);
    }

    _renderGradient (context) {
        const {width, height} = this.size;
        const gradient = context.createLinearGradient(0, 0, 0, width);
        gradientDescriptor.forEach((color, position) => {
            gradient.addColorStop(position, color);
        });
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
    }

    _renderGrass (context, camera) {
        const {size, images} = this;
        const {height} = size;
        const {ground, back, front} = images;

        const groundX = -camera.position.x / 0.8;
        const layerX = -camera.position.x / 1.2;

        for (let i = 0; i < 30; i++) {
            context.drawImage(back, layerX + ground.width * i + 600, height - back.height + 1);
            context.drawImage(ground, groundX + ground.width * i, height - ground.height + 1);
            context.drawImage(front, layerX + ground.width * i + 100, height - front.height + 1);
        }
    }
}
