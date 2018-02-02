import Trait from 'traits/Trait.js';

export default class BodyTrait extends Trait {
    start () {

    }

    stop () {

    }

    traitDidMount () {
        let {autoStart} = this.options;
        if (autoStart === undefined) {
            autoStart = true;
        }
        autoStart && this.start();
    }
}
