import EffectEntity from 'entities/EffectEntity.js';

export default class RainbowEntity extends EffectEntity {
    _getImageName () {
        return 'Rainbow';
    }

    _getEffectName () {
        return 'fly';
    }
}
