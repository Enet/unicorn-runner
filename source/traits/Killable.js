import Trait from 'Trait.js';

export default class Killable extends Trait {
    getName () {
        return 'killable';
    }

    onInit () {
        this.dead = false;
        this.deadTime = 0;
        this.removeAfter = .3;
    }

    kill () {
        this.enqueueTask(() => this.dead = true);
    }

    revive () {
        this.dead = false;
        this.deadTime = 0;
    }

    onUpdate (entity, deltaTime, level) {
        if (this.dead) {
            this.deadTime += deltaTime;
            if (this.deadTime > this.removeAfter) {
                this.enqueueTask(() => {
                    level.gameOver();
                });
            }
        }
    }
}

