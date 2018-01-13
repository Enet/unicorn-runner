import TileResolver from 'TileResolver.js';
import {
    SIDE_TOP,
    SIDE_BOTTOM,
    SIDE_LEFT,
    SIDE_RIGHT
} from 'constants.js';

export default class TileCollider {
    constructor (matrix) {
        this.tiles = new TileResolver(matrix);
    }

    checkX (entity) {
        let x;
        if (entity.velocity.x > 0) {
            x = entity.bounds.right;
        } else if (entity.velocity.x < 0) {
            x = entity.bounds.left;
        } else {
            return;
        }

        const matches = this.tiles.searchByRange(
            x, x,
            entity.bounds.top, entity.bounds.bottom);

        matches.forEach((match) => {
            if (entity.velocity.x > 0) {
                if (entity.bounds.right > match.x1) {
                    entity.obstruct(SIDE_RIGHT, match);
                }
            } else if (entity.velocity.x < 0) {
                if (entity.bounds.left < match.x2) {
                    entity.obstruct(SIDE_LEFT, match);
                }
            }
        });
    }

    checkY (entity) {
        let y;
        if (entity.velocity.y > 0) {
            y = entity.bounds.bottom;
        } else if (entity.velocity.y < 0) {
            y = entity.bounds.top;
        } else {
            return;
        }

        const matches = this.tiles.searchByRange(
            entity.bounds.left,
            entity.bounds.right,
            y,
            y
        );

        matches.forEach((match) => {
            if (entity.velocity.y > 0) {
                if (entity.bounds.bottom > match.y1) {
                    entity.obstruct(SIDE_BOTTOM, match);
                }
            } else if (entity.velocity.y < 0) {
                if (entity.bounds.top < match.y2) {
                    entity.obstruct(SIDE_TOP, match);
                }
            }
        });
    }
}
