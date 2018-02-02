import {
    AUDIO_CONTEXT
} from './constants.js';

function fetchImages (rawImages) {
    return Promise.all(Object.keys(rawImages).map((imageName) => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.name = imageName;
            image.onerror = reject;
            image.src = rawImages[imageName];
        });
    }));
}

function fetchSounds (rawSounds) {
    return Promise.all(Object.keys(rawSounds).map((soundName) => {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('GET', rawSounds[soundName], true);
            request.responseType = 'arraybuffer';
            request.onerror = reject;
            request.onload = () => {
                AUDIO_CONTEXT.decodeAudioData(request.response, (buffer) => {
                    buffer.name = soundName;
                    resolve(buffer);
                }, reject);
            };
            request.send();
        });
    }));
}

export default class ResourceManager {
    constructor () {
        this._images = {};
        this._sounds = {};
        this._onReady = this._onReady.bind(this);
        this._onError = this._onError.bind(this);
    }

    fetchResources ({images={}, sounds ={}}) {
        return Promise.all([
            fetchImages(images),
            fetchSounds(sounds)
        ])
            .then(this._onReady)
            .catch(this._onError);
    }

    getImage (imageName) {
        return this._images[imageName];
    }

    getSound (soundName) {
        return this._sounds[soundName];
    }

    _cacheResources (resources, cache) {
        resources.forEach((resource) => {
            cache[resource.name] = resource;
        });
    }

    _onReady ([imageNodes, soundBuffers]) {
        this._cacheResources(imageNodes, this._images);
        this._cacheResources(soundBuffers, this._sounds);
    }

    _onError (error) {
        throw error;
    }
}
