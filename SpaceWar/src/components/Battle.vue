<template>
<div>
  <Game v-show="isPause"></Game>
  <canvas id="canvas_game">
    <img class="img_plane" id="img_player1" src="assets/player.svg" />
    <img class="img_plane" id="img_player2" src="assets/player2.png" />
  </canvas>
  <Background></Background>
</div>
</template>

<script>
import Game from './Game.vue'
import Background from './Background.vue'
import mCanvas from '../res/Canvas'
import mPlayer from '../res/Player'
import mBullet from '../res/Bullet'

export default {
  name: 'Battle',
  components: {
    Game,
    Background
  },
  data () {
    return {
      canvas: null,
      imgPlayer1: null,
      imgPlayer2: null,
      player1: null,
      player2: null,
      playerBullets1: [],
      playerBullets2: [],
      handlerId: 0,
      isGame: false,
      isPause: false,
      state: false
    }
  },
  create () {
    this.prepare()
    this.attachListener()
    this.start()
  },
  method: {
    prepare () {
      this.canvas = new mCanvas.Canvas()
      this.imgPlayer1 = document.getElementById('img_player1')
      this.imgPlayer2 = document.getElementById('img_player2')
      this.player1 = new mPlayer.Player(this.canvas.screenWidth / 2 - this.imgPlayer1.width / 2, this.canvas.screenHeight - this.imgPlayer1.height, mPlayer.PlayerConst.playerVelocity, this.imgPlayer1)
      this.player2 = new mPlayer.Player(this.canvas.screenWidth / 2 - this.imgPlayer2.width / 2, 0, mPlayer.PlayerConst.playerVelocity, this.imgPlayer2)
    },
    attachListener () {
      window.addEventListener('keydown', this.callback1)
      window.addEventListener('keydown', this.callback2)
    },
    callback1 (event) {
      switch (event.keyCode) {
        case 27:// esc
          this.changeState()
          break
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
        case 74:// j
          this.playerShot1()
          break
        default:
          break
      }
    },
    callback2 (event) {
      switch (event.keyCode) {
        case 27:// esc
          this.changeState()
          break
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
        case 96:// 0
          this.playerShot2()
          break
        default:
          break
      }
    },
    playerShot1 () {
      if (this.playerBullets1.length >= mBullet.BulletConst.playerMaxCount) return
      var bullet = new mBullet.Bullet(
        this.player1.x + this.imgPlayer1.width / 2,
        this.player1.y,
        mBullet.BulletConst.playeSize,
        mBullet.BulletConst.playerColor1,
        mBullet.BulletConst.playerVelocity,
        this.imgPlayer1
      )
      this.playerBullets1.push(bullet)
    },
    playerShot2 () {
      if (this.playerBullets2.length >= mBullet.BulletConst.playerMaxCount) return
      var bullet = new mBullet.Bullet(
        this.player2.x + this.imgPlayer2.width / 2,
        this.player2.y + this.imgPlayer2.height,
        mBullet.BulletConst.playeSize,
        mBullet.BulletConst.playerColor2,
        mBullet.BulletConst.playerVelocity,
        this.imgPlayer2
      )
      this.playerBullets2.push(bullet)
    },
    loop () {
      this.canvas.clearRect(0, 0, this.canvas.screenWidth, this.canvas.screenHeight)
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
    changeState () {
      if (this.state) {
        this.isPause = true
        cancelAnimationFrame(this.handlerId)
        this.state = false
      } else {
        this.isPause = false
        this.loop()
        this.state = true
      }
    },
    start () {
      this.isGame = true
      this.state = true
      this.loop()
    }
  }
}
</script>

<style scoped>

</style>
