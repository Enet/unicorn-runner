import Trait from 'traits/Trait.js';
import Picker from 'traits/Picker.js';

export default class Controller extends Trait {
    getName () {
        return 'controller';
    }

    traitWillMount (onScoreChange) {
        this._score = 0;
        this._onScoreChange = onScoreChange;
    }

    traitDidMount () {
        const picker = new Picker(this._onPick.bind(this));
        this.entity.addTrait(picker);
    }

    traitWillUpdate (deltaTime, level) {
        level.isGameOver() && level.restartGame();
    }

    _onPick (body) {
        this._score += 50;
        this._onScoreChange(this._score);
    }
}
