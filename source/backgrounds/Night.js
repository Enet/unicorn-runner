import ParallaxBackground from 'backgrounds/ParallaxBackground.js';

export default class Night extends ParallaxBackground {
    _getPosition (context, camera, {x, y, i}) {
        const {height} = context.canvas;
        const image = this.images[i];
        y = height - image.naturalHeight;
        return {x, y};
    }
}

Night.images = {
    0: 'Night0',
    1: 'Night1',
    2: 'Night2'
};
