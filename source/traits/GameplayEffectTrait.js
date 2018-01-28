import GameplayTrait from 'traits/GameplayTrait.js';

import {
    EFFECT_TIME
} from 'constants.js';

const EFFECT_END_SOUND_DURATION = 3000;

export default class GameplayEffectTrait extends GameplayTrait {
    use () {
        if (this._isUsed) {
            return;
        }
        const {options, level} = this;
        const {effectName} = options;
        const duration = +options.duration || EFFECT_TIME;
        level.addEffect(effectName);
        level.setTimeout(this._onEffectEnd.bind(this), duration);
        super.use(...arguments);

        level.createSound('EffectStart-' + effectName).play();
        level.setTimeout(this._willEffectEnd.bind(this), duration - EFFECT_END_SOUND_DURATION);
    }

    getName () {
        return 'effect';
    }

    _willEffectEnd () {
        const {options, level} = this;
        const {effectName} = options;
        level.createSound('EffectEnd-' + effectName).play();
    }

    _onEffectEnd () {
        const {effectName} = this.options;
        this.level.removeEffect(effectName);
    }
}
