import Game from 'Game.js';

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

import {
    images,
    sounds,
    levels
} from 'resources.js';

export default class UnicornGame extends Game {
    _getResources () {
        return {images, sounds};
    }

    _onManagerReady ({canvas, onScoreChange}) {
        super._onManagerReady(...arguments);

        const manager = this._manager;
        const characterFactory = {
            unicorn: loadUnicorn(manager),
            enemyBug: loadEnemyBug(manager),
            rainbow: loadRainbow(manager)
        };
        const loadLevel = createLevelLoader(characterFactory);
        const level = loadLevel(levels[0], manager);
        const camera = new Camera(canvas.width, canvas.height, 0, 0);
        const unicorn = characterFactory.unicorn();

        const playerEnv = new Entity();
        const playerControl = new PlayerController(onScoreChange);
        playerControl.checkpoint.set(64, 64);
        playerControl.setPlayer(unicorn);
        playerEnv.addTrait(playerControl);
        level.entities.add(playerEnv);

        Object.assign(this._scene, {camera, unicorn, level});
    }

    _onUpdate (deltaTime) {
        const {context} = this._canvas;
        const {level, camera, unicorn} = this._scene;
        level.update(deltaTime / 1000);
        camera.position.x = Math.max(0, unicorn.position.x - 100);
        level.comp.draw(context, camera);
    }

    _onWindowKeyDown (event) {
        const {unicorn} = this._scene;
        if (event.code === 'Space') {
            unicorn.jump.start();
        } else {
            unicorn.jump.cancel();
        }
    }

    _onWindowKeyUp (event) {
        const {unicorn} = this._scene;
        unicorn.jump.cancel();
    }
}

