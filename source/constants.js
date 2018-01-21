import {
    Vector2,
    Color
} from 'engine/math.js';

export const TILE_SIZE = 60;
export const RUNNING_SPEED = 0.005;
export const JUMPING_BOOST = 0.75;
export const MAX_JUMPING_TIME = 300;
export const MAX_NO_COLLISION_TIME = 50;
export const MAX_HIDING_TIME = 500;
export const FLYING_BOOST = 300;
export const FLYING_TIME = 5000;
export const SPEED_EFFECT_TIME = 5000;
export const GAS_CLOUD_TIME = 5000;
export const CAMERA_OFFSET = new Vector2(200, 300);

export const INDEX_STATIC_BACKGROUND = -1000;
export const INDEX_RENDERABLE = 0;
export const INDEX_TILE_BACKGROUND = 500;
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
