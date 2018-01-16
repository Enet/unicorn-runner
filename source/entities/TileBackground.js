import SpriteSheet from 'engine/SpriteSheet.js';
import getTileIndexByPosition from 'utils/getTileIndexByPosition.js';

export default class TileBackground {
    constructor (image, tiles) {
        const buffer = document.createElement('canvas');
        const sprites = new SpriteSheet(image, {
            tileW: 60,
            tileH: 60
        });
        sprites.define('ground', 0, 0, 60, 60);

        buffer.width = 840 + 60;
        buffer.height = 660;

        const context = buffer.getContext('2d');
        this._tiles = tiles;
        this._context = context;
        this._buffer = buffer;
        this._sprites = sprites;
    }

    render (context, camera) {
        const buffer = this._buffer;

        const drawWidth = getTileIndexByPosition(camera.size.width);
        const drawFrom = getTileIndexByPosition(camera.position.x);
        const drawTo = drawFrom + drawWidth;
        this._redraw(drawFrom, drawTo);
        context.drawImage(
            buffer,
            -camera.position.x % 60,
            -camera.position.y
        );
    }

    isIterable () {
        return false;
    }

    _redraw (startIndex, endIndex) {
        const buffer = this._buffer;
        const context = this._context;
        const sprites = this._sprites;
        context.clearRect(0, 0, buffer.width, buffer.height);

        for (let x = startIndex; x <= endIndex; ++x) {
            const column = this._tiles.getColumn(x);
            column && column.forEach((tile, y) => {
                sprites.drawTile('ground', context, x - startIndex, y);
            });
        }
    }
}
