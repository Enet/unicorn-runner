import Game from 'engine/Game.js';
import Renderer from 'engine/Renderer.js';
import Camera from 'engine/Camera.js';
import Scene from 'engine/Scene.js';
import Debugger from 'engine/Debugger.js';

import Level from 'Level.js';
import {
    KEY_SPACE,
    KEY_F
} from 'constants.js';
import {
    images,
    sounds,
    levels,
    aliases
} from 'resources.js';

export default class UnicornGame extends Game {
    _getResources () {
        return {images, sounds, aliases};
    }

    _updateLevel (deltaTime) {
        const {level} = this._game;
        level.update(deltaTime);
    }

    _centerCamera () {
        const {camera, level} = this._game;
        const {player} = level;
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
        const level = new Level(levels[step], {
            manager, scene, callbacks
        });

        scene.add(camera);
        this._debugger = new Debugger(level.world, camera, context);
        this._game = {renderer, scene, camera, level};
    }

    _onUpdate (deltaTime) {
        this._updateLevel(deltaTime);
        this._centerCamera();

        const {renderer, scene} = this._game;
        renderer.render(scene);
        this._debugger.render();
    }

    _onWindowKeyDown (event) {
        if (this._isPaused) {
            return;
        }

        const {player} = this._game.level;
        if (event.keyCode === KEY_F) {
            player.fight.start();
        }

        if (event.keyCode === KEY_SPACE) {
            player.jump.start();
            player.fly.up();
        } else {
            player.jump.cancel();
            player.fly.down();
        }
    }

    _onWindowKeyUp (event) {
        if (this._isPaused) {
            return;
        }

        const {player} = this._game.level;
        if (event.keyCode === KEY_F) {
            player.fight.cancel();
        }

        player.jump.cancel();
        player.fly.down();
    }
}

