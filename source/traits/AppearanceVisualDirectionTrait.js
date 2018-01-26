import {
    Vector2
} from 'engine/math.js';

import AppearanceTrait from 'traits/AppearanceTrait.js';

export default class AppearanceVisualDirectionTrait extends AppearanceTrait {
    start () {
        Object.defineProperty(this.entity, 'scale', {
            configurable: true,
            get: this._getDirection.bind(this)
        });
    }

    stop () {
        delete this.entity.scale;
    }

    setDirection (direction) {
        direction = Math.sign(direction) || this._direction;
        this._direction = direction;
        this._prevDirection = direction;
    }

    getDirection () {
        let direction = this._direction;
        if (this.options.reverse) {
            direction *= -1;
        }
        return direction;
    }

    getVelocity () {
        return this._velocity;
    }

    getName () {
        return 'visualDirection';
    }

    traitDidMount () {
        this.setDirection(1);
        this._prevCenter = this.entity.body.center.x;
        this._velocity = new Vector2(0, 0);
        let {autoStart} = this.options;
        if (autoStart === undefined) {
            autoStart = true;
        }
        autoStart && this.start();
    }

    traitWillUpdate () {
        super.traitWillUpdate(...arguments);
        const {center} = this.entity.body;
        const dx = Math.round(center.x - this._prevCenter.x);
        const direction = Math.sign(dx) || this._prevDirection;
        this._velocity = center.subtract(this._prevCenter);
        this._direction = direction;
        this._prevDirection = direction;
        this._prevCenter = center.clone();
    }

    _getDirection () {
        return new Vector2(this.getDirection(), 1);
    }
}
