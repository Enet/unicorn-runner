import Game from 'engine/Game.js';
import Renderer from 'engine/Renderer.js';
import Camera from 'engine/Camera.js';
import Scene from 'engine/Scene.js';
import Debugger from 'engine/Debugger.js';

import UnicornResourceManager from 'UnicornResourceManager.js';
import Level from 'Level.js';
import {
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

    resize (size) {
        this._size = size;
        if (!this._game) {
            return;
        }
        const {width, height} = size;
        const {context, camera} = this._game;
        context.canvas.width = width;
        context.canvas.height = height;
        camera.size.width = width;
        camera.size.height = height;
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
        const x = player.body.center.x - 0.5 * camera.size.width;
        const y = Math.min(
            level.bounds.bottom,
            player.body.center.y + 0.5 * camera.size.height
        ) - camera.size.height;
        camera.position.x = x;
        camera.position.y = y;
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

    _onManagerReady ({debug, context, size, step, settings, ...callbacks}) {
        super._onManagerReady(...arguments);

        size = this._size || size;
        const {width, height} = size;
        const scale = `scale(${settings.mirror ? -1 : 1}, 1)`;
        context.canvas.style.transform = scale;
        context.canvas.width = width;
        context.canvas.height = height;

        const manager = this._manager;
        const renderer = new Renderer(context);
        const camera = new Camera(size);
        const scene = new Scene();
        scene.add(camera);

        const level = new Level(levels[step], {
            manager, scene, settings, callbacks
        });

        this._game = {context, renderer, scene, camera, level};
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

