import World from 'engine/World.js';
import StaticBoxBody from 'engine/StaticBoxBody.js';
import {
    Vector2
} from 'engine/math.js';

import TileBackground from 'backgrounds/TileBackground.js';
import LavaBackground from 'backgrounds/LavaBackground.js';
import Player from 'entities/Player.js';
import {
    entities,
    backgrounds
} from 'resources.js';
import {
    TILE_SIZE
} from 'constants.js';
import generateTileMatrix from 'utils/generateTileMatrix.js';
import getTileRangeByBounds from 'utils/getTileRangeByBounds.js';

export default class Level {
    constructor (data, {manager, scene, callbacks}) {
        this.manager = manager;
        this.scene = scene;
        this.callbacks = callbacks;
        this.entities = new Set();
        this.effects = new Set();

        this._initBounds(...arguments);
        this._initWorld(...arguments);
        this._initTiles(...arguments);
        this._initStaticBackground(...arguments);
        this._initLavaBackground(...arguments);
        this._initTileBackground(...arguments);
        this._initEntities(...arguments);
        this._initPlayer(...arguments);

        this._score = 0;
        this._slowFactor = 0;
        this._fastFactor = 0;
        this._isStopped = false;
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
    }

    addEffect (name) {
        const {effects} = this;
        if ((name === 'slow' && effects.has('fast')) ||
            (name === 'fast' && effects.has('slow'))) {
            effects.delete('slow');
            effects.delete('fast');
        } else {
            effects.add(name);
        }
        this.callbacks.onEffectChange(effects);
    }

    removeEffect (name) {
        const {effects} = this;
        effects.delete(name);
        this.callbacks.onEffectChange(effects);
    }

    loseGame () {
        this._isStopped = true;
        this.callbacks.onGameLose();
    }

    winGame () {
        this._isStopped = true;
        this.callbacks.onGameWin();
    }

    placePlayer () {
        const {player} = this;
        player.body.place(new Vector2(TILE_SIZE, TILE_SIZE));
    }

    isStopped () {
        return this._isStopped;
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

    update (deltaTime) {
        if (this._isStopped) {
            return;
        }

        const {effects} = this;
        if (effects.has('slow') && ++this._slowFactor % 2) {
            return;
        }

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

        this._play();

        if (effects.has('fast') && ++this._fastFactor % 2) {
            return this.update(deltaTime);
        }
    }

    _play () {
        const {player, bounds} = this;
        if (player.body.center.y + player.size.height / 2 >= bounds.bottom - 100 &&
            !player.killable.isDead()) {
            player.killable.changeHealth(-100);
        }
        if (player.body.center.x + player.size.width / 2 >= bounds.right - 100) {
            this.winGame();
        }
    }

    _getImageNodes (images) {
        const nodes = {};
        const {manager} = this;
        for (let i in images) {
            nodes[i] = manager.getImage(images[i]);
        }
        return nodes;
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
            tile.entity = {obstacle: true, size: {width, height}};
            tiles.push(tile);
            world.add(tile);
            return tile;
        });

        this._tileBodies = tiles;
        return this._tileMatrix = matrix;
    }

    _initStaticBackground ({meta}) {
        const {scene} = this;
        const Background = backgrounds[meta.background];
        if (!Background) {
            return;
        }
        const images = this._getImageNodes(Background.images);
        const background = new Background({images});
        scene.add(background);
        return background;
    }

    _initTileBackground () {
        const {scene} = this;
        const images = this._getImageNodes(TileBackground.images);
        const background = new TileBackground({
            images,
            tiles: this._tileMatrix
        });
        scene.add(background);
        return background;
    }

    _initLavaBackground () {
        const {scene, bounds} = this;
        const background = new LavaBackground({bounds});
        scene.add(background);
        return background;
    }

    _initEntities (data) {
        const level = this;
        data.entities.forEach(({name, position: [x, y], ...settings}) => {
            const Entity = entities[name];
            const images = this._getImageNodes(Entity.images);
            const entity = new Entity({level, settings, images, x, y});
            this.addEntity(entity);
        });
        return this.entities;
    }

    _initPlayer (data, {callbacks}) {
        const level = this;
        const images = this._getImageNodes(Player.images);
        const player = new Player({level, images});
        this.player = player;
        this.addEntity(player);
        this.placePlayer();
        return player;
    }
}
