import CoinEntity from 'entities/CoinEntity.js';

export default class Coin10Entity extends CoinEntity {
    _getNominal () {
        return 10;
    }
}
