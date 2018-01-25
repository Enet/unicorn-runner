import EventEmitter from 'events';

export default class Animation extends EventEmitter {
    constructor (frames, delay) {
        super();
        this.frames = frames;
        this.delay = delay;
        this._prevFrameIndex = null;
    }

    frame (time) {
        const {frames, delay} = this;
        if (time < 0) {
            time -= time * frames.length * delay;
        }
        const frameIndex = Math.floor(time / delay) % frames.length;
        const frameName = frames[frameIndex];
        if (!frameIndex) {
            this.emit('start');
        }
        if (frameIndex !== this._prevFrameIndex) {
            this.emit('frame', frameName);
        }
        if (frameIndex === frames.length - 1) {
            this.emit('end');
        }
        this._prevFrameIndex = frameIndex;
        return frameName;
    }
}
