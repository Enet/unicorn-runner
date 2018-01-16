import 'styles/index.styl';

import UnicornGame from 'UnicornGame.js';

const CANVAS_ID = 'canvas';
const canvasNode = document.getElementById(CANVAS_ID);
const canvasContext = canvasNode.getContext('2d');

const SCORE_ID = 'score';
const scoreNode = document.getElementById(SCORE_ID);
const onScoreChange = (value) => scoreNode.innerHTML = value;

new UnicornGame({
    context: canvasContext,
    onScoreChange
});
