import Background from 'backgrounds/Background.js';

const PARALLAX_SHIFT_X = 0.25;
const PARALLAX_SHIFT_Y = 0.05;
const OFFSET_X = 0;
const OFFSET_Y = 600;

export default class ParallaxBackground extends Background {
    constructor ({bounds}) {
        super(...arguments);
        this.bounds = bounds;

        // Some calculations are cached
        const {images} = this;
        for (let i = 0, il = Object.keys(images).length; i < il; i++) {
            const image = images[i];
            if (!image) {
                continue;
            }
            const {naturalWidth} = image;
            image.widthX = [
                0,
                naturalWidth,
                naturalWidth * 2,
                naturalWidth * 3
            ];
            image.widthX6 = image.widthX[3] * 2;
        }
    }

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

    _shouldRenderLayer (i, r) {
        return true;
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
        const halfHeight = height * 0.5;
        const {images} = this;
        const cameraX = camera.position.x + OFFSET_X;
        const cameraY = camera.position.y - this.bounds.bottom + OFFSET_Y;
        for (let i = 0, il = Object.keys(images).length; i < il; i++) {
            const image = images[i];
            if (!image) {
                continue;
            }
            const {widthX, widthX6, naturalHeight} = image;

            for (let r = 0, rl = 3; r < rl; r++) {
                if (!this._shouldRenderLayer(i, r)) {
                    continue;
                }
                let x = -cameraX * i * PARALLAX_SHIFT_X - widthX6;
                let y = height - naturalHeight - (cameraY * i - halfHeight) * PARALLAX_SHIFT_Y;
                const position = this._getPosition(context, camera, {x, y, i, r});
                x = (position.x + widthX[r + 1]) % widthX[rl] + widthX[rl - 1] | 0;
                y = position.y | 0;
                context.drawImage(image, x, y | 0);
            }
        }
    }
}
