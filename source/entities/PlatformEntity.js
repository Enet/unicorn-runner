import BoxBody from 'engine/BoxBody.js';
import StaticBoxBody from 'engine/StaticBoxBody.js';
import {
    Vector2
} from 'engine/math.js';

import BoxEntity from 'entities/BoxEntity.js';
import MotionLiftTrait from 'traits/MotionLiftTrait.js';

export default class PlatformEntity extends BoxEntity {
    _createBody (options) {
        const body = super._createBody(options, StaticBoxBody);
        body.update = BoxBody.prototype.update;
        return body;
    }

    _createTraits ({settings}) {
        return [
            ...super._createTraits(...arguments),
            new MotionLiftTrait({
                fromPoint: new Vector2(...settings.from),
                toPoint: new Vector2(...settings.to),
                speed: settings.speed
            })
        ];
    }
}
