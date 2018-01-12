import 'styles/index.styl';

import Game from 'Game.js';

const CANVAS_ID = 'canvas';
const canvasNode = document.getElementById(CANVAS_ID);

new Game(canvasNode);
