import Coin from 'entities/Coin.js';

export default class Coin100 extends Coin {
    _getNominal () {
        return 100;
    }
}

Coin100.images = {
    default: 'Coin100'
};
