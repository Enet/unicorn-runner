import Renderer from 'engine/Renderer.js';
import Camera from 'engine/Camera.js';
import Scene from 'engine/Scene.js';
import ParticleSystem from 'engine/ParticleSystem.js';
import {
    Vector2
} from 'engine/math.js';

import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    connect
} from 'xuder';

import Screen from 'components/Screen/Screen.jsx';
import Locale from 'components/Locale/Locale.jsx';
import {
    COLOR_RED,
    COLOR_ORANGE,
    COLOR_YELLOW,
    COLOR_GREEN,
    COLOR_SKY,
    COLOR_BLUE,
    COLOR_VIOLET
} from 'constants.js';

import './BackgroundScreen.styl';

const rainbowColors = [
    COLOR_RED,
    COLOR_ORANGE,
    COLOR_YELLOW,
    COLOR_GREEN,
    COLOR_SKY,
    COLOR_BLUE,
    COLOR_VIOLET
];

@connect(({game}) => ({game}))
export default class BackgroundScreen extends Screen {
    render () {
        const className = [
            ...this._getClassName(),
            `background-screen`
        ];

        return <section className={className}>
            <Locale
                value={this.context.locale}
                onChange={this._onLocaleChange} />
            <canvas
                hidden={this._frameRequest === null}
                className="background-screen__canvas"
                ref={this._onCanvasRef} />
        </section>
    }

    componentDidMount () {
        const renderer = new Renderer();
        const camera = new Camera(0, 0);
        const scene = new Scene();
        const particleSystem = this._createParticleSystem();
        scene.add(camera);
        scene.add(particleSystem);

        this._prevPosition = particleSystem.options.position;
        this._prevTime = Date.now();

        this._frameTimer = null;
        this._onFrameTimerTick();

        this._rainbow = {renderer, scene, particleSystem};

        document.addEventListener('mousemove', this._onDocumentMouseMove);
        window.addEventListener('resize', this._onWindowResize);
    }

    componentDidUpdate (prevProps) {
        /*
            Timer is required, because webkit cannot render canvas over canvas
            using non-default mix-blend-mode. Particles following the cursor
            will appear only when transition ends (after 500ms).
        */
        if (!prevProps.active && this.props.active) {
            this._frameTimer = setTimeout(this._onFrameTimerTick, 500);
        } else if (!this.props.active) {
            clearTimeout(this._frameTimer);
        }
    }

    componentWillUnmount () {
        clearTimeout(this._frameTimer);
        cancelAnimationFrame(this._frameRequest);
        document.removeEventListener('mousemove', this._onDocumentMouseMove);
        window.removeEventListener('resize', this._onWindowResize);
    }

    _getWindowSize () {
        const width = window.innerWidth;
        const height = window.innerHeight;
        return {width, height};
    }

    _createParticleSystem () {
        return new ParticleSystem({
            position: new Vector2(0, 0),
            mode: 'source-over',
            size: 3,
            directionError: 50,
            direction: 0,
            amount: 0,
            amountSpeed: 0,
            velocity: 0,
            processParticleOptions: (options) => {
                const randomColor = rainbowColors[rainbowColors.length * Math.random() | 0];
                options.startColor = randomColor;
                options.endColor = randomColor;
                return options;
            }
        });
    }

    @autobind
    _onLocaleChange (payload) {
        this.props.dispatch({
            type: 'LOCALE_CHANGE',
            payload
        });
    }

    @autobind
    _onCanvasRef (node) {
        this._context = node.getContext('2d');
        this._onWindowResize();
    }

    @autobind
    _onFrameTimerTick () {
        this._frameRequest = requestAnimationFrame(this._onAnimationFrame);
    }

    @autobind
    _onAnimationFrame () {
        if (!this.props.game.paused) {
            this._frameRequest = null;
            return;
        }

        const currentTime = Date.now();
        const deltaTime = currentTime - this._prevTime;

        const {renderer, scene, particleSystem} = this._rainbow;
        const {position} = particleSystem.options;
        particleSystem.update(deltaTime);
        renderer.render(scene, this._context);

        const deltaPosition = position.subtract(this._prevPosition);
        const deltaDistance = Math.min(deltaPosition.length(), 25);
        particleSystem.options.direction = Math.atan2(-deltaPosition.y, -deltaPosition.x);
        particleSystem.options.amount += deltaDistance;
        particleSystem.options.amountSpeed = 25;
        particleSystem.options.velocity = deltaDistance * 0.01;

        particleSystem.options.amount = Math.max(0, particleSystem.options.amount * 0.95 | 0);
        if (particleSystem.options.amount < 10) {
            particleSystem.options.amount = 0;
        }

        this._prevPosition = position;
        this._prevTime = currentTime;
        this._onFrameTimerTick();
    }

    @autobind
    _onDocumentMouseMove (event) {
        const {particleSystem} = this._rainbow;
        const position = new Vector2(event.clientX, event.clientY);
        particleSystem.options.position = position;
    }

    @autobind
    _onWindowResize () {
        const {width, height} = this._getWindowSize();

        const canvasNode = this._context.canvas;
        canvasNode.width = width;
        canvasNode.height = height;

        if (!this._rainbow) {
            return;
        }
        const {camera} = this._rainbow.scene;
        camera.size.width = width;
        camera.size.height = height;
    }

    _onEscapeKeyDown () {

    }
}
