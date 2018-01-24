import TriggerTrait from 'traits/TriggerTrait.js';

export default class TriggerBoundTrait extends TriggerTrait {
    traitWillUpdate (deltaTime) {
        const {options, level} = this;
        const {player} = level;
        const {x, y} = player.body.center;
        if (x > +options.x) {
            this.activate({axis: 'x', value: true});
        } else if (x <= +options.x) {
            this.activate({axis: 'x', value: false});
        } else if (y  > +options.y) {
            this.activate({axis: 'y', value: true});
        } else if (y <= +options.y) {
            this.activate({axis: 'y', value: false});
        }
    }
}
