import ResourceManager from 'ResourceManager.js';

import Timer from 'Timer.js';
import Camera from 'Camera.js';
import Entity from 'Entity.js';
import {
    createLevelLoader
} from 'loadLevel.js';
import {
    loadUnicorn
} from 'characters/Unicorn.js';
import {
    loadRainbow
} from 'characters/Rainbow.js';
import {
    loadEnemyBug
} from 'characters/EnemyBug.js';
import PlayerController from 'PlayerController.js';

import boardUpdateImage from 'images/boardUpdate.png';
import bugLineImage from 'images/bugLine.png';
import rainbowLineImage from 'images/rainbowLine.png';
import unicornFullImage from 'images/unicornFull.png';
import glassBackImage from 'images/glassBack.png';
import grassImage from 'images/grass.png';
import glassFrontImage from 'images/glassFront.png';

import LEVEL from 'levels/0.js';

const images = {
    boardUpdate: boardUpdateImage,
    bugLine: bugLineImage,
    rainbowLine: rainbowLineImage,
    unicornFull: unicornFullImage,
    glassBack: glassBackImage,
    grass: grassImage,
    glassFront: glassFrontImage
};

const sounds = {};

function loadCharacters (manager) {
    return {
        unicorn: loadUnicorn(manager),
        enemyBug: loadEnemyBug(manager),
        rainbow: loadRainbow(manager)
    };
}

function createPlayerEnv (playerEntity, onScoreChange) {
    const playerEnv = new Entity();
    const playerControl = new PlayerController(onScoreChange);
    playerControl.checkpoint.set(64, 64);
    playerControl.setPlayer(playerEntity);
    playerEnv.addTrait(playerControl);
    return playerEnv;
}

export default class Game {
    constructor (options) {
        const manager = new ResourceManager();
        manager.fetchResources({images, sounds}).then(() => {
            this._onManagerReady(options);
        });
        this._manager = manager;
    }

    getManager () {
        return this._manager;
    }

    _onManagerReady ({canvas, onScoreChange}) {
        const manager = this._manager;
        const characterFactory = loadCharacters(manager);
        const loadLevel = createLevelLoader(characterFactory);
        const level = loadLevel(LEVEL, manager);
        const camera = new Camera(canvas.width, canvas.height, 0, 0);
        const unicorn = characterFactory.unicorn();
        const playerEnv = createPlayerEnv(unicorn, onScoreChange);

        level.entities.add(playerEnv);

        ['keydown', 'keyup'].forEach((eventName) => {
            window.addEventListener(eventName, (event) => {
                if (event.code === 'Space') {
                    const keyState = event.type === 'keydown' ? 1 : 0;

                    if (keyState > 0) {
                        unicorn.jump.start();
                    } else {
                        unicorn.jump.cancel();
                    }
                } else {
                    unicorn.jump.cancel();
                }
            });
        });

        const timer = new Timer(1 / 60);
        timer.update = function update (deltaTime) {
            level.update(deltaTime);
            camera.position.x = Math.max(0, unicorn.position.x - 100);
            level.comp.draw(canvas.context, camera);
        }

        timer.start();
    }
}

