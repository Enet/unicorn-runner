export default function stringifyTileMatrix (matrix) {
    const {width, height} = matrix.getSize();
    const ranges = [];
    for (let yIndex = 0; yIndex < height; yIndex++) {
        for (let xIndex = 0; xIndex < width; xIndex++) {
            findPath(matrix, ranges, xIndex, yIndex);
        }
    }
    for (let yIndex = 0; yIndex < height; yIndex++) {
        for (let xIndex = 0; xIndex < width; xIndex++) {
            const tile = matrix.getElement(xIndex, yIndex);
            if (tile) {
                tile.path = null;
            }
        }
    }
    return ranges;
}

let uniquePathId = 0;

function findPath (matrix, ranges, xIndex, yIndex, path) {
    const tile = matrix.getElement(xIndex, yIndex);
    if (!tile || (tile.path && tile.path.id !== (path || {}).id)) {
        return;
    }

    path = path || {
        id: ++uniquePathId,
        xIndex,
        yIndex
    };
    tile.path = path;

    const width = xIndex - path.xIndex + 1;
    const height = yIndex - path.yIndex + 1;
    let dx = 0;
    let dy = 0;

    for (let h = 0; h < height; h++) {
        const nextTile = matrix.getElement(xIndex + 1, path.yIndex + h);
        if (!nextTile || nextTile.path) {
            for (let i = 0; i < h; i++) {
                matrix.getElement(xIndex + 1, path.yIndex + i).path = null;
            }
            dx--;
            break;
        } else {
            nextTile.path = path;
        }
    }
    dx++;

    for (let w = 0; w < width + dx; w++) {
        const nextTile = matrix.getElement(path.xIndex + w, yIndex + 1);
        if (!nextTile || nextTile.path) {
            for (let i = 0; i < w; i++) {
                matrix.getElement(path.xIndex + i, yIndex + 1).path = null;
            }
            dy--;
            break;
        } else {
            nextTile.path = path;
        }
    }
    dy++;

    if (dx || dy) {
        findPath(matrix, ranges, xIndex + dx, yIndex + dy, path);
    } else {
        ranges.push([path.xIndex, xIndex + 1, path.yIndex, yIndex + 1]);
    }
}
