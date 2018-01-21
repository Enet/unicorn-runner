import SlowMotion from 'entities/SlowMotion.js';

import spriteDescription from 'sprites/FastMotionSprite.js';

export default class FastMotion extends SlowMotion {
    _getSpriteDescription () {
        return spriteDescription;
    }

    _getSpeedEffect () {
        return 'fast';
    }
}

FastMotion.images = {
    default: 'FastMotion'
};
