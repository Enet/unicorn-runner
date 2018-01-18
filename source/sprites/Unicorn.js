export default {
    frames: [{
        name: 'idle',
        rect: [0, 0, 172, 119]
    }, {
        name: 'run-1',
        rect: [0, 0, 172, 119]
    }, {
        name: 'run-2',
        rect: [173, 0, 172, 119]
    }, {
        name: 'run-3',
        rect: [344, 0, 172, 119]
    }, {
        name: 'run-4',
        rect: [517, 0, 172, 119]
    }, {
        name: 'break',
        rect: [0, 0, 172, 119]
    }, {
        name: 'jump',
        rect: [690, 0, 172, 119]
    }, {
        name: 'death-1',
        rect: [0, 120, 172, 119]
    }, {
        name: 'death-2',
        rect: [173, 120, 172, 119]
    }, {
        name: 'death-3',
        rect: [344, 120, 172, 119]
    }, {
        name: 'death-4',
        rect: [517, 120, 172, 119]
    }, {
        name: 'death-5',
        rect: [690, 120, 172, 119]
    }, {
        name: 'death-6',
        rect: [863, 120, 172, 119]
    }, {
        name: 'death-7',
        rect: [1036, 120, 172, 119]
    }, {
        name: 'death-8',
        rect: [1209, 120, 172, 119]
    }, {
        name: 'death-9',
        rect: [1382, 120, 172, 119]
    }, {
        name: 'fight-1',
        rect: [863, 0, 172, 119]
    }, {
        name: 'fight-2',
        rect: [1036, 0, 172, 119]
    }, {
        name: 'fight-3',
        rect: [1209, 0, 172, 119]
    }, {
        name: 'fight-4',
        rect: [1382, 0, 172, 119]
    }],
    animations: [{
        name: 'default',
        delay: 15,
        frames: [
            'run-1',
            'run-2',
            'run-3',
            'run-4'
        ]
    }, {
        name: 'death',
        delay: 150,
        frames: [
            'death-5',
            'death-6',
            'death-7',
            'death-8',
            'death-9'
        ]
    }, {
        name: 'fight',
        delay: 15,
        frames: [
            'fight-1',
            'fight-2',
            'fight-3',
            'fight-4'
        ]
    }]
};
