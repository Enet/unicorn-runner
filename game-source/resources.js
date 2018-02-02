function importFiles (context) {
    const files = {};
    context.keys().forEach((key) => {
        const file = context(key);
        files[key.replace(/\.\/(.*)\..*/, '$1')] = file.default || file;
    });
    return files;
}

export const images = importFiles(require.context('images', false, /\.png$/));
export const sprites = importFiles(require.context('sprites', false, /\.yaml$/));
export const sounds = importFiles(require.context('sounds', false, /\.(?:mp3)$/));
export const levels = importFiles(require.context('levels', false, /\.js$/));
export const entities = importFiles(require.context('entities', false, /\.js$/));
export const backgrounds = importFiles(require.context('backgrounds', false, /\.js$/));
