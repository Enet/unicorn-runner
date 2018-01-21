import ParallaxBackground from 'backgrounds/ParallaxBackground.js';

const COLOR_CITY_1 = '#7aacf1';
const COLOR_CITY_2 = '#ffffff';

export default class CityBackground extends ParallaxBackground {
    _getGradient () {
        return {
            0: COLOR_CITY_1,
            1: COLOR_CITY_2
        };
    }

    _renderLayers (context, camera) {
        super._renderLayers(...arguments);
        context.drawImage(this.images.sky, 0, 0);
    }
}

CityBackground.images = {
    1: 'City1',
    2: 'City2',
    3: 'City3',
    sky: 'CitySky'
};
