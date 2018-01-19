import TopDustMushroom from 'entities/TopDustMushroom.js';

import GasBomb from 'traits/GasBomb.js';

export default class TopGasMushroom extends TopDustMushroom {
    _createTraits () {
        const traits = super._createTraits(...arguments);
        traits.shift();
        traits.push(new GasBomb({}, true));
        return traits;
    }

    _onBoom (body) {

    }
}

TopGasMushroom.images = {
    default: 'GasMushroom'
};
