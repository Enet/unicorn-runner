document.exitFullscreen = false ||
    document.exitFullscreen ||
    document.webkitExitFullscreen ||
    document.mozCancelFullScreen;

const {documentElement} = document;
documentElement.requestFullscreen = false ||
    documentElement.requestFullscreen ||
    documentElement.webkitRequestFullscreen ||
    documentElement.mozRequestFullScreen;

const TABLET_WIDTH = 640;

export default {
    start: () => {
        if (window.innerWidth > TABLET_WIDTH) {
            return;
        }
        documentElement.requestFullscreen && documentElement.requestFullscreen();
    },

    stop: () => {
        document.exitFullscreen && document.exitFullscreen();
    }
};
