import Trait from 'traits/Trait.js';
import {
    Vec2
} from 'engine/math.js';

import {
    TILE_SIZE
} from 'constants.js';

export default class Controller extends Trait {
    getName () {
        return 'controller';
    }

    onInit (onChange) {
        this.start = new Vec2(TILE_SIZE, TILE_SIZE);
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
        if (!level.isGameOver()) {
            return;
        }
        level.restartGame();
    }
}
