import {
    Vector2
} from 'engine/math.js';
import StaticPoint from 'engine/StaticPoint.js';
import TriangleBody from 'engine/TriangleBody.js';
import Entity from 'entities/Entity.js';

import Rope from 'entities/Rope.js';
import Killable from 'traits/Killable.js';
import Dollar10 from 'entities/Dollar10.js';
import Dollar50 from 'entities/Dollar50.js';
import Dollar100 from 'entities/Dollar100.js';
import spriteDescription from 'sprites/Spider.js';

const dollars = {
    10: Dollar10,
    50: Dollar50,
    100: Dollar100
};

export default class Spider extends Entity {
    get offset () {
        const offset = super.offset;
        offset.x -= (60 - 60) / 2;
        offset.y -= (66 - 33) / 2;
        return offset;
    }

    entityWillUpdate (deltaTime) {
        super.entityWillUpdate(...arguments);
        if (this._lifeTime - this._collisionTime < 2000) {
            return;
        }
        const {player} = this.level;
        if (!this._attackTime && player.fight.isFighting() && Math.random() > 0.01) {
            return;
        }
        if (Math.abs(this.body.center.x - player.body.center.x) < player.size.width / 2) {
            if (this._attackTime > 300) {
                this._collisionTime = this._lifeTime;
                this._attackTime = 0;
            } else {
                this._attackTime += deltaTime;
            }
            this.body.move(new Vector2(0, this._reaction * (1 - this._attackTime / 300)));
        }
    }

    entityCollision (body) {
        if (this._lifeTime - this._collisionTime < 2000) {
            return;
        }
        this._collisionTime = this._lifeTime;

        if (body !== this.level.player.body) {
            return;
        }

        const score = this.level.getScore();
        let nominal;
        if (score > 100) {
            nominal = 100;
        } else if (score > 50) {
            nominal = 50;
        } else if (score > 10) {
            nominal = 10;
        } else {
            return;
        }

        const {level} = this;
        const {manager} = level;
        const images = {default: manager.getImage(`Dollar${nominal}`)};
        const x = this.level.player.body.center.x;
        const y = this.level.player.body.center.y;
        const Dollar = dollars[nominal];
        const coin = new Dollar({level, x, y, images});
        this.level.addEntity(coin);
        this.level.changeScore(-nominal);
    }

    constructor ({settings}) {
        super(...arguments);
        const rope = new Rope({
            level: this.level,
            points: [
                new StaticPoint(this.body.center.x, this.body.center.y - 10),
                this.body.points[0]
            ]
        });
        this._reaction = +settings.reaction || 0;
        this._rope = rope;
        this._attackTime = 0;
        this._collisionTime = 0;
        this.level.addEntity(rope);
    }

    _getSpriteDescription () {
        return spriteDescription;
    }

    _getSize () {
        return new Vector2(60, 33);
    }

    _createBody (options) {
        const body = super._createBody(options, TriangleBody);
        return body;
    }

    _createTraits ({settings}) {
        return [
            new Killable({
                onKill: this._onKill.bind(this)
            })
        ];
    }

    _onKill () {
        this.level.changeScore(100);
    }
}

Spider.images = {
    default: 'Spider'
};
