import {
    Vector2
} from 'engine/math.js';

import StaticEntity from 'entities/StaticEntity.js';
import AppearanceFadeInTrait from 'traits/AppearanceFadeInTrait.js';
import AppearanceFadeOutTrait from 'traits/AppearanceFadeOutTrait.js';
import {
    COLOR_RED,
    COLOR_BLACK,
    TILE_SIZE,
    HEALTH_SCALE_TIME,
    INDEX_CLOUD_BACKGROUND
} from 'constants.js';

export default class HealthScaleEntity extends StaticEntity {
    get index () {
        return INDEX_CLOUD_BACKGROUND + 1;
    }

    get opacity () {
        return 0;
    }

    get position () {
        const {organism} = this.options;
        const {entity} = organism;
        const {body} = entity;
        const position = body.center.clone();
        position.y -= entity.size.height * 0.75;
        return position;
    }

    hide () {
        this.fadeIn.stop();
        this.fadeOut.start();
    }

    show () {
        this.fadeOut.stop();
        this.fadeIn.start();
        clearTimeout(this._timer);
        this._timer = setTimeout(this._onTimerTick.bind(this), HEALTH_SCALE_TIME);
    }

    render (context, camera) {
        if (!this._shouldRender(camera)) {
            return;
        }
        const {organism} = this.options;
        const x = -0.5 * TILE_SIZE;
        const y = 0;
        const width = TILE_SIZE;
        const height = 8;
        const health = organism.getHealth() * 0.01;
        context.beginPath();
        context.fillStyle = COLOR_BLACK.toString();
        context.fillRect(x, y, width, height);
        context.beginPath();
        context.fillStyle = COLOR_RED.toString();
        context.fillRect(x + 1, y + 1, (width - 2) * health, height - 2);
    }

    entityWillMount () {
        super.entityWillMount(...arguments);
        this._defaultSize = this.size;
    }

    entityWillUnmount () {
        super.entityWillUnmount(...arguments);
        clearTimeout(this._timer);
    }

    _getSize () {
        return new Vector2(TILE_SIZE, 0.25 * TILE_SIZE);
    }

    _createTraits () {
        return [
            new AppearanceFadeInTrait({
                autoStart: false
            }),
            new AppearanceFadeOutTrait({
                onEnd: this._onFadeOutEnd.bind(this)
            })
        ];
    }

    _onTimerTick () {
        this.fadeIn.stop();
        this.fadeOut.start();
    }

    _onFadeOutEnd () {
        const {organism} = this.options;
        if (!organism || !organism.isDead()) {
            return;
        }
        this.level.removeEntity(this);
    }
}
