import MushroomEntity from 'entitiesnew/MushroomEntity.js';
import BombGasTrait from 'traitsnew/BombGasTrait.js';
import AppearanceFadeOutTrait from 'traitsnew/AppearanceFadeOutTrait.js';
import OrganismTrait from 'traitsnew/OrganismTrait.js';
import {
    SCORE_GAS_MUSHROOM_DEATH
} from 'constants.js';

export default class GasMushroomEntity extends MushroomEntity {
    _getImageName () {
        return 'GasMushroom';
    }

    _getBombTrait () {
        return BombGasTrait;
    }

    _createTraits () {
        return [
            ...super._createTraits(...arguments),
            new OrganismTrait({
                onDie: this._onDie.bind(this)
            }),
            new AppearanceFadeOutTrait({
                onEnd: this._onFadeOutEnd.bind(this)
            })
        ];
    }

    _willExplode ({body, preventExplosion}) {
        if (body.entity instanceof GasMushroomEntity) {
            return preventExplosion();
        }
        if (body.entity.fight && body.entity.fight.isFighting()) {
            return preventExplosion();
        }
        super._willExplode(...arguments);
    }

    _onDie () {
        this.level.changeScore(SCORE_GAS_MUSHROOM_DEATH);
        this.fadeOut.start();
    }

    _onFadeOutEnd () {
        this.level.removeEntity(this);
    }
}
