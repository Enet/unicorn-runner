import TriangleBody from 'engine/TriangleBody.js';
import StaticPoint from 'engine/StaticPoint.js';
import {
    Vector2
} from 'engine/math.js';

import Entity from 'entities/Entity.js';
import RopeEntity from 'entities/RopeEntity.js';
import Coin10Entity from 'entities/Coin10Entity.js';
import Coin50Entity from 'entities/Coin50Entity.js';
import Coin100Entity from 'entities/Coin100Entity.js';
import OrganismTrait from 'traits/OrganismTrait.js';
import TriggerContactTrait from 'traits/TriggerContactTrait.js';
import AppearanceFadeOutTrait from 'traits/AppearanceFadeOutTrait.js';
import ActionFightTrait from 'traits/ActionFightTrait.js';
import GameplayScoreTrait from 'traits/GameplayScoreTrait.js';
import {
    SCORE_SPIDER_DEATH
} from 'constants.js';

const SPIDER_WAITING_TIME = 2000;
const SPIDER_FIGHTING_TIME = 500;
const SPIDER_DAMAGE = 5;
const coins = {
    10: Coin10Entity,
    50: Coin50Entity,
    100: Coin100Entity
};

export default class SpiderEntity extends Entity {
    entityWillUpdate (deltaTime) {
        super.entityWillUpdate(...arguments);

        if (this._lifeTime - this._collisionTime < SPIDER_WAITING_TIME) {
            return;
        }

        const {player} = this.level;
        if (this.fight.isStopped() &&
            !player.fight.isStopped() &&
            Math.random() > 0.01) {
            return;
        }

        const dx = this.body.center.x - player.body.center.x;
        if (Math.abs(dx) > player.size.width / 2) {
            return;
        }

        let fightingTime = 0;
        if (this._fightTime) {
            fightingTime = this._lifeTime - this._fightTime;
            fightingTime > SPIDER_FIGHTING_TIME && this._stopFight();
        } else {
            this._startFight();
        }

        const x = 0;
        const y = this._reaction * (1 - fightingTime / SPIDER_FIGHTING_TIME);
        const impulse = new Vector2(x, y);
        this.body.move(impulse);
    }

    entityWillMount ({settings}) {
        super.entityWillMount(...arguments);
        const {level} = this;
        const web = +settings.web || 10;
        const points = [
            new StaticPoint(this.body.center.x, this.body.center.y - web),
            this.body.points[0]
        ];
        const rope = new RopeEntity({level, points});
        this._reaction = +settings.reaction || 10;
        this._rope = rope;
        this._collisionTime = -SPIDER_WAITING_TIME;
        this._fightTime = null;
    }

    entityDidMount () {
        super.entityDidMount();
        this.level.addEntity(this._rope);
    }

    _startFight () {
        this._fightTime = this._lifeTime;
        this.fight.start();
    }

    _stopFight () {
        this._fightTime = null;
        this._collisionTime = this._lifeTime;
        this.fight.stop();
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
            }),
            new GameplayScoreTrait({
                deltaScore: SCORE_SPIDER_DEATH
            })
        ];
    }

    _beatOutCoin (index) {
        const {level} = this;
        const score = level.getScore();
        let nominal;
        if (score >= 100) {
            nominal = 100;
        } else if (score >= 50) {
            nominal = 50;
        } else if (score >= 10) {
            nominal = 10;
        } else {
            return;
        }

        const {player} = level;
        const x = player.body.center.x + 10 * Math.sin(index * Math.PI / 2);
        const y = player.body.center.y - player.size.height * 0.5;
        const CoinEntity = coins[nominal];
        const coin = new CoinEntity({level, x, y});
        level.addEntity(coin);
        level.changeScore(-nominal);
    }

    _onContact (body) {
        if (this._lifeTime - this._collisionTime < SPIDER_WAITING_TIME) {
            return;
        }
        this._stopFight();

        const {level} = this;
        const {player} = level;
        if (body !== player.body) {
            return;
        }

        for (let i = 0, il = Math.random() * 4; i < il; i++) {
            this._beatOutCoin(i);
        }
    }

    _onDie () {
        this.score.use();
        this.fadeOut.start();
    }

    _onFadeOutEnd () {
        this.level.removeEntity(this);
    }
}
