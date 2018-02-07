import createEntity from 'utils/createEntity.js';
import flattenSettings from 'utils/flattenSettings.js';
import getEmptyLevel from 'utils/getEmptyLevel.js';
import generateTileMatrix from 'game/utils/generateTileMatrix.js';

export default function jsonToLevel (json, manager) {
    let data;
    try {
        data = JSON.parse(json);
    } catch (error) {
        console.error(error);
        data = getEmptyLevel();
    }
    const settings = data.meta ? flattenSettings(data.meta) : {};
    const level = createEntity('LevelEntity', {settings, manager});

    const tiles = generateTileMatrix(data.tiles, data.patterns, () => {});
    const entities = data.entities.map((entity) => {
        return createEntity(entity.name + 'Entity', {
            level,
            position: entity.position,
            settings: entity.settings ? flattenSettings(entity.settings) : null
        });
    });
    const meta = data.meta;

    Object.assign(level, {tiles, entities, meta, json});
    return level;
}
