import {
    Vector2
} from 'engine/math.js';

import Entity from 'entities/Entity.js';
import DropEntity from 'entities/DropEntity.js';
import BodyAngleLimitTrait from 'traits/BodyAngleLimitTrait.js';
import BodyGravityTrait from 'traits/BodyGravityTrait.js';
import AppearanceVisualDirectionTrait from 'traits/AppearanceVisualDirectionTrait.js';
import OrganismTrait from 'traits/OrganismTrait.js';
import MotionWalkerTrait from 'traits/MotionWalkerTrait.js';
import TriggerContactTrait from 'traits/TriggerContactTrait.js';
import GameplayScoreTrait from 'traits/GameplayScoreTrait.js';
import {
    SCORE_BIRD_DEATH
} from 'constants.js';

const BIRD_DROP_PERIOD = 1000;
const BIRD_DROP_PROBABILITY = 0.002;

export default class BirdEntity extends Entity {
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
        const parent = this;
        const {x, y} = this.body.center;
        const drop = new DropEntity({x, y, level, parent});
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
        sprite.animations.get('die').once('end', this._onDieAnimationEnd.bind(this));
        return sprite;
    }

    _createTraits ({settings, y}) {
        const {range} = settings;
        return [
            new BodyGravityTrait(),
            new BodyAngleLimitTrait({
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
            }),
            new GameplayScoreTrait({
                deltaScore: SCORE_BIRD_DEATH
            }),
            new AppearanceVisualDirectionTrait({
                reverse: true
            })
        ];
    }

    _onContact () {
        this.organism.changeHealth(-100);
    }

    _onDie () {
        this._lifeTime = 0;
        this.score.use();
        this.level.playSound({
            name: 'bird'
        });
    }

    _onDieAnimationEnd () {
        this.level.removeEntity(this);
    }
}
