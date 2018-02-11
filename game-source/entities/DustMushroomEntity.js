import MushroomEntity from 'entities/MushroomEntity.js';
import BombDustTrait from 'traits/BombDustTrait.js';

const DUST_MUSHROOM_DAMAGE = 50;

export default class DustMushroomEntity extends MushroomEntity {
    _getImageName () {
        return 'DustMushroom';
    }

    _getBombTrait () {
        return BombDustTrait;
    }

    _onExplode ({body}) {
        body.entity.organism.changeHealth(-DUST_MUSHROOM_DAMAGE);
        super._onExplode(body);
    }
}
