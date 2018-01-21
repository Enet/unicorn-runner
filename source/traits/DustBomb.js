import {
    Vector2
} from 'engine/math.js';
import Trait from 'traits/Trait.js';

import DustCloud from 'entities/DustCloud.js';

export default class DustBomb extends Trait {
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
        this._explosionProgress += 0.1;
    }

    boom (body) {
        if (this._isActivated) {
            return;
        }
        this._isActivated = true;

        const vx = 10 - 10 * Math.random();
        const vy = -10 - 5 * Math.random();
        body.move(new Vector2(vx, vy));
        this.entity.body.move(new Vector2(-vx, -vy));
        this.entity.body.setGravity(null);

        const {level} = this;
        const {manager} = level;
        const images = {default: manager.getImage('DustCloud')};
        const {x, y} = this.entity.body.center;
        const cloud = new DustCloud({level, images, x, y});
        level.addEntity(cloud);

        const {onBoom} = this._callbacks;
        onBoom && onBoom(body);
    }
}
