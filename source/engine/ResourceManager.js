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
            const audio = new Audio(rawSounds[soundName]);
            audio.oncanplaythrough = () => resolve(audio);
            audio.name = soundName;
            audio.onerror = reject;
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

    _cacheNodes (nodes, cache) {
        const items = {};
        nodes.forEach((node) => {
            items[node.name] = node;
        });
        Object.assign(cache, items);
    }

    _onReady ([imageNodes, soundNodes]) {
        this._cacheNodes(imageNodes, this._images);
        this._cacheNodes(soundNodes, this._sounds);
    }

    _onError (error) {
        throw error;
    }
}
