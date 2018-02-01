const TABLET_WIDTH = 640;

export default class TouchScreen {
    constructor (canvasNode) {
        this._touchingSectors = {
            top: false,
            right: false,
            bottom: false,
            left: false
        };
        this._canvasNode = canvasNode;
        this._onTouchStart = this._onTouchStart.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        canvasNode.addEventListener('touchstart', this._onTouchStart);
        canvasNode.addEventListener('touchend', this._onTouchEnd);
        canvasNode.addEventListener('contextmenu', this._onContextMenu);
    }

    destructor () {
        const canvasNode = this._canvasNode;
        canvasNode.removeEventListener('touchstart', this._onTouchStart);
        canvasNode.removeEventListener('touchend', this._onTouchEnd);
        canvasNode.removeEventListener('contextmenu', this._onContextMenu);
    }

    isSectorTouching (sectorName) {
        return !!this._touchingSectors[sectorName];
    }

    _getTouchCoordinates (touch) {
        const x = touch.clientX;
        const y = touch.clientY;
        return {x, y};
    }

    _getTouchSector (touch) {
        let {x, y} = this._getTouchCoordinates(touch);
        let {width, height} = this._canvasNode;
        const tangent = height / width;

        if (window.innerWidth <= TABLET_WIDTH) {
            [x, y] = [y, x];
            x = width - x;
        }
        x -= 0.5 * width;
        y -= 0.5 * height;

        if (y >= tangent * x) {
            if (y >= -tangent * x) {
                return 'bottom';
            } else {
                return 'left';
            }
        } else {
            if (y >= -tangent * x) {
                return 'right';
            } else {
                return 'top';
            }
        }
    }

    _onTouchStart (event) {
        const {touches} = event;
        for (let t = 0, tl = touches.length; t < tl; t++) {
            const touch = touches[t];
            const sectorName = this._getTouchSector(touch);
            this._touchingSectors[sectorName] = true;
        }
    }

    _onTouchEnd (event) {
        const {changedTouches} = event;
        for (let t = 0, tl = changedTouches.length; t < tl; t++) {
            const touch = changedTouches[t];
            const sectorName = this._getTouchSector(touch);
            this._touchingSectors[sectorName] = false;
        }
    }

    _onContextMenu (event) {
        event.preventDefault();
    }
}
