import Trait from 'traits/Trait.js';
import HealthScaleEntity from 'entities/HealthScaleEntity.js';

const MIN_HEALTH = 0;
const MAX_HEALTH = 100;

export default class OrganismTrait extends Trait {
    isDead () {
        return this._health === MIN_HEALTH;
    }

    getPercent () {
        return this._health / this._maxHealth;
    }

    getHealth () {
        return this._health;
    }

    changeHealth (deltaHealth) {
        if (this.isDead()) {
            return;
        }
        if (this.level.isStopped()) {
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
        const healthScale = this._healthScale;
        if (deltaHealth) {
            healthScale && healthScale.show();
            onChange && onChange({health, deltaHealth});
        }
        if (this.isDead()) {
            healthScale && healthScale.hide();
            onDie && onDie();
        }
    }

    getName () {
        return 'organism';
    }

    traitWillMount ({health=100}) {
        this._health = +health;
        this._maxHealth = +health;
    }

    traitDidMount () {
        if (this.options.hideHealthScale) {
            return;
        }
        const {level} = this;
        const {x, y} = this.entity.body.center;
        const organism = this;
        const healthScale = new HealthScaleEntity({level, x, y, organism});
        this.level.addEntity(healthScale);
        this._healthScale = healthScale;
    }

    traitWillUnmount () {
        const healthScale = this._healthScale;
        healthScale && healthScale.hide();
    }
}

