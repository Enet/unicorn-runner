import TopDustMushroom from 'entities/TopDustMushroom.js';
import LeftGasMushroom from 'entities/LeftGasMushroom.js';

import GasBomb from 'traits/GasBomb.js';
import Killable from 'traits/Killable.js';

export default class TopGasMushroom extends TopDustMushroom {
    _createTraits () {
        const traits = super._createTraits(...arguments);
        traits.shift();
        traits.push(new GasBomb({
            onBoom: this._onBoom.bind(this)
        }, true));
        traits.push(new Killable({
            onKill: this._onKill.bind(this)
        }));
        return traits;
    }

    _onKill () {
        this.level.changeScore(100);
    }

    _onBoom (body, preventBoom) {
        if (body.entity instanceof TopGasMushroom ||
            body.entity instanceof LeftGasMushroom) {
            preventBoom();
        } else if (body.entity.fight && body.entity.fight.isFighting()) {
            preventBoom();
        }
    }
}

TopGasMushroom.images = {
    default: 'GasMushroom'
};
