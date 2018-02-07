import createEntity from 'utils/createEntity.js';
import flattenSettings from 'utils/flattenSettings.js';
import generateTileMatrix from '../../game-source/utils/generateTileMatrix.js';

export default function jsonToLevel (json, manager) {
    let data;
    try {
        data = JSON.parse(json);
    } catch (error) {
        console.error(error);
        data = {
            meta: {
                background: '',
                music: '',
                bounds: {top: 0, right: 0, bottom: 0, left: 0}
            },
            patterns: [],
            tiles: [],
            entities: []
        };
    }
    const settings = data.meta ? flattenSettings(data.meta) : {};
    const level = createEntity('Level', {settings, manager});

    const tiles = generateTileMatrix(data.tiles, data.patterns, () => {});
    const entities = data.entities.map((entity) => {
        return createEntity(entity.name, {
            level,
            position: entity.position,
            settings: entity.settings ? flattenSettings(entity.settings) : null
        });
    });
    const meta = data.meta;

    Object.assign(level, {tiles, entities, meta, json});
    return level;
}
