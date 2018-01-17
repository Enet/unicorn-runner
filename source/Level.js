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
    constructor (data, {manager, scene, player}) {
        const world = new World({
            top: -300,
            left: -300,
            bottom: 600
        });

        const gameplay = {
            isStopped: false,
            ellapsedTime: 0,
            player,
            scene,
            world
        };

        const tileBodies = [];
        const tileMatrix = generateTileMatrix(data.tiles, data.patterns, (x, y) => {
            const tileBody = new BoxBody({
                statical: true,
                x: x * TILE_SIZE,
                y: y * TILE_SIZE,
                width: TILE_SIZE,
                height: TILE_SIZE
            });
            tileBody.entity = {};
            tileBody.index = new Vector2(x, y);
            tileBodies.push(tileBody);
            world.add(tileBody);
            return tileBody;
        });

        Object.assign(gameplay, {tileBodies, tileMatrix});
        this._gameplay = gameplay;

        const staticBackground = new StaticBackground({
            size: new Vector2(800, 600),
            images: {
                ground: manager.getImage('ground'),
                back: manager.getImage('skyscraperBack'),
                front: manager.getImage('skyscraperFront')
            }
        });
        const tileBackground = new TileBackground({
            size: new Vector2(800, 600),
            images: {
                tile: manager.getImage('tile')
            },
            tiles: tileMatrix
        });
        scene.add(staticBackground);
        scene.add(tileBackground);

        data.entities.forEach(({name, position: [x, y]}) => {
            const image = manager.getImage(name);
            const position = new Vector2(x, y);
            const entity = new entities[name]({image, position});
            scene.add(entity);
            world.add(entity.body);
        });
        scene.add(player);
        world.add(player.body);

        this.placePlayer();
    }

    finishGame () {
        this._gameplay.isStopped = true;
        this.placePlayer();
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

    isGameOver () {
        const {isStopped, player} = this._gameplay;
        return false ||
            isStopped ||
            player.body.center.y > 1200 ||
            player.body.center.x > 11400;
    }

    onUpdate (deltaTime) {
        const {scene, world} = this._gameplay;

        world.update(deltaTime / 1000);

        scene.forEach((entity) => {
            entity.onUpdate(deltaTime, this);
        });

        scene.forEach((entity) => {
            entity.afterUpdate();
        });

        this._gameplay.ellapsedTime += deltaTime;
    }
}
