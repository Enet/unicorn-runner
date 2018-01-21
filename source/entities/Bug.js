import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import Killable from 'traits/Killable.js';
import Enemy from 'traits/Enemy.js';
import spriteDescription from 'sprites/BugSprite.js';

export default class Bug extends Entity {
    get offset () {
        const offset = super.offset;
        offset.x -= (58 - 29) / 2;
        offset.y -= 20;
        return offset;
    }

    _getSpriteDescription () {
        return spriteDescription;
    }

    _getSize () {
        return new Vector2(29, 45);
    }

    _createTraits () {
        return [
            new Enemy({
                onAttack: this._onAttack.bind(this)
            }, {
                count: 1,
                power: 40
            }),
            new Killable({
                onKill: this._onKill.bind(this)
            })
        ];
    }

    _onAttack (preventAttack) {
        if (Math.abs(this.body.angle % (2 * Math.PI)) > Math.PI / 12) {
            preventAttack();
        }
    }

    _onKill () {
        this.level.changeScore(100);
    }
}

Bug.images = {
    default: 'Bug'
};
