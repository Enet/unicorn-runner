import getTileIndexByPosition from 'utils/getTileIndexByPosition.js';
import {
    TILE_SIZE
} from 'constants.js';

export default function getTileRangeByBounds (tileMatrix, {top, left, bottom, right}) {
    const tiles = [];
    for (const xIndex of generateTileRange(left, right)) {
        for (const yIndex of generateTileRange(top, bottom)) {
            const tile = getTileByIndex(tileMatrix, xIndex, yIndex);
            if (!tile) {
                continue;
            }
            tiles.push(tile);
        }
    }
    return tiles;
}

function* generateTileRange (fromPosition, toPosition) {
    const maxPosition = Math.ceil(toPosition / TILE_SIZE) * TILE_SIZE;
    let position = fromPosition;
    do {
        yield getTileIndexByPosition(position);
        position += TILE_SIZE;
    } while (position < maxPosition);
}

function getTileByIndex (tileMatrix, xIndex, yIndex) {
    const tile = tileMatrix.getElement(xIndex, yIndex);
    if (!tile) {
        return;
    }
    return tile;
}
