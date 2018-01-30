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
            this._currentTime = 0;
        }
        if (this.options.fadeInOnPlay) {
            this._isStopped && this.setVolume(0);
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

        this._isStopped = true;
        this._isPaused = true;
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

    isPlaying () {
        return this._isPlaying;
    }

    fadeTo (options={}) {
        const {volumeNode} = this._nodes;
        let {duration, to, from} = options;
        duration = +duration || 100;
        to = typeof to === 'number' ? to : 1;
        from = typeof options.from === 'number' ? from : volumeNode.gain.value;
        const startTime = AUDIO_CONTEXT.currentTime;
        const endTime = startTime + duration * 0.001;
        volumeNode.gain.cancelScheduledValues(0);
        volumeNode.gain.exponentialRampToValueAtTime(from || 0.001, startTime);
        volumeNode.gain.exponentialRampToValueAtTime(to || 0.001, endTime);
        setTimeout(this._onTimerTick, duration);
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
        const {sourceNode} = this._nodes;
        return sourceNode.playbackRate.value;
    }

    setPlaybackRate (playbackRate=1) {
        const {sourceNode} = this._nodes;
        sourceNode.playbackRate.value = +playbackRate;
        return this;
    }

    getVolume () {
        const {volumeNode} = this._nodes;
        return volumeNode.gain.value;
    }

    setVolume (value) {
        const {volumeNode} = this._nodes;
        value = Math.max(0, Math.min(1, +value));
        volumeNode.gain.cancelScheduledValues(AUDIO_CONTEXT.currentTime);
        volumeNode.gain.value = value;
        return this;
    }

    getPanValue () {
        const {stereoPanNode} = this._nodes;
        return stereoPanNode.pan.value;
    }

    setPanValue (value) {
        const {stereoPanNode} = this._nodes;
        value = Math.max(-1, Math.min(1, +value));
        stereoPanNode.pan.value = value;
        return this;
    }

    constructor (options={}) {
        super();
        this.options = options;
        this._onEnd = this._onEnd.bind(this);
        this._onTimerTick = this._onTimerTick.bind(this);

        const nodes = {};
        const amplitudeNode = AUDIO_CONTEXT.createGain();
        amplitudeNode.gain.value = +options.amplitude || 1;

        const volumeNode = AUDIO_CONTEXT.createGain();
        volumeNode.gain.value = this.fadeInOnPlay ? 0 : 1;

        const stereoPanNode = AUDIO_CONTEXT.createStereoPanner();
        const sourceNode = this._createSourceNode(options);

        sourceNode.connect(amplitudeNode);
        amplitudeNode.connect(volumeNode);
        volumeNode.connect(stereoPanNode);
        stereoPanNode.connect(AUDIO_CONTEXT.destination);
        Object.assign(nodes, {
            sourceNode,
            amplitudeNode,
            volumeNode,
            stereoPanNode
        });

        this._nodes = nodes;
        this._startTime = 0;
        this._currentTime = 0;

        this._isPaused = true;
        this._isStopped = true;
        this._isPlaying = false;
    }

    _createSourceNode ({buffer, loop}) {
        const source = AUDIO_CONTEXT.createBufferSource();
        source.buffer = buffer;
        source.loop = !!loop;
        source.onended = this._onEnd;
        return source;
    }

    _play () {
        if (this._isPlaying) {
            return;
        }
        const currentTime = this._currentTime;
        const {sourceNode} = this._nodes;
        sourceNode.start(currentTime);
        this._startTime = AUDIO_CONTEXT.currentTime - currentTime;
        this._isPlaying = true;
    }

    _stop () {
        const {sourceNode, amplitudeNode} = this._nodes;
        this._currentTime = AUDIO_CONTEXT.currentTime - this._startTime;
        this._isPlaying && sourceNode.stop();
        this._isPlaying = false;

        const newSourceNode = this._createSourceNode(this.options);
        newSourceNode.connect(amplitudeNode);
        this._nodes.sourceNode = newSourceNode;
    }

    _onEnd () {
        this.emit('end', this);
    }

    _onTimerTick () {
        this._isPaused && this._stop();
    }
}
