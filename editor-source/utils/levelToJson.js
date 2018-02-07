import expandSettings from 'utils/expandSettings.js';
import stringifyTileMatrix from 'utils/stringifyTileMatrix.js';

export default function levelToJson (level) {
    const {meta} = level;
    const entities = [];
    level.entities.forEach((entity) => {
        if (entity.name === 'PlayerEntity') {
            return;
        }
        entities.push({
            name: entity.name.replace(/Entity$/, ''),
            position: {
                x: entity.position.x,
                y: entity.position.y
            },
            settings: expandSettings(entity.settings)
        });
    });
    const patterns = [];
    const ranges = stringifyTileMatrix(level.tiles);
    const tiles = [{ranges}];

    return JSON.stringify({meta, patterns, tiles, entities});
}
