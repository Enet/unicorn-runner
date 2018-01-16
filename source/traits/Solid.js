import Trait from 'traits/Trait.js';
import {
    SIDE_TOP,
    SIDE_BOTTOM,
    SIDE_LEFT,
    SIDE_RIGHT
} from 'engine/constants.js';

export default class Solid extends Trait {
    getName () {
        return 'solid';
    }

    enable () {
        this._isSolid = true;
    }

    disable () {
        this._isSolid = false;
    }

    onInit () {
        this.enable();
    }

    onObstacle (entity, side, match) {
        return;
        if (!this._isSolid) {
            return;
        }

        if (side === SIDE_BOTTOM) {
            entity.bottom = match.top;
            entity.velocity.y = 0;
        } else if (side === SIDE_TOP) {
            entity.top = match.bottom;
            entity.velocity.y = 0;
        } else if (side === SIDE_LEFT) {
            entity.left = match.right;
            entity.velocity.x = 0;
        } else if (side === SIDE_RIGHT) {
            entity.right = match.left;
            entity.velocity.x = 0;
        }
    }
}
