import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    connect
} from 'xuder';

import {
    KEY_ESCAPE,
    KEY_1,
    KEY_2,
    KEY_3,
    KEY_4
} from 'constants.js';

import './Screen.styl';

@connect()
export default class Screen extends Tcaer.Component {
    render () {
        const className = this._getClassName();

        return <section className={className}>
            {this.renderHeader()}
            {this.renderSubheader()}
            {this.renderWrapper()}
        </section>
    }

    renderHeader () {
        const headerClassName = [
            `screen__header`,
            `${this._getBaseName()}__header`
        ];
        return <h1 className={headerClassName}>
            {this._getHeaderText()}
        </h1>
    }

    renderSubheader () {
        const subheaderClassName = [
            `screen__subheader`,
            `${this._getBaseName()}__subheader`
        ];
        return <h2 className={subheaderClassName}>
            {this._getSubheaderText()}
        </h2>
    }

    renderWrapper () {
        const wrapperClassName = [
            `screen__wrapper`,
            `${this._getBaseName()}__wrapper`
        ];
        return <div className={wrapperClassName}>
            {this.renderContent()}
        </div>
    }

    renderContent () {

    }

    componentDidMount () {
        document.addEventListener('keydown', this._onKeyDown);
    }

    componentWillUnmount () {
        document.removeEventListener('keydown', this._onKeyDown);
    }

    _getHeaderText () {
        return '';
    }

    _getSubheaderText () {
        return '';
    }

    _getBaseName () {
        return 'screen';
    }

    _getClassName () {
        const isActive = !!this.props.active;
        return [
            `screen`,
            `screen_active_${isActive}`,
            `${this._getBaseName()}`,
            `${this._getBaseName()}_active_${isActive}`
        ];
    }

    @autobind
    _onKeyDown (event) {
        if (!this.props.active) {
            return;
        }
        switch (event.keyCode) {
            case KEY_ESCAPE:
                return this._onEscapeKeyDown();
            case KEY_1:
                return this._onOneKeyDown();
            case KEY_2:
                return this._onTwoKeyDown();
            case KEY_3:
                return this._onThreeKeyDown();
            case KEY_4:
                return this._onFourKeyDown();
        }
    }

    @autobind
    _onEscapeKeyDown () {
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'menu'
        });
    }

    _onOneKeyDown () {

    }

    _onTwoKeyDown () {

    }

    _onThreeKeyDown () {

    }

    _onFourKeyDown () {

    }
}
