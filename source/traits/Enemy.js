import {
    Vector2
} from 'engine/math.js';
import Trait from 'traits/Trait.js';

export default class Enemy extends Trait {
    getName () {
        return 'behaviour';
    }

    traitWillMount (callbacks={}, {count=Infinity, power=100}) {
        this._attack = {count, power, prevTime: 0};
        this._callbacks = callbacks;
    }

    traitCollision (body) {
        const {entity} = this;
        const attack = this._attack;
        if (entity.killable && entity.killable.isDead()) {
            return;
        }
        if (!body.entity.killable) {
            return;
        }
        if (!attack.count) {
            return;
        }

        const currentTime = Date.now();
        if (currentTime - attack.prevTime < 1000) {
            return;
        }

        let isPrevented = false;
        const {onAttack} = this._callbacks;
        onAttack && onAttack(() => {
            isPrevented = true;
        });
        if (isPrevented) {
            return;
        }

        attack.prevTime = currentTime;
        attack.count--;
        body.entity.killable.changeHealth(-attack.power);

        const x = -5;
        const y = -5;
        body.move(new Vector2(x, y));
    }
}
