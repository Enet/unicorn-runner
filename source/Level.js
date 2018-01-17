import StaticBackground from 'backgrounds/StaticBackground.js';
import TileBackground from 'backgrounds/TileBackground.js';
import {
    entities
} from 'resources.js';

import World from 'engine/World.js';
import BoxBody from 'engine/BoxBody.js';
import {
    Vector2
} from 'engine/math.js';

import generateTileMatrix from 'utils/generateTileMatrix.js';
import getTileRangeByBounds from 'utils/getTileRangeByBounds.js';
import {
    TILE_SIZE
} from 'constants.js';

export default class Level {
    constructor (data, {manager, scene, player, callbacks}) {
        const world = new World({
            top: -300,
            left: -300,
            bottom: 600
        });

        const tileBodies = [];
        const tileMatrix = generateTileMatrix(data.tiles, data.patterns, (x, y) => {
            const tileBody = new BoxBody({
                statical: true,
                x: x * TILE_SIZE,
                y: y * TILE_SIZE,
                width: TILE_SIZE,
                height: TILE_SIZE
            });
            tileBody.entity = {
                jumpable: true
            };
            tileBodies.push(tileBody);
            world.add(tileBody);
            return tileBody;
        });

        const gameplay = {
            isStopped: false,
            ellapsedTime: 0,
            player,
            scene,
            world,
            tileBodies,
            tileMatrix
        };
        this._gameplay = gameplay;

        const staticBackground = new StaticBackground({
            images: {
                ground: manager.getImage('Ground'),
                back: manager.getImage('SkyscraperBack'),
                front: manager.getImage('SkyscraperFront')
            }
        });
        const tileBackground = new TileBackground({
            images: {
                tile: manager.getImage('Tile')
            },
            tiles: tileMatrix
        });
        scene.add(staticBackground);
        scene.add(tileBackground);

        this.callbacks = callbacks;
        this.entities = new Set();
        data.entities.forEach(({name, position: [x, y]}) => {
            const image = manager.getImage(name);
            const entity = new entities[name]({image, x, y});
            this.addEntity(entity);
        });
        this.addEntity(player);

        this.placePlayer();
    }

    addEntity (entity) {
        const {scene, world} = this._gameplay;
        scene.add(entity);
        world.add(entity.body);
        this.entities.add(entity);
    }

    removeEntity (entity) {
        const {scene, world} = this._gameplay;
        this.entities.delete(entity);
        world.remove(entity.body);
        scene.remove(entity);
    }

    loseGame () {
        this._gameplay.isStopped = true;
        this.callbacks.onGameLose();
    }

    winGame () {
        this._gameplay.isStopped = true;
        this.callbacks.onGameWin();
    }

    restartGame () {
        const {player} = this._gameplay;
        player.killable.revive();
        this._gameplay.isStopped = false;
    }

    placePlayer () {
        const {player} = this._gameplay;
        player.body.place(new Vector2(TILE_SIZE, TILE_SIZE));
    }

    isStopped () {
        const {isStopped} = this._gameplay;
        return isStopped;
    }

    isGameOver () {
        const {isStopped, player} = this._gameplay;
        return false ||
            isStopped ||
            player.body.center.y > 1200 ||
            player.body.center.x > 11400;
    }

    update (deltaTime) {
        const {entities} = this;
        const {world} = this._gameplay;

        world.update(deltaTime / 1000);

        entities.forEach((entity) => {
            entity.entityWillUpdate(deltaTime, this);
        });

        entities.forEach((entity) => {
            entity.entityDidUpdate();
        });

        this._gameplay.ellapsedTime += deltaTime;
    }
}
