import {
    Vector2
} from 'engine/math.js';

import BodyTrait from 'traits/BodyTrait.js';

export default class BodyFrictionTrait extends BodyTrait {
    start () {
        this.entity.body.setFriction(this._friction);
    }

    stop () {
        delete this.entity.body.setFriction(null);
    }

    getName () {
        return 'friction';
    }

    traitWillMount ({x=0, y=0}) {
        x = +x || 0;
        y = +y || 0;
        this._friction = new Vector2(x, y);
    }
}
