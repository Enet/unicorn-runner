import StaticEntity from 'entitiesnew/StaticEntity.js';
import AppearanceFadeInTrait from 'traitsnew/AppearanceFadeInTrait.js';
import TriggerContactTrait from 'traitsnew/TriggerContactTrait.js';
import AppearanceFadeOutTrait from 'traitsnew/AppearanceFadeOutTrait.js';
import {
    GAS_CLOUD_TIME,
    INDEX_CLOUD
} from 'constants.js';

const GAS_CLOUD_MIN_DISTANCE = 2;
const GAS_CLOUD_DAMAGE = 2;

export default class GasCloud extends StaticEntity {
    get index () {
        return INDEX_CLOUD;
    }

    get angle () {
        return this._lifeTime / 2000;
    }

    render (context) {
        const {sprite, offset} = this;
        const alpha = context.globalAlpha * 0.9;
        const phase = 0.2 * this._lifeTime / GAS_CLOUD_TIME;
        context.globalAlpha = alpha * Math.abs(Math.sin(phase));
        sprite.render('gas-1', context, offset.x, offset.y);
        context.globalAlpha = alpha * Math.abs(Math.cos(phase));
        sprite.render('gas-2', context, offset.x, offset.y);
    }

    _getImageName () {
        return 'GasCloud';
    }

    _createTraits () {
        return [
            new AppearanceFadeInTrait({
                onEnd: this._onFadeInEnd.bind(this)
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

    _onFadeInEnd () {
        this.level.setTimeout(this._onGasCloudTimerTick.bind(this), GAS_CLOUD_TIME);
    }

    _onContact (body) {
        const distance = this.body.center.subtract(body.center).length();
        const damage = GAS_CLOUD_DAMAGE / Math.max(GAS_CLOUD_MIN_DISTANCE, distance);
        body.entity.organism.changeHealth(-damage);
    }

    _onGasCloudTimerTick () {
        this.fadeOut.start();
    }

    _onFadeOutEnd () {
        this.level.removeEntity(this);
    }
}
