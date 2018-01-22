import AppearanceTrait from 'traitsnew/AppearanceTrait.js';

const DEFAULT_DURATION = 500;
const ZERO_GETTER = () => 0;
const ONE_GETTER = () => 1;

const getterMap = [ZERO_GETTER, ONE_GETTER];

export default class AppearanceFadeOutTrait extends AppearanceTrait {
    start (duration=DEFAULT_DURATION) {
        this._duration = +duration;
        this._startTime = this._lifeTime;
        this._defineProperty(this._getOpacity);

        const {options} = this;
        const {onStart} = options;
        onStart();
    }

    stop () {
        this._reset();
        this._defineProperty(getterMap[this._startValue]);

        const {options} = this;
        const {onCancel} = options;
        onCancel();
    }

    getName () {
        return 'fadeOut';
    }

    traitWillMount () {
        this._resetOptions();
        this._startValue = 1;
        this._endValue = 0;
    }

    _defineProperty (get) {
        Object.defineProperty('opacity', this.entity, {
            configurable: true,
            get
        });
    }

    _resetOptions () {
        this._duration = null;
        this._startTime = null;
    }

    _processOpacity (opacity) {
        return opacity;
    }

    _isEnded (opacity) {
        return opacity < this._endValue;
    }

    _getOpacity () {
        const elapsedTime = this._lifeTime - this._startTime;
        const opacity = this._processOpacity(elapsedTime / this._duration);
        if (this._isEnded(opacity)) {
            this._defineProperty(getterMap[this._endValue]);
            const {options} = this;
            const {onEnd} = options;
            onEnd();
            return this._endValue;
        } else {
            return opacity;
        }
    }
}
