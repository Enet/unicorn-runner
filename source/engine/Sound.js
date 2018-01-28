import EventEmitter from 'events';

export default class Sound extends EventEmitter {
    play () {
        if (!this._isPaused) {
            return this;
        }
        if (this._isStopped) {
            this.audio.currentTime = 0;
            this.audio.volume = this._volumeFactor;
            this._clearTimeout();
        }
        this._isPaused = false;
        this._isStopped = false;
        this._onPlay();
        return this;
    }

    pause () {
        if (this._isPaused) {
            return this;
        }
        this._isPaused = true;
        this._onPause();
        return this;
    }

    stop () {
        if (this._isStopped) {
            return this;
        }
        this._isPaused = true;
        this._isStopped = true;
        this._onStop();
        return this;
    }

    isPaused () {
        return this._isPaused;
    }

    isStopped () {
        return this._isStopped;
    }

    fadeTo (options={}) {
        let {duration, to} = options;
        duration = +duration || 100;
        to = typeof to === 'number' ? to : 1;

        if (options.from !== undefined) {
            this.setVolume(+options.from);
        }

        const startTime = Date.now();
        this._animation.startValue = this._volumeValue;
        this._animation.endValue = to;
        this._animation.startTime = startTime;
        this._animation.endTime = startTime + duration;
        this._isStopped = false;
        this._setTimeout();
        return this;
    }

    fadeIn (options={}) {
        options.to = 1;
        return this.fadeTo(options);
    }

    fadeOut (options={}) {
        options.to = 0;
        return this.fadeTo(options);
    }

    getVolume () {
        return this._volumeValue;
    }

    setVolume (volume) {
        volume = Math.max(0, Math.min(1, +volume));
        this._volumeValue = volume;
        this.audio.volume = this._volumeFactor * volume;
        return this;
    }

    constructor (uri, {volumeFactor=1, loop=false}) {
        super();
        this._onAnimationTimerTick = this._onAnimationTimerTick.bind(this);

        const audio = new Audio(uri.src);
        audio.onended = this._onEnd.bind(this);
        audio.volume = +volumeFactor;
        audio.loop = !!loop;

        this.audio = audio;
        this.options = arguments[1];

        this._animation = {
            timer: null,
            startValue: null,
            endValue: null,
            startTime: null,
            endTime: null
        };
        this._volumeFactor = +volumeFactor;
        this._volumeValue = 1;
        this._isPaused = true;
        this._isStopped = true;
    }

    _clearTimeout () {
        clearTimeout(this._animation.timer);
        this._animation.timer = null;
    }

    _setTimeout () {
        if (this._animation.timer) {
            return;
        }
        this._animation.timer = setTimeout(this._onAnimationTimerTick);
    }

    _onPlay () {
        if (this.options.fadeInOnPlay) {
            this.fadeIn(this.options.fadeInOnPlay);
        }
        this.audio.play();
        const {onPlay} = this.options;
        onPlay && onPlay();
    }

    _onPause () {
        if (this.options.fadeOutOnPause) {
            this.fadeOut(this.options.fadeOutOnPause);
        } else {
            this.audio.pause();
        }
        const {onPause} = this.options;
        onPause && onPause();
    }

    _onStop () {
        if (this.options.fadeOutOnPause) {
            this.fadeOut(this.options.fadeOutOnPause);
        } else {
            this.audio.pause();
        }
        const {onStop} = this.options;
        onStop && onStop();
    }

    _onEnd () {
        this.emit('end', this);
    }

    _onAnimationTimerTick () {
        const currentTime = Date.now();
        const {startValue, endValue, startTime, endTime} = this._animation;
        const animationProgress = Math.min(1, (currentTime - startTime) / (endTime - startTime));
        const currentValue = startValue + (endValue - startValue) * animationProgress;
        this.setVolume(currentValue);

        this._animation.timer = null;
        if (animationProgress < 1) {
            this._setTimeout();
        } else if (currentValue === 0 && this._isPaused) {
            this.audio.pause();
        }
    }
}
