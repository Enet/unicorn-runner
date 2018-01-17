export default {
    frames: [{
        name: 'frame-1',
        rect: [0, 0, 58, 65]
    },
    {
        name: 'frame-2',
        rect: [58, 0, 58, 65]
    },
    {
        name: 'frame-3',
        rect: [116, 0, 58, 65]
    },
    {
        name: 'frame-4',
        rect: [174, 0, 58, 65]
    },
    {
        name: 'frame-5',
        rect: [232, 0, 58, 65]
    }],
    animations: [{
        name: 'default',
        delay: 15,
        frames: [
            'frame-1',
            'frame-2',
            'frame-3',
            'frame-4',
            'frame-5'
        ]
    }]
};
