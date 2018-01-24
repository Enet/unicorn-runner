import TriangleBody from 'engine/TriangleBody.js';

import Entity from 'entities/Entity.js';
import BombDustTrait from 'traits/BombDustTrait.js';
import TriggerBoundTrait from 'traits/TriggerBoundTrait.js';
import TriggerContactTrait from 'traits/TriggerContactTrait.js';
import BodyGravityTrait from 'traits/BodyGravityTrait.js';
import FootholdTrait from 'traits/FootholdTrait.js';

const STONE_DAMAGE = 80;

export default class StoneEntity extends Entity {
    _getImageName () {
        return 'Stone';
    }

    _createTraits ({settings}) {
        const {trigger} = settings;
        return [
            new FootholdTrait(),
            new BodyGravityTrait(),
            new TriggerBoundTrait({
                maxActivationCount: Infinity,
                x: +trigger.x,
                y: +trigger.y,
                onActivate: this._onStart.bind(this, !!trigger.value)
            }),
            new BombDustTrait({
                onExplode: this._onExplode.bind(this)
            })
        ];
    }

    _createBody (options) {
        return super._createBody(options, TriangleBody);
    }

    _onStart (expectedValue, {value}) {
        if (expectedValue !== value) {
            return;
        }
        this.traits.remove(this.trigger);
        this.gravity.stop();

        const trigger = new TriggerContactTrait({
            onActivate: this._onContact.bind(this),
            lifelessObjects: true
        });
        this.traits.add(trigger);
    }

    _onContact (body) {
        this.traits.remove(this.trigger);
        this.bomb.explode(body);
    }

    _onExplode ({body}) {
        const {organism} = body.entity;
        if (!organism) {
            return;
        }
        organism.changeHealth(-STONE_DAMAGE);
    }
}
