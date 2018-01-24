import CoinEntity from 'entities/CoinEntity.js';

export default class Coin100Entity extends CoinEntity {
    _getNominal () {
        return 100;
    }
}
