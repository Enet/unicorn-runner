import ParticleSystem from 'engine/ParticleSystem.js';
import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import Killable from 'traits/Killable.js';
import Walker from 'traits/Walker.js';
import Enemy from 'traits/Enemy.js';
import Obstacle from 'traits/Obstacle.js';
import spriteDescription from 'sprites/Lizard.js';
import {
    ORANGE_COLOR
} from 'constants.js';

export default class Lizard extends Entity {
    get scale () {
        let velocityDirection = this.walker.getDirection();
        const prevCenter = this._prevCenter;
        this._prevCenter = this.body.center.clone();
        if (velocityDirection) {
            const bodyDirection = 2 * (this.body.center.x > prevCenter.x) - 1;
            return new Vector2(bodyDirection, 1);
        } else {
            const {player} = this.level;
            const bodyDirection = 2 * (this.body.center.x > player.body.center.x) - 1;
            return new Vector2(bodyDirection, 1);
        }
    }

    constructor () {
        super(...arguments);
        this._prevCenter = this.body.center;
        this._particleSystem = null;
        this._onParticleSystemStop = this._onParticleSystemStop.bind(this);
    }

    entityWillUpdate (deltaTime) {
        super.entityWillUpdate(...arguments);
        if (!this._particleSystem) {
            return;
        }
        this._particleSystem.update(deltaTime);
    }

    _getSpriteDescription () {
        return spriteDescription;
    }

    _getSize () {
        return new Vector2(75, 60);
    }

    _getFrame () {
        const direction = this.walker.getDirection();
        if (direction) {
            return super._getFrame('walk');
        } else {
            return super._getFrame('attack');
        }
    }

    _createTraits ({settings}) {
        return [
            new Obstacle(),
            new Walker(settings.range),
            new Enemy({
                onAttack: this._onAttack.bind(this)
            }, {
                power: 20
            }),
            new Killable({
                onKill: this._onKill.bind(this)
            })
        ];
    }

    _onAttack (preventAttack) {
        const {player} = this.level;
        if (this.body.center.y >= player.body.center.y + player.size.height / 2) {
            return preventAttack();
        }
        if (this._particleSystem) {
            return preventAttack();
        }

        const difference = player.body.center.subtract(this.body.center);
        const particleSystem = new ParticleSystem({
            position: this.body.center,
            direction: Math.atan2(difference.y, difference.x),
            directionError: 5,
            amountSpeed: 100,
            velocity: 0.3,
            alphaSpeed: 0.005,
            size: 1,
            startColor: ORANGE_COLOR,
            mode: 'lighter'
        });
        particleSystem.update(0);
        particleSystem.stop(this._onParticleSystemStop);
        this.level.scene.add(particleSystem);
        this._particleSystem = particleSystem;
    }

    _onKill () {
        this.level.changeScore(200);
    }

    _onParticleSystemStop (particleSystem) {
        this.level.scene.remove(particleSystem);
        this._particleSystem = null;
    }
}

Lizard.images = {
    default: 'Lizard'
};
