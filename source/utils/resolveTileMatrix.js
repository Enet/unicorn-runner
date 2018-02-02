import {
    IS_PRODUCTION
} from 'constants.js';

/*
Image names only reflect corresponding situations below.
Tiles for 0, 1, 2, 3, 4, 6, 7 cases are different.
Tiles for 8, B, E, F are the same, so used common tile 8BEF.
TIles for 5 and 9 are the same, so used common tile 59.
Tiles for A, C, D are the same, so used common tile ACD.

Also the suffix -l or -r tells about tile's orientation.
For example 6-r and 6-l are just mirrored tiles.

..#..   ..#..   .....   .....   ..#..   .....   .....
.#0#.   ..1#.   ..2#.   .#3..   .#4..   ..6#.   .#7..
..#..   .....   ..#..   ..#..   .....   .....   .....

.....   ..#..   ..#..   ..#..
..8..   ..B..   ..E#.   .#F..
..#..   ..#..   ..#..   ..#..

.....   ..#..
..5..   ..9..
.....   .....

.....   ..#..   .....
.#A#.   .#C#.   .#D#.
.....   .....   ..#..

*/

const DEBUG_MODE = false;
const DEBUG_FROM_X = 0;
const DEBUG_TO_X = 0;
const DEBUG_FROM_Y = 0;
const DEBUG_TO_Y = 0;

let uniquePathId = 0;

// Abstract tile environment
class TileEnvironment extends Map {
    constructor ({top, right, bottom, left}) {
        super();
        top && this.set('top', top);
        right && this.set('right', right);
        bottom && this.set('bottom', bottom);
        left && this.set('left', left);
    }

    isHorizontal () {
        return this.has('left') || this.has('right');
    }

    isVertical () {
        return this.has('top') || this.has('bottom');
    }

    isHorizontalPipe () {
        return this.has('left') && this.has('right');
    }

    isVerticalPipe () {
        return this.has('top') && this.has('bottom');
    }

    isSeparate () {
        return this.size === 0;
    }
}

// Tile environment constructed by matrix of tiles
class FullTileEnvironment extends TileEnvironment {
    constructor (matrix, xIndex, yIndex) {
        super({
            top: matrix.getElement(xIndex, yIndex - 1),
            right: matrix.getElement(xIndex + 1, yIndex),
            bottom: matrix.getElement(xIndex, yIndex + 1),
            left: matrix.getElement(xIndex - 1, yIndex)
        });
    }
}

// Tile environment without unnecessary tiles
class FilteredTileEnvironment extends TileEnvironment {
    constructor (fullEnvironment, pathId) {
        const filteredEnvironment = {};
        fullEnvironment.forEach((side, s) => {
            // Avoid sides, that belong to another path
            if (!side.pathId || side.pathId === pathId) {
                filteredEnvironment[s] = side;
            }
        });
        super(filteredEnvironment);

        // Avoid T-crossroads and X-crossroads
        if (this.size > 2) {
            if (this.isHorizontalPipe()) {
                this.delete('top');
                this.delete('bottom');
            }
            if (this.isVerticalPipe()) {
                this.delete('left');
                this.delete('right');
            }
        }
    }
}

// Only tiles, that belong to the specified path
class PathTileEnvironment extends FilteredTileEnvironment {
    constructor (environment, pathId) {
        super(environment, pathId);
        this.forEach((side, s) => {
            !side.pathId && this.delete(s);
        });
    }

    getCornerData (pathEnvironment, filteredEnvironment) {
        // Code below can be shorter, but branches are the best way to debug it
        const indexOffset = {x: 0, y: 0};
        let deltaAngle = null;
        let imageName;
        if (pathEnvironment.has('top')) {
            if (filteredEnvironment.has('right')) {
                deltaAngle = -90;
                indexOffset.x = 1;
                imageName = '1-';
            } else {
                deltaAngle = 90;
                indexOffset.x = -1;
                imageName = '4-';
            }
            const pathAngle = filteredEnvironment.get('top').angle;
            imageName += pathAngle === 90 - 90 * indexOffset.x ? 'l' : 'r';
        } else if (pathEnvironment.has('right')) {
            if (filteredEnvironment.has('bottom')) {
                deltaAngle = -90;
                indexOffset.y = 1;
                imageName = '2-';
            } else {
                deltaAngle = 90;
                indexOffset.y = -1;
                imageName = '1-';
            }
            const pathAngle = filteredEnvironment.get('right').angle;
            imageName += pathAngle === 180 - 90 * indexOffset.y ? 'l' : 'r';
        } else if (pathEnvironment.has('bottom')) {
            if (filteredEnvironment.has('left')) {
                deltaAngle = -90;
                indexOffset.x = -1;
                imageName = '3-';
            } else {
                deltaAngle = 90;
                indexOffset.x = 1;
                imageName = '2-';
            }
            const pathAngle = filteredEnvironment.get('bottom').angle;
            imageName += pathAngle === 90 - 90 * indexOffset.x ? 'l' : 'r';
        } else if (pathEnvironment.has('left')) {
            if (filteredEnvironment.has('top')) {
                deltaAngle = -90;
                indexOffset.y = -1;
                imageName = '4-';
            } else {
                deltaAngle = 90;
                indexOffset.y = 1;
                imageName = '3-';
            }
            const pathAngle = filteredEnvironment.get('left').angle;
            imageName += pathAngle === 180 - 90 * indexOffset.y ? 'l' : 'r';
        }
        return {indexOffset, imageName, deltaAngle};
    }
}

export default function resolveTileMatrix (matrix) {
    const {width, height} = matrix.getSize();
    for (let yIndex = 0; yIndex < height; yIndex++) {
        for (let xIndex = 0; xIndex < width; xIndex++) {
            findPath(matrix, xIndex, yIndex);
        }
    }
    return matrix;
}

function findPath (matrix, xIndex, yIndex, pathId, angle) {
    if (DEBUG_MODE && !IS_PRODUCTION) {
        var debug = DEBUG_MODE &&
            xIndex >= DEBUG_FROM_X &&
            xIndex < DEBUG_TO_X &&
            yIndex >= DEBUG_FROM_Y &&
            yIndex < DEBUG_TO_Y;

        // eslint-disable-next-line
        var log = function () {
            // eslint-disable-next-line
            debug && console.log(...arguments);
        };
    }

    const tile = matrix.getElement(xIndex, yIndex);
    if (!tile || tile.pathId) {
        return;
    }

    if (angle !== undefined) {
        angle = (angle + 360) % 360;
    }
    pathId = pathId || ++uniquePathId;

    const fullEnvironment = new FullTileEnvironment(matrix, xIndex, yIndex);
    const filteredEnvironment = new FilteredTileEnvironment(fullEnvironment, pathId);
    const pathEnvironment = new PathTileEnvironment(filteredEnvironment, pathId);

    if (filteredEnvironment.isSeparate()) {
        // Lonely tile
        const imageName = '59-l';
        angle = angle || 0;
        Object.assign(tile, {imageName, pathId, angle});
    } else if (!filteredEnvironment.isHorizontal()) {
        // Kind of vertical tile
        angle = angle || 0;
        let imageName = '' +
            (filteredEnvironment.has('bottom') ? '8BEF' : '59') +
            (angle > 0 ? '-r' : '-l');
        Object.assign(tile, {imageName, pathId, angle});
        findPath(matrix, xIndex, yIndex - 1, pathId, angle);
        findPath(matrix, xIndex, yIndex + 1, pathId, angle);
    } else if (!filteredEnvironment.isVertical()) {
        // Kind of horizontal tile
        let imageName;
        if (filteredEnvironment.isHorizontalPipe()) {
            imageName = 'ACD';
        } else {
            imageName = filteredEnvironment.has('right') ? '6' : '7';
        }
        angle = angle || 90;
        imageName = imageName + (angle > 180 ? '-l' : '-r');
        Object.assign(tile, {imageName, pathId, angle});
        findPath(matrix, xIndex - 1, yIndex, pathId, angle);
        findPath(matrix, xIndex + 1, yIndex, pathId, angle);
    } else if (pathEnvironment.size) {
        // Kind of corner tile
        const {imageName, deltaAngle, indexOffset} = pathEnvironment.getCornerData(pathEnvironment, filteredEnvironment, log);
        Object.assign(tile, {imageName, pathId, angle});
        findPath(matrix, xIndex + indexOffset.x, yIndex + indexOffset.y, pathId, angle + deltaAngle);
    }

    if (tile.pathId && !filteredEnvironment.has('top')) {
        let leftCloudEdge = false;
        let rightCloudEdge = false;
        if (!fullEnvironment.has('left') ||
            fullEnvironment.get('left').pathId !== pathId ||
            (matrix.getElement(xIndex - 1, yIndex - 1) || {}).pathId === pathId) {
            leftCloudEdge = true;
        }
        if (!fullEnvironment.has('right') ||
            fullEnvironment.get('right').pathId !== pathId ||
            (matrix.getElement(xIndex + 1, yIndex - 1) || {}).pathId === pathId) {
            rightCloudEdge = true;
        }

        tile.cloudName = 'cloud';
        if (leftCloudEdge && rightCloudEdge) {
            tile.cloudName += '-center';
        } else if (leftCloudEdge) {
            tile.cloudName += '-edge-left';
        } else if (rightCloudEdge) {
            tile.cloudName += '-edge-right';
        } else {
            tile.cloudName += '-pipe';
        }
    }
}
