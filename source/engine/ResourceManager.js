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

function fetchSounds (sounds) {
    return Promise.resolve(Object.keys(sounds));
}

export default class ResourceManager {
    constructor () {
        this._images = {};
        this._sounds = {};
        this._onReady = this._onReady.bind(this);
        this._onError = this._onError.bind(this);
    }

    fetchResources ({images={}, sounds ={}, aliases={}}) {
        return Promise.all([
            fetchImages(images),
            fetchSounds(sounds),
            Promise.resolve(aliases)
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

    _onReady ([imageNodes, soundNodes, aliases]) {
        this._cacheNodes(imageNodes, this._images);
        this._cacheNodes(soundNodes, this._sounds);
        for (let a in aliases) {
            this._images[a] = this._images[aliases[a]];
        }
    }

    _onError (error) {
        throw error;
    }
}
