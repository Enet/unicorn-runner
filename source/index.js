import 'styles/index.styl';

import Game from 'Game.js';

const CANVAS_ID = 'canvas';
const canvasNode = document.getElementById(CANVAS_ID);
const canvasContext = canvasNode.getContext('2d');
const canvas = {
    context: canvasContext,
    width: canvasNode.width,
    height: canvasNode.height
};

const SCORE_ID = 'score';
const scoreNode = document.getElementById(SCORE_ID);
const onScoreChange = (value) => scoreNode.innerHTML = value;

new Game({
    canvas,
    onScoreChange
});
