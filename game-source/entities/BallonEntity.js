import StaticEntity from 'entities/StaticEntity.js';
import TriggerContactTrait from 'traits/TriggerContactTrait.js';
import BodyGravityTrait from 'traits/BodyGravityTrait.js';

export default class BallonEntity extends StaticEntity {
    get angle () {
        return super.angle + 0.1 * Math.sin(this._lifeTime * 0.002);
    }

    _getFrame () {
        if (this._isBlownUp) {
            return super._getFrame('default');
        } else {
            return 'ballon-1';
        }
    }

    _getImageName () {
        return 'Ballon';
    }

    _getSize () {
        return super._getSize(...arguments).length(0.5);
    }

    _createSprite () {
        const sprite = super._createSprite(...arguments);
        sprite.animations.get('default').once('end', this._onAnimationEnd.bind(this));
        return sprite;
    }

    _createTraits () {
        return [
            new TriggerContactTrait({
                onActivate: this._onContact.bind(this)
            }),
            new BodyGravityTrait()
        ];
    }

    _onContact (body) {
        const {level} = this;
        if (body !== level.player.body) {
            return;
        }
        this._isBlownUp = true;
        level.createSound('Ballon', {
            position: this.body.center
        }).play();
        level.winGame();
    }

    _onAnimationEnd () {
        this.level.removeEntity(this);
    }
}
