import {
    Vector2
} from 'engine/math.js';
import Trait from 'traits/Trait.js';

export default class Lift extends Trait {
    getDirection () {
        return this._direction;
    }

    getName () {
        return 'lift';
    }

    traitWillMount ({from, to}) {
        this._from = from;
        this._to = to;
        this._direction = 1;
    }

    traitWillUpdate (deltaTime) {
        const direction = this.getDirection();

        const shift = this._to.subtract(this._from).normalize().length(5 * direction);
        this.entity.body.place(this.entity.body.center.add(shift));
        if (this.entity.body.center.subtract(this._to).length() < 10) {
            this._direction = -1;
        } else if (this.entity.body.center.subtract(this._from).length() < 10) {
            this._direction = 1;
        }
    }
}
