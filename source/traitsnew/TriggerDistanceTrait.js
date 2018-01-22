import TriggerTrait from 'traitsnew/TriggerTrait.js';

export default class TriggerDistanceTrait extends TriggerTrait {
    traitWillMount ({maxActivationCount=Infinity}) {
        this._activationCount = maxActivationCount;
        this._prevValue = false;
    }

    traitWillUpdate (deltaTime) {
        const {options, level, entity} = this;
        const {player} = level;
        const distance = player.body.center.subtract(entity.body.center).length();
        const event = {distance};
        const prevValue = this._prevValue;
        if (distance < +options.distance) {
            event.value = true;
            !prevValue && this.activate(event);
        } else {
            event.value = false;
            prevValue && this.activate(event);
        }
        this._prevValue = event.value;
    }
}
