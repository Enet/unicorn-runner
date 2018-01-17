import Unicorn from 'entities/Unicorn.js';
import Picker from 'traits/Picker.js';
import Fly from 'traits/Fly.js';

export default class Player extends Unicorn {
    constructor () {
        super(...arguments);
        this._score = 0;
    }

    _createTraits (options) {
        return [
            ...super._createTraits(...arguments),
            new Picker(this._onPick.bind(this)),
            new Fly(),
            options.controller
        ];
    }

    _onPick (body) {
        this._score += 50;
        this.controller.traitScore(this._score);
    }
}
