import Trait from 'traitsnew/Trait.js';

export default class ControllerTrait extends Trait {
    setState (deltaState) {
        Object.assign(this._state, deltaState);
        const {up, down, left, right} = this._state;
        const {player} = this.level;

        if (player.fly.isStopped()) {
            left && player.run.left();
            right && player.run.right();

            if (down) {
                player.fight.start();
            } else {
                player.fight.stop();
            }

            if (up) {
                player.jump.start();
            } else {
                player.jump.stop();
            }
        } else {
            const x = +right - left;
            const y = +down - up;
            player.fly.setGravityDirection(x, y);
        }
    }

    traitWillMount () {
        this._state = {
            up: false,
            down: false,
            left: false,
            right: false
        };
    }

    traitDidMount () {
        const {entity} = this;
        if (!entity.run || !entity.jump || !entity.fight || !entity.fly) {
            throw 'Controller does not support this character!';
        }
    }
}
