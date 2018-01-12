import SpriteSheet from 'SpriteSheet.js';

export function createAnim (frames, frameLen) {
    return function resolveFrame(distance) {
        const frameIndex = Math.floor(distance / frameLen) % frames.length;
        const frameName = frames[frameIndex];
        return frameName;
    };
}

export function loadSpriteSheet (sheetSpec, image) {
    const sprites = new SpriteSheet(
        image,
        sheetSpec.tileW,
        sheetSpec.tileH
    );

    if (sheetSpec.frames) {
        sheetSpec.frames.forEach((frameSpec) => {
            sprites.define(frameSpec.name, ...frameSpec.rect);
        });
    }

    if (sheetSpec.animations) {
        sheetSpec.animations.forEach((animSpec) => {
            const animation = createAnim(animSpec.frames, animSpec.frameLen);
            sprites.defineAnim(animSpec.name, animation);
        });
    }

    return sprites;
}
