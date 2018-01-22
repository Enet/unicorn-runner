import BombTrait from 'traitsnew/BombTrait.js';

import DustCloud from 'entities/DustCloud.js';

export default class BombDustTrait extends BombTrait {
    _getCloud () {
        return DustCloud;
    }
}
