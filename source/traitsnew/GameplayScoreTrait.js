import GameplayTrait from 'traitsnew/GameplayTrait.js';

export default class GameplayScoreTrait extends GameplayTrait {
    use () {
        if (this._isUsed) {
            return;
        }
        const {deltaScore} = this.options;
        this.level.changeScore(+deltaScore);
        super.use(...arguments);
    }

    getName () {
        return 'score';
    }
}
