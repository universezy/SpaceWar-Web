const NuclearConsts = {
  HP: 300,
  VELOCITY: 0.5,
  DURATION: 500
}

function Nuclear (canvas, x, y, offsetX, offsetY, imgAlive, imgExplosion) {
  this.ctx = canvas.getContext('2d')
  this.x = x
  this.y = y
  this.offsetX = offsetX
  this.offsetY = offsetY
  this.imgAlive = imgAlive
  this.imgExplosion = imgExplosion
  this.alive = true
  this.show = true
  this.hp = NuclearConsts.HP
  this.velocity = NuclearConsts.VELOCITY
  this.duration = NuclearConsts.DURATION
}

Nuclear.prototype.draw = function () {
  let imgTarget
  if (!this.alive) {
    imgTarget = this.imgExplosion
    this.duration--
    if (this.duration === 0) {
      this.show = false
    }
  } else {
    imgTarget = this.imgAlive
  }
  this.ctx.drawImage(imgTarget, this.x - imgTarget.width / 2, this.y - imgTarget.height / 2)
}

Nuclear.prototype.updateCoord = function () {
  if (!this.alive) return
  this.x += this.velocity * this.offsetX
  this.y += this.velocity * this.offsetY
  if (this.x + this.imgAlive.width / 2 < this.minX ||
    this.x - this.imgAlive.width / 2 > this.maxX ||
    this.y + this.imgAlive.height / 2 < this.minY ||
    this.y - this.imgAlive.height / 2 > this.maxY) {
    this.show = false
  }
}

Nuclear.prototype.updateHp = function (hp) {
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

Nuclear.prototype.getImg = function () {
  if (this.alive) {
    return this.imgAlive
  } else {
    return this.imgExplosion
  }
}

Nuclear.prototype.detonate = function () {
  if (this.alive) {
    this.alive = false
  }
}

export default {
  NuclearConsts,
  Nuclear
}
