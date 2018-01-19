import Sprite from 'engine/Sprite.js';
import Background from 'backgrounds/Background.js';

import getTileIndexByDistance from 'utils/getTileIndexByDistance.js';
import spriteDescription from 'sprites/Tile.js';
import {
    TILE_SIZE
} from 'constants.js';

export default class Tile extends Background {
    constructor (options) {
        super(options);

        const sprite = new Sprite(this.images.tile, spriteDescription);

        this.tiles = options.tiles;
        this.sprite = sprite;
    }

    render (context, camera) {
        const indexWidth = getTileIndexByDistance(camera.size.width);
        const startIndex = getTileIndexByDistance(camera.position.x);
        const endIndex = startIndex + indexWidth;
        const {tiles, sprite} = this;
        const tx = camera.position.x % 60;
        const ty = camera.position.y;

        context.save();
        context.translate(-tx, -ty);

        for (let x = startIndex; x <= endIndex; ++x) {
            const column = tiles.getColumn(x);
            column && column.forEach((tile, y) => {
                sprite.render('ground', context, (x - startIndex) * TILE_SIZE, y * TILE_SIZE);
            });
        }

        context.translate(tx, ty);
        context.restore();
    }
}

Tile.images = {
    tile: 'Tile'
};
