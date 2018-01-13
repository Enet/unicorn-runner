export default class TileResolver {
    constructor (matrix, size = 60) {
        this._matrix = matrix;
        this._size = size;
    }

    toIndex (position) {
        const size = this._size;
        return Math.floor(position / size);
    }

    toIndexRange (position1, position2) {
        const size = this._size;
        const pMax = Math.ceil(position2 / size) * size;
        const range = [];
        let pos = position1;
        do {
            range.push(this.toIndex(pos));
            pos += this._size;
        } while (pos < pMax);
        return range;
    }

    getByIndex (xIndex, yIndex) {
        const matrix = this._matrix;
        const tile = matrix.getElement(xIndex, yIndex);
        if (!tile) {
            return;
        }
        const size = this._size;
        const x1 = xIndex * size;
        const x2 = x1 + size;
        const y1 = yIndex * size;
        const y2 = y1 + size;
        return {tile, x1, x2, y1, y2};
    }

    searchByPosition (posX, posY) {
        return this.getByIndex(
            this.toIndex(posX),
            this.toIndex(posY));
    }

    searchByRange (x1, x2, y1, y2) {
        const matches = [];
        this.toIndexRange(x1, x2).forEach((indexX) => {
            this.toIndexRange(y1, y2).forEach((indexY) => {
                const match = this.getByIndex(indexX, indexY);
                if (match) {
                    matches.push(match);
                }
            });
        });
        return matches;
    }
}
