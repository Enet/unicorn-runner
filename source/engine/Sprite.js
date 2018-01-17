export default class Sprite {
    constructor (image, {frames=[], animations=[]}) {
        this.image = image;

        this.frames = new Map();
        frames.forEach((description) => {
            const {name, rect} = description;
            const frame = this._createFrame(...rect);
            this.frames.set(name, frame);
        });

        this.animations = new Map();
        animations.forEach((description) => {
            const {name} = description;
            const animation = this._createAnimation(description);
            this.animations.set(name, animation);
        });
    }

    render (name, context, x=0, y=0) {
        const frame = this.frames.get(name);
        context.drawImage(frame, x, y);
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

    _createAnimation ({frames, delay}) {
        return (time) => {
            const frameIndex = Math.floor(time / delay) % frames.length;
            const frameName = frames[frameIndex];
            return frameName;
        };
    }
}
