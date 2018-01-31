import Tcaer from 'tcaer';
import Button from 'components/Button/Button.jsx';

import './Locale.styl';

export default class Locale extends Tcaer.Component {
    render () {
        const className = [
            `locale`,
            `locale_${this.props.value}`
        ];
        return <div className={className}>
            <div className="locale__circle" />
            <Button
                className="locale__button"
                onClick={this._onLocaleClick.bind(this, 'ru')}>
                RU
            </Button>
            <span className="locale__space" />
            <Button
                className="locale__button"
                onClick={this._onLocaleClick.bind(this, 'en')}>
                EN
            </Button>
        </div>
    }

    _onLocaleClick (locale) {
        this.props.onChange && this.props.onChange(locale);
    }
}
