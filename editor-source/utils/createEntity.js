import {
    Vector2
} from 'engine/math.js';
import TileMock from 'mocks/TileMock.js';
import LevelMock from 'mocks/LevelMock.js';
import expandSettings from 'utils/expandSettings.js';
import {
    entities
} from 'resources.js';

const settingsByEntityName = {
    Level: {
        'music': 'MusicMenu',
        'background': 'Mountains',
        'bounds.top': -500,
        'bounds.right': -500,
        'bounds.bottom': 500,
        'bounds.left': 500
    },
    Frog: {
        'range.from': 0,
        'range.to': 0
    },
    FruitFly: {
        'trigger.isPositive': true,
        'trigger.isHorizontal': true,
        'trigger.x': 0,
        'trigger.y': 0
    },
    Info: {
        'ru': '',
        'en': ''
    },
    Lizard: {
        'range.from': 0,
        'range.to': 0
    },
    Platform: {
        'from.x': 0,
        'from.y': 0,
        'to.x': 0,
        'to.y': 0,
        'speed': 0
    },
    Spider: {
        'web': 0,
        'reaction': 0
    },
    Stone: {
        'trigger.isPositive': true,
        'trigger.isHorizontal': true,
        'trigger.x': 0,
        'trigger.y': 0
    }
};

export default function createEntity (entityName, options={}) {
    if (entityName === 'Level') {
        return new LevelMock({
            ...settingsByEntityName.Level,
            ...options.settings
        }, options.manager);
    } else if (entityName === 'Tile') {
        return new TileMock();
    }

    const Entity = entities[entityName + 'Entity'];
    if (!Entity) {
        const pseudoEntity = {name: entityName};
        return pseudoEntity;
    }

    const settings = false ||
        options.settings ||
        settingsByEntityName[entityName.replace(/Entity$/, '')] ||
        {};

    const position = options.position ?
        new Vector2(options.position.x, options.position.y) :
        new Vector2(0, 0);

    options = {
        ...options,
        x: 0,
        y: 0,
        settings: expandSettings(settings)
    };

    const entity = new Entity(options);
    entity.name = entityName;
    entity.settings = settings;
    Object.defineProperty(entity, 'position', {
        get: () => position,
        configurable: true
    });
    return entity;
}
