import {
    Vector2
} from './math.js';

export default class Renderable {
    get index () {
        return 0;
    }

    get position () {
        return null;
    }

    get offset () {
        return new Vector2(0, 0);
    }

    get scale () {
        return new Vector2(1, 1);
    }

    get angle () {
        return 0;
    }

    get opacity () {
        return 1;
    }

    get mode () {
        return 'source-over';
    }

    constructor () {

    }
}
