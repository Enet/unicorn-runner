import {
    Vector2
} from 'engine/math.js';
import {
    TILE_SIZE
} from 'game/constants.js';

const HALF_TILE_SIZE = TILE_SIZE * 0.5;

export default class TileMock {
    get angle () {
        return 0;
    }

    render (context, camera, color) {
        context.beginPath();
        context.fillStyle = color;
        context.fillRect(-HALF_TILE_SIZE, -HALF_TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    constructor () {
        this.size = new Vector2(TILE_SIZE, TILE_SIZE);
        this.name = 'TileEntity';
        this.settings = {};
    }
}
