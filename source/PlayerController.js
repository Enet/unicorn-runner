import Trait from 'Trait.js';
import {
    Vec2
} from 'math.js';

const SCORE_ID = 'score';
const scoreNode = document.getElementById(SCORE_ID);

export default class PlayerController extends Trait {
    constructor () {
        super('playerController');
        this.checkpoint = new Vec2(0, 0);
        this.player = null;
        this.score = 0;
        this.scoreSelector = scoreNode;
    }

    setPlayer (entity) {
        this.player = entity;

        this.player.picker.onPick = () => {
            this.score += 50;

            setTimeout(() => {
                this.scoreSelector.innerHTML = this.score;
            }, 0);
        }
    }

    update (entity, deltaTime, level) {
        if (!level.entities.has(this.player)
           || this.player.position.y > 1200
           || this.player.position.x > 11400) {
            this.player.killable.revive();
            this.player.position.set(this.checkpoint.x, this.checkpoint.y);
            level.entities.add(this.player);
        }
    }
}
