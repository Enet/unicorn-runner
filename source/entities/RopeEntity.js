import Body from 'engine/Body.js';
import {
    Vector2
} from 'engine/math.js';
import {
    REACTION_NO
} from 'engine/constants.js';

import Entity from 'entities/Entity.js';
import {
    COLOR_BLACK
} from 'constants.js';

export default class RopeEntity extends Entity {
    get index () {
        return -1;
    }

    get angle () {
        return 0;
    }

    render (context, camera) {
        const {points} = this.body;
        context.save();
        context.strokeStyle = COLOR_BLACK.toString();
        context.lineWidth = 3;
        context.beginPath();
        points.forEach((point) => {
            context.lineTo(point.x - this.position.x, point.y - this.position.y);
        });
        context.stroke();
        context.restore();
    }

    _getSize () {
        return new Vector2(0, 0);
    }

    _createBody ({points}) {
        const reaction = REACTION_NO;
        const stiffness = 0.1;
        const body = new Body({points, reaction, stiffness});
        body.entity = this;
        return body;
    }
}
