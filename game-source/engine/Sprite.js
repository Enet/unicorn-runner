import Animation from './Animation.js';

export default class Sprite {
    constructor () {
        const {image, frames, animations} = this._initOptions(...arguments);

        this.image = image;

        this.frames = new Map();
        Object.keys(frames).forEach((name) => {
            const rectangle = frames[name];
            const frame = this._createFrame(...rectangle);
            this.frames.set(name, frame);
        });

        this.animations = new Map();
        Object.keys(animations).forEach((key) => {
            const frames = animations[key];
            const [name, delay] = key.split('.');
            const animation = this._createAnimation(frames, delay);
            this.animations.set(name, animation);
        });
    }

    render (name, context, x=0, y=0) {
        const frame = this.frames.get(name);
        context.drawImage(frame, x | 0, y | 0);
    }

    _initOptions (imageNode, spriteDescription={}) {
        const image = imageNode;

        const frames = spriteDescription.frames || {
            default: [0, 0, image.naturalWidth, image.naturalHeight]
        };

        const animations = spriteDescription.animations || {
            default: ['default']
        };

        return {image, frames, animations};
    }

    _createFrame (x, y, width, height) {
        const frame = document.createElement('canvas');
        frame.width = width;
        frame.height = height;

        const {image} = this;
        const context = frame.getContext('2d');
        context.drawImage(
            image,
            x, y, width, height,
            0, 0, width, height
        );

        return frame;
    }

    _createAnimation (frames, delay) {
        delay = +delay || 16;
        return new Animation(frames, delay);
    }

    static transformFrame (image, transforms={}, effects={}) {
        const {width, height} = image;
        const halfWidth = width * 0.5;
        const halfHeight = height * 0.5;

        const frame = document.createElement('canvas');
        frame.width = width;
        frame.height = height;

        const context = frame.getContext('2d');

        context.translate(halfWidth, halfHeight);
        for (let t in transforms) {
            context[t](...transforms[t]);
        }
        context.drawImage(image, -halfWidth, -halfHeight);
        if (effects.alphaGradient) {
            const imageData = context.getImageData(0, 0, width, height);
            for (let x = 0; x < width; x++) {
                for (let y = halfHeight; y < height; y++) {
                    const alphaIndex = (x + y * width) * 4 + 3;
                    const alphaValue = 255 * (1 - (y - halfHeight) * 2 / height);
                    imageData.data[alphaIndex] = alphaValue;
                }
            }
            context.putImageData(imageData, 0, 0);
        }

        return frame;
    }
}
