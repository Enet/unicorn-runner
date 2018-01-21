import EventEmitter from 'events';

export default class Animation extends EventEmitter {
    constructor ({frames, delay}) {
        super();
        this.frames = frames;
        this.delay = delay;
    }

    frame (time) {
        const {frames, delay} = this;
        const frameIndex = Math.floor(time / delay) % frames.length;
        if (!frameIndex) {
            this.emit('start');
        } else if (frameIndex === frames.length - 1) {
            this.emit('end');
        }
        const frameName = frames[frameIndex];
        return frameName;
    }
}
