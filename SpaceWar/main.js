var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var screenWidth = canvas.width = window.innerWidth;
var screenHeight = canvas.height = window.innerHeight;
var smallPlaneSize = 20;
var playerVelocity = 10;
var playerBulletSize = 5;
var playerBulletColor = 'rgb(255,140,0)';
var playerBulletVelocity = 3;

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
var minX = 0;
var maxX = screenWidth - img_player.width;
var minY = 0;
var maxY = screenHeight - img_player.height;

function Player() {
    this.x = maxX / 2;
    this.y = maxY;
    this.velocity = playerVelocity;
}

Player.prototype.draw = function () {
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

function Bullet(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.velocity = playerBulletVelocity;
    this.show = true;
}

Bullet.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
};

Bullet.prototype.move = function (dx, dy) {
    this.x += dx * this.velocity;
    if (this.x < minX) {
        this.show = false;
    } else if (this.x > maxX) {
        this.show = false;
    }
    this.y += dy * this.velocity;
    if (this.y < minY) {
        this.show = false;
    } else if (this.y > maxY) {
        this.show = false;
    }
};

var player = new Player();
var playerBullet = [];
var handlerId = 0;
var isGame = false;
var state = false;

function playerShot() {
    var bullet = new Bullet(player.x + img_player.width / 2, player.y, playerBulletSize, playerBulletColor);
    playerBullet.push(bullet);
}

function loop() {
    ctx.clearRect(0, 0, screenWidth, screenHeight);
    player.draw();
    for (var i = playerBullet.length - 1; i >= 0; i--) {
        if (playerBullet[i].show === true) {
            playerBullet[i].draw();
            playerBullet[i].move(0, -1);
        } else {
            playerBullet.splice(i, 1);
        }
    }
    console.log('length = ' + playerBullet.length);
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
                playerShot();
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