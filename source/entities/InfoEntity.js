import StaticEntity from 'entities/StaticEntity.js';
import TriggerContactTrait from 'traits/TriggerContactTrait.js';
import BodyGravityTrait from 'traits/BodyGravityTrait.js';
import {
    INDEX_RENDERABLE
} from 'constants.js';

export default class InfoEntity extends StaticEntity {
    get index () {
        return INDEX_RENDERABLE - 1;
    }

    entityWillUpdate () {
        super.entityWillUpdate(...arguments);
        if (!this._isActivated) {
            return;
        }
        this._isActivated--;
        if (this._isActivated) {
            return;
        }
        const {level} = this;
        level.hideInfo();
        level.createSound('MenuHover', {
            position: this.body.center
        }).play();
    }

    _getImageName () {
        return 'Info';
    }

    _createTraits () {
        return [
            new TriggerContactTrait({
                maxActivationCount: Infinity,
                onActivate: this._onContact.bind(this)
            }),
            new BodyGravityTrait()
        ];
    }

    _onContact (body) {
        const {level} = this;
        if (body !== level.player.body) {
            return;
        }
        if (!this._isActivated) {
            level.showInfo(this.options.settings.data);
            level.createSound('MenuHover', {
                position: this.body.center
            }).play();
        }
        this._isActivated = 2;
    }
}
