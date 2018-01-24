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
        context.drawImage(frame, x, y);
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
}
