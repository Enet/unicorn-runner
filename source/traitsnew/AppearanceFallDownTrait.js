import {
    Vector2
} from 'engine/math.js';
import {
    REACTION_NO,
    REACTION_FULL
} from 'engine/constants.js';

import AppearanceFadeOutTrait from 'traitsnew/AppearanceFadeOutTrait.js';

export default class AppearanceFallDownTrait extends AppearanceFadeOutTrait {
    start () {
        super.start(...arguments);
        const {entity} = this;
        entity.body.move(new Vector2(3, -3));
        entity.body.reaction = REACTION_NO;
    }

    stop () {
        super.stop(...arguments);
        const {entity} = this;
        entity.body.reaction = REACTION_FULL;
    }

    getName () {
        return 'fallDown';
    }
}
