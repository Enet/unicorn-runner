import {
    Vector2
} from 'engine/math.js';

import Entity from 'entitiesnew/Entity.js';
import Drop from 'entitiesnew/Drop.js';
import AppearanceAngleTrait from 'traitsnew/AppearanceAngleTrait.js';
import AppearanceGravityTrait from 'traitsnew/AppearanceGravityTrait.js';
import OrganismTrait from 'traitsnew/OrganismTrait.js';
import MotionWalkerTrait from 'traitsnew/MotionWalkerTrait.js';
import TriggerContactTrait from 'traitsnew/TriggerContactTrait.js';
import {
    SCORE_BIRD_DEATH
} from 'constants.js';

const BIRD_DROP_PERIOD = 1000;
const BIRD_DROP_PROBABILITY = 0.002;

export default class BirdEntity extends Entity {
    get scale () {
        const direction = this.motion.getVisualDirection();
        return new Vector2(-direction, 1);
    }

    entityWillUpdate () {
        super.entityWillUpdate(...arguments);

        if (this._lifeTime - this._prevDropTime < BIRD_DROP_PERIOD) {
            return;
        }
        if (Math.random() < 1 - BIRD_DROP_PROBABILITY) {
            return;
        }

        this._prevDropTime = this._lifeTime;
        const {level} = this;
        const parent = this.entity;
        const {x, y} = parent.body.center;
        const drop = new Drop({x, y, level, parent});
        this.level.addEntity(drop);
    }

    _getImageName () {
        return 'Bird';
    }

    _getSize () {
        return new Vector2(70, 20);
    }

    _getFrame () {
        const animationName = this.organism.isDead() ? 'die' : 'default';
        return super._getFrame(animationName);
    }

    _createSprite () {
        const sprite = super._createSprite(...arguments);
        sprite.animations.get('die').once(this._onDieAnimationEnd.bind(this));
        return sprite;
    }

    _createTraits ({settings, y}) {
        const {range} = settings;
        return [
            new AppearanceGravityTrait(),
            new AppearanceAngleTrait({
                maxAngle: Math.PI / 3
            }),
            new MotionWalkerTrait({
                fromPoint: new Vector2(range[0], y),
                toPoint: new Vector2(range[1], y),
                speed: 0.1
            }),
            new TriggerContactTrait({
                onActivate: this._onContact.bind(this)
            }),
            new OrganismTrait({
                onDie: this._onDie.bind(this)
            })
        ];
    }

    _onContact () {
        this.organism.changeHealth(-100);
    }

    _onDie () {
        this.level.changeScore(SCORE_BIRD_DEATH);
    }

    _onDieAnimationEnd () {
        this.level.removeEntity(this);
    }
}
