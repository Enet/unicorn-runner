import Background from 'backgrounds/Background.js';
import {
    INDEX_CLOUD_BACKGROUND
} from 'constants.js';

export default class CloudBackground extends Background {
    get index () {
        return INDEX_CLOUD_BACKGROUND;
    }

    constructor (options) {
        super(options);
        this._queue = [];
    }

    render (context, camera) {
        const queue = this._queue;
        queue.forEach(task => task(context));
        this._queue = [];
    }

    renderAsync (task) {
        this._queue.push(task);
    }
}
