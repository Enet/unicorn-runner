import Body from './Body.js';
import DynamicPoint from './DynamicPoint.js';

export default class BoxBody extends Body {
    constructor (options) {
        const {x, y, width, height} = options;
        const points = [
            new DynamicPoint(x, y), new DynamicPoint(x + width, y),
            new DynamicPoint(x + width, y + height), new DynamicPoint(x, y + height)
        ];
        super(Object.assign(options, {points}));
    }
}
