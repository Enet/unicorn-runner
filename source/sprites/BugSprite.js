export default {
    frames: [{
        name: 'bug-1',
        rect: [0, 0, 58, 65]
    },
    {
        name: 'bug-2',
        rect: [58, 0, 58, 65]
    },
    {
        name: 'bug-3',
        rect: [116, 0, 58, 65]
    },
    {
        name: 'bug-4',
        rect: [174, 0, 58, 65]
    },
    {
        name: 'bug-5',
        rect: [232, 0, 58, 65]
    }],
    animations: [{
        name: 'default',
        delay: 15,
        frames: [
            'bug-1',
            'bug-2',
            'bug-3',
            'bug-4',
            'bug-5'
        ]
    }]
};
