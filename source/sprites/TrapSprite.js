export default {
    frames: [{
        name: 'trap-1',
        rect: [0, 0, 70, 46]
    }, {
        name: 'trap-2',
        rect: [70, 0, 70, 46]
    }, {
        name: 'trap-3',
        rect: [140, 0, 70, 46]
    }, {
        name: 'trap-4',
        rect: [210, 0, 70, 46]
    }, {
        name: 'trap-5',
        rect: [280, 0, 70, 46]
    }],
    animations: [{
        name: 'default',
        delay: 15,
        frames: [
            'trap-1',
            'trap-2',
            'trap-3',
            'trap-4',
            'trap-5'
        ]
    }]
};
