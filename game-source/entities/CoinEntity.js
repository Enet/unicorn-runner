import Entity from 'entities/Entity.js';
import GameplayScoreTrait from 'traits/GameplayScoreTrait.js';
import PickableTrait from 'traits/PickableTrait.js';
import AppearanceFallDownTrait from 'traits/AppearanceFallDownTrait.js';
import BodyGravityTrait from 'traits/BodyGravityTrait.js';

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

    _createTraits ({settings}) {
        return [
            new GameplayScoreTrait({
                deltaScore: this._getNominal()
            }),
            new AppearanceFallDownTrait({
                onEnd: this._onFallDownEnd.bind(this)
            })
        ].concat(settings.gravity ? [] : [
            new BodyGravityTrait()
        ]);
    }

    _onPickableTimerTick () {
        this.traits.add(new PickableTrait({
            onPick: this._onPick.bind(this)
        }));
    }

    _onPick () {
        this.score.use();
        this.fallDown.start();

        this.level.createSound('CoinPick', {
            position: this.body.center
        }).play();
    }

    _onFallDownEnd () {
        this.level.removeEntity(this);
    }
}
