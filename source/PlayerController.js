import {
    Trait
} from 'Entity.js';
import {
    Vec2
} from 'math.js';

const SCORE_ID = 'score';
const scoreNode = document.getElementById(SCORE_ID);

export default class PlayerController extends Trait {
    constructor() {
        super('playerController');
        this.checkpoint = new Vec2(0, 0);
        this.player = null;
        this.score = 0;
        this.scoreSelector = scoreNode;
    }

    setPlayer(entity) {
        this.player = entity;

        this.player.picker.onPick = () => {
            this.score += 50;

            setTimeout(() => {
                this.scoreSelector.innerHTML = this.score;
            }, 0);
        }
    }

    update(entity, deltaTime, level) {
        if (!level.entities.has(this.player)
           || this.player.pos.y > 1200
           || this.player.pos.x > 11400) {
            this.player.killable.revive();
            this.player.pos.set(this.checkpoint.x, this.checkpoint.y);
            level.entities.add(this.player);
        }
    }
}
