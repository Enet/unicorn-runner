import TriangleBody from 'engine/TriangleBody.js';
import StaticPoint from 'engine/StaticPoint.js';
import {
    Vector2
} from 'engine/math.js';

import Entity from 'entitiesnew/Entity.js';
import Rope from 'entitiesnew/Rope.js';
import Coin10 from 'entitiesnew/Coin10.js';
import Coin50 from 'entitiesnew/Coin50.js';
import Coin100 from 'entitiesnew/Coin100.js';
import OrganismTrait from 'traitsnew/OrganismTrait.js';
import TriggerContactTrait from 'traitsnew/TriggerContactTrait.js';
import AppearanceFadeOutTrait from 'traitsnew/AppearanceFadeOutTrait.js';
import ActionFightTrait from 'traitsnew/ActionFightTrait.js';
import {
    SCORE_SPIDER_DEATH
} from 'constants.js';

const SPIDER_WAITING_TIME = 2000;
const SPIDER_FIGHTING_TIME = 300;
const SPIDER_DAMAGE = 5;
const coins = {
    10: Coin10,
    50: Coin50,
    100: Coin100
};

export default class SpiderEntity extends Entity {
    entityWillUpdate (deltaTime) {
        super.entityWillUpdate(...arguments);

        if (this._lifeTime - this._collisionTime < SPIDER_WAITING_TIME) {
            return;
        }

        const {player} = this.level;
        if (!this.fight.isFighting() &&
            player.fight.isFighting() &&
            Math.random() > 0.01) {
            return;
        }

        if (Math.abs(this.body.center.x - player.body.center.x) > player.size.width / 2) {
            return;
        }

        const fightingTime = this._lifeTime - this._fightTime;
        if (fightingTime > SPIDER_FIGHTING_TIME) {
            this._collisionTime = this._lifeTime;
            this.fight.stop();
        } else {
            this._fightTime = this._lifeTime;
            this.fight.start();
        }

        const x = 0;
        const y = this._reaction * (1 - fightingTime / SPIDER_FIGHTING_TIME);
        const impulse = new Vector2(x, y);
        this.body.move(impulse);
    }

    entityWillMount ({settings}) {
        super.entityWillMount(...arguments);
        const {level} = this;
        const points = [
            new StaticPoint(this.body.center.x, this.body.center.y - 10),
            this.body.points[0]
        ];
        const rope = new Rope({level, points});
        this._reaction = +settings.reaction || 0;
        this._rope = rope;
        this._collisionTime = 0;
        this._fightTime = 0;
    }

    entityDidMount () {
        super.entityDidMount();
        this.level.addEntity(this._rope);
    }

    _getImageName () {
        return 'Spider';
    }

    _getSize () {
        return new Vector2(60, 33);
    }

    _createBody (options) {
        return super._createBody(options, TriangleBody);
    }

    _createTraits ({settings}) {
        return [
            new OrganismTrait({
                onDie: this._onDie.bind(this)
            }),
            new ActionFightTrait({
                damage: SPIDER_DAMAGE
            }),
            new TriggerContactTrait({
                maxActivationCount: Infinity,
                onActivate: this._onContact.bind(this)
            }),
            new AppearanceFadeOutTrait({
                onEnd: this._onFadeOutEnd.bind(this)
            })
        ];
    }

    _onContact (body) {
        if (this._lifeTime - this._collisionTime < SPIDER_WAITING_TIME) {
            return;
        }
        this._collisionTime = this._lifeTime;

        const {level} = this;
        const {player} = level;
        if (body !== player.body) {
            return;
        }

        const score = level.getScore();
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

        const x = player.body.center.x;
        const y = player.body.center.y;
        const Coin = coins[nominal];
        const coin = new Coin({level, x, y});
        level.addEntity(coin);
        level.changeScore(-nominal);
    }

    _onDie () {
        this.level.changeScore(SCORE_SPIDER_DEATH);
        this.fadeOut.start();
    }

    _onFadeOutEnd () {
        this.level.removeEntity(this);
    }
}
