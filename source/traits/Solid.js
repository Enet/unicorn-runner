import Trait from 'Trait.js';
import {
    SIDE_TOP,
    SIDE_BOTTOM,
    SIDE_LEFT,
    SIDE_RIGHT
} from 'constants.js';

export default class Solid extends Trait {
    getName () {
        return 'solid';
    }

    onInit () {
        this.obstructs = true;
    }

    onObstacle (entity, side, match) {
        if (!this.obstructs) {
            return;
        }

        if (side === SIDE_BOTTOM) {
            entity.bounds.bottom = match.y1;
            entity.velocity.y = 0;
        } else if (side === SIDE_TOP) {
            entity.bounds.top = match.y2;
            entity.velocity.y = 0;
        } else if (side === SIDE_LEFT) {
            entity.bounds.left = match.x2;
            entity.velocity.x = 0;
        } else if (side === SIDE_RIGHT) {
            entity.bounds.right = match.x1;
            entity.velocity.x = 0;
        }
    }
}
