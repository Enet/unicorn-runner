export default class SpriteSheet {
    constructor (image, sheetSpec) {
        this.image = image;
        this.width = sheetSpec.tileW;
        this.height = sheetSpec.tileH;
        this.tiles = new Map();
        this.animations = new Map();

        if (sheetSpec.frames) {
            sheetSpec.frames.forEach((frameSpec) => {
                this.define(frameSpec.name, ...frameSpec.rect);
            });
        }

        if (sheetSpec.animations) {
            sheetSpec.animations.forEach((animSpec) => {
                const {frames, frameLen} = animSpec;
                const animation = function resolveFrame (distance) {
                    const frameIndex = Math.floor(distance / frameLen) % frames.length;
                    const frameName = frames[frameIndex];
                    return frameName;
                };
                this.defineAnim(animSpec.name, animation);
            });
        }
    }

    defineAnim (name, animation) {
        this.animations.set(name, animation);
    }

    define (name, x, y, width, height) {
        const buffers = [false, true].map(() => {
            const buffer = document.createElement('canvas');
            buffer.width = width;
            buffer.height = height;

            const context = buffer.getContext('2d');

            context.drawImage(
                this.image,
                x,
                y,
                width,
                height,
                0,
                0,
                width,
                height);

            return buffer;
        });

        this.tiles.set(name, buffers);
    }

    render (name, context, x, y) {
        const buffer = this.tiles.get(name)[0];
        context.drawImage(buffer, x, y);
    }

    drawTile (name, context, x, y) {
        this.render(name, context, x * this.width, y * this.height);
    }
}
