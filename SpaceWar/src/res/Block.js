const BlockConsts = {
  HP: 150,
  VELOCITY: 0.5,
  DURATION: 30
}

function Block (canvas, x, y, offsetX, offsetY, imgAlive, imgExplosion) {
  this.ctx = canvas.getContext('2d')
  this.x = x
  this.y = y
  this.offsetX = offsetX
  this.offsetY = offsetY
  this.imgAlive = imgAlive
  this.imgExplosion = imgExplosion
  this.hp = BlockConsts.HP
  this.velocity = BlockConsts.VELOCITY
  this.minX = 0
  this.maxX = canvas.width
  this.minY = 0
  this.maxY = canvas.height
  this.alive = true
  this.show = true
  this.duration = BlockConsts.DURATION
}

Block.prototype.draw = function () {
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

Block.prototype.updateCoord = function () {
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

Block.prototype.updateHp = function (hp) {
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

Block.prototype.getImg = function () {
  if (this.alive) {
    return this.imgAlive
  } else {
    return this.imgExplosion
  }
}

export default {
  BlockConsts,
  Block
}
