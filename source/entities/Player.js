import {
    Vector2
} from 'engine/math.js';
import DynamicPoint from 'engine/DynamicPoint.js';

import Unicorn from 'entities/Unicorn.js';
import Picker from 'traits/Picker.js';
import Run from 'traits/Run.js';
import Jump from 'traits/Jump.js';
import Fly from 'traits/Fly.js';
import Fight from 'traits/Fight.js';

export default class Player extends Unicorn {
    get scale () {
        return new Vector2(this.run.getDirection(), 1);
    }

    _getFrame () {
        if (this.killable.isDead()) {
            return super._getFrame('death');
        } else if (this.jump.isJumping()) {
            return 'jump';
        } else if (this.fight.isFighting()) {
            return super._getFrame('fight');
        } else if (this.run.getDistance() > 0) {
            this._lifeTime = this.run.getDistance();
            return super._getFrame('default');
        } else {
            return 'idle';
        }
    }

    _createTraits () {
        return [
            ...super._createTraits(...arguments),
            new Run(),
            new Jump(),
            new Fly(),
            new Fight(),
            new Picker({
                onPick: this._onPick.bind(this)
            })
        ];
    }

    _createBody () {
        const body = super._createBody(...arguments);
        body.points.forEach((point) => {
            point.integrate = this._integratePoint.bind(point);
        });
        return body;
    }

    _integratePoint (deltaTime, world) {
        const limit = 7.5;
        const {x, y, cache} = this;
        const vx = Math.max(-2 * limit, Math.min(2 * limit, x - cache.x));
        const vy = Math.max(-limit, Math.min(limit, y - cache.y));
        this.x = cache.x + vx;
        this.y = cache.y + vy;
        return DynamicPoint.prototype.integrate.call(this, ...arguments);
    }

    _onPick (entity) {
        if (!entity.score) {
            return;
        }
        this.level.changeScore(entity.score.getNominal());
    }

    _onHealthChange (health) {
        return this.level.setHealth(health);
    }

    _onRemove () {
        return this.level.loseGame();
    }
}

Player.images = Unicorn.images;
