import EffectEntity from 'entities/EffectEntity.js';

export default class SlowMotionEntity extends EffectEntity {
    _getImageName () {
        return 'SlowMotion';
    }

    _getEffectName () {
        return 'slow';
    }
}
