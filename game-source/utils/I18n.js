export default class I18n {
    constructor (dictionary) {
        this._dictionary = dictionary;
    }

    get (component, key) {
        const locale = component.context.locale;
        return this._dictionary[locale][key];
    }
}
