const EnemyConsts = {
  HP: 50,
  VELOCITY: 3,
  DURATION: 50
}

function Enemy (canvas, x, y, offsetX, offsetY, imgAlive, imgExplosion) {
  this.ctx = canvas.getContext('2d')
  this.x = x
  this.y = y
  this.offsetX = offsetX
  this.offsetY = offsetY
  this.imgAlive = imgAlive
  this.imgExplosion = imgExplosion
  this.hp = EnemyConsts.HP
  this.velocity = EnemyConsts.VELOCITY
  this.minX = 0
  this.maxX = canvas.width
  this.minY = 0
  this.maxY = canvas.height
  this.alive = true
  this.show = true
  this.duration = EnemyConsts.DURATION
}

Enemy.prototype.draw = function () {
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

Enemy.prototype.updateCoord = function () {
  if (!this.alive) return
  this.x += this.velocity * this.offsetX
  if (this.x <= this.minX) {
    this.x = this.minX
    this.offsetX = 0 - this.offsetX
  } else if (this.x >= this.maxX) {
    this.x = this.maxX
    this.offsetX = 0 - this.offsetX
  }
  if (this.y <= this.minY && this.offsetY > 0) {
    this.y += this.velocity * this.offsetY
  } else {
    this.y += this.velocity * this.offsetY
    if (this.y <= this.minY) {
      this.y = this.minY
      this.offsetY = 0 - this.offsetY
    } else if (this.y >= this.maxY) {
      this.y = this.maxY
      this.offsetY = 0 - this.offsetY
    }
  }
}

Enemy.prototype.updateHp = function (hp) {
  if (this.hp !== 0) {
    this.hp += hp
    if (this.hp <= 0) {
      this.hp = 0
      this.alive = false
    } else if (this.hp > 100) {
      this.hp = 100
    }
  }
  console.log('rest hp = ' + this.hp)
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
