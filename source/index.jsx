import 'styles/index.styl';

import Tcaer from 'tcaer';
import Store from 'xuder';

import App from 'components/App/App.jsx';
import rootReducer from 'reducers/rootReducer.js';

const store = new Store(rootReducer);
const appNode = document.getElementById('app');
Tcaer.render(<App />, appNode, {store});
