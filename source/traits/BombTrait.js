import {
    Vector2
} from 'engine/math.js';

import Trait from 'traits/Trait.js';
import getImageNodes from 'utils/getImageNodes.js';

export default class BombTrait extends Trait {
    explode (body) {
        if (!this._warheadCount) {
            return;
        }

        let isExplosionPrevented = false;
        let isWavePrevented = false;
        let isCloudPrevented = false;

        const {options} = this;
        const {willExplode} = options;
        willExplode && willExplode({
            body,
            preventExplosion: () => isExplosionPrevented = true,
            preventWave: () => isWavePrevented = true,
            preventCloud: () => isCloudPrevented = true
        });

        if (isExplosionPrevented) {
            return;
        }

        this._warheadCount--;
        this.entity.body.setGravity(null);

        if (!isWavePrevented) {
            this._makeWave(body);
        }

        if (!isCloudPrevented) {
            this._makeCloud();
        }

        const {onExplode} = options;
        onExplode && onExplode({body});
    }

    getName () {
        return 'bomb';
    }

    traitWillMount ({warheadCount=1}) {
        this._warheadCount = +warheadCount;
    }

    _makeWave (body) {
        const x = 5 - 10 * Math.random();
        const y = -10 - 5 * Math.random();
        const impulse = new Vector2(x, y);
        body.move(impulse);
        impulse.y *= 0.5;
        this.entity.body.move(impulse.length(-1));
    }

    _getCloud () {

    }

    _makeCloud () {
        const Cloud = this._getCloud();
        const {level} = this;
        const images = getImageNodes(level.manager, Cloud.images);
        const {x, y} = this.entity.body.center;
        const cloud = new Cloud({level, images, x, y});
        level.addEntity(cloud);
    }
}
