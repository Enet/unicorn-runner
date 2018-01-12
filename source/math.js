export class Matrix {
    constructor (grid) {
        this._grid = grid || [];
    }

    getColumn (x) {
        return this._grid[x];
    }

    setColumn (x, value) {
        this._grid[x] = value;
    }

    getElement (x, y) {
        const column = this.getColumn(x);
        if (!column) {
            return undefined;
        }
        return column[y];
    }

    setElement (x, y, value) {
        let column = this.getColumn(x);
        if (!column) {
            column = [];
            this.setColumn(x, column);
        }
        column[y] = value;
    }
}

export class Vec2 {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    set (x, y) {
        this.x = x;
        this.y = y;
    }
}
