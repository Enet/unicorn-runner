import Tcaer from 'tcaer';

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
                    className="menu__entity"
                    key={entityName}>
                    {entityName}
                </div>
            })}
        </div>
    }

    _onClick (entityName) {
        this.props.onSelect && this.props.onSelect(entityName);
    }
}
