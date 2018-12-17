const EnemyConsts = {
  HP: 80,
  VELOCITY: 3
}

function Enemy(canvas, x, y, dx, dy, imgAlive, imgExplosion) {
  this.ctx = canvas.getContext('2d')
  this.x = x
  this.y = y
  this.dx = dx
  this.dy = dy
  this.imgAlive = imgAlive
  this.imgExplosion = imgExplosion
  this.hp = PlayerConsts.HP
  this.velocity = PlayerConsts.VELOCITY
  this.minX = 0
  this.maxX = canvas.width
  this.minY = 0
  this.maxY = canvas.height
  this.alive = true
}

Enemy.prototype.draw = function () {
  let imgTarget
  if (!this.alive) {
    imgTarget = this.imgExplosion
  } else {
    imgTarget = this.imgAlive
  }
  this.ctx.drawImage(imgTarget, this.x - imgTarget.width / 2, this.y - imgTarget.height / 2)
}

Enemy.prototype.updateCoord = function () {

}

Enemy.prototype.updateHp = function (hp) {
  if (this.hp !== 0) {
    this.hp += hp
    if (this.hp <= 0) {
      this.hp = 0
      this.alive = false
    } else if (this.hp1 > 100) {
      this.hp = 100
    }
  }
}

Enemy.prototype.getImg = function () {
  if (this.alive) {
    return this.imgAlive
  } else {
    return this.imgExplosion
  }
}

export default {
  EnemyConsts,
  Enemy
}
