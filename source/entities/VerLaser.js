import HorLaser from 'entities/HorLaser.js';

import Laser from 'traits/Laser.js';

export default class VerLaser extends HorLaser {
    get angle () {
        return super.angle + Math.PI / 2;
    }

    _createTraits () {
        return [
            new Laser('x')
        ];
    }
}
