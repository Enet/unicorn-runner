let uniquePathId = 0;

const DEBUG_MODE = false;
const DEBUG_FROM_X = 1;
const DEBUG_TO_X = 10;
const DEBUG_FROM_Y = 0;
const DEBUG_TO_Y = 6;

class TileEnvironment extends Map {
    constructor (tile, {top, right, bottom, left}) {
        super();
        this.tile = tile;
        top && this.set('top', top);
        right && this.set('right', right);
        bottom && this.set('bottom', bottom);
        left && this.set('left', left);
    }

    initialize ({pathId, imageName}) {
        Object.assign(this.tile, {pathId, imageName});
    }

    hasPathId () {
        return !!this.tile.pathId;
    }

    hasNotCorner (side) {
        return this.has(side) && !this.get(side).corner;
    }

    isBelongingToPath (pathId) {
        return this.tile.pathId === pathId;
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

    isCorner () {
        return this.isHorizontal() && this.isVertical();
    }

    isSeparate () {
        return this.size === 0;
    }
}

class FullTileEnvironment extends TileEnvironment {
    constructor (matrix, xIndex, yIndex) {
        super(matrix.getElement(xIndex, yIndex), {
            top: matrix.getElement(xIndex, yIndex - 1),
            right: matrix.getElement(xIndex + 1, yIndex),
            bottom: matrix.getElement(xIndex, yIndex + 1),
            left: matrix.getElement(xIndex - 1, yIndex)
        });
    }
}

class FilteredTileEnvironment extends TileEnvironment {
    constructor (environment, pathId) {
        super(environment.tile, {
            top: environment.get('top'),
            right: environment.get('right'),
            bottom: environment.get('bottom'),
            left: environment.get('left')
        });
        this.forEach((side, s) => {
            if (side.pathId && side.pathId !== pathId) {
                this.delete(s);
            }
        });

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

class PathTileEnvironment extends FilteredTileEnvironment {
    constructor (environment, pathId) {
        super(environment, pathId);
        this.forEach((side, s) => {
            if (!side.pathId) {
                this.delete(s);
            }
        });
    }

    getCorner (filteredEnvironment) {
        let xOffset = 0;
        let yOffset = 0;
        let deltaAngle;
        let imageName;

        if (this.has('top')) {
            imageName = '1';
            if (filteredEnvironment.has('right')) {
                deltaAngle = -90;
                xOffset = 1;
            } else {
                deltaAngle = 90;
                xOffset = -1;
            }
        } else if (this.has('right')) {
            imageName = '2';
            if (filteredEnvironment.has('bottom')) {
                deltaAngle = -90;
                yOffset = 1;
            } else {
                deltaAngle = 90;
                yOffset = -1;
            }
        } else if (this.has('bottom')) {
            imageName = '3';
            if (filteredEnvironment.has('left')) {
                deltaAngle = -90;
                xOffset = -1;
            } else {
                deltaAngle = 90;
                xOffset = 1;
            }
        } else if (this.has('left')) {
            imageName = '4';
            if (filteredEnvironment.has('top')) {
                deltaAngle = -90;
                yOffset = -1;
            } else {
                deltaAngle = 90;
                yOffset = 1;
            }
        }

        if (deltaAngle > 0) {
            imageName += 'f';
        }

        return {imageName, deltaAngle, xOffset, yOffset};
    }
}

export default function polarizeTileMatrix (matrix) {
    const {width, height} = matrix.getSize();
    for (let yIndex = 0; yIndex < height; yIndex++) {
        for (let xIndex = 0; xIndex < width; xIndex++) {
            findPath(matrix, xIndex, yIndex);
        }
    }
    return matrix;
}

function findPath (matrix, xIndex, yIndex, pathId, angle) {
    const debug = DEBUG_MODE &&
        xIndex > DEBUG_FROM_X &&
        xIndex < DEBUG_TO_X &&
        yIndex > DEBUG_FROM_Y &&
        yIndex < DEBUG_TO_Y;

    // eslint-disable-next-line
    const log = function () {
        debug && console.log(...arguments);
    };

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
        const imageName = '59';
        angle = angle || 0;
        filteredEnvironment.initialize({imageName, pathId});
    } else if (!filteredEnvironment.isHorizontal()) {
        angle = angle || 0;
        let imageName = '' +
            (filteredEnvironment.has('bottom') ? '8BEF' : '59') +
            (angle > 0 ? 'f' : '');
        filteredEnvironment.initialize({imageName, pathId});
        findPath(matrix, xIndex, yIndex - 1, pathId, angle);
        findPath(matrix, xIndex, yIndex + 1, pathId, angle);
    } else if (!filteredEnvironment.isVertical()) {
        let imageName;
        if (filteredEnvironment.isHorizontalPipe()) {
            imageName = 'ACD';
        } else {
            imageName = filteredEnvironment.has('right') ? '6' : '7';
        }
        angle = angle || 90;
        imageName = imageName + (angle > 180 ? '' : 'f');
        filteredEnvironment.initialize({imageName, pathId});
        findPath(matrix, xIndex - 1, yIndex, pathId, angle);
        findPath(matrix, xIndex + 1, yIndex, pathId, angle);
    } else if (pathEnvironment.size) {
        const {imageName, deltaAngle, xOffset, yOffset} = pathEnvironment.getCorner(filteredEnvironment);
        filteredEnvironment.initialize({imageName, pathId});
        tile.corner = true;
        findPath(matrix, xIndex + xOffset, yIndex + yOffset, pathId, angle + deltaAngle);
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
