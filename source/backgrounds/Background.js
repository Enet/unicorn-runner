import Renderable from 'engine/Renderable.js';

export default class Background extends Renderable {
    constructor ({images}) {
        super();
        this.images = images;
    }
}
