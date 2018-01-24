import ParallaxBackground from 'backgrounds/ParallaxBackground.js';

export default class NightBackground extends ParallaxBackground {
    _getImageNames () {
        return {
            0: 'Night0',
            1: 'Night1',
            2: 'Night2'
        };
    }

    _getPosition (context, camera, {x, y, i}) {
        const {height} = camera.size;
        const image = this.images[i];
        y = height - image.naturalHeight;
        return {x, y};
    }
}
