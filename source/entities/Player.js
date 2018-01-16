import Unicorn from 'entities/Unicorn.js';

export default class Player extends Unicorn {
    constructor (options) {
        super(options);
        this.addTrait(options.controller);
    }
}
