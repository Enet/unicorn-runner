import TileResolver from 'TileResolver.js';
import SpriteSheet from 'SpriteSheet.js';

export function createBackgroundLayer (level, tiles, manager) {
    const resolver = new TileResolver(tiles);
    const buffer = document.createElement('canvas');
    const sprites = new SpriteSheet(manager.getImage('boardUpdate'), 60, 60);

    sprites.define('ground', 0, 0, 60, 60);

    buffer.width = 840 + 60;
    buffer.height = 660;

    const context = buffer.getContext('2d');

    function redraw (startIndex, endIndex)  {
        context.clearRect(0, 0, buffer.width, buffer.height);

        for (let x = startIndex; x <= endIndex; ++x) {
            const column = tiles.getColumn(x);
            column && column.forEach((tile, y) => {
                sprites.drawTile('ground', context, x - startIndex, y);
            });
        }
    }

    return function drawBackgroundLayer (context, camera) {
        const drawWidth = resolver.toIndex(camera.size.x);
        const drawFrom = resolver.toIndex(camera.position.x);
        const drawTo = drawFrom + drawWidth;

        redraw(drawFrom, drawTo);

        context.drawImage(
            buffer,
            -camera.position.x % 60,
            -camera.position.y
        );
    };
}

export function drawStaticBackground (manager) {
    const buffer = document.createElement('canvas');
    buffer.width = 840 + 60;
    buffer.height = 660;

    let GrassImage = manager.getImage('grass');
    let GlassBackImage = manager.getImage('glassBack');
    let GlassFrontImage = manager.getImage('glassFront');

    function drawGradient (context) {
        let gradient = context.createLinearGradient(0, 0, 0, buffer.width);
        gradient.addColorStop(0, '#0714BC');
        gradient.addColorStop(0.25, '#0730EF');
        gradient.addColorStop(1, '#268BEF');
        context.fillStyle = gradient;
        context.fillRect(0, 0, buffer.width, buffer.height);
    }

    function drawGrass (context, camera) {
        let GrassCoordX = -camera.position.x / 0.8;
        let GlassCoordX = -camera.position.x / 1.2;

        for (let i = 0; i < 30; i++) {
            context.drawImage(GlassBackImage, GlassCoordX + GrassImage.width * i + 600, buffer.height - GlassBackImage.height + 1);
            context.drawImage(GrassImage, GrassCoordX + GrassImage.width * i, buffer.height - GrassImage.height + 1);
            context.drawImage(GlassFrontImage, GlassCoordX + GrassImage.width * i + 100, buffer.height - GlassFrontImage.height + 1);
        }
    }

    return function drawBackgroundLayer (context, camera) {
        drawGradient(context);
        drawGrass(context, camera);
    }
}

export function createSpriteLayer (entities, width = 172, height = 119) {
    const spriteBuffer = document.createElement('canvas');
    spriteBuffer.width = width;
    spriteBuffer.height = height;
    const spriteBufferContext = spriteBuffer.getContext('2d');

    return function drawSpriteLayer (context, camera) {
        entities.forEach((entity) => {
            spriteBufferContext.clearRect(0, 0, width, height);

            entity.draw(spriteBufferContext);

            context.drawImage(
                spriteBuffer,
                entity.position.x - camera.position.x,
                entity.position.y - camera.position.y
            );
        });
    };
}
