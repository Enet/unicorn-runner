export default class Trait {
    constructor (options={}) {
        this.options = options;
        this._lifeTime = 0;
        this.traitWillMount(options);
    }

    update (deltaTime) {
        this._lifeTime += deltaTime;
    }

    getName () {
        return '';
    }

    traitWillMount () {

    }

    traitDidMount () {

    }

    traitWillUpdate (deltaTime) {

    }

    traitDidUpdate () {

    }

    traitCollision (body) {

    }

    traitWillUnmount () {

    }
}
