import Trait from 'traitsnew/Trait.js';

export default class GameplayTrait extends Trait {
    use () {
        this._isUsed = true;
    }

    isUsed () {
        return this._isUsed;
    }

    traitWillMount () {
        this._isUsed = false;
    }
}
