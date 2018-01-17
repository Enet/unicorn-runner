import Trait from 'traits/Trait.js';
import Picker from 'traits/Picker.js';

export default class Controller extends Trait {
    getName () {
        return 'controller';
    }

    traitWillMount ({onScoreChange, onHealthChange}) {
        this._score = 0;
        this._onScoreChange = onScoreChange;
        this._onHealthChange = onHealthChange;
    }

    traitDidMount () {
        const picker = new Picker(this._onPick.bind(this));
        this.entity.traits.add(picker);
    }

    traitWillUpdate (deltaTime, level) {
        level.isGameOver() && !level.isStopped() && level.winGame();
    }

    traitInjure (health) {
        this._onHealthChange(health);
    }

    traitKill (level) {
        level.loseGame();
    }

    _onPick (body) {
        this._score += 50;
        this._onScoreChange(this._score);
    }
}
