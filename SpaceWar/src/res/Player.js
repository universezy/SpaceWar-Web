const PlayerConsts = {
  hp: 1000,
  velocity: 5
}

function Player (canvas, x, y, img) {
  this.ctx = canvas.getContext('2d')
  this.x = x
  this.y = y
  this.hp = PlayerConsts.hp
  this.velocity = PlayerConsts.velocity
  this.img = img
  this.minX = 0
  this.maxX = canvas.screenWidth - img.width
  this.minY = 0
  this.maxY = canvas.screenHeight - img.height
}

Player.prototype.draw = function () {
  this.ctx.drawImage(this.img, this.x, this.y)
}

Player.prototype.move = function (dx, dy) {
  this.x += dx * this.velocity
  if (this.x < this.minX) {
    this.x = this.minX
  } else if (this.x > this.maxX) {
    this.x = this.maxX
  }
  this.y += dy * this.velocity
  if (this.y < this.minY) {
    this.y = this.minY
  } else if (this.y > this.maxY) {
    this.y = this.maxY
  }
}

export default {
  PlayerConsts,
  Player
}
