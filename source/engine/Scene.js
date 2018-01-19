import Camera from './Camera.js';
import Renderable from './Renderable.js';

export default class Scene {
    get camera () {
        return this._camera;
    }

    set camera (camera) {
        if (!this._cameras.has(camera)) {
            throw 'Camera must be added to the scene!';
        }
        this._camera = camera;
    }

    constructor () {
        this._cameras = new Set();
        this._renderables = new Set();
        this._sorted = null;
    }

    add (object) {
        if (object instanceof Camera) {
            this._cameras.add(object);
            if (!this._camera) {
                this._camera = object;
            }
        } else if (object instanceof Renderable) {
            this._renderables.add(object);
            this._sorted = null;
        } else {
            throw 'Only camera or renderable object can be added to the scene!';
        }
    }

    remove (object) {
        if (this._renderables.delete(object)) {
            this._sorted = null;
        }
        this._cameras.delete(object);
        if (object === this._camera) {
            this._camera = null;
        }
        return object;
    }

    clear () {
        this._camera = null;
        this._cameras.clear();
        this._renderables.clear();
        this._sorted = null;
    }

    forEach () {
        if (!this._sorted) {
            this._sorted = Array.from(this._renderables.values());
            this._sorted.sort(this._sortByIndex);
        }
        return this._sorted.forEach(...arguments);
    }

    _sortByIndex (renderable1, renderable2) {
        return renderable1.index - renderable2.index;
    }
}
