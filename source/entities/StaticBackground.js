export default class StaticBackground {
    constructor (manager) {
        this._manager = manager;
        this._buffer = {
            width: 840 + 60,
            height: 660
        };
    }

    render (context, camera) {
        this._renderGradient(context);
        this._renderGrass(context, camera);
    }

    isIterable () {
        return false;
    }

    _renderGradient (context) {
        const buffer = this._buffer;
        let gradient = context.createLinearGradient(0, 0, 0, buffer.width);
        gradient.addColorStop(0, '#0714BC');
        gradient.addColorStop(0.25, '#0730EF');
        gradient.addColorStop(1, '#268BEF');
        context.fillStyle = gradient;
        context.fillRect(0, 0, buffer.width, buffer.height);
    }

    _renderGrass (context, camera) {
        const buffer = this._buffer;
        const manager = this._manager;

        let GrassImage = manager.getImage('grass');
        let GlassBackImage = manager.getImage('glassBack');
        let GlassFrontImage = manager.getImage('glassFront');

        let GrassCoordX = -camera.position.x / 0.8;
        let GlassCoordX = -camera.position.x / 1.2;

        for (let i = 0; i < 30; i++) {
            context.drawImage(GlassBackImage, GlassCoordX + GrassImage.width * i + 600, buffer.height - GlassBackImage.height + 1);
            context.drawImage(GrassImage, GrassCoordX + GrassImage.width * i, buffer.height - GrassImage.height + 1);
            context.drawImage(GlassFrontImage, GlassCoordX + GrassImage.width * i + 100, buffer.height - GlassFrontImage.height + 1);
        }
    }
}
