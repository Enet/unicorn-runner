import Body from './Body.js';
import StaticPoint from './StaticPoint.js';

export default class StaticBoxBody extends Body {
    constructor (options) {
        const {x, y, width, height} = options;
        const points = [
            new StaticPoint(x, y), new StaticPoint(x + width, y),
            new StaticPoint(x + width, y + height), new StaticPoint(x, y + height)
        ];
        super(Object.assign(options, {points}));
        this.static = true;
    }

    update () {

    }

    emit () {

    }
}
