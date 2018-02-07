import 'styles/index.styl';

import Tcaer from 'tcaer';
import App from 'components/App/App.jsx';
import UnicornResourceManager from 'game/UnicornResourceManager.js';
import {
    images
} from 'game/resources.js';

const manager = new UnicornResourceManager();
manager.fetchResources({images}).then(() => {
    const appNode = document.getElementById('app');
    Tcaer.render(<App manager={manager} />, appNode);
}).catch((error) => {
    console.error(error);
    alert('Images cannot be loaded!');
});
