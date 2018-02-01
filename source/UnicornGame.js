import Game from 'engine/Game.js';
import Renderer from 'engine/Renderer.js';
import Camera from 'engine/Camera.js';
import Scene from 'engine/Scene.js';
import Debugger from 'engine/Debugger.js';

import UnicornResourceManager from 'UnicornResourceManager.js';
import TouchScreen from 'TouchScreen.js';
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

    pause () {
        super.pause(...arguments);
        if (!this._game) {
            return;
        }
        const {level} = this._game;
        level.pause();
    }

    resume () {
        super.resume(...arguments);
        if (!this._game) {
            return;
        }
        const {level} = this._game;
        level.resume();
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

        const kb = this._keyboard;
        const ts = this._touchScreen;
        const newState = {
            up: kb.isPressed(KEY_UP, KEY_W, KEY_SPACE) || ts.isSectorTouching('top'),
            down: kb.isPressed(KEY_DOWN, KEY_S) || ts.isSectorTouching('bottom'),
            left: kb.isPressed(KEY_LEFT, KEY_A) || ts.isSectorTouching('left'),
            right: kb.isPressed(KEY_RIGHT, KEY_D) || ts.isSectorTouching('right')
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
        const {canvas} = context;
        canvas.style.transform = scale;
        canvas.width = width;
        canvas.height = height;

        const manager = this._manager;
        const renderer = new Renderer(context);
        const camera = new Camera(size);
        const scene = new Scene();
        scene.add(camera);

        const level = new Level(levels[step], {
            manager, scene, settings, callbacks
        });

        this._touchScreen = new TouchScreen(canvas);
        this._game = {context, renderer, scene, camera, level};
        if (debug) {
            this._debugger = new Debugger(level.world, camera, context);
        }

        const {onGameReady} = callbacks;
        onGameReady && onGameReady();
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

