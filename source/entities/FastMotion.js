import SlowMotion from 'entities/SlowMotion.js';

import spriteDescription from 'sprites/FastMotion.js';

export default class FastMotion extends SlowMotion {
    _getSpriteDescription () {
        return spriteDescription;
    }

    _getSpeedFactor () {
        return 2;
    }
}
