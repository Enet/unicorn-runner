export default {
    frames: [{
        name: 'fly-1',
        rect: [0, 0, 96, 87]
    }, {
        name: 'fly-2',
        rect: [96, 0, 96, 87]
    }, {
        name: 'fly-3',
        rect: [192, 0, 96, 87]
    }, {
        name: 'fly-4',
        rect: [288, 0, 96, 87]
    }, {
        name: 'fly-5',
        rect: [0, 87, 96, 87]
    }, {
        name: 'fly-6',
        rect: [96, 87, 96, 87]
    }, {
        name: 'fly-7',
        rect: [192, 87, 96, 87]
    }, {
        name: 'fly-8',
        rect: [288, 87, 96, 87]
    }, {
        name: 'die-1',
        rect: [0, 174, 96, 87]
    }, {
        name: 'die-2',
        rect: [96, 174, 96, 87]
    }, {
        name: 'die-3',
        rect: [192, 174, 96, 87]
    }, {
        name: 'die-4',
        rect: [288, 174, 96, 87]
    }, {
        name: 'die-5',
        rect: [0, 261, 96, 87]
    }, {
        name: 'die-6',
        rect: [96, 261, 96, 87]
    }, {
        name: 'die-7',
        rect: [192, 261, 96, 87]
    }, {
        name: 'die-8',
        rect: [288, 261, 96, 87]
    }],
    animations: [{
        name: 'default',
        delay: 15,
        frames: [
            'fly-1',
            'fly-2',
            'fly-3',
            'fly-4',
            'fly-5',
            'fly-6',
            'fly-7',
            'fly-8'
        ]
    }, {
        name: 'die',
        delay: 45,
        frames: [
            'die-1',
            'die-2',
            'die-3',
            'die-4',
            'die-5',
            'die-6',
            'die-7',
            'die-8'
        ]
    }]
};
