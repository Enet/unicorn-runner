import TopMushroom from 'entities/TopMushroom.js';
import {
    Vector2
} from 'engine/math.js';

export default class LeftMushroom extends TopMushroom {
    get angle () {
        return super.angle - Math.PI / 2;
    }

    get offset () {
        const offset = super.offset;
        offset.y += 10;
        offset.x -= 10;
        return offset;
    }

    _getSize () {
        return new Vector2(20, 40);
    }

    _createBody () {
        const body = super._createBody(...arguments);
        body.setGravity(new Vector2(0, 0));
        return body;
    }
}

LeftMushroom.images = TopMushroom.images;
