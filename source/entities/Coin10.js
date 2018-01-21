import Coin from 'entities/Coin.js';

export default class Coin10 extends Coin {
    _getNominal () {
        return 10;
    }
}

Coin10.images = {
    default: 'Coin10'
};
