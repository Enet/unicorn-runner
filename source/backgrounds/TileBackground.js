import Sprite from 'engine/Sprite.js';

import Background from 'backgrounds/Background.js';
import getTileIndexByDistance from 'utils/getTileIndexByDistance.js';
import resolveTileMatrix from 'utils/resolveTileMatrix.js';
import {
    TILE_SIZE,
    INDEX_TILE_BACKGROUND
} from 'constants.js';

const THOUSAND_TILE_SIZE = 1000 * TILE_SIZE;
const CLOUD_OFFSET_X = (90 - TILE_SIZE) * 0.5;
const CLOUD_OFFSET_Y = 7;
const CLOUD_EDGE_OFFSET_X = 15;
const DEBUG_TILE_IMAGES = false;

const frameDescriptions = {
    'cloud-edge-right': {
        from: 'cloud-edge-left',
        transforms: {
            scale: [-1, 1]
        }
    },
    '1-l': {
        from: 'tile-corner-left',
        transforms: {
            rotate: [0]
        }
    },
    '2-l': {
        from: 'tile-corner-left',
        transforms: {
            rotate: [Math.PI / 2]
        }
    },
    '3-l': {
        from: 'tile-corner-left',
        transforms: {
            rotate: [Math.PI]
        }
    },
    '4-l': {
        from: 'tile-corner-left',
        transforms: {
            rotate: [-Math.PI / 2]
        }
    },
    '1-r': {
        from: 'tile-corner-right',
        transforms: {
            scale: [1, 1]
        }
    },
    '2-r': {
        from: 'tile-corner-right',
        transforms: {
            scale: [-1, 1]
        }
    },
    '3-r': {
        from: 'tile-corner-right',
        transforms: {
            scale: [-1, -1]
        }
    },
    '4-r': {
        from: 'tile-corner-right',
        transforms: {
            scale: [-1, 1]
        }
    },
    '59-l': {
        from: 'tile-pipe',
        transforms: {
            scale: [1, 1]
        },
        effects: {
            alphaGradient: true
        }
    },
    '59-r': {
        from: 'tile-pipe',
        transforms: {
            scale: [-1, 1]
        },
        effects: {
            alphaGradient: true
        }
    },
    '6-l': {
        from: 'tile-edge-left',
        transforms: {
            scale: [-1, 1]
        }
    },
    '7-l': {
        from: 'tile-edge-left',
        transforms: {
            scale: [1, 1]
        }
    },
    '6-r': {
        from: 'tile-edge-right',
        transforms: {
            scale: [-1, 1]
        }
    },
    '7-r': {
        from: 'tile-edge-right',
        transforms: {
            scale: [1, 1]
        }
    },
    '8BEF-l': {
        from: 'tile-pipe',
        transforms: {
            scale: [1, 1]
        }
    },
    '8BEF-r': {
        from: 'tile-pipe',
        transforms: {
            scale: [-1, 1]
        }
    },
    'ACD-l': {
        from: 'tile-pipe',
        transforms: {
            rotate: [-Math.PI / 2]
        }
    },
    'ACD-r': {
        from: 'tile-pipe',
        transforms: {
            rotate: [Math.PI / 2]
        }
    }
};


export default class TileBackground extends Background {
    get index () {
        return INDEX_TILE_BACKGROUND;
    }

    constructor (options) {
        super(options);
        const {images, manager} = this;
        const sprite = new Sprite(images.tile, manager.getSprite('Tile'));

        this.tiles = resolveTileMatrix(options.tiles);
        this.sprite = sprite;
        this.cloudRenderer = options.cloudRenderer;

        for (let frameName in frameDescriptions) {
            const frameDescription = frameDescriptions[frameName];
            const {from, transforms, effects} = frameDescription;
            const frame = Sprite.transformFrame(
                sprite.frames.get(from),
                transforms,
                effects
            );
            frame.frameName = frameName; // information to debug
            sprite.frames.set(frameName, frame);
        }
    }

    render (context, camera) {
        const indexWidth = getTileIndexByDistance(camera.size.width) + 1;
        const startIndex = getTileIndexByDistance(camera.position.x);
        const endIndex = startIndex + indexWidth;
        const {tiles, cloudRenderer} = this;
        const tx = (camera.position.x + THOUSAND_TILE_SIZE) % TILE_SIZE;
        const ty = camera.position.y;

        context.save();
        context.translate(-tx, -ty);

        for (let xIndex = startIndex; xIndex <= endIndex; ++xIndex) {
            const column = tiles.getColumn(xIndex);
            column && column.forEach((tile, yIndex) => {
                const x = (xIndex - startIndex) * TILE_SIZE;
                const y = yIndex * TILE_SIZE;

                if (!tile.imageName) {
                    return;
                }

                const tileImage = this.sprite.frames.get(tile.imageName);
                context.drawImage(tileImage, x, y);

                const cloudImage = this.sprite.frames.get(tile.cloudName);
                let cloudEdgeOffset = 0;
                if (tile.cloudName === 'cloud-edge-left') {
                    cloudEdgeOffset = CLOUD_EDGE_OFFSET_X;
                } else if (tile.cloudName === 'cloud-edge-right') {
                    cloudEdgeOffset = -CLOUD_EDGE_OFFSET_X;
                }
                cloudImage && cloudRenderer.renderAsync((context) => {
                    context.drawImage(
                        cloudImage,
                        x - CLOUD_OFFSET_X - cloudEdgeOffset - tx,
                        y - CLOUD_OFFSET_Y - ty
                    );
                });

                if (DEBUG_TILE_IMAGES) {
                    const fontSize = 16;
                    context.fillStyle = 'red';
                    context.font = fontSize + 'px sans-serif';
                    context.textAlign = 'center';
                    context.fillText(tile.imageName, x + TILE_SIZE / 2, y + (TILE_SIZE + fontSize) / 2);
                }
            });
        }

        context.restore();
    }

    _getImageNames () {
        return {
            tile: 'Tile'
        };
    }
}
