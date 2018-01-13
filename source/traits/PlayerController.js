import Trait from 'Trait.js';
import {
    Vec2
} from 'engine/math.js';

export default class PlayerController extends Trait {
    getName () {
        return 'playerController';
    }

    onInit (onChange) {
        this.checkpoint = new Vec2(0, 0);
        this.player = null;
        this.score = 0;
        this.onChange = onChange;
    }

    onMount (entity) {
        this.player = entity;
        this.player.picker.onPick = () => {
            this.score += 50;

            setTimeout(() => {
                this.onChange(this.score);
            }, 0);
        }
    }

    onUpdate (entity, deltaTime, level) {
        if (level.isGameOver ||
            this.player.position.y > 1200 ||
            this.player.position.x > 11400) {
            this.player.killable.revive();
            this.player.position.set(this.checkpoint.x, this.checkpoint.y);
            level.isGameOver = false;
        }
    }
}
