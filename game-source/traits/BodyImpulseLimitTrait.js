import DynamicPoint from 'engine/DynamicPoint.js';

import BodyTrait from 'traits/BodyTrait.js';

export default class BodyImpulseLimitTrait extends BodyTrait {
    start () {
        this.entity.body.points.forEach((point) => {
            if (point instanceof DynamicPoint === false) {
                return;
            }
            point.integrate = this._integratePoint.bind(point, this._limit);
        });
    }

    stop () {
        this.entity.body.points.forEach((point) => {
            delete point.integrate;
        });
    }

    getName () {
        return 'impulseLimit';
    }

    traitWillMount ({limit=7.5}) {
        this._limit = +limit;
    }

    _integratePoint (limit, ...a) {
        const {x, y, cache} = this;
        const vx = Math.max(-2 * limit, Math.min(2 * limit, x - cache.x));
        const vy = Math.max(-limit, Math.min(limit, y - cache.y));
        this.x = cache.x + vx;
        this.y = cache.y + vy;
        return DynamicPoint.prototype.integrate.call(this, ...a);
    }
}
