import Tcaer from 'tcaer';

import './Locale.styl';

export default class Locale extends Tcaer.Component {
    render () {
        const className = [
            `locale`,
            `locale_${this.props.value}`
        ];
        return <div className={className}>
            <span onClick={this._onLocaleClick.bind(this, 'ru')}>RU</span>
            <span onClick={this._onLocaleClick.bind(this, 'en')}>EN</span>
        </div>
    }

    _onLocaleClick (locale) {
        this.props.onChange && this.props.onChange(locale);
    }
}
