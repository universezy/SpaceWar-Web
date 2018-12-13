const BulletConsts = {
  color1: 'rgb(255,140,0)',
  color2: 'rgb(124,252,0)',
  size: 4,
  attack: 2,
  velocity: 15,
  maxCount: 30
}

function Bullet (canvas, x, y, dx, dy, color) {
  this.ctx = canvas.getContext('2d')
  this.x = x
  this.y = y
  this.dx = dx
  this.dy = dy
  this.color = color
  this.size = BulletConsts.size
  this.attack = BulletConsts.attack
  this.velocity = BulletConsts.velocity
  this.minX = 0
  this.maxX = canvas.width
  this.minY = 0
  this.maxY = canvas.height
  this.show = true
}

Bullet.prototype.update = function () {
  this.x += this.dx * this.velocity
  if (this.x < this.minX || this.x > this.maxX) {
    this.show = false
  }
  this.y += this.dy * this.velocity
  if (this.y < this.minY || this.y > this.maxY) {
    this.show = false
  }
}

Bullet.prototype.draw = function () {
  this.ctx.beginPath()
  this.ctx.fillStyle = this.color
  this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
  this.ctx.fill()
}

export default {
  BulletConsts,
  Bullet
}
