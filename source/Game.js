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

import LEVEL from 'levels/0.js';

function loadCharacters () {
    const entityFactories = {};

    function addFactory (name) {
        return (factory) => entityFactories[name] = factory;
    }


    return Promise.all([
        loadUnicorn().then(addFactory('unicorn')),
        loadEnemyBug().then(addFactory('enemyBug')),
        loadRainbow().then(addFactory('rainbow'))
    ])
        .then(() => entityFactories);
}

function createPlayerEnv (playerEntity) {
    const playerEnv = new Entity();
    const playerControl = new PlayerController();
    playerControl.checkpoint.set(64, 64);
    playerControl.setPlayer(playerEntity);
    playerEnv.addTrait(playerControl);
    return playerEnv;
}

export default class Game {
    constructor (canvasNode) {
        this._init(canvasNode);
    }

    async _init (canvasNode) {
        const canvasWidth = canvasNode.width;
        const canvasHeight = canvasNode.height;

        const context = canvasNode.getContext('2d');
        const characterFactory = await loadCharacters();
        const loadLevel = await createLevelLoader(characterFactory);
        const level = await loadLevel(LEVEL);
        const camera = new Camera(canvasWidth, canvasHeight, 0, 0);
        const unicorn = characterFactory.unicorn();
        const playerEnv = createPlayerEnv(unicorn);

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
            level.comp.draw(context, camera);
        }

        timer.start();
    }
}

