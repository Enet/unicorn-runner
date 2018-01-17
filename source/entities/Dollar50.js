import Dollar from 'entities/Dollar.js';

export default class Dollar50 extends Dollar {
    _getNominal () {
        return 50;
    }
}
