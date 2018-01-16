const imageNames = [
    'Bug',
    'Rainbow',
    'Unicorn',
    'skyscraperBack',
    'skyscraperFront',
    'ground',
    'tile'
];

const soundNames = [

];

const levelNames = [
    0
];

const entityNames = [
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
