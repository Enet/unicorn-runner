import {
    Matrix
} from 'engine/math.js';

export default function stringifyTileMatrix (matrix) {
    matrix = new Matrix(matrix);
    const {width, height} = matrix.getSize();
    const ranges = [];
    for (let yIndex = 0; yIndex < height; yIndex++) {
        for (let xIndex = 0; xIndex < width; xIndex++) {
            findPath(matrix, ranges, xIndex, yIndex);
        }
    }
    return ranges;
}

let uniquePathId = 0;

function findPath (matrix, ranges, xIndex, yIndex, path) {
    const tile = matrix.getElement(xIndex, yIndex);
    if (!tile || tile.path) {
        return;
    }

    path = path || {
        id: ++uniquePathId,
        xIndex,
        yIndex
    };
    tile.path = path;

    const width = xIndex - path.xFrom + 1;
    const height = yIndex - path.yFrom + 1;
    let dx = 0;
    let dy = 0;

    for (let h = 0; h < height; h++) {
        const nextTile = matrix.getElement(xIndex + 1, path.yFrom + h);
        if (!nextTile || nextTile.path) {
            dx--;
            break;
        }
    }
    dx++;

    for (let w = 0; w < width + dx; w++) {
        const nextTile = matrix.getElement(path.xFrom + w, yIndex + 1);
        if (!nextTile || nextTile.path) {
            dy--;
            break;
        }
    }
    dy++;

    if (dx || dy) {
        findPath(matrix, ranges, xIndex + dx, yIndex + dy, path);
    } else {
        ranges.push([path.xIndex, xIndex + 1, path.yIndex, yIndex + 1]);
    }
}
