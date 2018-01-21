export default class TraitManager {
    constructor (entity) {
        this.entity = entity;
        this._storage = new Set();
    }

    add (trait) {
        this._storage.add(trait);

        const {entity} = this;
        const traitName = trait.getName();
        if (entity[traitName]) {
            throw 'Trait can not override existing property!';
        }
        entity[traitName] = trait;

        trait.entity = entity;
        trait.level = entity.level;
        trait.traitDidMount();
    }

    remove (trait) {
        trait.traitWillUnmount();
        this._storage.delete(trait);
    }

    forEach () {
        return this._storage.forEach(...arguments);
    }
}
