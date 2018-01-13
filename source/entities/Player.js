import Unicorn from 'entities/Unicorn.js';

export default class Player extends Unicorn {
    constructor (image, controller) {
        super(image);
        this.addTrait(controller);
    }
}
