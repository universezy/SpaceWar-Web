const BlockConsts = {
  HP: 150,
  VELOCITY: 0.5,
  DURATION: 30,
  SCORE: 30
}

function Block (canvas, x, y, offsetX, offsetY, imgAlive, imgExplosion) {
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
  this.maxY = canvas.height
  // init
  this.hp = BlockConsts.HP
  this.duration = BlockConsts.DURATION
  // state
  this.alive = true
  this.show = true
}

Block.prototype.release = function () {
  this.ctx = null
  this.imgAlive = null
  this.imgExplosion = null
}

Block.prototype.draw = function () {
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

Block.prototype.updateCoord = function () {
  if (!this.alive) return
  this.x += BlockConsts.VELOCITY * this.offsetX
  this.y += BlockConsts.VELOCITY * this.offsetY
  if (this.x + this.imgAlive.width / 2 < this.minX ||
    this.x - this.imgAlive.width / 2 > this.maxX ||
    this.y - this.imgAlive.height / 2 > this.maxY) {
    this.show = false
  }
}

Block.prototype.updateHp = function (hp) {
  if (this.hp !== 0) {
    this.hp += hp
    if (this.hp <= 0) {
      this.hp = 0
      this.alive = false
      return true
    }
  }
  return false
}

Block.prototype.getImg = function () {
  return this.alive ? this.imgAlive : this.imgExplosion
}

export default {
  BlockConsts,
  Block
}
