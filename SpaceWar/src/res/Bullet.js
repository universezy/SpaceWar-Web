const BulletConsts = {
  COLOR1: 'rgb(255,140,0)',
  COLOR2: 'rgb(124,252,0)',
  SIZE: 4,
  ATTACK: 1,
  VELOCITY: 15,
  MAX_COUNT: 30
}

function Bullet (canvas, x, y, offsetX, offsetY, color) {
  this.ctx = canvas.getContext('2d')
  this.x = x
  this.y = y
  this.offsetX = offsetX
  this.offsetY = offsetY
  this.color = color
  this.size = BulletConsts.SIZE
  this.attack = BulletConsts.ATTACK
  this.velocity = BulletConsts.VELOCITY
  this.minX = 0
  this.maxX = canvas.width
  this.minY = 0
  this.maxY = canvas.height
  this.show = true
}

Bullet.prototype.draw = function () {
  this.ctx.beginPath()
  this.ctx.fillStyle = this.color
  this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
  this.ctx.fill()
}

Bullet.prototype.update = function () {
  this.x += this.offsetX * this.velocity
  if (this.x < this.minX || this.x > this.maxX) {
    this.show = false
  }
  this.y += this.offsetY * this.velocity
  if (this.y < this.minY || this.y > this.maxY) {
    this.show = false
  }
}

export default {
  BulletConsts,
  Bullet
}
