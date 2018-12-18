const BossConsts = {
  HP: 1000,
  VELOCITY: 2,
  DURATION: 100,
  SCORE: 500,
  FREQUENCE: 50
}

function Boss (canvas, x, y, offsetX, offsetY, imgAlive, imgExplosion) {
  // default
  this.ctx = canvas.getContext('2d')
  this.x = x
  this.y = y
  this.offsetX = offsetX
  this.offsetY = offsetY
  this.imgAlive = imgAlive
  this.imgExplosion = imgExplosion
  // limit
  this.minX = 0
  this.maxX = canvas.width
  this.minY = 0
  this.maxY = Math.min(canvas.height, 300)
  // init
  this.hp = BossConsts.HP
  this.frequence = BossConsts.FREQUENCE
  this.duration = BossConsts.DURATION
  // state
  this.alive = true
  this.show = true
}

Boss.prototype.draw = function () {
  let imgTarget
  if (!this.alive) {
    imgTarget = this.imgExplosion
    this.duration--
    if (this.duration === 0) {
      this.show = false
    }
  } else {
    imgTarget = this.imgAlive
    this.frequence--
    if (this.frequence < 0) {
      this.frequence = BossConsts.FREQUENCE
    }
  }
  this.ctx.drawImage(imgTarget, this.x - imgTarget.width / 2, this.y - imgTarget.height / 2)
}

Boss.prototype.updateCoord = function () {
  if (!this.alive) return
  this.x += BossConsts.VELOCITY * this.offsetX
  if (this.x <= this.minX) {
    this.x = this.minX
    this.offsetX = 0 - this.offsetX
  } else if (this.x >= this.maxX) {
    this.x = this.maxX
    this.offsetX = 0 - this.offsetX
  }
  if (this.y <= this.minY && this.offsetY > 0) {
    this.y += BossConsts.VELOCITY * this.offsetY
  } else {
    this.y += BossConsts.VELOCITY * this.offsetY
    if (this.y <= this.minY) {
      this.y = this.minY
      this.offsetY = 0 - this.offsetY
    } else if (this.y >= this.maxY) {
      this.y = this.maxY
      this.offsetY = 0 - this.offsetY
    }
  }
}

Boss.prototype.updateHp = function (hp) {
  if (this.hp !== 0) {
    this.hp += hp
    if (this.hp <= 0) {
      this.hp = 0
      this.alive = false
      return true
    } else if (this.hp > BossConsts.HP) {
      this.hp = BossConsts.HP
    }
  }
  return false
}

Boss.prototype.getImg = function () {
  if (this.alive) {
    return this.imgAlive
  } else {
    return this.imgExplosion
  }
}

export default {
  BossConsts,
  Boss
}
