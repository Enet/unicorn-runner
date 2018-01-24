import MotionTrait from 'traits/MotionTrait.js';

const DEFAULT_SPEED = 0.2;

export default class MotionRocketTrait extends MotionTrait {
    move () {
        const {entity, level} = this;
        const {player} = level;
        const line = player.body.center
            .subtract(entity.body.center)
            .normalize()
            .length(this._speed);

        entity.body.move(line);
    }

    traitWillMount ({speed=DEFAULT_SPEED}) {
        super.traitWillMount(...arguments);
        this._isStopped = true;
        this._speed = +speed;
    }
}
