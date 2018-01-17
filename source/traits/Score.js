import Trait from 'traits/Trait.js';

export default class Score extends Trait {
    getName () {
        return 'score';
    }

    traitWillMount (nominal) {
        this._nominal = nominal;
    }

    getNominal () {
        return this._nominal;
    }
}
