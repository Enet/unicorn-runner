import BombTrait from 'traits/BombTrait.js';
import GasCloudEntity from 'entities/GasCloudEntity.js';

export default class BombGasTrait extends BombTrait {
    _makeWave () {

    }

    _getCloud () {
        return GasCloudEntity;
    }

    _getDuration () {
        return +this.options.duration || null;
    }
}
