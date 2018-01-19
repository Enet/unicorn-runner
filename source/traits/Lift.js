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

        const shift = this._to.subtract(this._from).normalize().length(2 * direction);
        this.entity.body.place(this.entity.body.center.add(shift));
        if (this.entity.body.center.subtract(this._to).length() < 20) {
            this._direction = -1;
        } else if (this.entity.body.center.subtract(this._from).length() < 20) {
            this._direction = 1;
        }
    }

    traitCollision (body) {
        if (body !== this.level.player.body) {
            return;
        }
        const {entity} = this;
        if (body.center.y + body.entity.size.height / 2 > entity.body.center.y - entity.size.height / 4) {
            return;
        }
        body.move(new Vector2(
            entity.body.points[0].cache.x - entity.body.points[0].x,
            entity.body.points[0].cache.y - entity.body.points[0].y
        ));
    }
}
