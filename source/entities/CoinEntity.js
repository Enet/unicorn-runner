import Entity from 'entities/Entity.js';
import GameplayScoreTrait from 'traits/GameplayScoreTrait.js';
import PickableTrait from 'traits/PickableTrait.js';
import AppearanceFallDownTrait from 'traits/AppearanceFallDownTrait.js';

const COIN_UNPICKABLE_TIME = 500;

export default class CoinEntity extends Entity {
    get angle () {
        return this._lifeTime * this._getNominal() / 10000;
    }

    entityDidMount () {
        super.entityDidMount();
        this.level.setTimeout(
            this._onPickableTimerTick.bind(this),
            COIN_UNPICKABLE_TIME
        );
    }

    _getImageName () {
        return 'Coin' + this._getNominal();
    }

    _getNominal () {
        return 0;
    }

    _createTraits () {
        return [
            new GameplayScoreTrait({
                deltaScore: this._getNominal()
            }),
            new AppearanceFallDownTrait({
                onEnd: this._onFallDownEnd.bind(this)
            })
        ];
    }

    _onPickableTimerTick () {
        this.traits.add(new PickableTrait({
            onPick: this._onPick.bind(this)
        }));
    }

    _onPick () {
        this.fallDown.start();
    }

    _onFallDownEnd () {
        this.level.removeEntity(this);
    }
}
