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

export function toEventName (propName) {
    return propName.substr(2).toLowerCase();
}

export function isDataProp (propName) {
    return /^data/.test(propName);
}

export function toDataName (propName) {
    return propName.replace(/([A-Z])/g, '-$1').toLowerCase();
}

export function setProp (node, propName, propValue) {
    if (isDataProp(propName)) {
        propName = toDataName(propName);
    }
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
        const eventName = toEventName(propName);
        node.addEventListener(eventName, propValue);
    } else if (propName === 'dangerouslySetInnerHtml') {
        node.innerHTML = propValue;
    } else {
        node.setAttribute(propName, propValue);
    }
}

export function removeProp (node, propName, propValue) {
    if (isDataProp(propName)) {
        propName = toDataName(propName);
    }
    if (propName === 'className') {
        node.removeAttribute('class');
    } else if (propName === 'ref') {
        propValue(null);
    } else if (typeof propValue === 'boolean') {
        node.removeAttribute(propName);
        node[propName] = false;
    } else if (isEventProp(propName)) {
        const eventName = toEventName(propName);
        node.removeEventListener(eventName, propValue);
    } else if (propName === 'dangerouslySetInnerHtml') {
        node.innerHTML = '';
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

export function updateNode (node, newProps, prevProps) {
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

export function createTextNodeFromVnode (vnode, context) {
    return document.createTextNode(vnode + '');
}

export function createComponentFromVnode (vnode, context) {
    const {props, children} = vnode;
    const component = new vnode.type(props, children, context);
    component.componentWillMount();

    const newComponentVnode = component.render();
    component['@@vnode'] = newComponentVnode;

    const node = createTreeFromVnode(newComponentVnode, context);
    component['@@node'] = node;
    node['@@components'].unshift(component);
    return node;
}

export function createNodeFromVnode (vnode, context) {
    const {props, children} = vnode;
    const node = document.createElement(vnode.type);
    node['@@components'] = [];
    node['@@index'] = 0;

    Object.keys(props).forEach((propName) => {
        const propValue = props[propName];
        setProp(node, propName, propValue);
    });

    children
        .map(child => createTreeFromVnode(child, context))
        .forEach(childNode => node.appendChild(childNode));

    return node;
}

export function createTreeFromVnode (vnode, context) {
    if (isVnodePrimitive(vnode)) {
        return createTextNodeFromVnode(vnode, context);
    } else if (Component.isPrototypeOf(vnode.type)) {
        return createComponentFromVnode(vnode, context);
    } else {
        return createNodeFromVnode(vnode, context);
    }
}

export function mountComponentsToNodes (node) {
    const components = node['@@components'];
    components && components.slice().reverse().forEach((component) => {
        component.componentDidMount();
    });
    node.childNodes.forEach(childNode => mountComponentsToNodes(childNode));
}

export function unmountComponentsFromNodes (node) {
    const components = node['@@components'];
    components && components.forEach((component) => {
        component.componentWillUnmount();
    });
    node.childNodes.forEach(childNode => unmountComponentsFromNodes(childNode));
}

export function renderVnode (newVnode, prevVnode, parentNode, context, index=0) {
    const prevNode = parentNode.childNodes[index];

    if (!prevVnode && !isVnodePrimitive(prevVnode)) {

        const newNode = createTreeFromVnode(newVnode, context);
        parentNode.appendChild(newNode);
        mountComponentsToNodes(newNode);

    } else if (!newVnode && !isVnodePrimitive(newVnode)) {

        unmountComponentsFromNodes(prevNode);
        const commentNode = document.createComment('');
        parentNode.replaceChild(commentNode, prevNode);
        enqueueTask(() => {
            commentNode.parentNode.removeChild(commentNode);
        });

    } else if (isVnodeChanged(newVnode, prevVnode)) {

        const newNode = createTreeFromVnode(newVnode, context);
        unmountComponentsFromNodes(prevNode);
        parentNode.replaceChild(newNode, prevNode);
        mountComponentsToNodes(newNode);

    } else if (Component.isPrototypeOf(newVnode.type)) {

        const componentIndex = prevNode['@@index'];
        const component = prevNode['@@components'][componentIndex];

        if (component instanceof newVnode.type) {
            component['@@updateComponentState'](
                newVnode.props,
                newVnode.children,
                context
            );
        }

        const newComponentVnode = component.render();
        const prevComponentVnode = component['@@vnode'];
        prevNode['@@index'] = componentIndex + 1;
        renderVnode(
            newComponentVnode,
            prevComponentVnode,
            parentNode,
            context,
            index
        );
        component['@@vnode'] = newComponentVnode;
        prevNode['@@index'] = componentIndex;
    } else if (newVnode.type) {

        updateNode(prevNode, newVnode.props, prevVnode.props);

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

const tasks = new Set();
let frame = null;
export function enqueueTask (task) {
    tasks.delete(task);
    tasks.add(task);
    if (!frame) {
        frame = requestAnimationFrame(() => {
            tasks.forEach(task => task());
            tasks.clear();
            frame = null;
        });
    }
}
