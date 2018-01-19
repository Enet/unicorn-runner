import Dollar from 'entities/Dollar.js';

export default class Dollar100 extends Dollar {
    _getNominal () {
        return 100;
    }
}

Dollar100.images = {
    default: 'Dollar100'
};
