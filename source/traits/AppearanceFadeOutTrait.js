import AppearanceTrait from 'traits/AppearanceTrait.js';

const DEFAULT_DURATION = 500;

export default class AppearanceFadeOutTrait extends AppearanceTrait {
    start (duration=DEFAULT_DURATION) {
        if (this._startTime) {
            return;
        }
        this._duration = +duration;
        this._startTime = this._lifeTime;
        this._startValue = this.entity.opacity;
        this._defineProperty(this._getOpacity.bind(this));

        const {options} = this;
        const {onStart} = options;
        onStart && onStart();
    }

    stop () {
        if (!this._startTime) {
            return;
        }
        const opacity = this.entity.opacity;
        this._resetOptions();
        this._defineProperty(() => opacity);

        const {options} = this;
        const {onStop} = options;
        onStop && onStop();
    }

    getName () {
        return 'fadeOut';
    }

    traitWillMount () {
        this._resetOptions();
        this._endValue = 0;
    }

    _defineProperty (get) {
        Object.defineProperty(this.entity, 'opacity', {
            configurable: true,
            get
        });
    }

    _resetOptions () {
        this._duration = null;
        this._startTime = null;
        this._startValue = null;
    }

    _processOpacity (opacity) {
        return this._startValue - opacity;
    }

    _isEnded (opacity) {
        return opacity < this._endValue;
    }

    _getOpacity () {
        const elapsedTime = this._lifeTime - this._startTime;
        const opacity = this._processOpacity(elapsedTime / this._duration);
        if (this._isEnded(opacity)) {
            this._defineProperty(() => this._endValue);
            const {options} = this;
            const {onEnd} = options;
            onEnd && onEnd();
            return this._endValue;
        } else {
            return opacity;
        }
    }
}
