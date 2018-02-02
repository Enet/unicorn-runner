import Entity from 'entities/Entity.js';
import GameplayMedicineTrait from 'traits/GameplayMedicineTrait.js';
import PickableTrait from 'traits/PickableTrait.js';
import AppearanceFallDownTrait from 'traits/AppearanceFallDownTrait.js';

const MEDICINE_DELTA_HEALTH = 40;

export default class MedicineEntity extends Entity {
    get angle () {
        return Math.sin(0.005 * this._lifeTime);
    }

    entityWillMount () {
        super.entityWillMount(...arguments);
        this._view = Math.floor(Math.random() * this.sprite.frames.size) + 1;
    }

    _getImageName () {
        return 'Medicine';
    }

    _getFrame () {
        return 'medicine-' + this._view;
    }

    _createTraits () {
        return [
            new GameplayMedicineTrait({
                deltaHealth: MEDICINE_DELTA_HEALTH
            }),
            new PickableTrait({
                onPick: this._onPick.bind(this)
            }),
            new AppearanceFallDownTrait({
                onEnd: this._onFallDownEnd.bind(this)
            })
        ];
    }

    _onPick ({organism}) {
        this.medicine.use(organism);
        this.fallDown.start();
        this.level.createSound('Medicine', {
            position: this.body.center
        }).play();
    }

    _onFallDownEnd () {
        this.level.removeEntity(this);
    }
}
