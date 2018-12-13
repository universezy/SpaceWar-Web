const PlayerConsts = {
  hp: 100,
  velocity: 5
}

function Player (canvas, x, y, img) {
  this.ctx = canvas.getContext('2d')
  this.x = x
  this.y = y
  this.img = img
  this.hp = PlayerConsts.hp
  this.velocity = PlayerConsts.velocity
  this.originX = x
  this.originY = y
  this.minX = 0
  this.maxX = canvas.width
  this.minY = 0
  this.maxY = canvas.height
  this.mvUp = false
  this.mvDown = false
  this.mvLeft = false
  this.mvRight = false
  this.show = true
  this.explose = new Image()
  this.explose.src = '../assets/explose.svg'
}

Player.prototype.update = function () {
  if (this.mvUp) {
    this.y -= this.velocity
    if (this.y < this.minY) {
      this.y = this.minY
    }
  }
  if (this.mvDown) {
    this.y += this.velocity
    if (this.y > this.maxY) {
      this.y = this.maxY
    }
  }
  if (this.mvLeft) {
    this.x -= this.velocity
    if (this.x < this.minX) {
      this.x = this.minX
    }
  }
  if (this.mvRight) {
    this.x += this.velocity
    if (this.x > this.maxX) {
      this.x = this.maxX
    }
  }
}

Player.prototype.draw = function () {
  if (!this.show) {
    this.img = this.explose
  }
  this.ctx.drawImage(this.img, this.x - this.img.width / 2, this.y - this.img.height / 2)
}

Player.prototype.setUp = function (status) {
  this.mvUp = status
}

Player.prototype.setDown = function (status) {
  this.mvDown = status
}

Player.prototype.setLeft = function (status) {
  this.mvLeft = status
}

Player.prototype.setRight = function (status) {
  this.mvRight = status
}

Player.prototype.resetStates = function () {
  this.mvUp = false
  this.mvDown = false
  this.mvLeft = false
  this.mvRight = false
}

Player.prototype.resetCoord = function () {
  this.x = this.originX
  this.y = this.originY
}

export default {
  PlayerConsts,
  Player
}
