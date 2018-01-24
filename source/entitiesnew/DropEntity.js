import TriangleBody from 'engine/TriangleBody.js';
import {
    Vector2
} from 'engine/math.js';
import {
    REACTION_TRAP,
    REACTION_NO
} from 'engine/constants.js';

import Entity from 'entities/Entity.js';
import TriggerContactTrait from 'traitsnew/TriggerContactTrait.js';
import BombGasTrait from 'traitsnew/BombGasTrait.js';
import AppearanceGravityTrait from 'traitsnew/AppearanceGravityTrait.js';
import AppearanceFadeOutTrait from 'traitsnew/AppearanceFadeOutTrait.js';

const DROP_DAMAGE = 10;

export default class DropEntity extends Entity {
    get scale () {
        return new Vector2(1, this.opacity);
    }

    get offset () {
        const offset = super.offset;
        if (!this.trigger.getActivationCound()) {
            offset.y += (1 - this.opacity) * this.size.height;
        }
        return offset;
    }

    _getImageName () {
        return 'Drop';
    }

    _createBody (options) {
        const body = super._createBody(options, TriangleBody);
        body.reaction = REACTION_TRAP;
        return body;
    }

    _createTraits () {
        return [
            new TriggerContactTrait({
                onActivate: this._onContact.bind(this),
                lifelessObjects: true
            }),
            new AppearanceGravityTrait({
                autoStart: false
            }),
            new BombGasTrait({
                onExplode: this._onExplode.bind(this)
            }),
            new AppearanceFadeOutTrait({
                onEnd: this._onFadeOutEnd.bind(this)
            })
        ];
    }

    _onContact (body) {
        if (!body.entity.foothold && !body.entity.organism) {
            this.trigger.setActivationCount(1);
            return;
        }
        if (body === this.options.parent.body) {
            this.trigger.setActivationCount(1);
            return
        }

        this.bomb.explode(body);
        this.body.stop();
        this.body.move = () => {};
        this.body.reaction = REACTION_NO;
        this.gravity.start();
    }

    _onExplode ({body}) {
        const {organism} = body.entity;
        if (!organism) {
            return;
        }
        organism.changeHealth(-DROP_DAMAGE);
    }

    _onFadeOutEnd () {
        this.level.removeEntity(this);
    }
}
