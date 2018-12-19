const NuclearConsts = {
  HP: 200,
  VELOCITY: 1,
  DURATION: 150,
  ATTACK: 5
}

function Nuclear (canvas, x, y, offsetY, imgAlive, imgExplosion) {
  // default
  this.ctx = canvas.getContext('2d')
  this.x = x
  this.y = y
  this.offsetY = offsetY
  this.imgAlive = imgAlive
  this.imgExplosion = imgExplosion
  // limit
  this.minY = 0
  this.maxY = canvas.height
  // init
  this.hp = NuclearConsts.HP
  this.duration = NuclearConsts.DURATION
  this.size = this.imgExplosion.width
  // state
  this.alive = true
  this.show = true
}

Nuclear.prototype.release = function () {
  this.ctx = null
  this.imgAlive = null
  this.imgExplosion = null
}

Nuclear.prototype.draw = function () {
  var imgTarget
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
  this.y += NuclearConsts.VELOCITY * this.offsetY
  if (this.y + this.imgAlive.height / 2 < this.minY ||
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
    }
  }
}

Nuclear.prototype.getImg = function () {
  return this.alive ? this.imgAlive : this.imgExplosion
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
