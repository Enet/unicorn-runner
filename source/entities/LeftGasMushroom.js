import LeftDustMushroom from 'entities/LeftDustMushroom.js';

import GasBomb from 'traits/GasBomb.js';

export default class LeftGasMushroom extends LeftDustMushroom {
    _createTraits () {
        const traits = super._createTraits(...arguments);
        traits.shift();
        traits.push(new GasBomb({}, true));
        return traits;
    }

    _onBoom (body) {

    }
}

LeftGasMushroom.images = {
    default: 'GasMushroom'
};
