import Entity from 'entities/Entity.js';
import FootholdTrait from 'traits/FootholdTrait.js';

export default class BoxEntity extends Entity {
    entityCollision () {
        super.entityCollision(...arguments);
        if (Math.abs(this.body.getVelocity().x) > 1 &&
            Math.abs(this.body.getVelocity().y) < 0.5) {
            this.level.loopSound({
                name: 'scrape',
                key: 'scrape',
                position: this.body.center
            });
        } else {
            this.level.stopSound({
                key: 'scrape'
            });
        }
    }

    _getImageName () {
        return 'Box';
    }

    _createTraits () {
        return [
            new FootholdTrait()
        ];
    }
}
