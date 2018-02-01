import World from 'engine/World.js';
import StaticBoxBody from 'engine/StaticBoxBody.js';
import Sound from 'engine/Sound.js';
import {
    Vector2
} from 'engine/math.js';
import {
    AUDIO_CONTEXT
} from 'engine/constants.js';

import CloudBackground from 'backgrounds/CloudBackground.js';
import TileBackground from 'backgrounds/TileBackground.js';
import LavaBackground from 'backgrounds/LavaBackground.js';
import PlayerEntity from 'entities/PlayerEntity.js';
import generateTileMatrix from 'utils/generateTileMatrix.js';
import getTileRangeByBounds from 'utils/getTileRangeByBounds.js';
import {
    TILE_SIZE
} from 'constants.js';

let uniqueTimerId = 0;

export default class Level {
    constructor (data, {manager, scene, settings, callbacks}) {
        this.manager = manager;
        this.scene = scene;
        this.settings = settings;
        this.callbacks = callbacks;
        this.entities = new Set();
        this.effects = new Set();
        this.sounds = new Set();
        this.timers = new Map();

        this._score = 0;
        this._timeFactor = 0;
        this._isStopped = false;
        this._elapsedTime = 0;
        this._playbackRate = 1;
        this._gainNode = AUDIO_CONTEXT.createGain();
        this._gainNode.connect(AUDIO_CONTEXT.destination);

        this._initBounds(...arguments);
        this._initWorld(...arguments);
        this._initTiles(...arguments);
        this._initStaticBackground(...arguments);
        this._initLavaBackground(...arguments);
        this._initTileBackground(...arguments);
        this._initPlayer(...arguments);
        this._initEntities(...arguments);
        this._initMusic(...arguments);
    }

    destructor () {
        this.sounds.forEach((sound) => {
            sound.setVolume(0);
            sound.stop();
        });
    }

    addEntity (entity) {
        const {scene, world} = this;
        scene.add(entity);
        world.add(entity.body);
        this.entities.add(entity);
        entity.entityDidMount();
    }

    removeEntity (entity) {
        entity.entityWillUnmount();
        const {scene, world} = this;
        this.entities.delete(entity);
        world.remove(entity.body);
        scene.remove(entity);
        this.setTimeout(() => entity.entityDidUnmount());
    }

    addEffect (name) {
        const {effects} = this;
        if (name === 'slow' && effects.has('fast')) {
            this.removeEffect('fast');
        } else if (name === 'fast' && effects.has('slow')) {
            this.removeEffect('slow');
        } else {
            if (name === 'fly') {
                this.player.fly.start();
            } else {
                this._setPlaybackRate(name === 'fast' ? 2 : 0.5);
            }
            effects.add(name);
        }
        this.callbacks.onEffectChange(effects);
    }

    removeEffect (name) {
        const {effects} = this;
        effects.delete(name);
        if (name === 'fly') {
            this.player.fly.stop();
        } else {
            this._setPlaybackRate(1);
        }
        this.callbacks.onEffectChange(effects);
    }

    setTimeout (callback, time=0) {
        const timerId = uniqueTimerId++;
        time += this._elapsedTime;
        this.timers.set(timerId, {time, callback});
    }

    clearTimeout (timerId) {
        this.timers.delete(timerId);
    }

    loseGame () {
        if (this._musicSound) {
            this._musicSound.stop();
        }
        this._loseSound = this.createSound('LevelLose')
            .play()
            .once('end', this._onGameLose.bind(this));
    }

    winGame () {
        if (this.player.organism.isDead()) {
            return;
        }
        if (this.isStopped()) {
            return;
        }
        this._winSound = this.createSound('LevelWin')
            .play()
            .once('end', this._onGameWin.bind(this));
    }

    placePlayer () {
        const {player} = this;
        player.body.place(new Vector2(TILE_SIZE, TILE_SIZE));
    }

    isStopped () {
        return this._isStopped || !!this._winSound || !!this._loseSound;
    }

    getScore () {
        return this._score;
    }

    changeScore (deltaScore) {
        this._score += deltaScore;
        this.callbacks.onScoreChange(Math.floor(this._score));
    }

    setHealth (health) {
        this.callbacks.onHealthChange(Math.floor(health));
    }

    createSound (name, options={}) {
        if (!this.settings.sound) {
            options.amplitude = 0;
        }
        const {manager} = this;
        options.buffer = manager.getSound(name);
        options.destination = this._gainNode;

        const sound = new Sound(options);
        sound.position = options.position;
        sound.name = name;
        sound.setPlaybackRate(this._playbackRate);

        this._updateSoundByPosition(sound);
        this.sounds.add(sound);

        if (!options.loop) {
            sound.once('end', this._onSoundEnd.bind(this));
        }
        return sound;
    }

    removeSound (sound) {
        if (!sound) {
            return;
        }
        sound.stop();
        this.sounds.delete(sound);
    }

    pause () {
        this._gainNode.gain.value = 0;
    }

    resume () {
        this._gainNode.gain.value = 1;
    }

    update (deltaTime) {
        if (this._isStopped) {
            return;
        }

        const {effects} = this;
        if (effects.has('slow') && ++this._timeFactor % 2) {
            return;
        }

        const elapsedTime = this._elapsedTime;
        const {timers} = this;
        timers.forEach((timer, timerId) => {
            if (timer.time > elapsedTime) {
                return;
            }
            timer.callback();
            timers.delete(timerId);
        });

        const {world, entities} = this;
        const candidates = Array.from(entities.values()).map(entity => entity.body);
        entities.forEach((entity) => {
            const tiles = getTileRangeByBounds(this._tileMatrix, entity.body);
            entity.body.candidates = tiles.concat(candidates);
            entity.entityWillUpdate(deltaTime, this);
        });

        world.update(deltaTime / 1000);

        entities.forEach((entity) => {
            entity.entityDidUpdate();
        });

        this.sounds.forEach(sound => this._updateSoundByPosition(sound));

        this._play();
        this._elapsedTime += deltaTime;

        if (effects.has('fast') && ++this._timeFactor % 2) {
            return this.update(deltaTime);
        }
    }

    _play () {
        const {player, bounds} = this;
        if (player.body.center.y + player.size.height / 2 >= bounds.bottom - 100 &&
            !player.organism.isDead()) {
            player.organism.changeHealth(-100);
        }
        if (player.body.center.x + player.size.width / 2 >= bounds.right - 100) {
            this.winGame();
        }
    }

    _updateSoundByPosition (sound) {
        if (!sound.position) {
            return;
        }
        const {player, scene} = this;
        const volume = 1 - player.body.center.subtract(sound.position).length() * 0.002;
        const pan = 2 * (sound.position.x - player.body.center.x) / scene.camera.size.width;
        sound.setVolume(volume);
        sound.setPanValue(pan);
    }

    _setPlaybackRate (playbackRate) {
        this._playbackRate = playbackRate;
        this.sounds.forEach((sound) => {
            sound.setPlaybackRate(playbackRate);
            this._musicSound.setPlaybackRate(playbackRate);
        });
    }

    _initBounds ({meta}) {
        const {bounds} = meta;
        const top = +bounds[0];
        const right = +bounds[1];
        const bottom = +bounds[2];
        const left = +bounds[3];
        this.bounds = {top, right, bottom, left};
    }

    _initWorld () {
        const {bounds} = this;
        const world = new World(bounds);
        return this.world = world;
    }

    _initTiles (data) {
        const {world} = this;
        const tiles = [];
        const width = TILE_SIZE;
        const height = TILE_SIZE;
        const matrix = generateTileMatrix(data.tiles, data.patterns, (xIndex, yIndex) => {
            const x = xIndex * width;
            const y = yIndex * height;
            const tile = new StaticBoxBody({x, y, width, height});
            tile.entity = {foothold: true, obstacle: true, size: {width, height}};
            tiles.push(tile);
            world.add(tile);
            return tile;
        });

        this._tileBodies = tiles;
        return this._tileMatrix = matrix;
    }

    _initStaticBackground ({meta}) {
        const {manager, scene} = this;
        const Background = manager.getBackground(meta.background);
        if (!Background) {
            return;
        }
        const background = new Background({manager});
        scene.add(background);
        return background;
    }

    _initCloudBackground () {
        const {manager, scene} = this;
        const background = new CloudBackground({manager});
        scene.add(background);
        return background;
    }

    _initTileBackground () {
        const {manager, scene} = this;
        const cloudRenderer = this._initCloudBackground(...arguments);
        const background = new TileBackground({
            manager,
            tiles: this._tileMatrix,
            cloudRenderer
        });
        scene.add(background);
        return background;
    }

    _initLavaBackground () {
        const {manager, bounds, scene} = this;
        const background = new LavaBackground({manager, bounds});
        scene.add(background);
        return background;
    }

    _initEntities (data) {
        const level = this;
        const {manager} = this;
        data.entities.forEach(({name, position: [x, y], ...settings}) => {
            const Entity = manager.getEntity(name);
            const entity = new Entity({level, settings, x, y});
            this.addEntity(entity);
        });
        return this.entities;
    }

    _initPlayer (data, {callbacks}) {
        const level = this;
        const player = new PlayerEntity({level});
        this.player = player;
        this.addEntity(player);
        this.placePlayer();
        return player;
    }

    _initMusic ({meta}) {
        if (!meta.music) {
            return;
        }
        const musicSound = this.createSound(meta.music, {
            loop: true,
            amplitude: 0.25,
            fadeOutOnPause: {}
        });
        this._musicSound = musicSound;
        this.settings.music && musicSound.play();
    }

    _onSoundEnd (sound) {
        this.removeSound(sound);
    }

    _onGameWin () {
        this._isStopped = true;
        const score = this._score;
        this.callbacks.onGameWin({score});
    }

    _onGameLose () {
        this._isStopped = true;
        this.callbacks.onGameLose();
    }
}
