import Background from 'backgrounds/Background.js';

const WAVE_0 = 4;
const WAVE_1 = 8;
const WAVE_2 = 16;
const STEP = 64;

export default class Lava extends Background {
    get index () {
        return 1000;
    }

    constructor ({bounds}) {
        super(...arguments);
        this._bounds = bounds;
        this._phase = 0;
    }

    render (context, camera) {
        this._phase++;

        const bounds = this._bounds;
        const tx = camera.position.x;
        const ty = camera.position.y;
        const {width} = context.canvas;

        context.save();
        context.translate(-tx, -ty);

        const gradient = context.createLinearGradient(0, 0, 0, width);
        gradient.addColorStop(0, 'orange');
        gradient.addColorStop(1, 'red');
        context.fillStyle = gradient;

        let prevAngle = tx / 100;
        let prevWave = this._getWave(prevAngle);
        for (let x = 0, xl = width; x < xl; x += STEP) {
            context.beginPath();
            context.moveTo(tx + x, bounds.bottom - 150 + prevWave);
            prevAngle += STEP / 100;
            prevWave = this._getWave(prevAngle);
            context.lineTo(tx + x + STEP, bounds.bottom - 150 + prevWave);
            context.lineTo(tx + x + STEP, bounds.bottom);
            context.lineTo(tx + x, bounds.bottom);
            context.fill();
        }

        context.translate(tx, ty);
        context.restore();
    }

    _getWave (angle) {
        const phase = this._phase / 50;
        return 0 +
            Math.sin(angle + phase) * WAVE_2 +
            Math.cos(angle + 2 * phase) * WAVE_1 +
            Math.sin(angle + 4 * phase) * WAVE_0;
    }
}
