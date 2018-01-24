import BodyTrait from 'traits/BodyTrait.js';

export default class BodyAngleLimitTrait extends BodyTrait {
    start () {
        this.entity.body.getDeltaAngle = this._getDeltaAngle.bind(this);
    }

    stop () {
        delete this.entity.body.getDeltaAngle;
    }

    getName () {
        return 'angleLimit';
    }

    traitWillMount ({maxAngle=Math.PI, attenuationFactor=0.001}) {
        this._maxAngle = +maxAngle;
        this._attenuationFactor = +attenuationFactor;
    }

    _getDeltaAngle (deltaAngle, angle) {
        deltaAngle = deltaAngle * (1 - Math.abs(angle) / this._maxAngle);
        deltaAngle -= this._attenuationFactor * Math.abs(angle) * Math.sign(angle);
        return deltaAngle;
    }
}
