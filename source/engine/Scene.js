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
    }

    add (object) {
        if (object instanceof Camera) {
            this._cameras.add(object);
            if (!this._camera) {
                this._camera = object;
            }
        } else if (object instanceof Renderable) {
            this._renderables.add(object);
        } else {
            throw 'Only camera or renderable object can be added to the scene!';
        }
    }

    remove (object) {
        this._renderables.delete(object);
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
    }

    forEach () {
        return this._renderables.forEach(...arguments);
    }
}
