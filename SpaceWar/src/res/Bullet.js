const BulletConsts = {
  COLOR1: 'rgb(255,140,0)',
  COLOR2: 'rgb(124,252,0)',
  SIZE: 4,
  ATTACK: 1,
  VELOCITY: 15,
  MAX_COUNT: 30
}

function Bullet (canvas, x, y, offsetX, offsetY, color) {
  // default
  this.ctx = canvas.getContext('2d')
  this.x = x
  this.y = y
  this.offsetX = offsetX
  this.offsetY = offsetY
  this.color = color
  // limit
  this.minX = 0
  this.maxX = canvas.width
  this.minY = 0
  this.maxY = canvas.height
  // state
  this.show = true
}

Bullet.prototype.draw = function () {
  this.ctx.beginPath()
  this.ctx.fillStyle = this.color
  this.ctx.arc(this.x, this.y, BulletConsts.SIZE, 0, 2 * Math.PI)
  this.ctx.fill()
}

Bullet.prototype.updateCoord = function () {
  this.x += this.offsetX * BulletConsts.VELOCITY
  if (this.x < this.minX || this.x > this.maxX) {
    this.show = false
  }
  this.y += this.offsetY * BulletConsts.VELOCITY
  if (this.y < this.minY || this.y > this.maxY) {
    this.show = false
  }
}

export default {
  BulletConsts,
  Bullet
}
