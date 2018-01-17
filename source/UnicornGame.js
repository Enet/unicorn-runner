import Game from 'engine/Game.js';
import Renderer from 'engine/Renderer.js';
import Camera from 'engine/Camera.js';
import Scene from 'engine/Scene.js';
import Debugger from 'engine/Debugger.js';

import Level from 'Level.js';
import Player from 'entities/Player.js';
import Controller from 'traits/Controller.js';
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
        camera.position.y = player.body.center.y - 300;
    }

    _onManagerReady ({context, step, settings, ...callbacks}) {
        super._onManagerReady(...arguments);

        const {width, height} = context.canvas;
        const manager = this._manager;
        const renderer = new Renderer(context);
        const camera = new Camera({width, height});
        const scene = new Scene();

        scene.add(camera);

        const controller = new Controller(callbacks.onScoreChange);
        const player = new Player({
            image: manager.getImage('Unicorn'),
            controller
        });
        const level = new Level(levels[step], {
            manager, scene, player, callbacks
        });

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

