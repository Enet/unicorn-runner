import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';

import {
    entities
} from 'resources.js';

import './Menu.styl';

const hiddenEntityNames = [
    'CoinEntity',
    'RopeEntity',
    'DropEntity',
    'DustCloudEntity',
    'EffectEntity',
    'Entity',
    'GasCloudEntity',
    'HealthScaleEntity',
    'MushroomEntity',
    'StaticEntity',
    'UnicornEntity'
];
const entityNames = ['Cursor', 'Tile'].concat(Object.keys(entities).filter((entityName) => {
    return hiddenEntityNames.indexOf(entityName) === -1;
}));

export default class Menu extends Tcaer.Component {
    render () {
        const className = [
            `menu`
        ];

        return <div className={className}>
            {entityNames.map((entityName) => {
                return <div
                    onClick={this._onClick.bind(this, entityName)}
                    className={`menu__entity menu__entity_selected_${entityName === this.props.selected}`}
                    key={entityName}>
                    {entityName.replace(/Entity$/, '')}
                </div>
            })}
        </div>
    }

    componentDidMount () {
        this._prevSelected = this.props.selected;
        document.addEventListener('keydown', this._onDocumentKeyDown);
    }

    componentWillUnmount () {
        document.removeEventListener('keydown', this._onDocumentKeyDown);
    }

    _onClick (entityName) {
        this._prevSelected = this.props.selected;
        this.props.onSelect && this.props.onSelect(entityName.replace(/Entity$/, ''));
    }

    @autobind
    _onDocumentKeyDown (event) {
        if (event.keyCode === 84) {
            this._prevSelected = this.props.selected;
            this._onClick('Tile');
        } else if (event.keyCode === 67) {
            this._prevSelected = this.props.selected;
            this._onClick('Cursor');
        } else if (event.keyCode === 90) {
            const {selected} = this.props;
            this._onClick(this._prevSelected);
            this._prevSelected = selected;
        }
    }
}
