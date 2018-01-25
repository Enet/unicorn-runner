import Sprite from 'engine/Sprite.js';

import Background from 'backgrounds/Background.js';
import getTileIndexByDistance from 'utils/getTileIndexByDistance.js';
import polarizeTileMatrix from 'utils/polarizeTileMatrix.js';
import {
    TILE_SIZE,
    INDEX_TILE_BACKGROUND
} from 'constants.js';

const THOUSAND_TILE_SIZE = 1000 * TILE_SIZE;
const DEBUG_TILE_IMAGES = false;

export default class TileBackground extends Background {
    get index () {
        return INDEX_TILE_BACKGROUND;
    }

    constructor (options) {
        super(options);
        const {images, manager} = this;

        this.tiles = polarizeTileMatrix(options.tiles);
        this.sprite = new Sprite(images.tile, manager.getSprite('Tile'));
        this.cloudRenderer = options.cloudRenderer;

        this._setFrame('cloud-edge-right', this._transformFrame('cloud-edge-left', {
            scale: [-1, 1]
        }, {}, 90, 43));
        this._setFrame('0', this.sprite.frames.get('cloud-center'));
        this._setFrame('1', this._transformFrame('tile-corner-left', {
            rotate: [0]
        }));
        this._setFrame('2', this._transformFrame('tile-corner-left', {
            rotate: [Math.PI / 2]
        }));
        this._setFrame('3', this._transformFrame('tile-corner-left', {
            rotate: [Math.PI]
        }));
        this._setFrame('4', this._transformFrame('tile-corner-left', {
            rotate: [-Math.PI / 2]
        }));
        this._setFrame('1f', this._transformFrame('tile-corner-right', {
            scale: [1, 1]
        }));
        this._setFrame('2f', this._transformFrame('tile-corner-right', {
            scale: [-1, 1]
        }));
        this._setFrame('3f', this._transformFrame('tile-corner-right', {
            scale: [-1, -1]
        }));
        this._setFrame('4f', this._transformFrame('tile-corner-right', {
            scale: [-1, 1]
        }));
        this._setFrame('59', this._transformFrame('tile-pipe', {
            scale: [1, 1]
        }, {
            alphaGradient: true
        }));
        this._setFrame('59f', this._transformFrame('tile-pipe', {
            scale: [-1, 1]
        }, {
            alphaGradient: true
        }));
        this._setFrame('6', this._transformFrame('tile-edge-left', {
            scale: [-1, 1]
        }));
        this._setFrame('7', this._transformFrame('tile-edge-left', {
            scale: [1, 1]
        }));
        this._setFrame('6f', this._transformFrame('tile-edge-right', {
            scale: [-1, 1]
        }));
        this._setFrame('7f', this._transformFrame('tile-edge-right', {
            scale: [1, 1]
        }));
        this._setFrame('8BEF', this._transformFrame('tile-pipe', {
            scale: [1, 1]
        }));
        this._setFrame('8BEFf', this._transformFrame('tile-pipe', {
            scale: [-1, 1]
        }));
        this._setFrame('ACD', this._transformFrame('tile-pipe', {
            rotate: [-Math.PI / 2]
        }));
        this._setFrame('ACDf', this._transformFrame('ACD', {
            scale: [1, -1]
        }));
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
                const tileImage = this.sprite.frames.get(tile.imageName);
                const cloudImage = this.sprite.frames.get(tile.cloudName);
                context.drawImage(tileImage, x, y);
                let cloudOffset = (90 - 60) * 0.5;
                if (tile.cloudName === 'cloud-edge-left') {
                    cloudOffset += 15;
                } else if (tile.cloudName === 'cloud-edge-right') {
                    cloudOffset -= 15;
                }
                cloudImage && cloudRenderer.renderAsync((context) => {
                    context.drawImage(cloudImage, x - cloudOffset - tx, y - 20 - ty);
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

    _setFrame (frameName, frame) {
        frame.frameName = frameName;
        this.sprite.frames.set(frameName, frame);
    }

    _transformFrame (frameName, transformations={}, effects={}, width=TILE_SIZE, height=TILE_SIZE) {
        const image = this.sprite.frames.get(frameName);
        const halfWidth = width * 0.5;
        const halfHeight = height * 0.5;

        const frame = document.createElement('canvas');
        frame.width = width;
        frame.height = height;

        const context = frame.getContext('2d');

        context.translate(halfWidth, halfHeight);
        for (let t in transformations) {
            context[t](...transformations[t]);
        }
        context.drawImage(image, -halfWidth, -halfHeight);
        if (effects.alphaGradient) {
            const imageData = context.getImageData(0, 0, width, height);
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    imageData.data[(x + y * width) * 4 + 3] = 255 * (1 - y / height);
                }
            }
            context.putImageData(imageData, 0, 0);
        }

        return frame;
    }
}
