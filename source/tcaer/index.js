import Component from './Component.js';
import {
    isVnodeString,
    renderElement
} from './utils.js';

export default class Tcaer {
    static createElement (type, props, ...rawChildren) {
        props = props || {};
        const key = props.key;
        delete props.key;

        const children = [];
        rawChildren.forEach((rawChild) => {
            if (!rawChild && !isVnodeString(rawChild)) {
                return;
            }
            if (rawChild instanceof Array === false) {
                rawChild = [rawChild];
            }
            rawChild.forEach(c => children.push(c));
        });

        return {type, props, key, children};
    }

    static render (treeVnode, containerNode) {
        renderElement(containerNode, treeVnode, null);
    }
}

Tcaer.Component = Component;
