import Trait from 'traits/Trait.js';

export default class BugBehaviour extends Trait {
    getName () {
        return 'behaviour';
    }

    traitWillMount () {
        this._isActive = true;
    }

    traitCollision (body) {
        const {entity} = this;
        if (entity.killable && entity.killable.isDead()) {
            return;
        }
        if (!body.entity.killable) {
            return;
        }
        if (!this._isActive) {
            return;
        }
        this._isActive = false;
        body.entity.killable.kill();
    }
}
