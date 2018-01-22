import GameplayTrait from 'traitsnew/GameplayTrait.js';

const DEFAULT_DURATION = 5000;

export default class GameplayEffectTrait extends GameplayTrait {
    use () {
        if (this._isUsed) {
            return;
        }
        const {options, level} = this;
        const {effectName} = options;
        const duration = +options.duration || DEFAULT_DURATION;
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
