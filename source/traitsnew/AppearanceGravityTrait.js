import {
    Vector2
} from 'engine/math.js';

import AppearanceTrait from 'traitsnew/AppearanceTrait.js';

export default class AppearanceGravityTrait extends AppearanceTrait {
    start () {
        this.entity.body.setGravity(this._gravity);
    }

    stop () {
        delete this.entity.body.setGravity(null);
    }

    getName () {
        return 'gravity';
    }

    traitWillMount ({x=0, y=0}) {
        x = +x || 0;
        y = +y || 0;
        this._gravity = new Vector2(x, y);
    }

    traitDidMount () {
        let {autoStart} = this.options;
        if (autoStart === undefined) {
            autoStart = true;
        }
        autoStart && this.start();
    }
}
