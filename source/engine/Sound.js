export default class Sound {
    play () {
        this._isPaused = false;
        this.audio.play();
    }

    pause () {
        this._isPaused = true;
        this._volume = 0;
    }

    getVolume () {
        return this.audio.volume;
    }

    setVolume (volume) {
        this._volume = +volume;
    }

    constructor (uri, {volume=1, loop=false, autoPlay}) {
        const audio = new Audio(uri.src);
        audio.volume = 0;
        audio.loop = !!loop;

        this.audio = audio;
        this._volume = +volume;
        this._isPaused = true;
        autoPlay && this.play();
        requestAnimationFrame(this._onTimeUpdate.bind(this));
    }

    _onTimeUpdate () {
        const {audio} = this;
        let audioVolume = audio.volume;
        audioVolume -= Math.sign(audioVolume - this._volume) * 0.04;
        audioVolume = Math.max(0, Math.min(audioVolume, 1));
        audio.volume = audioVolume;
        !audioVolume && audio.pause();
        requestAnimationFrame(this._onTimeUpdate.bind(this));
    }
}
