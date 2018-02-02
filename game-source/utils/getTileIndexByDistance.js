import {
    TILE_SIZE
} from 'constants.js';

export default function getTileIndexByDistance (distance) {
    return Math.floor(distance / TILE_SIZE);
}
