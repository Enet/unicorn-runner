import Background from 'backgrounds/Background.js';

import {
    LAVA_HEIGHT,
    INDEX_LAVA_BACKGROUND,
    COLOR_ORANGE,
    COLOR_RED
} from 'constants.js';

const COLOR_LAVA_1 = COLOR_ORANGE;
const COLOR_LAVA_2 = COLOR_RED;
const WAVE_0 = 4;
const WAVE_1 = 8;
const WAVE_2 = 16;
const STEP = 64;

export default class LavaBackground extends Background {
    get mode () {
        return 'exclusion';
    }

    get index () {
        return INDEX_LAVA_BACKGROUND;
    }

    constructor ({bounds}) {
        super(...arguments);
        this._bounds = bounds;
        this._phase = 0;
    }

    render (context, camera) {
        this._phase += 0.02;

        const bounds = this._bounds;
        const tx = camera.position.x | 0;
        const ty = camera.position.y | 0;
        const {width} = camera.size;

        context.save();
        context.translate(-tx, -ty);

        const gradient = context.createLinearGradient(0, 0, 0, width);
        gradient.addColorStop(0, COLOR_LAVA_1);
        gradient.addColorStop(1, COLOR_LAVA_2);
        context.fillStyle = gradient;

        let prevAngle = tx / 100;
        let prevWave = this._getWave(prevAngle);
        for (let x = 0, xl = width; x < xl; x += STEP) {
            context.beginPath();
            context.moveTo(tx + x, bounds.bottom - LAVA_HEIGHT + prevWave);
            prevAngle += STEP / 100;
            prevWave = this._getWave(prevAngle);
            context.lineTo(tx + x + STEP, bounds.bottom - LAVA_HEIGHT + prevWave);
            context.lineTo(tx + x + STEP, bounds.bottom);
            context.lineTo(tx + x, bounds.bottom);
            context.fill();
        }

        context.restore();
    }

    _getWave (angle) {
        const phase = this._phase;
        return 0 +
            Math.sin(angle + phase) * WAVE_2 +
            Math.cos(angle + 2 * phase) * WAVE_1 +
            Math.sin(angle + 4 * phase) * WAVE_0;
    }
}
