import Renderable from 'engine/Renderable.js';

import getImageNodes from 'utils/getImageNodes.js';
import {
    INDEX_STATIC_BACKGROUND
} from 'constants.js';

export default class Background extends Renderable {
    get index () {
        return INDEX_STATIC_BACKGROUND;
    }

    constructor ({manager}) {
        super();
        this.images = getImageNodes(manager, this._getImageNames());
        this.manager = manager;
    }

    _getImageNames () {

    }
}
