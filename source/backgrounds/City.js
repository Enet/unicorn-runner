import ParallaxBackground from 'backgrounds/ParallaxBackground.js';

export default class City extends ParallaxBackground {
    _getGradient () {
        return {
            0: '#7aacf1',
            1: '#ffffff'
        };
    }

    _renderLayers (context, camera) {
        super._renderLayers(...arguments);
        context.drawImage(this.images.sky, 0, 0);
    }
}

City.images = {
    1: 'City1',
    2: 'City2',
    3: 'City3',
    sky: 'CitySky'
};
