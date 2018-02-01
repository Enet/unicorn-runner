export default {
    meta: {
        music: 'MusicMountains',
        background: 'Mountains',
        bounds: [-300, 2400, 700, -300]
    },
    tiles: [{
        ranges: [
            [3, 7, 1, 2],
            [0, 1, 3, 7],
            [1, 23, 6, 7],
            [24, 34, 6, 7],
            [38, 48, 4, 5],
            [51, 53, 4, 5],
            [55, 57, 6, 7],
            [60, 68, 6, 7],
            [64, 6, 8, 9],
            [73, 83, 5, 6],
            [87, 89, 8, 9],
            [93, 97, 6, 7],
            [101, 120, 6, 7],
            [124, 134, 6, 7],
            [138, 148, 4, 5],
            [151, 153, 4, 5],
            [155, 157, 6, 7],
            [160, 161, 6, 7],
            [164, 169, 8, 9],
            [173, 183, 5, 6],
            [187, 189, 8, 9],
            [193, 194, 6, 7]
        ]
    }],
    entities: [{
        name: 'Info',
        position: [250, 0],
        data: {
            ru: 'Привет, <b>дружок</b>. Конь набрал кредитов, теперь придётся возвращать.',
            en: 'Hello <b>world</b>!'
        }
    }, {
        name: 'FastMotion',
        position: [450, 50],
        from: [100, 300],
        to: [700, 300]
    }, {
        name: 'Rainbow',
        position: [600, 50],
        from: [100, 300],
        to: [700, 300]
    }, {
        name: 'Frog',
        position: [800, 200],
        range: [300, 800]
    }] || [{
        name: 'Spider',
        position: [350, 50],
        reaction: 20
    }, {
        name: 'Box',
        position: [450, 330],
        range: [450, 550]
    }, {
        name: 'Box',
        position: [550, 330],
        range: [400, 550]
    }, {
        name: 'Box',
        position: [780, 0]
    }, {
        name: 'Box',
        position: [780, 70]
    }, {
        name: 'Box',
        position: [780, 150]
    }, {
        name: 'Box',
        position: [780, 210]
    }, {
        name: 'Box',
        position: [780, 270]
    }, {
        name: 'Box',
        position: [780, 330]
    }, {
        name: 'Box',
        position: [780, 390]
    }, {
        name: 'Box',
        position: [780, 450]
    }, {
        name: 'Box',
        position: [720, 0]
    }, {
        name: 'HorLaser',
        position: [690, 390]
    }, {
        name: 'HorLaser',
        position: [750, 390]
    }, {
        name: 'HorLaser',
        position: [810, 390]
    }] || [{
        name: 'Coin10',
        position: [500, 0]
    }, {
        name: 'Coin50',
        position: [500, 60]
    }, {
        name: 'Coin100',
        position: [600, 0]
    }, {
        name: 'Bush',
        position: [500, 330]
    }, {
        name: 'TopMushroom',
        position: [408, 0]
    }, {
        name: 'Box',
        position: [408, 60]
    }, {
        name: 'Bug',
        position: [780, 0]
    }, {
        name: 'Box',
        position: [800, 60]
    }, {
        name: 'Medicine',
        position: [1608, 0]
    }, {
        name: 'Bug',
        position: [1800, 0]
    }, {
        name: 'Bug',
        position: [2580, 0]
    }, {
        name: 'Rainbow',
        position: [3288, 0]
    }, {
        name: 'Bug',
        position: [3960, 0]
    }, {
        name: 'Rainbow',
        position: [4448, 0]
    }, {
        name: 'Bug',
        position: [4620, 0]
    }, {
        name: 'Rainbow',
        position: [5588, 0]
    }, {
        name: 'Rainbow',
        position: [7388, 0]
    }]
};
