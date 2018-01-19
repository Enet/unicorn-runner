export default {
    frames: [{
        name: 'walk-1',
        rect: [0, 0, 75, 60]
    }, {
        name: 'walk-2',
        rect: [75, 0, 75, 60]
    }, {
        name: 'walk-3',
        rect: [150, 0, 75, 60]
    }, {
        name: 'walk-4',
        rect: [225, 0, 75, 60]
    }, {
        name: 'walk-5',
        rect: [0, 60, 75, 60]
    }, {
        name: 'walk-6',
        rect: [75, 60, 75, 60]
    }, {
        name: 'walk-7',
        rect: [150, 60, 75, 60]
    }, {
        name: 'walk-8',
        rect: [225, 60, 75, 60]
    }, {
        name: 'walk-9',
        rect: [0, 120, 75, 60]
    }, {
        name: 'walk-10',
        rect: [75, 120, 75, 60]
    }, {
        name: 'walk-11',
        rect: [150, 120, 75, 60]
    }, {
        name: 'walk-12',
        rect: [225, 120, 75, 60]
    }, {
        name: 'walk-13',
        rect: [0, 180, 75, 60]
    }, {
        name: 'walk-14',
        rect: [75, 180, 75, 60]
    }, {
        name: 'walk-15',
        rect: [150, 180, 75, 60]
    }, {
        name: 'walk-16',
        rect: [225, 180, 75, 60]
    }, {
        name: 'attack-1',
        rect: [300, 0, 75, 60]
    }, {
        name: 'attack-2',
        rect: [300, 60, 75, 60]
    }, {
        name: 'attack-3',
        rect: [300, 120, 75, 60]
    }, {
        name: 'attack-4',
        rect: [300, 180, 75, 60]
    }],
    animations: [{
        name: 'default',
        delay: 15,
        frames: [
            'attack-1'
        ]
    }, {
        name: 'walk',
        delay: 15,
        frames: [
            'walk-1',
            'walk-2',
            'walk-3',
            'walk-4',
            'walk-5',
            'walk-6',
            'walk-7',
            'walk-8',
            'walk-9',
            'walk-10',
            'walk-11',
            'walk-12',
            'walk-13',
            'walk-14',
            'walk-15',
            'walk-16'
        ]
    }, {
        name: 'attack',
        delay: 30,
        frames: [
            'attack-1',
            'attack-2',
            'attack-3',
            'attack-4'
        ]
    }]
};
