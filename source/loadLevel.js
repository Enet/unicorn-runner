import {
    Matrix
} from 'math.js';
import {
    createBackgroundLayer,
    drawStaticBackground,
    createSpriteLayer
} from 'layers.js';
import Level from 'Level.js';

export function setupCollision (levelSpec, level) {
    const mergedTiles = levelSpec.layers.reduce((mergedTiles, layerSpec) => {
        return mergedTiles.concat(layerSpec.tiles);
    }, []);
    const collisionGrid = createCollisionGrid(mergedTiles, levelSpec.patterns);
    level.setCollisionGrid(collisionGrid);
}

export function setupBackgrounds (levelSpec, level, manager) {
    levelSpec.layers.forEach(layer => {
        const backgroundGrid = createBackgroundGrid(layer.tiles, levelSpec.patterns);
        const backgroundLayer = createBackgroundLayer(level, backgroundGrid, manager);
        const staticBackgroundLayer = drawStaticBackground(manager);
        level.comp.layers.push(staticBackgroundLayer);
        level.comp.layers.push(backgroundLayer);
    });
}

export function setupEntities (levelSpec, level, entityFactory) {
    levelSpec.entities.forEach(({name, pos: [x, y]}) => {
        const createEntity = entityFactory[name];
        const entity = createEntity();
        entity.position.set(x, y);
        level.entities.add(entity);
    });

    const spriteLayer = createSpriteLayer(level.entities);
    level.comp.layers.push(spriteLayer);
}

export function createLevelLoader (entityFactory) {
    return function loadLevel (levelSpec, manager) {
        const level = new Level();
        setupCollision(levelSpec, level);
        setupBackgrounds(levelSpec, level, manager);
        setupEntities(levelSpec, level, entityFactory);
        return level;
    }
}

export function createCollisionGrid (tiles, patterns) {
    const grid = new Matrix();

    for (const {tile, x, y} of expandTiles(tiles, patterns)) {
        grid.setElement(x, y, {type: tile.type});
    }

    return grid;
}

export function createBackgroundGrid (tiles, patterns) {
    const grid = new Matrix();

    for (const {tile, x, y} of expandTiles(tiles, patterns)) {
        grid.setElement(x, y, {name: tile.name});
    }

    return grid;
}


export function* expandSpan (xStart, xLen, yStart, yLen) {
    const xEnd = xStart + xLen;
    const yEnd = yStart + yLen;
    for (let x = xStart; x < xEnd; ++x) {
        for (let y = yStart; y < yEnd; ++y) {
            yield {x, y};
        }
    }
}

export function expandRange (range) {
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

export function* expandRanges (ranges) {
    for (const range of ranges) {
        yield* expandRange(range);
    }
}

export function* expandTiles (tiles, patterns) {
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
