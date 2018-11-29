var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var screenWidth = canvas.width = window.innerWidth;
var screenHeight = canvas.height = window.innerHeight;
var smallPlaneSize = 20;
var playerVelocity = 10;
var playerBulletSize = 5;
var player1BulletColor = 'rgb(255,140,0)';
var player2BulletColor = 'rgb(124,252,0)';
var playerBulletVelocity = 3;
var playerBulletMaxCount = 20;

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
var img_player1 = document.getElementById('img_player1');
var img_player2 = document.getElementById('img_player2');
var minX = 0;
var maxX = screenWidth - img_player1.width;
var minY = 0;
var maxY = screenHeight - img_player1.height;

function Player(img, x, y) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.velocity = playerVelocity;
}

Player.prototype.draw = function () {
    ctx.drawImage(this.img, this.x, this.y);
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

var player1 = new Player(img_player1, maxX / 2, maxY);
var player2 = new Player(img_player2, maxX / 2, 0);
var player1Bullets = [];
var player2Bullets = [];
var handlerId = 0;
var isGame = false;
var isBattle = false;
var state = false;

function player1Shot() {
    if (player1Bullets.length >= playerBulletMaxCount) return;
    var bullet = new Bullet(player1.x + img_player1.width / 2, player1.y, playerBulletSize, player1BulletColor);
    player1Bullets.push(bullet);
}

function player2Shot() {
    if (player2Bullets.length >= playerBulletMaxCount) return;
    var bullet = new Bullet(player2.x + img_player1.width / 2, player2.y + img_player2.height, playerBulletSize, player2BulletColor);
    player2Bullets.push(bullet);
}

function loop() {
    ctx.clearRect(0, 0, screenWidth, screenHeight);
    player1.draw();
    for (var i = player1Bullets.length - 1; i >= 0; i--) {
        if (player1Bullets[i].show === true) {
            player1Bullets[i].draw();
            player1Bullets[i].move(0, -1);
        } else {
            player1Bullets.splice(i, 1);
        }
    }
    if (isBattle) {
        player2.draw();
        for (var j = player2Bullets.length - 1; j >= 0; j--) {
            if (player2Bullets[j].show === true) {
                player2Bullets[j].draw();
                player2Bullets[j].move(0, 1);
            } else {
                player2Bullets.splice(j, 1);
            }
        }
    }
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
    });

    button_battle.addEventListener('click', function (event) {
        div_main.style.display = 'none';
        footer.style.display = 'none';
        div_menu.style.display = 'block';
        isBattle = true;
    });

    button_explain.addEventListener('click', function (event) {
        // TODO
    });
}

window.onload = function () {
    prepare();
    start();
};

window.onkeydown = function (event) {
    if (!isGame) {
        return;
    } else if (event.keyCode === 27) { // esc
        changeState();
    } else if (state) {
        switch (event.keyCode) {
            case 87: // W
                player1.move(0, -1);
                break;
            case 65: // A
                player1.move(-1, 0);
                break;
            case 83: // S
                player1.move(0, 1);
                break;
            case 68: // D
                player1.move(1, 0);
                break;
            case 74: // J
                player1Shot();
                break;
            default:
                break;
        }
        if (isBattle) {
            switch (event.keyCode) {
                case 38: // up
                    player2.move(0, -1);
                    break;
                case 37: // left
                    player2.move(-1, 0);
                    break;
                case 40: // down
                    player2.move(0, 1);
                    break;
                case 39: // right
                    player2.move(1, 0);
                    break;
                case 96: // 0
                    player2Shot();
                    break;
                default:
                    break;
            }
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