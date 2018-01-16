import {
    Matrix
} from 'engine/math.js';

export default function generateTileMatrix (tiles, patterns = [], iterator) {
    const matrix = new Matrix();
    for (const {x, y} of unzipTiles(tiles, patterns, 0, 0)) {
        matrix.setElement(x, y, iterator(x, y));
    }
    return matrix;
}

function* unzipTiles (tiles, patterns, xOffset, yOffset) {
    for (const tile of tiles) {
        for (let {x, y} of unzipRanges(tile.ranges)) {
            x += xOffset;
            y += yOffset;

            if (tile.pattern) {
                const tiles = patterns[tile.pattern].tiles;
                yield* unzipTiles(tiles, patterns, x, y);
            } else {
                yield {x, y};
            }
        }
    }
}

function* unzipRanges (ranges) {
    for (const range of ranges) {
        const [xFrom, xTo, yFrom, yTo] = range;
        for (let x = xFrom; x < xTo; ++x) {
            for (let y = yFrom; y < yTo; ++y) {
                yield {x, y};
            }
        }
    }
}
