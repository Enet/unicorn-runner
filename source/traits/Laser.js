import Trait from 'traits/Trait.js';

export default class Laser extends Trait {
    getName () {
        return 'behaviour';
    }

    traitWillMount (callbacks={}, axis='y') {
        this._callbacks = callbacks;
        this._axis = axis;
    }

    traitCollision (body) {
        if (!body.entity.killable) {
            return;
        }
        const axis = this._axis;
        if (Math.abs(body.center[axis] - this.entity.body.center[axis]) > 30) {
            return;
        }

        body.entity.killable.changeHealth(-0.25);
        const {onInjure} = this._callbacks;
        onInjure && onInjure();
    }
}
