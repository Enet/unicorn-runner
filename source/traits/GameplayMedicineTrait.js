import GameplayTrait from 'traits/GameplayTrait.js';

export default class GameplayMedicineTrait extends GameplayTrait {
    use (organism) {
        if (this._isUsed) {
            return;
        }
        if (organism.isDead()) {
            return;
        }
        const {deltaHealth} = this.options;
        organism.changeHealth(+deltaHealth);
        super.use(...arguments);
    }

    getName () {
        return 'medicine';
    }
}
