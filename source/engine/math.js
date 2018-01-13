export class Matrix {
    constructor (table) {
        this._table = table || [];
    }

    getColumn (x) {
        return this._table[x];
    }

    setColumn (x, value) {
        this._table[x] = value;
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

export class Position extends Vec2 {

}

export class Size extends Vec2 {
    get width () {
        return this.x;
    }

    get height () {
        return this.y;
    }

    set width (width) {
        this.x = width;
    }

    set height (height) {
        this.y = height;
    }
}
