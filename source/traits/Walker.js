import {
    Vector2
} from 'engine/math.js';
import Trait from 'traits/Trait.js';

export default class Walker extends Trait {
    getDirection () {
        const {player} = this.level;
        const {entity} = this;
        if (Math.abs(player.body.center.x - entity.body.center.x) < this._freezeDistance) {
            return 0;
        } else {
            return this._direction;
        }
    }

    getName () {
        return 'walker';
    }

    traitWillMount ([from, to], speed=0.05, freezeDistance=150) {
        this._freezeDistance = freezeDistance;
        this._from = +from || 0;
        this._to = +to || 0;
        this._direction = 1;
        this._speed = speed;
    }

    traitWillUpdate (deltaTime) {
        const direction = this.getDirection();
        if (Math.abs(this.entity.body.angle % (2 * Math.PI)) > Math.PI / 12) {
            return;
        }

        this.entity.body.move(new Vector2(this._speed * direction, 0));
        if (this.entity.body.center.x >= this._to) {
            this._direction = -1;
        } else if (this.entity.body.center.x <= this._from) {
            this._direction = 1;
        }
    }
}
