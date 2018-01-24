import ResourceManager from 'engine/ResourceManager.js';

import {
    sprites,
    entities,
    backgrounds
} from 'resources.js';

export default class UnicornResourceManager extends ResourceManager {
    getSprite (spriteName) {
        return sprites[spriteName + 'Sprite'];
    }

    getEntity (entityName) {
        return entities[entityName + 'Entity'];
    }

    getBackground (backgroundName) {
        if (backgroundName === 'Parallax' ||
            backgroundName === 'Tile' ||
            backgroundName === 'Lava') {
            return;
        }
        return backgrounds[backgroundName + 'Background'];
    }
}
