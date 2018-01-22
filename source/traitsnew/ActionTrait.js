import Trait from 'traitsnew/Trait.js';

export default class ActionTrait extends Trait {
    start () {
        if (!this._isStopped) {
            return;
        }
        this._isStopped = false;
        this._onStart(...arguments);
    }

    stop () {
        if (this._isStopped) {
            return;
        }
        this._isStopped = true;
        this._onStop(...arguments);
    }

    isStopped () {
        return this._isStopped;
    }

    traitWillMount () {
        this._isStopped = true;
    }

    _onStart () {
        const {options} = this;
        const {onStart} = options;
        onStart && onStart(...arguments);
    }

    _onStop () {
        const {options} = this;
        const {onStop} = options;
        onStop && onStop(...arguments);
    }
}
