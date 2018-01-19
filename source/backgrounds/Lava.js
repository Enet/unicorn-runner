import Background from 'backgrounds/Background.js';

const STEP = 8;
const DOUBLE_STEP = 16;
const QUAD_STEP = 32;

export default class Lava extends Background {
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
        for (let x = 0, xl = width; x < xl; x += QUAD_STEP) {
            context.beginPath();
            context.moveTo(tx + x, bounds.bottom - 150 + prevWave);
            prevAngle += QUAD_STEP / 100;
            prevWave = this._getWave(prevAngle);
            context.lineTo(tx + x + QUAD_STEP, bounds.bottom - 150 + prevWave);
            context.lineTo(tx + x + QUAD_STEP, bounds.bottom);
            context.lineTo(tx + x, bounds.bottom);
            context.fill();
        }

        context.translate(tx, ty);
        context.restore();
    }

    _getWave (angle) {
        const phase = this._phase / 100;
        return 0 +
            Math.sin(angle + phase) * QUAD_STEP +
            Math.cos(angle + 2 * phase) * DOUBLE_STEP +
            Math.sin(angle + 4 * phase) * STEP;
    }
}
