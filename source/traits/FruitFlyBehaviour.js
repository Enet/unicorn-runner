import Trait from 'traits/Trait.js';

export default class FruitFlyBehaviour extends Trait {
    getName () {
        return 'motion';
    }

    traitWillMount (callbacks={}, {trigger, speed=0.2}) {
        this._callbacks = callbacks;
        this._trigger = trigger;
        this._speed = speed;
        this._isTriggered = false;
    }

    traitWillUpdate (deltaTime) {
        const {player} = this.level;
        if (!this._isTriggered) {
            if (player.body.center.x > this._trigger) {
                this._isTriggered = true;
                const {onStart} = this._callbacks;
                onStart && onStart();
            }
            return;
        }

        const {entity} = this;
        const direction = player.body.center.subtract(entity.body.center);
        entity.body.move(direction.normalize().length(this._speed));
    }

    traitCollision (body) {
        if (body !== this.level.player.body) {
            return;
        }
        const {onEnd} = this._callbacks;
        onEnd && onEnd();
    }
}
