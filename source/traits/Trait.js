export default class Trait {
    constructor () {
        this._tasks = [];
        this.traitWillMount(...arguments);
    }

    getName () {
        return '';
    }

    enqueueTask (task) {
        this._tasks.push(task);
    }

    dequeueTask (task) {
        const index = this._tasks.indexOf(task);
        if (index === -1) {
            return;
        }
        task.call(this);
        this._tasks.splice(index, 1);
    }

    clearQueue () {
        this._tasks = [];
    }

    executeQueue () {
        this._tasks.forEach((task) => task.call(this));
        this.clearQueue();
    }

    traitWillMount () {

    }

    traitDidMount () {

    }

    traitWillUpdate (deltaTime, level) {

    }

    traitDidUpdate () {

    }

    traitCollision (body) {

    }

    traitWillUnmount () {

    }
}
