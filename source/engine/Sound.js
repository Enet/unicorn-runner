import EventEmitter from 'events';
import {
    AUDIO_CONTEXT
} from './constants.js';

export default class Sound extends EventEmitter {
    play () {
        if (!this._isPaused) {
            return this;
        }

        if (this._isStopped) {
            this.setVolume(1);
            this._clearTimeout();
            this._currentTime = 0;
        }

        if (this.options.fadeInOnPlay) {
            this.fadeIn(this.options.fadeInOnPlay);
        }
        this._play();

        this._isPaused = false;
        this._isStopped = false;
        this._isPlaying = true;

        const {onPlay} = this.options;
        onPlay && onPlay();
        return this;
    }

    pause () {
        if (this._isPaused) {
            return this;
        }

        this._isPaused = true;
        if (this.options.fadeOutOnPause) {
            this.fadeOut(this.options.fadeOutOnPause);
        } else {
            this._stop();
        }

        const {onPause} = this.options;
        onPause && onPause();
        return this;
    }

    stop () {
        if (this._isStopped) {
            return this;
        }

        this._isPaused = true;
        this._isStopped = true;
        if (this.options.fadeOutOnPause) {
            this.fadeOut(this.options.fadeOutOnPause);
        } else {
            this._stop();
        }

        const {onStop} = this.options;
        onStop && onStop();
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
        this._animation.startValue = this.volumeNode.gain.value;
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

    getPlaybackRate () {
        return this.source.playbackRate.value;
    }

    setPlaybackRate (playbackRate=1) {
        this.source.playbackRate.value = +playbackRate;
        return this;
    }

    getVolume () {
        return this.volumeNode.gain.value;
    }

    setVolume (volume) {
        volume = Math.max(0, Math.min(1, +volume));
        this.volumeNode.gain.value = volume;
        return this;
    }

    constructor (buffer, {amplitude=1, loop=false}) {
        super();
        this._onAnimationTimerTick = this._onAnimationTimerTick.bind(this);

        const source = AUDIO_CONTEXT.createBufferSource();
        source.buffer = buffer;
        source.loop = !!loop;
        source.onended = this._onEnd.bind(this);

        const amplitudeNode = AUDIO_CONTEXT.createGain();
        amplitudeNode.gain.value = +amplitude;

        const volumeNode = AUDIO_CONTEXT.createGain();
        volumeNode.gain.value = 1;

        source.connect(amplitudeNode);
        amplitudeNode.connect(volumeNode);
        volumeNode.connect(AUDIO_CONTEXT.destination);
        Object.assign(this, {source, amplitudeNode, volumeNode});

        this.options = arguments[1];

        this._animation = {
            timer: null,
            startValue: null,
            endValue: null,
            startTime: null,
            endTime: null
        };
        this._startTime = 0;
        this._currentTime = 0;
        this._isPaused = true;
        this._isStopped = true;
        this._isPlaying = false;
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

    _play () {
        if (this._isPlaying) {
            return;
        }
        this._startTime = AUDIO_CONTEXT.currentTime - this._currentTime;
        this.source.start(this._currentTime);
    }

    _stop () {
        this._currentTime = AUDIO_CONTEXT.currentTime - this._startTime;
        this._isPlaying && this.source.stop();
        const source = AUDIO_CONTEXT.createBufferSource();
        source.buffer = this.source.buffer;
        source.loop = this.source.loop;
        source.onended = this.source.onended;
        source.connect(this.amplitudeNode);
        this.source = source;
        this._isPlaying = false;
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
            this._stop();
        }
    }
}
