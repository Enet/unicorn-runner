import MushroomEntity from 'entitiesnew/MushroomEntity.js';
import BombDustTrait from 'traitsnew/BombDustTrait.js';

const DUST_MUSHROOM_DAMAGE = 80;

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
