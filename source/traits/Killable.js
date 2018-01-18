import Trait from 'traits/Trait.js';

import {
    MAX_HIDING_TIME
} from 'constants.js';

export default class Killable extends Trait {
    getName () {
        return 'killable';
    }

    traitWillMount (callbacks={}, health=100) {
        this._callbacks = callbacks;
        this._health = health;
        this._afterDeathTime = 0;
    }

    traitWillUpdate (deltaTime) {
        if (!this.isDead()) {
            return;
        }
        this._afterDeathTime += deltaTime;
        if (this._afterDeathTime > MAX_HIDING_TIME) {
            const {entity} = this;
            const {onRemove} = this._callbacks;
            this.level.removeEntity(entity);
            onRemove && onRemove();
        }
    }

    getHealth () {
        return this._health;
    }

    getHidingProgress () {
        return Math.min(1, this._afterDeathTime / MAX_HIDING_TIME);
    }

    isDead () {
        return this._health === 0;
    }

    changeHealth (delta) {
        if (this.isDead()) {
            return;
        }

        this._health = Math.max(0, Math.min(100, this._health + delta));

        const {onChange, onKill} = this._callbacks;
        onChange && onChange(this._health);
        if (this.isDead()) {
            this._onKill();
            onKill && onKill();
        }
    }

    reviveFully () {
        this._health = 100;
        this._afterDeathTime = 0;
    }

    _onKill () {
        Object.defineProperty(this.entity, 'opacity', {
            get: () => 1 - this.getHidingProgress()
        });
    }
}

