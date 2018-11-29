var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var screenWidth = canvas.width = window.innerWidth;
var screenHeight = canvas.height = window.innerHeight;
var smallPlaneSize = 20;
var defaultVelocity = 10;

var div_main = document.getElementById('div_main');
var div_menu = document.getElementById('div_menu');
var div_alert = document.getElementById('div_alert');
var button_solo = document.getElementById('button_solo');
var button_battle = document.getElementById('button_battle');
var button_explain = document.getElementById('button_explain');
var footer = document.getElementById('footer');
var span_level = document.getElementById('span_level');
var span_hp = document.getElementById('span_hp');
var span_score = document.getElementById('span_score');
var img_player = document.getElementById('img_player');
var img_plane1 = document.getElementById('img_plane1');
var minX = 0;
var maxX = screenWidth - img_player.width;
var minY = 0;
var maxY = screenHeight - img_player.height;

function Player() {
    this.x = maxX / 2;
    this.y = maxY;
    this.velocity = defaultVelocity;
}

Player.prototype.draw = function () {
    ctx.clearRect(0, 0, screenWidth, screenHeight);
    ctx.drawImage(img_player, this.x, this.y);
};

Player.prototype.move = function (dx, dy) {
    this.x += dx * this.velocity;
    if (this.x < minX) {
        this.x = minX;
    } else if (this.x > maxX) {
        this.x = maxX;
    }
    this.y += dy * this.velocity;
    if (this.y < minY) {
        this.y = minY;
    } else if (this.y > maxY) {
        this.y = maxY;
    }
};

var player = new Player();
var handlerId = 0;
var isGame = false;
var state = false;

function loop() {
    player.draw();
    handlerId = requestAnimationFrame(loop);
}

function changeState() {
    if (state) {
        div_alert.style.display = "block";
        cancelAnimationFrame(handlerId);
        state = false;
    } else {
        div_alert.style.display = "none";
        loop();
        state = true;
    }
}

function prepare() {
    attachButtonListener();
}

function start() {
    isGame = true;
    state = true;
    loop();
}

function stop() {

}

function attachButtonListener() {
    button_solo.addEventListener('click', function (event) {
        div_main.style.display = 'none';
        footer.style.display = 'none';
        div_menu.style.display = 'block';
        prepare();
        start();
    });

    button_battle.addEventListener('click', function (event) {
        div_main.style.display = 'none';
        footer.style.display = 'none';
        div_menu.style.display = 'block';
        prepare();
        start();
        // TODO
    });

    button_explain.addEventListener('click', function (event) {
        // TODO
    });
}

window.onload = function () {
    isLoaded = true;
    prepare();
};

window.onkeydown = function (event) {
    if (!isGame) {
        return;
    } else if (event.keyCode === 27) { // esc
        changeState();
    } else if (state) {
        switch (event.keyCode) {
            case 87: // W
                player.move(0, -1);
                break;
            case 65: // A
                player.move(-1, 0);
                break;
            case 83: // S
                player.move(0, 1);
                break;
            case 68: // D
                player.move(1, 0);
                break;
            case 74: // J
                // TODO
                break;
            case 38: // up
                // TODO
                break;
            case 37: // left
                // TODO
                break;
            case 40: // down
                // TODO
                break;
            case 39: // right
                // TODO
                break;
            case 96: // 0
                // TODO
                break;
            default:
                break;
        }
    }
};

window.onresize = function () {
    if (state) {
        cancelAnimationFrame(handlerId);
    }
    screenWidth = canvas.width = window.innerWidth;
    screenHeight = canvas.height = window.innerHeight;
    if (state) {
        loop();
    }
};