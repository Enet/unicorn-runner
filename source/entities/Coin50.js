import Coin from 'entities/Coin.js';

export default class Coin50 extends Coin {
    _getNominal () {
        return 50;
    }
}

Coin50.images = {
    default: 'Coin50'
};
