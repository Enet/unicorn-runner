import StaticEntity from 'entities/StaticEntity.js';
import {
    Vector2
} from 'engine/math.js';

export default class Bush extends StaticEntity {
    _getFrame () {
        return 'bush';
    }

    _getSize () {
        return new Vector2(240, 80);
    }
}

Bush.images = {
    default: 'Bush'
};
