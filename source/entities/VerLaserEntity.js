import HorLaserEntity from 'entities/HorLaserEntity.js';

const HALF_PI = Math.PI * 0.5;

export default class VerLaserEntity extends HorLaserEntity {
    get angle () {
        return super.angle + HALF_PI;
    }

    _getCoordinateName () {
        return 'x';
    }
}
