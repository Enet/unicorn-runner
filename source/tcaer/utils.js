import Component from './Component.js';

export function isVnodeChanged (newVnode, prevVnode) {
    return false ||
        typeof newVnode !== typeof prevVnode ||
        isVnodePrimitive(newVnode) && newVnode !== prevVnode ||
        newVnode.type !== prevVnode.type ||
        newVnode.key !== prevVnode.key;
}

export function isVnodePrimitive (vnode) {
    return false ||
        typeof vnode === 'string' ||
        typeof vnode === 'number' ||
        typeof vnode === 'boolean';
}

export function normalizeChildren (children) {
    let normalizedChildren = [];
    children.forEach((child) => {
        if (!child && !isVnodePrimitive(child)) {
            return;
        }
        if (child instanceof Array === false) {
            child = [child];
        }
        normalizedChildren.push(...child);
    });
    return normalizedChildren;
}

export function isEventProp (propName) {
    return /^on/.test(propName);
}

export function setProp (node, propName, propValue) {
    if (propName === 'className') {
        if (propValue instanceof Array) {
            propValue = propValue.join(' ');
        } else if (typeof propValue === 'object') {
            propValue = Object.keys(propValue)
                .filter(key => propValue[key])
                .join(' ');
        }
        node.setAttribute('class', propValue);
    } else if (propName === 'ref') {
        propValue(node);
    } else if (typeof propValue === 'boolean') {
        if (propValue) {
            node.setAttribute(propName, propName);
            node[propName] = true;
        } else {
            node[propName] = false;
        }
    } else if (isEventProp(propName)) {
        const eventName = propName.slice(2).toLowerCase();
        node.addEventListener(eventName, propValue);
    } else {
        node.setAttribute(propName, propValue);
    }
}

export function removeProp (node, propName, propValue) {
    if (propName === 'className') {
        node.removeAttribute('class');
    } else if (propName === 'ref') {
        propValue(null);
    } else if (typeof propValue === 'boolean') {
        node.removeAttribute(propName);
        node[propName] = false;
    } else if (isEventProp(propName)) {
        const eventName = propName.slice(2).toLowerCase();
        node.removeEventListener(eventName, propValue);
    } else {
        node.removeAttribute(propName);
    }
}

export function updateProp (node, propName, newPropValue, prevPropValue) {
    if (!newPropValue) {
        removeProp(node, propName, prevPropValue);
    } else if (!prevPropValue || newPropValue !== prevPropValue) {
        isEventProp(propName) && removeProp(node, propName, prevPropValue);
        setProp(node, propName, newPropValue);
    }
}

export function updateElement (node, newProps, prevProps) {
    prevProps = prevProps || {};
    const allProps = {...newProps, ...prevProps};
    Object.keys(allProps).forEach((propName) => {
        const newPropValue = newProps[propName];
        const prevPropValue = prevProps[propName];
        if (prevPropValue !== newPropValue) {
            updateProp(node, propName, newPropValue, prevPropValue);
        }
    });
}

export function createNodeFromVnode (vnode, context) {
    let component;
    let node;
    const {props, children} = vnode;

    if (isVnodePrimitive(vnode)) {
        return document.createTextNode(vnode + '');
    } else if (Component.isPrototypeOf(vnode.type)) {
        component = new vnode.type(props, children, context);
        component.componentWillMount();
        const componentVnode = component.render();
        component.prevComponentVnode = componentVnode;
        node = createNodeFromVnode(componentVnode, context);
        node.components.unshift(component);
        component.node = node;
        return node;
    }

    node = document.createElement(vnode.type);
    node.components = [];

    Object.keys(props).forEach((propName) => {
        const propValue = props[propName];
        setProp(node, propName, propValue);
    });

    children
        .map(child => createNodeFromVnode(child, context))
        .forEach(childNode => node.appendChild(childNode));

    return node;
}

export function mountComponentsToNodes (node) {
    node.components && node.components.slice().reverse().forEach((component) => {
        component.componentDidMount();
    });
    node.childNodes.forEach(childNode => mountComponentsToNodes(childNode));
}

export function unmountComponentsFromNodes (node) {
    node.components && node.components.forEach((component) => {
        component.componentWillUnmount();
    });
    node.childNodes.forEach(childNode => unmountComponentsFromNodes(childNode));
}

export function renderVnode (newVnode, prevVnode, parentNode, context, index=0) {
    const prevNode = parentNode.childNodes[index];

    if (!prevVnode && !isVnodePrimitive(prevVnode)) {
        const newNode = createNodeFromVnode(newVnode, context);
        parentNode.appendChild(newNode);
        mountComponentsToNodes(newNode);
    } else if (!newVnode && !isVnodePrimitive(newVnode)) {
        unmountComponentsFromNodes(prevNode);
        const commentNode = document.createComment('');
        parentNode.replaceChild(commentNode, prevNode);
    } else if (isVnodeChanged(newVnode, prevVnode)) {
        const newNode = createNodeFromVnode(newVnode, context);
        unmountComponentsFromNodes(prevNode);
        parentNode.replaceChild(newNode, prevNode);
        mountComponentsToNodes(newNode);
    } else if (Component.isPrototypeOf(newVnode.type)) {
        const componentIndex = prevNode.componentIndex || 0;
        const component = prevNode.components[componentIndex];
        if (component instanceof newVnode.type) {
            component.props = newVnode.props;
            component.children = newVnode.children;
            component.componentWillUpdate(newVnode.props);
        }
        const newComponentVnode = component.render();
        prevNode.componentIndex = componentIndex + 1;
        renderVnode(newComponentVnode, component.prevComponentVnode, parentNode, context, index);
        component.prevComponentVnode = newComponentVnode;
        prevNode.componentIndex = componentIndex;
        if (component instanceof newVnode.type) {
            component.componentDidUpdate(prevVnode.props);
        }
    } else if (newVnode.type) {
        updateElement(prevNode, newVnode.props, prevVnode.props);

        const newChildrenCount = newVnode.children.length;
        const prevChildrenCount = prevVnode.children.length;
        const childrenCount = Math.max(newChildrenCount, prevChildrenCount);
        for (let c = 0; c < childrenCount; c++) {
            renderVnode(
                newVnode.children[c],
                prevVnode.children[c],
                prevNode,
                context,
                c
            );
        }
    }
}
