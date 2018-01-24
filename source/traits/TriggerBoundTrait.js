import TriggerTrait from 'traits/TriggerTrait.js';

export default class TriggerBoundTrait extends TriggerTrait {
    traitWillUpdate (deltaTime) {
        const {options, level} = this;
        const {player} = level;
        const {x, y} = player.body.center;
        if (x > +options.x) {
            this.activate({coordinate: 'x', value: false});
        } else if (x <= +options.x) {
            this.activate({coordinate: 'x', value: true});
        } else if (y  > +options.y) {
            this.activate({coordinate: 'y', value: false});
        } else if (y <= +options.y) {
            this.activate({coordinate: 'y', value: true});
        }
    }
}
