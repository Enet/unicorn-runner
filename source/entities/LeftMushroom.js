import TopMushroom from 'entities/TopMushroom.js';
import {
    Vector2
} from 'engine/math.js';

export default class LeftMushroom extends TopMushroom {
    get angle () {
        return super.angle - Math.PI / 2;
    }

    _createBody () {
        const body = super._createBody(...arguments);
        body.setGravity(new Vector2(0, 0));
        return body;
    }
}

LeftMushroom.images = TopMushroom.images;
