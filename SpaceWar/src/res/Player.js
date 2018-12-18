const PlayerConsts = {
  HP: 100,
  VELOCITY: 5,
  DURATION_LASER: 200,
  DURATION_SHIELD: 300,
  ATTACK_LASER: 3
}

function Player (canvas, x, y, imgAlive, imgExplosion, imgLaser, imgShield) {
  // default
  this.ctx = canvas.getContext('2d')
  this.x = x
  this.y = y
  this.imgAlive = imgAlive
  this.imgExplosion = imgExplosion
  this.imgLaser = imgLaser
  this.imgShield = imgShield
  // limit
  this.originX = x
  this.originY = y
  this.minX = 0
  this.maxX = canvas.width
  this.minY = 0
  this.maxY = canvas.height
  // init
  this.hp = PlayerConsts.HP
  this.laserWidth = this.imgLaser.width * 2
  this.durationLaser = PlayerConsts.DURATION_LASER
  this.durationShield = PlayerConsts.DURATION_SHIELD
  // state
  this.mvUp = false
  this.mvDown = false
  this.mvLeft = false
  this.mvRight = false
  this.alive = true
  this.laser = false
  this.shield = false
}

Player.prototype.draw = function () {
  let imgTarget
  if (!this.alive) {
    imgTarget = this.imgExplosion
  } else if (this.shield) {
    imgTarget = this.imgShield
    this.durationShield--
    if (this.durationShield === 0) {
      this.shield = false
    }
  } else {
    imgTarget = this.imgAlive
  }
  this.ctx.drawImage(imgTarget, this.x - imgTarget.width / 2, this.y - imgTarget.height / 2)
  if (this.laser) {
    this.ctx.drawImage(this.imgLaser, this.x - this.imgLaser.width / 2, this.y - imgTarget.height / 2 - this.imgLaser.height)
    var gradient = this.ctx.createLinearGradient(this.x - this.laserWidth / 2, 0, this.x + this.laserWidth / 2, 0)
    gradient.addColorStop(0, 'rgba(255,128,128,0.6)')
    gradient.addColorStop(0.5, 'rgba(255,0,0,0.9)')
    gradient.addColorStop(1, 'rgba(255,128,128,0.6)')
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(this.x - this.imgLaser.width, 0, this.laserWidth, this.y - imgTarget.height / 2 - this.imgLaser.height)
    this.durationLaser--
    if (this.durationLaser === 0) {
      this.laser = false
    }
  }
}

Player.prototype.updateCoord = function () {
  if (!this.alive) return
  if (this.mvUp) {
    this.y -= PlayerConsts.VELOCITY
    if (this.y < this.minY) {
      this.y = this.minY
    }
  }
  if (this.mvDown) {
    this.y += PlayerConsts.VELOCITY
    if (this.y > this.maxY) {
      this.y = this.maxY
    }
  }
  if (this.mvLeft) {
    this.x -= PlayerConsts.VELOCITY
    if (this.x < this.minX) {
      this.x = this.minX
    }
  }
  if (this.mvRight) {
    this.x += PlayerConsts.VELOCITY
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
    } else if (this.hp > 100) {
      this.hp = 100
    }
  }
}

Player.prototype.getImg = function () {
  if (this.alive) {
    return this.imgAlive
  } else {
    return this.imgExplosion
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

Player.prototype.onLaser = function () {
  if (!this.laser) {
    this.durationLaser = PlayerConsts.DURATION_LASER
    this.laser = true
  }
}

Player.prototype.onShield = function () {
  if (!this.shield) {
    this.durationShield = PlayerConsts.DURATION_SHIELD
    this.shield = true
  }
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
  this.laser = false
  this.shield = false
  this.durationLaser = PlayerConsts.DURATION_LASER
  this.durationShield = PlayerConsts.DURATION_SHIELD
}

export default {
  PlayerConsts,
  Player
}
