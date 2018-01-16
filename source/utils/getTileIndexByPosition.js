import {
    TILE_SIZE
} from 'constants.js';

export default function getTileIndexByPosition (position) {
    return Math.floor(position / TILE_SIZE);
}
