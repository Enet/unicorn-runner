import ParallaxBackground from 'backgrounds/ParallaxBackground.js';

const COLOR_NIGHT = '#110d12';

export default class NightBackground extends ParallaxBackground {
    _getImageNames () {
        return {
            0: 'Night0',
            1: 'Night1',
            2: 'Night2'
        };
    }

    _getGradient () {
        return {
            0: COLOR_NIGHT
        };
    }

    _shouldRenderLayer (i, r) {
        return i || !r;
    }

    _getPosition (context, camera, {x, y, i}) {
        const {height} = camera.size;
        const image = this.images[i];
        y = height - image.naturalHeight;
        return {x, y};
    }
}
