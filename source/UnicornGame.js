import Game from 'engine/Game.js';
import Renderer from 'engine/Renderer.js';
import Camera from 'engine/Camera.js';
import Scene from 'engine/Scene.js';
import Debugger from 'engine/Debugger.js';

import UnicornResourceManager from 'UnicornResourceManager.js';
import Level from 'Level.js';
import {
    CAMERA_OFFSET,
    KEY_SPACE,
    KEY_UP,
    KEY_DOWN,
    KEY_LEFT,
    KEY_RIGHT,
    KEY_W,
    KEY_S,
    KEY_A,
    KEY_D
} from 'constants.js';
import {
    images,
    sounds,
    levels
} from 'resources.js';

export default class UnicornGame extends Game {
    destructor () {
        super.destructor(...arguments);
        const {level} = this._game;
        level.destructor();
    }

    _createManager () {
        return new UnicornResourceManager();
    }

    _getResources () {
        return {images, sounds};
    }

    _updateLevel (deltaTime) {
        const {level} = this._game;
        level.update(deltaTime);
    }

    _centerCamera () {
        const {camera, level} = this._game;
        const {player} = level;
        camera.position.x = player.body.center.x - CAMERA_OFFSET.x;
        camera.position.y = player.body.center.y - CAMERA_OFFSET.y;
    }

    _controlPlayer () {
        const {player, settings} = this._game.level;
        if (!player.controller) {
            return;
        }

        const keyboard = this._keyboard;
        const newState = {
            up: keyboard.isPressed(KEY_UP, KEY_W, KEY_SPACE),
            down: keyboard.isPressed(KEY_DOWN, KEY_S),
            left: keyboard.isPressed(KEY_LEFT, KEY_A),
            right: keyboard.isPressed(KEY_RIGHT, KEY_D)
        };
        if (settings.mirror) {
            [newState.left, newState.right] = [newState.right, newState.left];
        }
        player.controller.setState(newState);
    }

    _onManagerReady ({debug, context, step, settings, ...callbacks}) {
        super._onManagerReady(...arguments);
        const scale = `scale(${settings.mirror ? -1 : 1}, 1)`;
        context.canvas.style.transform = scale;

        const {width, height} = context.canvas;
        const manager = this._manager;
        const renderer = new Renderer(context);
        const camera = new Camera({width, height});
        const scene = new Scene();
        scene.add(camera);

        const level = new Level(levels[step], {
            manager, scene, settings, callbacks
        });

        this._game = {renderer, scene, camera, level};
        if (debug) {
            this._debugger = new Debugger(level.world, camera, context);
        }
    }

    _onUpdate (deltaTime) {
        this._controlPlayer();
        this._updateLevel(deltaTime);
        this._centerCamera();

        const {renderer, scene} = this._game;
        renderer.render(scene);
        this._debugger && this._debugger.render();
    }
}

