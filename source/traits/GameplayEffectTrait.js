import GameplayTrait from 'traits/GameplayTrait.js';

import {
    EFFECT_TIME
} from 'constants.js';

export default class GameplayEffectTrait extends GameplayTrait {
    use () {
        if (this._isUsed) {
            return;
        }
        const {options, level} = this;
        const {effectName} = options;
        const duration = +options.duration || EFFECT_TIME;
        level.addEffect(effectName);
        level.setTimeout(this._onTimerTick.bind(this), duration);
        super.use(...arguments);
    }

    getName () {
        return 'effect';
    }

    _onTimerTick () {
        const {effectName} = this.options;
        this.level.removeEffect(effectName);
    }
}
