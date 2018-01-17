import Trait from 'traits/Trait.js';
import Picker from 'traits/Picker.js';

export default class Controller extends Trait {
    getName () {
        return 'controller';
    }

    traitWillMount ({onScoreChange, onHealthChange}) {
        this._onScoreChange = onScoreChange;
        this._onHealthChange = onHealthChange;
    }

    traitWillUpdate (deltaTime, level) {
        level.isGameOver() && !level.isStopped() && level.winGame();
    }

    traitHealth (health) {
        this._onHealthChange(health);
    }

    traitKill (level) {
        level.loseGame();
    }

    traitScore (score) {
        this._onScoreChange(score);
    }
}
