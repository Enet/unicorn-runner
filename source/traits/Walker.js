import {
    Vector2
} from 'engine/math.js';
import Trait from 'traits/Trait.js';

export default class Walker extends Trait {
    getDirection () {
        const {player} = this.level;
        const {entity} = this;
        if (Math.abs(player.body.center.x - entity.body.center.x) < 100) {
            return 0;
        } else {
            return this._direction;
        }
    }

    getName () {
        return 'walker';
    }

    traitWillMount ([from, to]) {
        this._from = +from || 0;
        this._to = +to || 0;
        this._direction = 1;
    }

    traitWillUpdate (deltaTime) {
        const direction = this.getDirection();
        if (Math.abs(this.entity.body.angle % (2 * Math.PI)) > Math.PI / 12) {
            return;
        }

        this.entity.body.move(new Vector2(0.05 * direction, 0));
        if (this.entity.body.center.x >= this._to) {
            this._direction = -1;
        } else if (this.entity.body.center.x <= this._from) {
            this._direction = 1;
        }
    }
}
