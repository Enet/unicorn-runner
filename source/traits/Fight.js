import Trait from 'traits/Trait.js';

export default class Fight extends Trait {
    start () {
        this._isFighting = true;
    }

    cancel () {
        this._isFighting = false;
    }

    isFighting () {
        const {entity} = this;
        if (entity.fly && entity.fly.isFlying()) {
            return;
        }
        if (entity.jump && entity.jump.isJumping()) {
            return;
        }
        return this._isFighting;
    }

    getName () {
        return 'fight';
    }

    traitWillMount () {
        this._isFighting = false;
    }

    traitCollision (body) {
        if (!this.isFighting()) {
            return;
        }
        if (!body.entity.killable || body.entity.killable.isDead()) {
            return;
        }
        if (body.center.y >= this.entity.body.center.y - this.entity.offset.y) {
            return;
        }
        body.entity.killable.changeHealth(-1);
    }
}
