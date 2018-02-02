export default function autobind (target, key, descriptor) {
    let method = descriptor.value;

    return {
        configurable: true,
        get () {
            if (this === target.prototype ||
                this.hasOwnProperty(key) ||
                typeof method !== 'function') {
                return method;
            }

            const value = method.bind(this);
            Object.defineProperty(this, key, {
                configurable: true,
                value
            });
            return value;
        },
        set (value) {
            method = value;
        }
    };
}
