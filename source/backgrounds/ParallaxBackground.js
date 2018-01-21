import Background from 'backgrounds/Background.js';

const PARALLAX_SHIFT_X = 0.25;
const PARALLAX_SHIFT_Y = 0.05;

export default class ParallaxBackground extends Background {
    render (context, camera) {
        this._renderGradient(context, camera);
        this._renderLayers(context, camera);
    }

    _getGradient () {
        return null;
    }

    _getPosition (context, camera, {x, y, i}) {
        return {x, y};
    }

    _renderGradient (context, camera) {
        const stops = this._getGradient();
        if (!stops) {
            return;
        }
        const {width, height} = camera.size;
        const gradient = context.createLinearGradient(0, 0, 0, width);
        for (let s in stops) {
            gradient.addColorStop(+s, stops[s]);
        }
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
    }

    _renderLayers (context, camera) {
        const {height} = camera.size;
        const halfHeight = height / 2;
        const {images} = this;
        for (let i = 0, il = Object.keys(images).length; i < il; i++) {
            for (let r = 0; r < 2; r++) {
                const image = images[i];
                if (!image) {
                    continue;
                }
                if (!i && r) {
                    continue;
                }
                const {naturalWidth, naturalHeight} = image;
                const {x, y} = this._getPosition(context, camera, {
                    x: -camera.position.x * i * PARALLAX_SHIFT_X,
                    y: height - naturalHeight - (camera.position.y * i - halfHeight) * PARALLAX_SHIFT_Y,
                    i
                });
                context.drawImage(image, x % naturalWidth + r * naturalWidth, y);
            }
        }
    }
}

ParallaxBackground.images = Background.images;
