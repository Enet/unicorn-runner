import Trait from 'traitsnew/Trait.js';

export default class PickableTrait extends Trait {
    pick () {
        if (this._isPicked) {
            return;
        }
        this._isPicked = true;
        const {onPick} = this._callbacks;
        onPick && onPick();
    }

    isPicked () {
        return this._isPicked;
    }

    getName () {
        return 'pickable';
    }

    traitWillMount () {
        this._isPicked = false;
    }
}
