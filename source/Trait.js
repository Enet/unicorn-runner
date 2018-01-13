export default class Trait {
    constructor () {
        this._tasks = [];
        this.onInit(...arguments);
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
        this._tasks.splice(index, 1);
    }

    clearQueue () {
        this._tasks = [];
    }

    executeQueue () {
        this._tasks.forEach((task) => task());
        this.clearQueue();
    }

    onInit () {

    }

    onMount (selfEntity) {

    }

    onUpdate () {

    }

    onCollision (selfEntity, externalEntity) {

    }

    onObstacle () {

    }

}
