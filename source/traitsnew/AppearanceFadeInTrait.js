import AppearanceFadeOutTrait from 'traitsnew/AppearanceFadeOutTrait.js';

export default class AppearanceFadeInTrait extends AppearanceFadeOutTrait {
    getName () {
        return 'fadeIn';
    }

    traitWillMount () {
        super.traitWillMount(...arguments);
        this._startValue = 0;
        this._endValue = 1;
    }

    _processOpacity (opacity) {
        return this._endValue - opacity;
    }

    _isEnded (opacity) {
        return opacity > this._endValue;
    }
}
