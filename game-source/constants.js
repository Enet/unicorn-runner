import {
    Color
} from 'engine/math.js';

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const VICTORY_CONDITION = 10000;
export const TILE_SIZE = 60;
export const LAVA_HEIGHT = 150;
export const EFFECT_TIME = 5000;
export const HEALTH_SCALE_TIME = 7500;

export const RUN_SPEED = 0.1;
export const FIGHT_DAMAGE = 20;
export const FIGHT_SHIFT = 5;
export const FIGHT_WAITING_TIME = 1000;
export const FLY_GRAVITY = 300;
export const JUMP_IMPULSE_POWER = 0.75;
export const JUMP_IMPULSE_TIME = 300;
export const JUMP_NO_COLLISION_TIME = 50;

export const SCORE_SPIDER_DEATH = 100;
export const SCORE_LIZARD_DEATH = 200;
export const SCORE_BIRD_DEATH = 50;
export const SCORE_BUG_DEATH = 250;
export const SCORE_FROG_DEATH = 200;
export const SCORE_FRUIT_FLY_DEATH = 100;
export const SCORE_GAS_MUSHROOM_DEATH = 50;

export const INDEX_STATIC_BACKGROUND = -1000;
export const INDEX_TILE_BACKGROUND = -500;
export const INDEX_RENDERABLE = 0;
export const INDEX_CLOUD_BACKGROUND = 500;
export const INDEX_CLOUD = 600;
export const INDEX_LAVA_BACKGROUND = 1000;

export const KEY_CONTROL = 17;
export const KEY_DELETE = 8;
export const KEY_BACKSPACE = 46;
export const KEY_ESCAPE = 27;
export const KEY_SPACE = 32;
export const KEY_LEFT = 37;
export const KEY_UP = 38;
export const KEY_RIGHT = 39;
export const KEY_DOWN = 40;
export const KEY_H = 72;
export const KEY_T = 84;
export const KEY_C = 67;
export const KEY_Z = 90;
export const KEY_W = 87;
export const KEY_S = 83;
export const KEY_A = 65;
export const KEY_D = 68;
export const KEY_E = 69;
export const KEY_R = 82;
export const KEY_1 = 49;
export const KEY_2 = 50;
export const KEY_3 = 51;
export const KEY_4 = 52;

export const COLOR_BLACK = new Color(0, 0, 0);
export const COLOR_RED = new Color(255, 0, 0);
export const COLOR_ORANGE = new Color(255, 128, 0);
export const COLOR_YELLOW = new Color(255, 255, 0);
export const COLOR_GREEN = new Color(0, 255, 0);
export const COLOR_SKY = new Color(0, 128, 255);
export const COLOR_BLUE = new Color(0, 0, 255);
export const COLOR_VIOLET = new Color(255, 0, 255);
