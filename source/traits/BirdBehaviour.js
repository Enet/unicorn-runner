import Trait from 'traits/Trait.js';

import Drop from 'entities/Drop.js';

export default class BirdBehaviour extends Trait {
    getName () {
        return 'behavoiur';
    }

    traitWillMount () {
        this._lifeTime = 0;
        this._prevAttackTime = 0;
    }

    traitWillUpdate (deltaTime) {
        this._lifeTime += deltaTime;
        if (this._lifeTime - this._prevAttackTime < 1000) {
            return;
        }
        if (Math.random() > 0.002) {
            return;
        }

        this._prevAttackTime = this._lifeTime;
        const {entity} = this;
        const {level} = this;
        const {manager} = level;
        const images = {default: manager.getImage('Drop')};
        const {x, y} = entity.body.center;
        const parent = entity;
        const drop = new Drop({x, y, images, level, parent});
        this.level.addEntity(drop);
    }
}
