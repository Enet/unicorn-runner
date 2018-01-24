import {
    Vector2
} from 'engine/math.js';

import UnicornEntity from 'entitiesnew/UnicornEntity.js';
import ControllerTrait from 'traitsnew/ControllerTrait.js';
import PickerTrait from 'traitsnew/PickerTrait.js';
import ActionRunTrait from 'traitsnew/ActionRunTrait.js';
import ActionJumpTrait from 'traitsnew/ActionJumpTrait.js';
import ActionFlyTrait from 'traitsnew/ActionFlyTrait.js';
import ActionFightTrait from 'traitsnew/ActionFightTrait.js';
import AppearanceImpulseLimitTrait from 'traitsnew/AppearanceImpulseLimitTrait.js';

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
        } else if (this.fight.isFighting()) {
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
        const sprite = this._createSprite(...arguments);
        sprite.animations.get('die').once(this._onDieAnimationEnd.bind(this));
        return sprite;
    }

    _createTraits () {
        return [
            ...super._createTraits(...arguments),
            new ControllerTrait(),
            new AppearanceImpulseLimitTrait(),
            new ActionRunTrait(),
            new ActionJumpTrait(),
            new ActionFlyTrait(),
            new ActionFightTrait(),
            new PickerTrait()
        ];
    }

    _onHealthChange ({health}) {
        this.level.setHealth(health);
    }

    _onDieAnimationEnd () {
        this.level.loseGame();
    }
}
