import Entity from 'entities/Entity.js';
import TriangleBody from 'engine/TriangleBody.js';
import {
    Vector2
} from 'engine/math.js';

import Bomb from 'traits/Bomb.js';
import Meteor from 'traits/Meteor.js';
import Obstacle from 'traits/Obstacle.js';
import spriteDescription from 'sprites/Stone.js';

export default class Stone extends Entity {
    _getSpriteDescription () {
        return spriteDescription;
    }

    _getFrame () {
        return 'stone';
    }

    _getSize () {
        return new Vector2(89, 82);
    }

    _createTraits ({settings}) {
        return [
            new Bomb({
                onBoom: this._onBoom.bind(this)
            }),
            new Meteor({
                onHit: this._onHit.bind(this)
            }, settings),
            new Obstacle()
        ];
    }

    _createBody (options) {
        const body = super._createBody(options, TriangleBody);
        return body;
    }

    _onHit (body) {
        this.bomb.boom(body);
    }

    _onBoom (body) {
        if (!body.entity.killable) {
            return;
        }
        body.entity.killable.changeHealth(-80);
    }
}

Stone.images = {
    default: 'Stone'
};
