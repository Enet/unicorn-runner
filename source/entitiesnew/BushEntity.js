import StaticEntity from 'entitiesnew/StaticEntity.js';
import {
    INDEX_RENDERABLE
} from 'constants.js';

export default class BushEntity extends StaticEntity {
    get index () {
        return INDEX_RENDERABLE + 10;
    }

    _getImageName () {
        return 'Bush';
    }
}
