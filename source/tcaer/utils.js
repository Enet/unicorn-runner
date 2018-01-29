import Component from './Component.js';

export function isVnodeChanged (newVnode, prevVnode) {
    return false ||
        typeof newVnode !== typeof prevVnode ||
        typeof newVnode === 'string' && newVnode !== prevVnode ||
        newVnode.type !== prevVnode.type ||
        newVnode.key !== prevVnode.key;
}

export function isVnodeString (vnode) {
    return false ||
        typeof vnode === 'string' ||
        typeof vnode === 'number' ||
        typeof vnode === 'boolean';
}

export function isEventProp (propName) {
    return /^on/.test(propName);
}

export function setProp (node, propName, propValue) {
    if (propName === 'className') {
        node.setAttribute('class', propValue);
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

export function createNodeFromVnode (vnode) {
    let component;
    let node;
    const {props, children} = vnode;

    if (isVnodeString(vnode)) {
        return document.createTextNode(vnode + '');
    } else if (Component.isPrototypeOf(vnode.type)) {
        component = new vnode.type({...props, children});
        component.componentWillMount();
        let prevComponentVnode = component.render();
        node = createNodeFromVnode(prevComponentVnode);
        node.component = component;
        component.forceUpdate = () => {
            const newComponentVnode = component.render();
            const {parentNode} = node;
            const index = Array.from(parentNode.childNodes).indexOf(node);
            renderElement(parentNode, newComponentVnode, prevComponentVnode, index);
            prevComponentVnode = newComponentVnode;
        };
        component.componentDidMount();
        return node;
    }

    node = document.createElement(vnode.type);

    Object.keys(props).forEach((propName) => {
        const propValue = props[propName];
        setProp(node, propName, propValue);
    });

    children
        .map(createNodeFromVnode)
        .forEach((childNode) => node.appendChild(childNode));

    return node;
}

export function updateElement (node, newProps, prevProps) {
    prevProps = prevProps || {};
    const {component} = node;
    component && component.componentWillUpdate(newProps);

    const allProps = {...newProps, ...prevProps};
    Object.keys(allProps).forEach((propName) => {
        const newPropValue = newProps[propName];
        const prevPropValue = prevProps[propName];
        updateProp(node, propName, newPropValue, prevPropValue);
    });

    if (component) {
        component.props = newProps;
        component.componentDidUpdate(prevProps);
    }
}

export function renderElement (parentNode, newVnode, prevVnode, index=0) {
    if (!prevVnode && !isVnodeString(prevVnode)) {
        const newNode = createNodeFromVnode(newVnode);
        parentNode.appendChild(newNode);
    } else if (!newVnode && !isVnodeString(newVnode)) {
        const prevNode = parentNode.childNodes[index];
        prevNode.component && prevNode.component.componentWillUnmount();
        parentNode.removeChild(prevNode);
    } else if (isVnodeChanged(newVnode, prevVnode)) {
        const newNode = createNodeFromVnode(newVnode);
        const prevNode = parentNode.childNodes[index];
        prevNode.component && prevNode.component.componentWillUnmount();
        parentNode.replaceChild(newNode, prevNode);
    } else if (newVnode.type) {
        const prevNode = parentNode.childNodes[index];
        updateElement(prevNode, newVnode.props, prevVnode.props);

        const newChildrenCount = newVnode.children.length;
        const prevChildrenCount = prevVnode.children.length;
        const childrenCount = Math.max(newChildrenCount, prevChildrenCount);
        for (let c = 0; c < childrenCount; c++) {
            renderElement(
                parentNode.childNodes[index],
                newVnode.children[c],
                prevVnode.children[c],
                c
            );
        }
    }
}
