import Entity from 'entities/Entity.js';
import FootholdTrait from 'traits/FootholdTrait.js';

export default class BoxEntity extends Entity {
    _getImageName () {
        return 'Box';
    }

    _createTraits () {
        return [
            new FootholdTrait()
        ];
    }
}
