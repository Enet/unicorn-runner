import Renderable from 'engine/Renderable.js';

export default class Background extends Renderable {
    get index () {
        return -1000;
    }

    constructor ({images}) {
        super();
        this.images = images;
    }
}
