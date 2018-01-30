import {
    combineReducers
} from 'xuder';
import screenReducer from 'reducers/screenReducer.js';
import settingsReducer from 'reducers/settingsReducer.js';
import gameReducer from 'reducers/gameReducer.js';
import localeReducer from 'reducers/localeReducer.js';
import soundReducer from 'reducers/soundReducer.js';

export default combineReducers({
    screen: screenReducer,
    settings: settingsReducer,
    game: gameReducer,
    locale: localeReducer,
    sound: soundReducer
});
