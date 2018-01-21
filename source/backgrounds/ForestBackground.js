import ParallaxBackground from 'backgrounds/ParallaxBackground.js';

const COLOR_FOREST_1 = '#f69102';
const COLOR_FOREST_2 = '#fdf19b';

export default class ForestBackground extends ParallaxBackground {
    _getGradient () {
        return {
            0: COLOR_FOREST_1,
            0.5: COLOR_FOREST_2
        };
    }
}

ForestBackground.images = {
    0: 'Forest0',
    1: 'Forest1',
    2: 'Forest2'
};
