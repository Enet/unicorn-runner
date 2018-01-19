import World from 'engine/World.js';
import StaticBoxBody from 'engine/StaticBoxBody.js';
import {
    Vector2
} from 'engine/math.js';

import StaticBackground from 'backgrounds/StaticBackground.js';
import TileBackground from 'backgrounds/TileBackground.js';
import Player from 'entities/Player.js';
import {
    entities
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

        this._initWorld(...arguments);
        this._initTiles(...arguments);
        this._initStaticBackground();
        this._initTileBackground();
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
    }

    removeEntity (entity) {
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

    restartGame () {
        const {player} = this;
        player.killable.reviveFully();
        this.placePlayer();
        this._isStopped = false;
    }

    placePlayer () {
        const {player} = this;
        player.body.place(new Vector2(TILE_SIZE, TILE_SIZE));
    }

    isStopped () {
        return this._isStopped;
    }

    changeScore (delta) {
        this._score += delta;
        this.callbacks.onScoreChange(Math.floor(this._score));
    }

    setHealth (health) {
        this.callbacks.onHealthChange(Math.floor(health));
    }

    update (deltaTime) {
        const {effects} = this;
        if (effects.has('slow') && ++this._slowFactor % 2) {
            return;
        }

        const {world, entities} = this;
        const candidates = Array.from(entities.values()).map(entity => entity.body);
        entities.forEach((entity) => {
            const tiles = getTileRangeByBounds(this._tileMatrix, entity.body);
            entity.body.candidates = tiles.concat(candidates);
        });

        world.update(deltaTime / 1000);

        entities.forEach((entity) => {
            entity.entityWillUpdate(deltaTime, this);
        });

        entities.forEach((entity) => {
            entity.entityDidUpdate();
        });

        this._play();

        if (effects.has('fast') && ++this._fastFactor % 2) {
            return this.update(deltaTime);
        }
    }

    _play () {
        const {player} = this;
        if (player.body.center.y > 1200 || player.body.center.x > 11400) {
            this.winGame();
        }
    }

    _initWorld () {
        const world = new World({
            top: -300,
            left: -300,
            bottom: 600
        });
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
            tile.entity = {obstacle: true};
            tiles.push(tile);
            world.add(tile);
            return tile;
        });

        this._tileBodies = tiles;
        return this._tileMatrix = matrix;
    }

    _initStaticBackground () {
        const {scene, manager} = this;
        const background = new StaticBackground({
            images: {
                ground: manager.getImage('Ground'),
                back: manager.getImage('SkyscraperBack'),
                front: manager.getImage('SkyscraperFront')
            }
        });
        scene.add(background);
        return background;
    }

    _initTileBackground () {
        const {scene, manager} = this;
        const background = new TileBackground({
            images: {
                tile: manager.getImage('Tile')
            },
            tiles: this._tileMatrix
        });
        scene.add(background);
        return background;
    }

    _initEntities (data) {
        const {manager} = this;
        const level = this;
        data.entities.forEach(({name, position: [x, y]}) => {
            const image = manager.getImage(name);
            const entity = new entities[name]({level, image, x, y});
            this.addEntity(entity);
        });
        return this.entities;
    }

    _initPlayer (data, {callbacks}) {
        const {manager} = this;
        const level = this;
        const image = manager.getImage('Unicorn');
        const player = new Player({level, image});
        this.player = player;
        this.addEntity(player);
        this.placePlayer();
        return player;
    }
}
