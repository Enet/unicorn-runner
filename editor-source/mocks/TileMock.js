import {
    Vector2
} from 'engine/math.js';
import {
    TILE_SIZE
} from 'constants.js';

const HALF_TILE_SIZE = TILE_SIZE * 0.5;
const TILE_COLOR = 'orange';

export default class TileMock {
    get angle () {
        return 0;
    }

    render (context) {
        context.beginPath();
        context.fillStyle = TILE_COLOR;
        context.fillRect(-HALF_TILE_SIZE, -HALF_TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    constructor () {
        this.size = new Vector2(TILE_SIZE, TILE_SIZE);
        this.name = 'Tile';
        this.settings = {};
    }
}
