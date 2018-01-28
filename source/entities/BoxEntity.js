import Entity from 'entities/Entity.js';
import FootholdTrait from 'traits/FootholdTrait.js';

export default class BoxEntity extends Entity {
    entityCollision () {
        super.entityCollision(...arguments);
        if (!this._scrapeSound) {
            return;
        }
        const boxVelocity = this.body.getVelocity();
        if (Math.abs(boxVelocity.x) > 1 &&
            Math.abs(boxVelocity.y) < 0.5) {
            this._scrapeSound.setVolume(Math.min(1, Math.abs(boxVelocity.x) * 0.1));
            this._scrapeSound.play();
        } else {
            this._scrapeSound.pause();
        }

        if (Math.abs(boxVelocity.y) > 2) {
            this._playCollisionSound();
        }
    }

    entityWillMount () {
        super.entityWillMount(...arguments);
        this._scrapeSound = this.level.createSound('BoxScrape', {
            loop: true,
            position: this.body.center,
            fadeOutOnPause: {}
        });
    }

    entityWillUnmount () {
        super.entityWillUnmount(...arguments);
        this.level.removeSound(this._scrapeSound);
    }

    _getImageName () {
        return 'Box';
    }

    _createTraits () {
        return [
            new FootholdTrait()
        ];
    }

    _playCollisionSound () {
        if (this._collisionSound) {
            return;
        }
        const collisionSound = this.level.createSound('BoxCollision', {
            position: this.body.center
        });
        collisionSound.once('end', this._onCollisionSoundEnd.bind(this));
        this._collisionSound = collisionSound.play();
    }

    _onCollisionSoundEnd () {
        this._collisionSound = null;
    }
}
