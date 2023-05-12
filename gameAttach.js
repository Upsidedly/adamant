import { clamp } from './gameUtils.js';
class Container {
    get center() {
        return [this.width / 2, this.height / 2];
    }
    get x() {
        return parseInt(getComputedStyle(this.element).left.slice(0, -2)) || 0;
    }
    get y() {
        return parseInt(getComputedStyle(this.element).top.slice(0, -2)) || 0;
    }
    get width() {
        return parseInt(getComputedStyle(this.element).width.slice(0, -2)) || 0;
    }
    get height() {
        return parseInt(getComputedStyle(this.element).height.slice(0, -2)) || 0;
    }
    constructor(game, element, parent) {
        var _a;
        this.game = game;
        this.element = element;
        this.parent = parent;
        this.$ = $(this.element);
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.appendChild(element);
    }
    fillColor(color) {
        this.element.style.backgroundColor = color;
    }
}
class Character {
    get x() {
        return parseInt(getComputedStyle(this.element).left.slice(0, -2)) || 0;
    }
    get y() {
        return parseInt(getComputedStyle(this.element).top.slice(0, -2)) || 0;
    }
    get width() {
        return parseInt(getComputedStyle(this.element).width.slice(0, -2)) || 0;
    }
    get height() {
        return parseInt(getComputedStyle(this.element).height.slice(0, -2)) || 0;
    }
    constructor(game) {
        this.game = game;
        this.element = document.createElement('div');
        this.element.style.position = 'absolute';
        this.game.container.element.appendChild(this.element);
        this.element.id = `$acharacter${Character.count++}`;
        this.$ = $(this.element);
        this.$
            .css('left', this.game.container.width / 2 - this.width / 2)
            .css('top', this.game.container.height / 2 - this.height / 2);
    }
    move(coords, speed = -1 /*, bounding = false */) {
        if (speed == -1) {
            console.log(this.x);
            console.log(this.$.css('top'));
            const boundedX = clamp(this.x + coords[0], 0, this.game.container.width - this.width);
            // this.$.css('left', `${bounding ? boundedX : this.x + coords[0] }px`)
            this.game.background.$.css('left', `${this.game.background.x - coords[0]}px`);
            console.debug(boundedX, this.x + coords[0], this.game.container.width);
            if (coords[1]) {
                const boundedY = clamp(this.y + coords[1], 0, this.game.container.height - this.height);
                // this.$.css('top', `${bounding ? boundedY : this.y + coords[1]}px`)
                this.game.background.$.css('top', `${this.game.background.y - coords[1]}px`);
            }
        }
    }
    tp(coords, speed = -1) {
        if (speed == -1) {
            this.$.css('left', `${coords[0]}px`);
            if (coords[1]) {
                this.$.css('top', `${coords[1]}px`);
            }
        }
    }
}
Character.count = 1;
class Object {
    constructor(game, type, where) {
        var _a;
        this.game = game;
        this.type = type;
        this.where = where;
        this.element = document.createElement(type === 'entity' ? 'div' : 'p');
        this.element.style.position = 'absolute';
        this.$ = $(this.element);
        (_a = document.getElementById(`$a${where}`)) === null || _a === void 0 ? void 0 : _a.appendChild(this.element);
    }
}
class Game {
    constructor(o) {
        this.objects = [];
        this.keyEvents = {};
        this.container = new Container(this, document.getElementById('game'));
        this.container.element.style.position = 'absolute';
        this.container.element.style.width = (o === null || o === void 0 ? void 0 : o.dimensions) ? o.dimensions[0] : '1280px';
        this.container.element.style.height = (o === null || o === void 0 ? void 0 : o.dimensions) ? o.dimensions[1] : '720px';
        this.container.element.style.backgroundColor = 'black';
        this.container.element.style.overflow = 'clip';
        this.character = null;
        this.background = new Container(this, document.createElement('div'), this.container.element);
        this.background.$
            .css('position', 'absolute')
            .css('width', '100%')
            .css('height', '100%');
        this.background.element.id = '$abackground';
        this.foreground = new Container(this, document.createElement('div'), this.container.element);
        this.foreground.$
            .css('position', 'absolute')
            .css('width', '100%')
            .css('height', '100%');
        this.static = new Container(this, document.createElement('div'), this.container.element);
        this.static.$
            .css('position', 'absolute')
            .css('width', '100%')
            .css('height', '100%');
        this.foreground.element.id = '$aforeground';
        document.onkeydown = (ev) => {
            var _a;
            console.debug(`${ev.code}`);
            if (ev.key in this.keyEvents || ev.code in this.keyEvents) {
                ((_a = this.keyEvents[ev.key]) !== null && _a !== void 0 ? _a : this.keyEvents[ev.code])(ev);
            }
        };
    }
    addCharacter() {
        this.character = new Character(this);
    }
    onKeys(events, ev) {
        for (const event of events) {
            this.keyEvents[event] = ev;
        }
    }
    addObject(type, where) {
        const obj = new Object(this, type, where);
        this.objects.push(obj);
        return obj;
    }
}
globalThis.Game = Game;
