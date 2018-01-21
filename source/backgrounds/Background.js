import Renderable from 'engine/Renderable.js';
import {
    INDEX_STATIC_BACKGROUND
} from 'constants.js';

export default class Background extends Renderable {
    get index () {
        return INDEX_STATIC_BACKGROUND;
    }

    constructor ({images}) {
        super();
        this.images = images;
    }
}

Background.images = {};
