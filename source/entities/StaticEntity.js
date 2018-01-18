import StaticBoxBody from 'engine/StaticBoxBody.js';
import Entity from 'entities/Entity.js';

export default class StaticEntity extends Entity {
    _createBody (options) {
        const body = super._createBody(options, StaticBoxBody);
        body.collidable = false;
        return body;
    }
}
