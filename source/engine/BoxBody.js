import Body from './Body.js';
import DynamicPoint from './DynamicPoint.js';
import StaticPoint from './StaticPoint.js';

export default class BoxBody extends Body {
    constructor (options) {
        const Point = options.statical ? StaticPoint : DynamicPoint;
        const {x, y, width, height} = options;
        const points = [
            new Point(x, y), new Point(x + width, y),
            new Point(x + width, y + height), new Point(x, y + height)
        ];
        super(Object.assign(options, {points}));
    }
}
