import StaticEntity from 'entities/StaticEntity.js';
import {
    INDEX_RENDERABLE
} from 'constants.js';

export default class BushEntity extends StaticEntity {
    get index () {
        return INDEX_RENDERABLE + 10;
    }

    entityWillMount () {
        super.entityWillMount(...arguments);
        this._bushSound = this.level.createSound('Bush', {
            loop: true
        });
    }

    entityCollision (body) {
        super.entityCollision(...arguments);
        if (body !== this.level.player.body) {
            return;
        }
        if (Math.abs(body.getVelocity().x) < 1) {
            return;
        }
        this._collision = true;
    }

    entityWillUpdate () {
        super.entityWillUpdate(...arguments);
        if (this._collision) {
            this._bushSound.play();
            this._collision = false;
        } else {
            this._bushSound.pause();
        }
    }

    entityWillUnmount () {
        super.entityWillUnmount(...arguments);
        this.level.removeSound(this._bushSound);
    }

    _getImageName () {
        return 'Bush';
    }
}
