import StaticEntity from 'entities/StaticEntity.js';
import {
    Vector2
} from 'engine/math.js';
import {
    REACTION_TRAP
} from 'engine/constants.js';

import spriteDescription from 'sprites/GasCloud.js';
import {
    GAS_CLOUD_TIME
} from 'constants.js';

const ONE_OF_FIVE = GAS_CLOUD_TIME * 0.2;
const FOUR_OF_FIVE = GAS_CLOUD_TIME - ONE_OF_FIVE;

export default class GasCloud extends StaticEntity {
    get index () {
        return 600;
    }

    get opacity () {
        if (this._lifeTime < ONE_OF_FIVE) {
            return this._lifeTime / ONE_OF_FIVE;
        } else if (this._lifeTime > FOUR_OF_FIVE) {
            return 1 - (this._lifeTime - FOUR_OF_FIVE) / ONE_OF_FIVE;
        } else {
            return 1;
        }
    }

    get angle () {
        return this._lifeTime / 2000;
    }

    render (context) {
        const {sprite, offset} = this;
        const alpha = context.globalAlpha * 0.9;
        context.globalAlpha = alpha * Math.abs(Math.sin(this._lifeTime / ONE_OF_FIVE));
        sprite.render('gas-1', context, offset.x, offset.y);
        context.globalAlpha = alpha * Math.abs(Math.cos(this._lifeTime / ONE_OF_FIVE));
        sprite.render('gas-2', context, offset.x, offset.y);
    }

    entityWillUpdate (deltaTime) {
        super.entityWillUpdate(...arguments);
        if (this._lifeTime > GAS_CLOUD_TIME) {
            this.level.removeEntity(this);
        }
    }

    entityCollision (body) {
        const entity = body.entity;
        if (!entity.killable || entity.killable.isDead()) {
            return;
        }
        const distance = this.body.center.subtract(entity.body.center).length();
        const power = 2 / Math.max(2, distance);
        entity.killable.changeHealth(-power);
    }

    _getSpriteDescription () {
        return spriteDescription;
    }

    _getSize () {
        return new Vector2(360, 360);
    }

    _createBody () {
        const body = super._createBody(...arguments);
        body.reaction = REACTION_TRAP;
        return body;
    }
}

GasCloud.images = {
    default: 'GasCloud'
};
