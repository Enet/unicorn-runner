import Unicorn from 'entities/Unicorn.js';

export default class Player extends Unicorn {
    _createTraits (options) {
        return [
            ...super._createTraits(...arguments),
            options.controller
        ];
    }
}
