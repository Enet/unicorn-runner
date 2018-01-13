import Camera from './Camera.js';

export default class Scene {
    get camera () {
        return this._camera;
    }

    set camera (camera) {
        if (!this._storage.has(camera)) {
            throw 'Camera must be added to scene!';
        }
        this._camera = camera;
    }

    constructor () {
        this._camera = null;
        this._storage = new Set();
    }

    add (object) {
        this._storage.add(object);
        if (object instanceof Camera) {
            this._camera = object;
        }
    }

    remove (object) {
        this._storage.delete(object);
        if (object === this._camera) {
            this._camera = null;
        }
        return object;
    }

    clear () {
        this._camera = null;
        this._storage.clear();
    }

    forEach (iterator, force) {
        this._storage.forEach((renderable, r) => {
            if (!force && renderable.isIterable && !renderable.isIterable()) {
                return;
            }
            iterator(renderable, r);
        });
    }
}
