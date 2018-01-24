import Entity from 'entities/Entity.js';
import GameplayMedicineTrait from 'traits/GameplayMedicineTrait.js';
import PickableTrait from 'traits/PickableTrait.js';
import AppearanceFallDownTrait from 'traits/AppearanceFallDownTrait.js';

export default class MedicineEntity extends Entity {
    _getImageName () {
        return 'Medicine';
    }

    _createTraits () {
        return [
            new GameplayMedicineTrait(),
            new PickableTrait({
                onPick: this._onPick.bind(this)
            }),
            new AppearanceFallDownTrait({
                onEnd: this._onFallDownEnd.bind(this)
            })
        ];
    }

    _onPick () {
        this.medicine.use();
        this.fallDown.start();
    }

    _onFallDownEnd () {
        this.level.removeEntity(this);
    }
}
