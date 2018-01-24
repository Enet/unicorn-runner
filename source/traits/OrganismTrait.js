import Trait from 'traits/Trait.js';

const MIN_HEALTH = 0;
const MAX_HEALTH = 100;

export default class OrganismTrait extends Trait {
    isDead () {
        return this._health === MIN_HEALTH;
    }

    getHealth () {
        return this._health;
    }

    changeHealth (deltaHealth) {
        if (this.isDead()) {
            return;
        }

        let health = this._health;
        const {options} = this;
        const {willChange} = options;
        if (willChange) {
            deltaHealth = willChange({health, deltaHealth});
        }

        health += deltaHealth;
        health = Math.max(MIN_HEALTH, Math.min(MAX_HEALTH, health));
        this._health = health;

        const {onChange, onDie} = options;
        onChange && onChange({health, deltaHealth});
        this.isDead() && onDie && onDie();
    }

    getName () {
        return 'organism';
    }

    traitWillMount ({health=100}) {
        this._health = +health;
    }
}

