import Game from 'engine/Game.js';
import Renderer from 'engine/Renderer.js';
import Camera from 'engine/Camera.js';
import Scene from 'engine/Scene.js';

import Level from 'Level.js';
import Player from 'entities/Player.js';
import Controller from 'traits/Controller.js';

import {
    Vec2
} from 'engine/math.js';
import Debugger from 'engine/Debugger.js';

import {
    KEY_SPACE
} from 'constants.js';

import {
    images,
    sounds,
    levels
} from 'resources.js';

export default class UnicornGame extends Game {
    _getResources () {
        return {images, sounds};
    }

    _updateLevel (deltaTime) {
        const {level} = this._game;
        level.onUpdate(deltaTime);
    }

    _centerCamera () {
        const {camera, player} = this._game;
        camera.position.x = Math.max(0, player.body.center.x - 200);
    }

    _onManagerReady ({context, onScoreChange}) {
        super._onManagerReady(...arguments);

        const {width, height} = context.canvas;
        const manager = this._manager;
        const renderer = new Renderer(context);
        const camera = new Camera(width, height, 0, 0);
        const scene = new Scene();

        scene.add(camera);

        const controller = new Controller(onScoreChange);
        const player = new Player({
            image: manager.getImage('Unicorn'),
            position: new Vec2(50, 0),
            controller
        });
        const level = new Level(levels[0], {manager, scene, player});

        this._debugger = new Debugger(level._gameplay.world, camera, context);
        this._game = {renderer, scene, camera, level, player};
    }

    _onUpdate (deltaTime) {
        const {renderer, scene} = this._game;
        this._updateLevel(deltaTime);
        this._centerCamera();
        renderer.render(scene);
        this._debugger.render();
    }

    _onWindowKeyDown (event) {
        const {player} = this._game;
        if (event.keyCode === KEY_SPACE) {
            player.jump.start();
        } else {
            player.jump.cancel();
        }
    }

    _onWindowKeyUp (event) {
        const {player} = this._game;
        player.jump.cancel();
    }
}

