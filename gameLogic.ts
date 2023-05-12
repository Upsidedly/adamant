import './gameAttach.js'
import { randint } from './gameUtils.js'

const game = new Game({ dimensions: ['100%', '100%']})

game.addCharacter()
if (!game.character) throw Error('No character!')
game.character.$
    .css('width', '30px')
    .css('height', '30px')
    .css('backgroundColor', 'yellow')

// const box = game.addObject('entity', 'background')
// box.$
//     .css('width', 50)
//     .css('height', 50)
//     .css('backgroundColor', 'blue')
//     .css('left', 800)

function getRandomColor() {
    var letters = 'BCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}

const number = randint(100, 10000)

for (let i = 0; i < number; i++) {
    const color = getRandomColor()
    game.addObject('entity', 'background').$
        .css('width', `${randint(20, 300)}px`)
        .css('height', `${randint(20, 300)}px`)
        .css('backgroundColor', color)
        .css('left', randint(-number, number))
        .css('top', randint(-number, number))
}

// game.addObject('entity', 'background').$
//     .css('width', '80px')
//     .css('height', '80px')
//     .css('backgroundColor', 'green')
//     .css('left', 500)
//     .css('top', 500)

// game.addObject('entity', 'background').$
//     .css('width', '20px')
//     .css('height', '20px')
//     .css('backgroundColor', 'red')
//     .css('left', 2000)
//     .css('top', 500)


const speed = game.character.width * 2

game.onKeys(['KeyW', 'ArrowUp'], (ev) => {
    game.character!.move([0, -(speed)], undefined, true)
})

game.onKeys(['KeyS', 'ArrowDown'], (ev) => {
    game.character!.move([0, speed], undefined, true)
})

game.onKeys(['KeyA', 'ArrowLeft'], (ev) => {
    game.character!.move([-(speed)], undefined, true)
})

game.onKeys(['KeyD', 'ArrowRight'], (ev) => {
    game.character!.move([speed], undefined, true)
})

game.keyEvents['KeyX'] = (ev) => {
    game.character!.tp(game.container.center)
}