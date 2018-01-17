import {
    Matrix
} from 'engine/math.js';

export default function generateTileMatrix (tiles, patterns = [], iterator) {
    const matrix = new Matrix();
    for (const {xIndex, yIndex} of unzipTiles(tiles, patterns, 0, 0)) {
        matrix.setElement(xIndex, yIndex, iterator(xIndex, yIndex));
    }
    return matrix;
}

function* unzipTiles (tiles, patterns, xOffset, yOffset) {
    for (const tile of tiles) {
        for (let {xIndex, yIndex} of unzipRanges(tile.ranges)) {
            xIndex += xOffset;
            yIndex += yOffset;

            if (tile.pattern) {
                const tiles = patterns[tile.pattern].tiles;
                yield* unzipTiles(tiles, patterns, xIndex, yIndex);
            } else {
                yield {xIndex, yIndex};
            }
        }
    }
}

function* unzipRanges (ranges) {
    for (const range of ranges) {
        const [xFrom, xTo, yFrom, yTo] = range;
        for (let xIndex = xFrom; xIndex < xTo; ++xIndex) {
            for (let yIndex = yFrom; yIndex < yTo; ++yIndex) {
                yield {xIndex, yIndex};
            }
        }
    }
}
