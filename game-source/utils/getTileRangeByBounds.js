import getTileIndexByDistance from 'utils/getTileIndexByDistance.js';
import {
    TILE_SIZE
} from 'constants.js';

export default function getTileRangeByBounds (tileMatrix, {min, max}) {
    const tiles = [];
    for (const xIndex of generateTileRange(min.x, max.x)) {
        for (const yIndex of generateTileRange(min.y, max.y)) {
            const tile = getTileByIndex(tileMatrix, xIndex, yIndex);
            if (!tile) {
                continue;
            }
            tiles.push(tile);
        }
    }
    return tiles;
}

function* generateTileRange (from, to) {
    const maxDistance = Math.ceil(to / TILE_SIZE) * TILE_SIZE;
    let distance = from;
    do {
        yield getTileIndexByDistance(distance);
        distance += TILE_SIZE;
    } while (distance < maxDistance);
}

function getTileByIndex (tileMatrix, xIndex, yIndex) {
    const tile = tileMatrix.getElement(xIndex, yIndex);
    if (!tile) {
        return;
    }
    return tile;
}
