import AppearanceFadeOutTrait from 'traits/AppearanceFadeOutTrait.js';

export default class AppearanceFadeInTrait extends AppearanceFadeOutTrait {
    getName () {
        return 'fadeIn';
    }

    traitWillMount () {
        super.traitWillMount(...arguments);
        this._startValue = 0;
        this._endValue = 1;
    }

    traitDidMount () {
        let {autoStart} = this.options;
        if (autoStart === undefined) {
            autoStart = true;
        }
        autoStart && this.start();
    }

    _processOpacity (opacity) {
        return opacity;
    }

    _isEnded (opacity) {
        return opacity > this._endValue;
    }
}
