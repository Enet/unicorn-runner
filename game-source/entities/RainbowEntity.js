import EffectEntity from 'entities/EffectEntity.js';

export default class RainbowEntity extends EffectEntity {
    get angle () {
        return 0;
    }

    _getImageName () {
        return 'Rainbow';
    }

    _getEffectName () {
        return 'fly';
    }

    _getDuration () {
        return super._getDuration() * 1.5;
    }
}
