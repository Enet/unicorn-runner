import Trait from 'traitsnew/Trait.js';

export default class TriggerTrait extends Trait {
    activate () {
        if (!this._activationCount) {
            return;
        }
        this._activationCount--;
        const {options} = this;
        const {onActivate} = options;
        onActivate && onActivate(...arguments);
    }

    getName () {
        return 'trigger';
    }

    traitWillMount ({maxActivationCount=1}) {
        this._activationCount = maxActivationCount;
    }
}
