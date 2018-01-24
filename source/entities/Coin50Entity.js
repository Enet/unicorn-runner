import CoinEntity from 'entities/CoinEntity.js';

export default class Coin50Entity extends CoinEntity {
    _getNominal () {
        return 50;
    }
}
