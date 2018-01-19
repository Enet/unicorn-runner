import ParallaxBackground from 'backgrounds/ParallaxBackground.js';

export default class Forest extends ParallaxBackground {
    _getGradient () {
        return {
            0: '#f69102',
            0.5: '#fdf19b'
        };
    }
}

Forest.images = {
    0: 'Forest0',
    1: 'Forest1',
    2: 'Forest2'
};
