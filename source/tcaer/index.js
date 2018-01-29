import Component from './Component.js';
import {
    normalizeChildren,
    renderVnode
} from './utils.js';

export default class Tcaer {
    static createElement (type, props, ...children) {
        props = props || {};
        const key = props.key;
        delete props.key;

        children = normalizeChildren(children);
        return {type, props, key, children};
    }

    static render (treeVnode, containerNode, context) {
        renderVnode(treeVnode, null, containerNode, context);
    }
}

Tcaer.Component = Component;
