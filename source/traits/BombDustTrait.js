import BombTrait from 'traits/BombTrait.js';
import DustCloudEntity from 'entities/DustCloudEntity.js';

export default class BombDustTrait extends BombTrait {
    _getCloud () {
        return DustCloudEntity;
    }
}
