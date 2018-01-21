import Body from 'engine/Body.js';
import {
    Vector2
} from 'engine/math.js';
import {
    REACTION_NO
} from 'engine/constants.js';
import Entity from 'entities/Entity.js';

import {
    BLACK_COLOR
} from 'constants.js';

export default class Rope extends Entity {
    get index () {
        return -1;
    }

    get angle () {
        return 0;
    }

    render (context, camera) {
        const {points} = this.body;
        context.save();
        context.strokeStyle = BLACK_COLOR.toString();
        context.lineWidth = 3;
        context.beginPath();
        points.forEach((point) => {
            context.lineTo(point.x - this.position.x, point.y - this.position.y);
        });
        context.stroke();
        context.restore();
    }

    _getSpriteDescription () {

    }

    _getSize () {
        return new Vector2(0, 0);
    }

    _createBody ({points, stiffness=0.1}) {
        const reaction = REACTION_NO;
        const body = new Body({points, reaction, stiffness});
        body.entity = this;
        return body;
    }

    _createSprite () {

    }
}

Rope.images = {};
