import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import Killable from 'traits/Killable.js';
import DustBomb from 'traits/DustBomb.js';
import FruitFlyBehaviour from 'traits/FruitFlyBehaviour.js';

export default class FruitFly extends Entity {
    get offset () {
        const offset = super.offset;
        offset.x -= (65 - 40) / 2;
        offset.y -= (71 - 30) / 2;
        return offset;
    }

    _getSize () {
        return new Vector2(40, 30);
    }

    _createTraits ({settings}) {
        return [
            new DustBomb({
                onBoom: this._onBoom.bind(this)
            }),
            new FruitFlyBehaviour({
                onEnd: this._onEnd.bind(this)
            }, settings),
            new Killable({
                onKill: this._onKill.bind(this)
            })
        ];
    }

    _createBody () {
        const body = super._createBody(...arguments);
        body.setGravity(new Vector2(0, 0));
        return body;
    }

    _onEnd () {
        const {player} = this.level;
        if (player.fight && player.fight.isFighting()) {
            return;
        }
        this.bomb.boom(player.body);
        this.killable.changeHealth(-100);
    }

    _onBoom () {
        this.level.player.killable.changeHealth(-25);
    }

    _onKill () {
        this.level.changeScore(100);
    }
}

FruitFly.images = {
    default: 'FruitFly'
};
