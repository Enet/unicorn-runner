const imageNames = [
    'Dollar10',
    'Dollar50',
    'Dollar100',
    'SlowMotion',
    'FastMotion',
    'Medicine',
    'Box',
    'Bug',
    'Rainbow',
    'Unicorn',
    'SkyscraperBack',
    'SkyscraperFront',
    'Ground',
    'Tile'
];

const soundNames = [

];

const levelNames = [
    0
];

const entityNames = [
    'Dollar10',
    'Dollar50',
    'Dollar100',
    'SlowMotion',
    'FastMotion',
    'Medicine',
    'Box',
    'Bug',
    'Rainbow',
    'Unicorn'
];

export const images = {};
imageNames.forEach((imageName) => {
    images[imageName] = require(`images/${imageName}.png`);
});

export const sounds = {};
soundNames.forEach((soundName) => {
    sounds[soundName] = require(`sounds/${soundName}.png`);
});

export const levels = levelNames.map((levelName) => {
    return require(`levels/${levelName}.js`).default;
});

export const entities = {};
entityNames.forEach((entityName) => {
    entities[entityName] = require(`entities/${entityName}.js`).default;
});
