import Trait from 'traits/Trait.js';

export default class PickableTrait extends Trait {
    pick (picker) {
        if (this._isPicked) {
            return;
        }
        this._isPicked = true;
        const {onPick} = this.options;
        onPick && onPick(picker);
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
