export default class Background {
    constructor ({images, size}) {
        this.images = images;
        this.size = size;
    }

    isIterable () {
        return false;
    }
}
