import Game from 'engine/Game.js';
import Renderer from 'engine/Renderer.js';
import Camera from 'engine/Camera.js';
import Scene from 'engine/Scene.js';
import Debugger from 'engine/Debugger.js';

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
        const keyboard = this._keyboard;
        const {player} = this._game.level;

        if (keyboard.isPressed(KEY_DOWN, KEY_S)) {
            player.fight.start();
            player.fly.down(true);
        } else {
            player.fight.cancel();
            player.fly.down(false);
        }

        if (keyboard.isPressed(KEY_UP, KEY_W, KEY_SPACE)) {
            player.jump.start();
            player.fly.up(true);
        } else {
            player.jump.cancel();
            player.fly.up(false);
        }

        if (keyboard.isPressed(KEY_LEFT, KEY_A)) {
            player.run.left();
            player.fly.left(true);
        } else {
            player.fly.left(false);
        }

        if (keyboard.isPressed(KEY_RIGHT, KEY_D)) {
            player.run.right();
            player.fly.right(true);
        } else {
            player.fly.right(false);
        }
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
        const level = new Level(levels[step], {
            manager, scene, callbacks
        });

        scene.add(camera);
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

