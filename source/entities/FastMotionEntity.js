import EffectEntity from 'entities/EffectEntity.js';

export default class FastMotionEntity extends EffectEntity {
    _getImageName () {
        return 'FastMotion';
    }

    _getEffectName () {
        return 'fast';
    }

    _getDuration () {
        return super._getDuration() * 2;
    }
}
