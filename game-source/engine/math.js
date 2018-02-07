export class Vector2 {
    get width () {
        return this.x;
    }

    set width (width) {
        this.x = width;
    }

    get height () {
        return this.y;
    }

    set height (height) {
        this.y = height;
    }

    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    clone () {
        const {x, y} = this;
        return new Vector2(x, y);
    }

    reverse () {
        const {x, y} = this;
        return new Vector2(y, x);
    }

    set (vector) {
        this.x = vector.x;
        this.y = vector.y;
    }

    add (vector) {
        const {x, y} = this;
        return new Vector2(x + vector.x, y + vector.y);
    }

    subtract (vector) {
        const {x, y} = this;
        return new Vector2(x - vector.x, y - vector.y);
    }

    length (scale) {
        if (typeof scale !== 'number') {
            return Math.sqrt(this.dot(this));
        }
        const {x, y} = this;
        return new Vector2(x * scale, y * scale);
    }

    normalize () {
        const length = this.length();
        return this.length(1 / length);
    }

    inverse () {
        return this.length(-1);
    }

    dot (vector) {
        return this.x * vector.x + this.y * vector.y;
    }
}

export class Color {
    constructor (r, g, b) {
        Object.assign(this, {r, g, b});
    }

    mix (color, slider) {
        if (this.isEqual(color)) {
            return color;
        }
        slider = Math.max(0, Math.min(1, slider));
        let {r, g, b} = this;
        r = Math.floor(r + (color.r - r) * slider);
        g = Math.floor(g + (color.g - g) * slider);
        b = Math.floor(b + (color.b - b) * slider);
        return new Color(r, g, b);
    }

    isEqual (color) {
        if (this === color) {
            return true;
        }
        if (this.r === color.r &&
            this.g === color.g &&
            this.b === color.b) {
            return true;
        }
        return false;
    }

    toString () {
        const {r, g, b} = this;
        return `rgb(${r}, ${g}, ${b})`;
    }
}

export class Matrix {
    constructor (matrix) {
        if (matrix) {
            this._size = matrix.getSize();
            this._table = matrix.getTable();
        } else {
            this._size = new Vector2(0, 0);
            this._table = [];
        }
    }

    getTable () {
        return this._table;
    }

    getSize () {
        return this._size;
    }

    getColumn (x) {
        return this._table[x];
    }

    setColumn (x, value) {
        this._table[x] = value;
        this._size.x = Math.max(this._size.x, x + 1);
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
        this._size.x = Math.max(this._size.x, x + 1);
        this._size.y = Math.max(this._size.y, y + 1);
    }
}
