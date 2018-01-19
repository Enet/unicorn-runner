import Dollar from 'entities/Dollar.js';

export default class Dollar10 extends Dollar {
    _getNominal () {
        return 10;
    }
}

Dollar10.images = {
    default: 'Dollar10'
};
