import ParallaxBackground from 'backgrounds/ParallaxBackground.js';

const COLOR_MOUNTAINS_1 = '#6b7d95';
const COLOR_MOUNTAINS_2 = '#96afd1';

export default class MountainsBackground extends ParallaxBackground {
    _getImageNames () {
        return {
            0: 'Mountains0',
            1: 'Mountains1',
            2: 'Mountains2'
        };
    }

    _getGradient () {
        return {
            0: COLOR_MOUNTAINS_1,
            0.5: COLOR_MOUNTAINS_2
        };
    }
}
