import ParallaxBackground from 'backgrounds/ParallaxBackground.js';

export default class Mountains extends ParallaxBackground {
    _getGradient () {
        return {
            0: '#6b7d95',
            0.5: '#96afd1'
        };
    }
}

Mountains.images = {
    0: 'Mountains0',
    1: 'Mountains1',
    2: 'Mountains2'
};
