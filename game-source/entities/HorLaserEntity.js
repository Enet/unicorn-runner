import {
    Vector2
} from 'engine/math.js';

import StaticEntity from 'entities/StaticEntity.js';
import TriggerContactTrait from 'traits/TriggerContactTrait.js';
import {
    TILE_SIZE,
    COLOR_RED,
    INDEX_RENDERABLE
} from 'constants.js';

const HALF_TILE_SIZE = 0.5 * TILE_SIZE;
const LASER_DAMAGE = 0.25;

export default class HorLaserEntity extends StaticEntity {
    get index () {
        return INDEX_RENDERABLE + 1;
    }

    get opacity () {
        return 0.75 * Math.abs(Math.sin(0.002 * this._lifeTime));
    }

    render (context, camera) {
        if (!this._shouldRender(camera)) {
            return;
        }
        const alpha = context.globalAlpha;
        context.fillStyle = COLOR_RED.toString();
        for (let i = 1; i < 5; i++) {
            context.globalAlpha = alpha * i * 0.25;
            context.beginPath();
            context.fillRect(
                -HALF_TILE_SIZE,
                -HALF_TILE_SIZE + HALF_TILE_SIZE - (5 - i),
                TILE_SIZE,
                (5 - i) * 2
            );
        }
        context.globalAlpha = alpha;
    }

    entityWillMount () {
        super.entityWillMount(...arguments);
        this._defaultSize = this.size;
        this._idleSound = this.level.createSound('LaserIdle', {
            loop: true,
            amplitude: 0.1,
            position: this.body.center
        }).play();
        this._fightSound = this.level.createSound('LaserFight', {
            loop: true,
            fadeInOnPlay: {},
            fadeOutOnPause: {}
        });
    }

    entityWillUpdate () {
        super.entityWillUpdate(...arguments);
        if (this._contact) {
            this._contact = false;
        } else {
            this._fightSound.pause();
        }
    }

    entityWillUnmount () {
        super.entityWillUnmount(...arguments);
        this.level.removeSound(this._idleSound);
        this.level.removeSound(this._fightSound);
    }

    _getSize () {
        return new Vector2(TILE_SIZE, TILE_SIZE);
    }

    _getCoordinateName () {
        return 'y';
    }

    _createTraits () {
        return [
            new TriggerContactTrait({
                maxActivationCount: Infinity,
                onActivate: this._onContact.bind(this)
            })
        ];
    }

    _onContact (body) {
        const coordinateName = this._getCoordinateName();
        const laserCenter = this.body.center[coordinateName];
        const halfBodyWidth = body.entity.size[coordinateName] * 0.5;
        if (body.center[coordinateName] + halfBodyWidth < laserCenter ||
            body.center[coordinateName] - halfBodyWidth > laserCenter) {
            return;
        }
        body.entity.organism.changeHealth(-LASER_DAMAGE);
        this._contact = true;
        this._fightSound.play();
    }
}
