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

    getName () {
        return 'visualDirection';
    }

    traitDidMount () {
        this.setDirection(1);
        this._prevCenterX = this.entity.body.center.x;
        let {autoStart} = this.options;
        if (autoStart === undefined) {
            autoStart = true;
        }
        autoStart && this.start();
    }

    traitWillUpdate () {
        super.traitWillUpdate(...arguments);
        const {x} = this.entity.body.center;
        const dx = Math.round(x - this._prevCenterX);
        const direction = Math.sign(dx) || this._prevDirection;
        this._direction = direction;
        this._prevDirection = direction;
        this._prevCenterX = x;
    }

    _getDirection () {
        return new Vector2(this.getDirection(), 1);
    }
}
