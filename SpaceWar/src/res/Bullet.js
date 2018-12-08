const BulletConsts = {
  color1: 'rgb(255,140,0)',
  color2: 'rgb(124,252,0)',
  size: 5,
  attack: 50,
  velocity: 5,
  maxCount: 20
}

function Bullet (canvas, x, y, color, img) {
  this.ctx = canvas.getContext('2d')
  this.x = x
  this.y = y
  this.color = color
  this.size = BulletConsts.size
  this.attack = BulletConsts.attack
  this.velocity = BulletConsts.velocity
  this.minX = 0
  this.maxX = canvas.screenWidth - img.width
  this.minY = 0
  this.maxY = canvas.screenHeight - img.height
  this.show = true
}

Bullet.prototype.draw = function () {
  this.ctx.beginPath()
  this.ctx.fillStyle = this.color
  this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
  this.ctx.fill()
}

Bullet.prototype.move = function (dx, dy) {
  this.x += dx * this.velocity
  if (this.x < this.minX) {
    this.show = false
  } else if (this.x > this.maxX) {
    this.show = false
  }
  this.y += dy * this.velocity
  if (this.y < this.minY) {
    this.show = false
  } else if (this.y > this.maxY) {
    this.show = false
  }
}

export default {
  BulletConsts,
  Bullet
}
