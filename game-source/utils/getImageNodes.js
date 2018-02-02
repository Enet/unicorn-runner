export default function getImageNodes (manager, images) {
    const nodes = {};
    for (let i in images) {
        nodes[i] = manager.getImage(images[i]);
    }
    return nodes;
}
