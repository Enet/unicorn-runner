import {
    Vector2
} from 'engine/math.js';

import Entity from 'entities/Entity.js';
import OrganismTrait from 'traits/OrganismTrait.js';
import AppearanceAngleLimitTrait from 'traits/AppearanceAngleLimitTrait.js';

export default class UnicornEntity extends Entity {
    get offset () {
        const offset = super.offset;
        offset.y -= 20;
        return offset;
    }

    _getImageName () {
        return 'Unicorn';
    }

    _getSize () {
        return new Vector2(100, 65);
    }

    _createTraits () {
        return [
            new AppearanceAngleLimitTrait({
                maxAngle: 0.33 * Math.PI
            }),
            new OrganismTrait({
                onChange: this._onHealthChange.bind(this),
                onDie: this._onDie.bind(this)
            })
        ];
    }

    _onHealthChange () {

    }

    _onDie () {

    }
}
