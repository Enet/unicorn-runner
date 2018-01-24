import Entity from 'entitiesnew/Entity.js';
import PickableTrait from 'traitsnew/PickableTrait.js';
import GameplayEffectTrait from 'traitsnew/GameplayEffectTrait.js';
import AppearanceFallDownTrait from 'traitsnew/AppearanceFallDownTrait.js';

export default class EffectEntity extends Entity {
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
