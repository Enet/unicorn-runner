import BombTrait from 'traitsnew/BombTrait.js';
import GasCloud from 'entities/GasCloud.js';

export default class BombGasTrait extends BombTrait {
    _makeWave () {

    }

    _getCloud () {
        return GasCloud;
    }
}
