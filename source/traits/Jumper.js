import {
    Vector2
} from 'engine/math.js';
import Trait from 'traits/Trait.js';

export default class Jumper extends Trait {
    getDirection () {
        return this._direction;
    }

    getName () {
        return 'walker';
    }

    traitWillMount ([from, to], freezeDistance=100) {
        this._freezeDistance = freezeDistance;
        this._from = +from || 0;
        this._to = +to || 0;
        this._direction = 1;
        this._prevFightTime = 0;
        this._prevJumpTime = 0;
    }

    traitWillUpdate (deltaTime) {
        const direction = this.getDirection();
        if (Math.abs(this.entity.body.angle % (2 * Math.PI)) > Math.PI / 12) {
            return;
        }

        if (Math.random() > 0.01) {
            return;
        }

        const {player} = this.level;
        const {entity} = this;
        if (Math.abs(player.body.center.x - entity.body.center.x) < this._freezeDistance &&
            player.body.center.y - player.size.height / 2 < entity.body.center.y &&
            player.body.center.y + player.size.height / 2 > entity.body.center.y) {
            if (Date.now() - this._prevFightTime < 1000) {
                return;
            }

            if (!this._directionBeforeFight) {
                this._directionBeforeFight = this._direction;
            }
            this._direction = 2 * (player.body.center.x > entity.body.center.x) - 1;
            entity.attack();
            this._prevFightTime = Date.now();

            if (Math.abs(player.body.center.x - entity.body.center.x) < 20 + player.size.width / 2 + entity.size.width / 2) {
                player.killable.changeHealth(-10);
                player.body.move(new Vector2(Math.sign(player.body.center.x - entity.body.center.x) * 2, 0));
            }
        } else {
            if (Date.now() - this._prevJumpTime < 2000) {
                return;
            }
            if (this._directionBeforeFight) {
                this._direction = this._directionBeforeFight;
                this._directionBeforeFight = null;
            }

            entity.jump(direction);
            this._prevJumpTime = Date.now();
            if (entity.body.center.x >= this._to && this._direction >= 0) {
                this._direction = -1;
            } else if (entity.body.center.x <= this._from && this._direction <= 0) {
                this._direction = 1;
            }
        }
    }
}
