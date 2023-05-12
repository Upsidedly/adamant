import { clamp } from './gameUtils.js'

class Container {
    public $: JQuery<HTMLDivElement>

    get center(): [number, number] {
        return [this.width / 2, this.height / 2]
    }

    get x() {
        return parseInt(getComputedStyle(this.element).left.slice(0, -2)) || 0
    }

    get y() {
        return parseInt(getComputedStyle(this.element).top.slice(0, -2)) || 0
    }

    get width() {
        return parseInt(getComputedStyle(this.element).width.slice(0, -2)) || 0
    }

    get height() {
        return parseInt(getComputedStyle(this.element).height.slice(0, -2)) || 0
    }

    constructor(public game: Game, public element: HTMLDivElement, public parent?: HTMLElement) {
        this.$ = $(this.element)
        this.parent?.appendChild(element)
    }

    fillColor(color: string) {
        this.element.style.backgroundColor = color
    }
}

type Awaitable<T> = T | Promise<T>

class Character {
    public element: HTMLDivElement
    public $: JQuery<HTMLDivElement>

    static count = 1

    get x() {
        return parseInt(getComputedStyle(this.element).left.slice(0, -2)) || 0
    }

    get y() {
        return parseInt(getComputedStyle(this.element).top.slice(0, -2)) || 0
    }

    get width() {
        return parseInt(getComputedStyle(this.element).width.slice(0, -2)) || 0
    }

    get height() {
        return parseInt(getComputedStyle(this.element).height.slice(0, -2)) || 0
    }

    constructor(public game: Game) {
        this.element = document.createElement('div')
        this.element.style.position = 'absolute'
        this.game.container.element.appendChild(this.element)
        this.element.id = `$acharacter${Character.count++}`
        this.$ = $(this.element)
    }

    move(coords: [number, number?], speed = -1, bounding = false) {
        if (speed == -1) {
            console.log(this.x)
            console.log(this.$.css('top'))
            const boundedX = clamp(this.x + coords[0], 0, this.game.container.width - this.width)
            this.$.css('left', `${bounding ? boundedX : this.x + coords[0] }px`)
            this.game.background.$.css(
                'left',
                `${this.game.background.x - coords[0]}px`
            )
            console.debug(boundedX, this.x + coords[0], this.game.container.width)
            if (coords[1]) {
                const boundedY = clamp(this.y + coords[1], 0, this.game.container.height - this.height)
                this.$.css('top', `${Math.max(bounding ? boundedY : this.y + coords[1], 0) }px`)
                this.game.background.$.css(
                    'top',
                    `${this.game.background.y - coords[1]}px`
                )
            }
        }
    }

    tp(coords: [number, number?], speed = -1) {
        if (speed == -1) {
            this.$.css('left', `${coords[0]}px`)
            if (coords[1]) {
                this.$.css('top', `${coords[1]}px`)
            }
        }
    }
}

class Object<T extends 'entity' | 'text' = 'entity' | 'text'> {
    public element: T extends 'entity' ? HTMLDivElement : HTMLParagraphElement
    public $: JQuery<typeof this.element>
    constructor(public game: Game, public type: T, public where: 'background' | 'foreground') {
        this.element = document.createElement(type === 'entity' ? 'div' : 'p')
        this.element.style.position = 'absolute'
        this.$ = $(this.element)
        document.getElementById(`$a${where}`)?.appendChild(this.element)
    }
}

type GameOptions = { dimensions?: [string, string] }

class Game {
    container: Container
    character: Character | null
    background: Container
    foreground: Container
    objects: Object[] = []
    static: Container
    public keyEvents: { [key: string]: (ev: KeyboardEvent) => Awaitable<unknown> } = {}
    constructor(o?: GameOptions) {
        this.container = new Container(this, document.getElementById('game')! as HTMLDivElement)
        this.container.element.style.position = 'absolute'

        this.container.element.style.width = o?.dimensions ? o.dimensions[0] : '1280px'
        this.container.element.style.height = o?.dimensions ? o.dimensions[1] : '720px'

        this.container.element.style.backgroundColor = 'black'
        this.container.element.style.overflow = 'clip'
        this.character = null

        this.background = new Container(this, document.createElement('div'), this.container.element)
        this.background.$
            .css('position', 'absolute')
            .css('width', '100%')
            .css('height', '100%')
        this.background.element.id = '$abackground'
        this.foreground = new Container(this, document.createElement('div'), this.container.element)
        this.foreground.$
            .css('position', 'absolute')
            .css('width', '100%')
            .css('height', '100%')
        this.static = new Container(this, document.createElement('div'), this.container.element)
        this.static.$
            .css('position', 'absolute')
            .css('width', '100%')
            .css('height', '100%')
        this.foreground.element.id = '$aforeground'

        document.onkeydown = (ev) => {
            console.debug(`${ev.code}`)
            if (ev.key in this.keyEvents || ev.code in this.keyEvents) {
                (this.keyEvents[ev.key] ?? this.keyEvents[ev.code])(ev)
            }
        }
    }

    addCharacter() {
        this.character = new Character(this)
    }

    onKeys(events: string[], ev: (ev: KeyboardEvent) => Awaitable<unknown>) {
        for (const event of events) {
            this.keyEvents[event] = ev
        }
    }

    addObject(type: 'entity' | 'text', where: 'background' | 'foreground') {
        const obj = new Object(this, type, where)
        this.objects.push(obj)
        return obj
    }
}

type GameConstructor = typeof Game

declare global {
    var Game: GameConstructor
}

globalThis.Game = Game

export { }