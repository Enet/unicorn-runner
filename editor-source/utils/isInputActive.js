export default function isInputActive () {
    const {activeElement} = document;
    if (!activeElement) {
        return false;
    }

    const {tagName} = activeElement;
    if (tagName !== 'INPUT' && tagName !== 'TEXTAREA') {
        return false;
    }

    return true;
}
