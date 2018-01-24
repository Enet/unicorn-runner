import {
    Vector2
} from 'engine/math.js';

import UnicornEntity from 'entities/UnicornEntity.js';
import ControllerTrait from 'traits/ControllerTrait.js';
import PickerTrait from 'traits/PickerTrait.js';
import ActionRunTrait from 'traits/ActionRunTrait.js';
import ActionJumpTrait from 'traits/ActionJumpTrait.js';
import ActionFlyTrait from 'traits/ActionFlyTrait.js';
import ActionFightTrait from 'traits/ActionFightTrait.js';
import AppearanceImpulseLimitTrait from 'traits/AppearanceImpulseLimitTrait.js';

export default class PlayerEntity extends UnicornEntity {
    get scale () {
        const direction = this.run.getDirection();
        return new Vector2(direction, 1);
    }

    _getFrame () {
        let animationName;
        if (this.organism.isDead()) {
            animationName = 'die';
        } else if (this.jump.isJumping()) {
            animationName = 'jump';
        } else if (!this.fight.isStopped()) {
            animationName = 'fight';
        } else if (!this.run.isStopped()) {
            this._lifeTime = this.body.center.x;
            animationName = 'run';
        } else {
            animationName = 'default';
        }
        return super._getFrame(animationName);
    }

    _createSprite () {
        const sprite = super._createSprite(...arguments);
        sprite.animations.get('die').once('end', this._onDieAnimationEnd.bind(this));
        return sprite;
    }

    _createTraits () {
        return [
            ...super._createTraits(...arguments),
            new AppearanceImpulseLimitTrait(),
            new ActionRunTrait(),
            new ActionJumpTrait(),
            new ActionFlyTrait(),
            new ActionFightTrait(),
            new PickerTrait(),
            new ControllerTrait()
        ];
    }

    _onHealthChange ({health}) {
        this.level.setHealth(health);
    }

    _onDieAnimationEnd () {
        this.level.loseGame();
    }
}
