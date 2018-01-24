import Sprite from 'engine/Sprite.js';

import Background from 'backgrounds/Background.js';
import getTileIndexByDistance from 'utils/getTileIndexByDistance.js';
import {
    TILE_SIZE,
    INDEX_TILE_BACKGROUND
} from 'constants.js';

const THOUSAND_TILE_SIZE = 1000 * TILE_SIZE;

export default class TileBackground extends Background {
    get index () {
        return INDEX_TILE_BACKGROUND;
    }

    constructor (options) {
        super(options);
        const {images, manager} = this;
        this.tiles = options.tiles;
        this.sprite = new Sprite(images.tile, manager.getSprite('Tile'));
    }

    render (context, camera) {
        const indexWidth = getTileIndexByDistance(camera.size.width) + 1;
        const startIndex = getTileIndexByDistance(camera.position.x);
        const endIndex = startIndex + indexWidth;
        const {tiles} = this;
        const imageUp = this.sprite.frames.get('tile-up');
        const imageCenter = this.sprite.frames.get('tile-center');
        const tx = (camera.position.x + THOUSAND_TILE_SIZE) % TILE_SIZE;
        const ty = camera.position.y;

        context.save();
        context.translate(-tx, -ty);

        for (let xIndex = startIndex; xIndex <= endIndex; ++xIndex) {
            const column = tiles.getColumn(xIndex);
            column && column.forEach((tile, yIndex) => {
                const x = (xIndex - startIndex) * TILE_SIZE;
                const y = yIndex * TILE_SIZE;
                const image = tiles.getElement(xIndex, yIndex - 1) ? imageCenter : imageUp;
                context.drawImage(image, x, y);
            });
        }

        context.translate(tx, ty);
        context.restore();
    }

    _getImageNames () {
        return {
            tile: 'Tile'
        };
    }
}
