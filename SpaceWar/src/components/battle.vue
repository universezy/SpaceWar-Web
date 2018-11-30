<template>
<div>
  <gameAlert v-show="isPause"></gameAlert>
  <canvas id="canvas_game">
    <img class="img_plane" id="img_player1" src="../assets/player.svg" />
    <img class="img_plane" id="img_player2" src="../assets/player2.png" />
  </canvas>
  <background></background>
</div>
</template>

<script>
import gameAlert from './game-alert.vue'
import background from './background.vue'
import mPlayer from '../res/Player'
import mBullet from '../res/Bullet'

export default {
  name: 'battle',
  components: {
    gameAlert,
    background
  },
  data () {
    return {
      canvas: null,
      ctx: null,
      screenWidth: 0,
      screenHeight: 0,
      imgPlayer1: null,
      imgPlayer2: null,
      player1: null,
      player2: null,
      playerBullets1: [],
      playerBullets2: [],
      handlerId: 0,
      isPause: true
    }
  },
  mounted () {
    this.prepare()
    this.attachListener()
    this.start()
  },
  methods: {
    prepare: function () {
      this.canvas = document.getElementById('canvas_game')
      this.ctx = this.canvas.getContext('2d')
      this.screenWidth = this.canvas.width = window.innerWidth
      this.screenHeight = this.canvas.height = window.innerHeight
      this.imgPlayer1 = document.getElementById('img_player1')
      this.imgPlayer2 = document.getElementById('img_player2')
      this.player1 = new mPlayer.Player(
        this.canvas,
        this.screenWidth / 2 - this.imgPlayer1.width / 2,
        this.screenHeight - this.imgPlayer1.height,
        mPlayer.PlayerConst.playerVelocity,
        this.imgPlayer1
      )
      this.player2 = new mPlayer.Player(
        this.canvas,
        this.screenWidth / 2 - this.imgPlayer2.width / 2,
        0,
        mPlayer.PlayerConst.playerVelocity,
        this.imgPlayer2
      )
    },
    attachListener: function () {
      if (typeof window.addEventListener !== 'undefined') {
        window.addEventListener('keydown', this.callbackPlayer1)
        window.addEventListener('keydown', this.callbackPlayer2)
        window.addEventListener('keydown', this.callbackControl1)
        window.addEventListener('keydown', this.callbackControl2)
        window.addEventListener('keydown', this.callbackGame)
      } else {
        alert('The version of your browser is too low.')
      }
    },
    callbackPlayer1: function (e) {
      // 兼容Firefox
      e = e || event
      switch (e.witch || e.keyCode) {
        case 87:// w
          this.player1.move(0, -1)
          break
        case 65:// a
          this.player1.move(-1, 0)
          break
        case 83:// s
          this.player1.move(0, 1)
          break
        case 68:// d
          this.player1.move(1, 0)
          break
        default:
          break
      }
    },
    callbackPlayer2: function (e) {
      e = e || event
      switch (e.witch || e.keyCode) {
        case 38:// up
          this.player2.move(0, -1)
          break
        case 37:// left
          this.player2.move(-1, 0)
          break
        case 40:// down
          this.player2.move(0, 1)
          break
        case 39:// right
          this.player2.move(1, 0)
          break
        default:
          break
      }
    },
    callbackControl1: function (e) {
      e = e || event
      switch (e.witch || e.keyCode) {
        case 74:// j
          this.playerShot1()
          break
        default:
          break
      }
    },
    callbackControl2: function (e) {
      e = e || event
      switch (e.witch || e.keyCode) {
        case 96:// 0
          this.playerShot2()
          break
        default:
          break
      }
    },
    callbackGame: function (e) {
      e = e || event
      switch (e.witch || e.keyCode) {
        case 27:// esc
          this.changeState()
          break
        default:
          break
      }
    },
    playerShot1: function () {
      if (this.playerBullets1.length < mBullet.BulletConst.playerMaxCount) {
        var bullet = new mBullet.Bullet(
          this.canvas,
          this.player1.x + this.imgPlayer1.width / 2,
          this.player1.y,
          mBullet.BulletConst.playeSize,
          mBullet.BulletConst.playerColor1,
          mBullet.BulletConst.playerVelocity,
          this.imgPlayer1
        )
        this.playerBullets1.push(bullet)
      }
    },
    playerShot2: function () {
      if (this.playerBullets2.length < mBullet.BulletConst.playerMaxCount) {
        var bullet = new mBullet.Bullet(
          this.canvas,
          this.player2.x + this.imgPlayer2.width / 2,
          this.player2.y + this.imgPlayer2.height,
          mBullet.BulletConst.playeSize,
          mBullet.BulletConst.playerColor2,
          mBullet.BulletConst.playerVelocity,
          this.imgPlayer2
        )
        this.playerBullets2.push(bullet)
      }
    },
    checkCollision: function () {
      // TODO
    },
    loop: function () {
      this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight)
      this.player1.draw()
      this.player2.draw()
      for (var i = this.playerBullets1.length - 1; i >= 0; i--) {
        if (this.playerBullets1[i].show === true) {
          this.playerBullets1[i].draw()
          this.playerBullets1[i].move(0, -1)
        } else {
          this.playerBullets1.splice(i, 1)
        }
      }
      for (var j = this.playerBullets2.length - 1; j >= 0; j--) {
        if (this.playerBullets2[j].show === true) {
          this.playerBullets2[j].draw()
          this.playerBullets2[j].move(0, 1)
        } else {
          this.playerBullets2.splice(j, 1)
        }
      }
      this.handlerId = requestAnimationFrame(this.loop)
    },
    changeState: function () {
      if (this.isPause) {
        this.loop()
        this.isPause = false
      } else {
        cancelAnimationFrame(this.handlerId)
        this.isPause = true
      }
    },
    start: function () {
      this.isPause = true
    }
  }
}
</script>

<style scoped>
#canvas_game{
    z-index: -1;
}
</style>
