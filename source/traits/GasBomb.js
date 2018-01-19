import Trait from 'traits/Trait.js';

import GasCloud from 'entities/GasCloud.js';

export default class GasBomb extends Trait {
    getExplosionProgress () {
        return this._explosionProgress;
    }

    getName () {
        return 'bomb';
    }

    traitWillMount (callbacks, isSensitive=false) {
        this._callbacks = callbacks;
        this._isActivated = false;
        this._isSensitive = !!isSensitive;
        this._explosionProgress = 0;
    }

    traitCollision (body) {
        const {entity} = this;
        if (this._isActivated) {
            return;
        }
        if (!this._isSensitive) {
            return;
        }
        if (entity.killable && entity.killable.isDead()) {
            return;
        }
        if (!body.entity.killable) {
            return;
        }
        this.boom(body);
    }

    traitWillUpdate () {
        if (!this._isActivated) {
            return;
        }
        if (this._explosionProgress > 1) {
            return;
        }
        this._explosionProgress += 0.01;
    }

    boom (body) {
        let isBoomPrevented = false;
        const {onBoom} = this._callbacks;
        onBoom && onBoom(body, () => {
            isBoomPrevented = true;
        });
        if (isBoomPrevented) {
            return;
        }

        this._isActivated = true;
        this.entity.body.setGravity(null);

        const {level} = this;
        const {manager} = level;
        const images = {default: manager.getImage('GasCloud')};
        const {x, y} = this.entity.body.center;
        const cloud = new GasCloud({level, images, x, y});
        level.addEntity(cloud);

    }
}
