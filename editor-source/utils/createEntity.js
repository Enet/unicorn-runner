import {
    Vector2
} from 'engine/math.js';
import TileMock from 'mocks/TileMock.js';
import LevelMock from 'mocks/LevelMock.js';
import expandSettings from 'utils/expandSettings.js';
import {
    entities
} from 'game/resources.js';

const settingsByEntityName = {
    LevelEntity: {
        'music': 'MusicMenu',
        'background': 'Mountains',
        'bounds.top': 0,
        'bounds.right': 0,
        'bounds.bottom': 0,
        'bounds.left': 0
    },
    BirdEntity: {
        'range.from': 0,
        'range.to': 0
    },
    Coin10Entity: {
        'gravity': true
    },
    Coin50Entity: {
        'gravity': true
    },
    Coin100Entity: {
        'gravity': true
    },
    FrogEntity: {
        'range.from': 0,
        'range.to': 0
    },
    FruitFlyEntity: {
        'trigger.isPositive': true,
        'trigger.isHorizontal': true,
        'trigger.x': 0,
        'trigger.y': 0
    },
    InfoEntity: {
        'ru': '',
        'en': ''
    },
    LizardEntity: {
        'range.from': 0,
        'range.to': 0
    },
    PlatformEntity: {
        'from.x': 0,
        'from.y': 0,
        'to.x': 0,
        'to.y': 0,
        'speed': 0
    },
    SpiderEntity: {
        'web': 0,
        'reaction': 0
    },
    StoneEntity: {
        'trigger.isPositive': true,
        'trigger.isHorizontal': true,
        'trigger.x': 0,
        'trigger.y': 0
    }
};

let uniqueEntityId = 0;

export default function createEntity (entityName, options={}) {
    if (entityName === 'LevelEntity') {
        return new LevelMock({
            ...settingsByEntityName[entityName],
            ...options.settings
        }, options.manager);
    } else if (entityName === 'TileEntity') {
        return new TileMock();
    }

    const Entity = entities[entityName];
    if (!Entity) {
        const pseudoEntity = {name: entityName};
        return pseudoEntity;
    }

    const settings = false ||
        options.settings ||
        {...settingsByEntityName[entityName]} ||
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
    entity.id = ++uniqueEntityId;
    entity._shouldRender = () => true;
    Object.defineProperty(entity, 'position', {
        get: () => position,
        configurable: true
    });
    return entity;
}
