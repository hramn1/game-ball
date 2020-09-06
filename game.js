'use strict'

let getRandomValue = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};


const GAME_CONSTANTS = {
    GRAVITY: 0.45,
    SIZE: 50,
    OFFSET_Y: 0,
    GAME_TIME: 30000,
}

const setup = {
    velocity: 1,
    widthScreen: window.innerWidth,
    heightScreen: window.innerHeight - 5,
}

const game = {
    isStart: false,
    textGame: '',

    gameOver(msg, timerGame) {
        this.textGame = msg;
        this.isStart = false;
        clearTimeout(timerGame);
        ctx.clearRect(0, 0, setup.widthScreen, setup.heightScreen);
        document.querySelector(`.modal-msg`).textContent = this.textGame;
        document.querySelector(`.start-modal`).style.display = "block";
    },

    gameStart() {
        const timerGame = setTimeout(function () {
            game.gameOver(`Вы выграли!`);
        }, GAME_CONSTANTS.GAME_TIME);

        const rectangle = new Array(5)
            .fill('')
            .map(function () {
                return new Rectangle();
            });

        document.querySelector(`.start-modal`).style.display = "none";
        this.isStart = true;
        if (this.isStart) {
            requestAnimationFrame(function renderGame() {
                ctx.clearRect(0, 0, setup.widthScreen, setup.heightScreen);
                for (let it of rectangle) {
                    it.render();
                    it.move(timerGame);
                    it.reset();
                    circle.render();
                }
                if (game.isStart) {
                    requestAnimationFrame(renderGame)
                }
            });
        }
    }
};

document.querySelector(`.start-game-btn`).addEventListener('click', () => {
        game.gameStart();
    });

let ctx = document.querySelector('#game').getContext('2d');
document.querySelector('#game').width = setup.widthScreen;
document.querySelector('#game').height = setup.heightScreen;

const circle = {
    x: setup.widthScreen / 2,
    y: setup.heightScreen / 2,
    ys: GAME_CONSTANTS.OFFSET_Y,
    size: GAME_CONSTANTS.SIZE,
    jumping: false,

    render() {
        ctx.beginPath();
        ctx.font = "60px Segoe UI Emoji";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("😾", this.x, this.y, 60);
        ctx.closePath();
    },

    jump(jumping) {
        if (jumping) {
            this.ys = -12;
            let jumpTimer = setInterval(() => {
                this.jumping = true;
                circle.y += circle.ys;
                circle.ys += GAME_CONSTANTS.GRAVITY;
                if (this.y >= setup.heightScreen / 2) {
                    clearInterval(jumpTimer);
                    this.y = setup.heightScreen / 2;
                    this.jumping = !jumping;
                }
            }, 10)
        }
    },
};
document.addEventListener("keydown", function (evt) {
    if (evt.key === "ArrowUp") {
        const jumping = !circle.jumping;
        circle.jump(jumping);
    }
})

class Rectangle {
    constructor() {
        this.x = getRandomValue(setup.widthScreen, setup.widthScreen + 300);
        this.y = getRandomValue(0, setup.heightScreen);
        this.width = getRandomValue(30, 80);
        this.velocity = getRandomValue(5 * setup.velocity, 15 * setup.velocity);
        this.size = GAME_CONSTANTS.SIZE;

    }

    render() {
        ctx.beginPath();
        ctx.font = `${this.width}px Segoe UI Emoji`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("🗿", this.x, this.y, this.width);
        ctx.closePath();
    }

    move(timerGame) {
        this.x = this.x - this.velocity;
        if (this.isHit()) {
            game.gameOver('Вы проиграли', timerGame);
        }
    }

    _isOfScreen() {
        return this.x < 0 - this.width;
    }

    reset() {
        if (this._isOfScreen()) {
            this.x = getRandomValue(setup.widthScreen, setup.widthScreen + 300);
            this.y = getRandomValue(0, setup.heightScreen);
            this.velocity = getRandomValue(5, 15);
        }
    }

    isHit() {
        return (
            circle.x < this.x + this.size &&
            circle.x + circle.size > this.x &&
            circle.y < this.y + this.size &&
            circle.y + circle.size > this.y
        );
    }
}






