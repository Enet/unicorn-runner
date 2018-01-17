import {
    Vector2
} from 'engine/math.js';
import Trait from 'traits/Trait.js';
import Pickable from 'traits/Pickable.js';

export default class RainbowBehaviour extends Trait {
    getName () {
        return 'behaviour';
    }

    traitDidMount () {
        const pickable = new Pickable(this._onPick.bind(this));
        this.entity.addTrait(pickable);
    }

    _onPick () {
        const {entity} = this;
        entity.body.move(new Vector2(3, -3));
        entity.body.collidable = false;
    }
}
