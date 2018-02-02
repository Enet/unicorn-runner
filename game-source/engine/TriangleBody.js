import Body from './Body.js';
import DynamicPoint from './DynamicPoint.js';

export default class TriangleBody extends Body {
    constructor (options) {
        const {x, y, width, height} = options;
        const points = [
            new DynamicPoint(x + width / 2, y),
            new DynamicPoint(x, y + height),
            new DynamicPoint(x + width, y + height)
        ];
        super(Object.assign(options, {points}));
    }
}
