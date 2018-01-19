import BoxBody from 'engine/BoxBody.js';
import StaticBoxBody from 'engine/StaticBoxBody.js';
import {
    Vector2
} from 'engine/math.js';
import Box from 'entities/Box.js';

import Obstacle from 'traits/Obstacle.js';
import Lift from 'traits/Lift.js';

export default class Platform extends Box {
    _createBody (options) {
        const body = super._createBody(options, StaticBoxBody);
        body.update = BoxBody.prototype.update;
        return body;
    }

    _createTraits ({settings}) {
        return [
            new Obstacle(),
            new Lift({
                from: this.body.center,
                to: new Vector2(...settings.to)
            })
        ];
    }
}

Platform.images = {
    default: 'Box'
};
