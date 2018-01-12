const imageNames = [
    'boardUpdate',
    'bugLine',
    'rainbowLine',
    'unicornFull',
    'glassBack',
    'grass',
    'glassFront'
];

const soundNames = [

];

const levelNames = [
    0
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
