import Unicorn from 'entities/Unicorn.js';
import Picker from 'traits/Picker.js';
import Run from 'traits/Run.js';
import Jump from 'traits/Jump.js';
import Fly from 'traits/Fly.js';

export default class Player extends Unicorn {
    _getFrame () {
        if (this.killable.isDead()) {
            return super._getFrame('death');
        } else if (this.jump.isJumping()) {
            return 'jump';
        } else if (this.run.getDistance() > 0) {
            this._lifeTime = this.run.getDistance();
            return super._getFrame('default');
        } else {
            return 'idle';
        }
    }

    _createTraits () {
        return [
            ...super._createTraits(...arguments),
            new Run(),
            new Jump(),
            new Fly(),
            new Picker({
                onPick: this._onPick.bind(this)
            })
        ];
    }

    _onPick (entity) {
        if (!entity.score) {
            return;
        }
        this.level.changeScore(entity.score.getNominal());
    }

    _onHealthChange (health) {
        return this.level.setHealth(health);
    }

    _onKill () {
        return this.level.loseGame();
    }
}
