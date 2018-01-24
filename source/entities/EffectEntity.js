import Entity from 'entities/Entity.js';
import PickableTrait from 'traits/PickableTrait.js';
import GameplayEffectTrait from 'traits/GameplayEffectTrait.js';
import AppearanceFallDownTrait from 'traits/AppearanceFallDownTrait.js';

export default class EffectEntity extends Entity {
    get angle () {
        return Math.sin(0.002 * this._lifeTime);
    }

    _getEffectName () {
        return '';
    }

    _createTraits () {
        return [
            new PickableTrait({
                onPick: this._onPick.bind(this)
            }),
            new GameplayEffectTrait({
                effectName: this._getEffectName()
            }),
            new AppearanceFallDownTrait({
                onEnd: this._onFallDownEnd.bind(this)
            })
        ];
    }

    _onPick () {
        this.effect.use();
        this.fallDown.start();
    }

    _onFallDownEnd () {
        this.level.removeEntity(this);
    }
}
