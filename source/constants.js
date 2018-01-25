import {
    Vector2,
    Color
} from 'engine/math.js';

export const TILE_SIZE = 60;
export const EFFECT_TIME = 5000;
export const CAMERA_OFFSET = new Vector2(500, 300);

export const RUN_SPEED = 0.1;
export const FIGHT_DAMAGE = 10;
export const FIGHT_SHIFT = 0.1;
export const FLY_GRAVITY = 300;
export const JUMP_IMPULSE_POWER = 0.75;
export const JUMP_IMPULSE_TIME = 300;
export const JUMP_NO_COLLISION_TIME = 50;

export const SCORE_SPIDER_DEATH = 100;
export const SCORE_LIZARD_DEATH = 100;
export const SCORE_BIRD_DEATH = 100;
export const SCORE_BUG_DEATH = 100;
export const SCORE_FROG_DEATH = 100;
export const SCORE_FRUIT_FLY_DEATH = 100;
export const SCORE_GAS_MUSHROOM_DEATH = 100;

export const INDEX_STATIC_BACKGROUND = -1000;
export const INDEX_TILE_BACKGROUND = -500;
export const INDEX_RENDERABLE = 0;
export const INDEX_CLOUD_BACKGROUND = 500;
export const INDEX_CLOUD = 600;
export const INDEX_LAVA_BACKGROUND = 1000;

export const KEY_ESCAPE = 27;
export const KEY_SPACE = 32;
export const KEY_LEFT = 37;
export const KEY_UP = 38;
export const KEY_RIGHT = 39;
export const KEY_DOWN = 40;
export const KEY_W = 87;
export const KEY_S = 83;
export const KEY_A = 65;
export const KEY_D = 68;

export const COLOR_BLACK = new Color(0, 0, 0);
export const COLOR_RED = new Color(255, 0, 0);
export const COLOR_ORANGE = new Color(255, 128, 0);
export const COLOR_YELLOW = new Color(255, 255, 0);
export const COLOR_GREEN = new Color(0, 255, 0);
export const COLOR_SKY = new Color(0, 128, 255);
export const COLOR_BLUE = new Color(0, 0, 255);
export const COLOR_VIOLET = new Color(255, 0, 255);
