const PlayerConsts = {
  HP: 100,
  VELOCITY: 5
}

function Player (canvas, x, y, imgAlive, imgExplose) {
  this.ctx = canvas.getContext('2d')
  this.x = x
  this.y = y
  this.imgAlive = imgAlive
  this.imgExplose = imgExplose
  this.hp = PlayerConsts.HP
  this.velocity = PlayerConsts.VELOCITY
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
  this.alive = true
}

Player.prototype.draw = function () {
  let imgTarget
  if (this.alive) {
    imgTarget = this.imgAlive
  } else {
    imgTarget = this.imgExplose
  }
  this.ctx.drawImage(imgTarget, this.x - imgTarget.width / 2, this.y - imgTarget.height / 2)
}

Player.prototype.updateCoord = function () {
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

Player.prototype.updateHp = function (hp) {
  if (this.hp !== 0) {
    this.hp += hp
    if (this.hp <= 0) {
      this.hp = 0
      this.alive = false
    } else if (this.hp1 > 100) {
      this.hp = 100
    }
  }
}

Player.prototype.getImg = function () {
  if (this.alive) {
    return this.imgAlive
  } else {
    return this.imgExplose
  }
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

Player.prototype.resetSource = function () {
  this.hp = PlayerConsts.HP
  this.alive = true
}

export default {
  PlayerConsts,
  Player
}
