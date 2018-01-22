import AppearanceTrait from 'traitsnew/AppearanceTrait.js';

export default class AppearanceAngleTrait extends AppearanceTrait {
    start () {
        this.entity.body.getDeltaAngle = this._getDeltaAngle;
    }

    stop () {
        delete this.entity.body.getDeltaAngle;
    }

    getName () {
        return 'angle';
    }

    traitWillMount ({maxAngle, attenuationFactor=0.001}) {
        this._maxAngle = +maxAngle;
        this._attenuationFactor = +attenuationFactor;
    }

    traitDidMount () {
        this.start();
    }

    _getDeltaAngle (deltaAngle, angle) {
        deltaAngle = deltaAngle * (1 - Math.abs(angle) / this._maxAngle);
        deltaAngle -= this._attenuationFactor * Math.abs(angle) * Math.sign(angle);
        return deltaAngle;
    }
}
