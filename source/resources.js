const imageNames = [
    'EnemyBug',
    'Rainbow',
    'Unicorn',
    'boardUpdate',
    'glassBack',
    'grass',
    'glassFront'
];

const soundNames = [

];

const levelNames = [
    0
];

const entityNames = [
    'EnemyBug',
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
