export default class Keyboard {
    constructor () {
        this._pressedKeys = new Set();
        this._onWindowKeyDown = this._onWindowKeyDown.bind(this);
        this._onWindowKeyUp = this._onWindowKeyUp.bind(this);
        window.addEventListener('keydown', this._onWindowKeyDown);
        window.addEventListener('keyup', this._onWindowKeyUp);
    }

    destructor () {
        window.removeEventListener('keydown', this._onWindowKeyDown);
        window.removeEventListener('keyup', this._onWindowKeyUp);
    }

    isPressed () {
        const pressedKeys = this._pressedKeys;
        for (let a = 0, al = arguments.length; a < al; a++) {
            const keyCode = arguments[a];
            if (pressedKeys.has(keyCode)) {
                return true;
            }
        }
        return false;
    }

    _onWindowKeyDown (event) {
        this._pressedKeys.add(event.keyCode);
    }

    _onWindowKeyUp (event) {
        this._pressedKeys.delete(event.keyCode);
    }
}
