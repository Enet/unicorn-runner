import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    entities
} from 'game/resources.js';
import {
    KEY_T,
    KEY_C,
    KEY_Z
} from 'game/constants.js';

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
const entityNames = []
    .concat('CursorEntity', 'TileEntity')
    .concat(Object.keys(entities))
    .filter((entityName) => {
        return hiddenEntityNames.indexOf(entityName) === -1;
    });

export default class Menu extends Tcaer.Component {
    render () {
        const className = [
            `menu`
        ];

        return <div className={className}>
            {entityNames.map((entityName) => {
                const isSelected = entityName === this.props.selectedEntityName;
                return <div
                    onClick={this._onClick.bind(this, entityName)}
                    className={`menu__entity menu__entity_selected_${isSelected}`}
                    key={entityName}>
                    {entityName === 'CursorEntity' || entityName === 'TileEntity' ? '' : '+ '}
                    {entityName.replace(/Entity$/, '')}
                </div>
            })}
        </div>
    }

    componentDidMount () {
        this._prevSelectedEntityName = this.props.selectedEntityName;
        document.addEventListener('keydown', this._onDocumentKeyDown);
    }

    componentWillUnmount () {
        document.removeEventListener('keydown', this._onDocumentKeyDown);
    }

    _onClick (entityName) {
        this._prevSelectedEntityName = this.props.selectedEntityName;
        this.props.onSelect && this.props.onSelect(entityName);
    }

    @autobind
    _onDocumentKeyDown (event) {
        const {keyCode} = event;
        const {selectedEntityName} = this.props;
        switch (keyCode) {
            case KEY_T:
                this._prevSelectedEntityName = selectedEntityName;
                this._onClick('TileEntity');
                break;
            case KEY_C:
                this._prevSelectedEntityName = selectedEntityName;
                this._onClick('CursorEntity');
                break;
            case KEY_Z:
                this._onClick(this._prevSelectedEntityName);
                this._prevSelectedEntityName = selectedEntityName;
                break;
        }
    }
}
