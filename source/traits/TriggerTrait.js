import Trait from 'traits/Trait.js';

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

    setActivationCount (activationCount) {
        this._activationCount = +activationCount || 0;
    }

    getActivationCound () {
        return this._activationCount;
    }

    getName () {
        return 'trigger';
    }

    traitWillMount ({maxActivationCount=1}) {
        this._activationCount = maxActivationCount;
    }
}
