const imageNames = [
    'Mountains0',
    'Mountains1',
    'Mountains2',
    'Forest0',
    'Forest1',
    'Forest2',
    'Night0',
    'Night1',
    'Night2',
    'CitySky',
    'City1',
    'City2',
    'City3',
    'Bush',
    'Stone',
    'Explosion',
    'Mushroom',
    'Dollar10',
    'Dollar50',
    'Dollar100',
    'SlowMotion',
    'FastMotion',
    'Medicine',
    'Box',
    'Bug',
    'Lizard',
    'Rainbow',
    'Unicorn',
    'Tile'
];

const soundNames = [

];

const levelNames = [
    0
];

const entityNames = [
    'HorLaser',
    'VerLaser',
    'Bush',
    'Stone',
    'Explosion',
    'TopMushroom',
    'LeftMushroom',
    'Dollar10',
    'Dollar50',
    'Dollar100',
    'SlowMotion',
    'FastMotion',
    'Medicine',
    'Box',
    'Bug',
    'Lizard',
    'Rainbow',
    'Unicorn'
];

const backgroundNames = [
    'City',
    'Night',
    'Forest',
    'Mountains'
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

export const backgrounds = {};
backgroundNames.forEach((backgroundName) => {
    backgrounds[backgroundName] = require(`backgrounds/${backgroundName}.js`).default;
});
