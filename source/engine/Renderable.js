import {
    Vector2
} from './math.js';

export default class Renderable {
    get position () {
        return null;
    }

    get offset () {
        return new Vector2(0, 0);
    }

    get angle () {
        return 0;
    }

    get opacity () {
        return 1;
    }

    constructor () {

    }
}
