import StaticBackground from 'entities/StaticBackground.js';
import TileBackground from 'entities/TileBackground.js';

import EntityCollider from 'EntityCollider.js';
import TileCollider from 'TileCollider.js';

import {
    Matrix
} from 'engine/math.js';
import {
    entities
} from 'resources.js';

export default class Level {
    constructor (data, {manager, scene, player}) {
        this.gravity = 1500;
        this.totalTime = 0;

        this.scene = scene;

        this.entityCollider = new EntityCollider(this.scene);
        this.tileCollider = null;


        // set collision matrix
        const mergedTiles = data.layers.reduce((mergedTiles, layerSpec) => {
            return mergedTiles.concat(layerSpec.tiles);
        }, []);
        const collisionMatrix = createTileMatrix(mergedTiles, data.patterns);
        this.tileCollider = new TileCollider(collisionMatrix);


        // set up backgrounds
        data.layers.forEach((layer) => {
            const backgroundMatrix = createTileMatrix(layer.tiles, data.patterns);
            const backgroundLayer = new TileBackground(manager.getImage('boardUpdate'), backgroundMatrix);
            const staticBackgroundLayer = new StaticBackground(manager);
            this.scene.add(staticBackgroundLayer);
            this.scene.add(backgroundLayer);
        });

        // set up entities
        data.entities.forEach(({name, position: [x, y]}) => {
            const entity = new entities[name](manager.getImage(name));
            entity.position.set(x, y);
            this.scene.add(entity);
        });

        this.scene.add(player);
    }

    onUpdate (deltaTime) {
        deltaTime /= 1000;

        this.scene.forEach((entity) => {
            entity.onUpdate(deltaTime, this);
        });

        this.scene.forEach((entity) => {
            this.entityCollider.check(entity);
        });

        this.scene.forEach((entity) => {
            entity.finalize();
        });

        this.totalTime += deltaTime;
    }

    gameOver () {
        this.isGameOver = true;
    }
}

function createTileMatrix (tiles, patterns) {
    const matrix = new Matrix();
    for (const {tile, x, y} of expandTiles(tiles, patterns)) {
        matrix.setElement(x, y, {type: tile.type});
    }
    return matrix;
}

function* expandSpan (xStart, xLen, yStart, yLen) {
    const xEnd = xStart + xLen;
    const yEnd = yStart + yLen;
    for (let x = xStart; x < xEnd; ++x) {
        for (let y = yStart; y < yEnd; ++y) {
            yield {x, y};
        }
    }
}

function expandRange (range) {
    if (range.length === 4) {
        const [xStart, xLen, yStart, yLen] = range;
        return expandSpan(xStart, xLen, yStart, yLen);

    } else if (range.length === 3) {
        const [xStart, xLen, yStart] = range;
        return expandSpan(xStart, xLen, yStart, 1);

    } else if (range.length === 2) {
        const [xStart, yStart] = range;
        return expandSpan(xStart, 1, yStart, 1);
    }
}

function* expandRanges (ranges) {
    for (const range of ranges) {
        yield* expandRange(range);
    }
}

function* expandTiles (tiles, patterns) {
    function* walkTiles (tiles, offsetX, offsetY) {
        for (const tile of tiles) {
            for (const {x, y} of expandRanges(tile.ranges)) {
                const derivedX = x + offsetX;
                const derivedY = y + offsetY;

                if (tile.pattern) {
                    const tiles = patterns[tile.pattern].tiles;
                    yield* walkTiles(tiles, derivedX, derivedY);
                } else {
                    yield {
                        tile,
                        x: derivedX,
                        y: derivedY
                    };
                }
            }
        }
    }

    yield* walkTiles(tiles, 0, 0);
}
