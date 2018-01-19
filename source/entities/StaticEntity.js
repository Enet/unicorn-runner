import StaticBoxBody from 'engine/StaticBoxBody.js';
import {
    REACTION_TRAP
} from 'engine/constants.js';
import Entity from 'entities/Entity.js';

export default class StaticEntity extends Entity {
    _createBody (options) {
        const body = super._createBody(options, StaticBoxBody);
        body.reaction = REACTION_TRAP;
        return body;
    }
}
