<template>
  <div>
    <canvas id="canvas_game">
      <img class="img_plane" id="img_player1" src="../assets/player.svg" />
      <img class="img_plane" id="img_player2" src="../assets/player2.png" />
    </canvas>
    <alertCom v-show="isPause"></alertCom>
    <menuCom></menuCom>
  </div>
</template>

<script>
import menuCom from './component-menu.vue'
import alertCom from './component-alert.vue'
import mPlayer from '../res/Player'
import mBullet from '../res/Bullet'

export default {
  name: 'battle',
  components: {
    menuCom,
    alertCom
  },
  data () {
    return {
      canvas: null,
      ctx: null,
      screenWidth: 0,
      screenHeight: 0,
      hp1: 0,
      hp2: 0,
      imgPlayer1: null,
      imgPlayer2: null,
      player1: null,
      player2: null,
      bullets1: [],
      bullets2: [],
      isShotting1: false,
      isShotting2: false,
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
      this.prepareEnv()
      this.prepareSrc()
    },
    prepareEnv: function () {
      this.canvas = document.getElementById('canvas_game')
      this.ctx = this.canvas.getContext('2d')
      this.screenWidth = this.canvas.width = window.innerWidth
      this.screenHeight = this.canvas.height = window.innerHeight
    },
    prepareSrc: function () {
      this.imgPlayer1 = document.getElementById('img_player1')
      this.imgPlayer2 = document.getElementById('img_player2')
      this.player1 = new mPlayer.Player(
        this.canvas,
        this.screenWidth / 2,
        this.screenHeight - this.imgPlayer1.height / 2,
        this.imgPlayer1
      )
      this.player2 = new mPlayer.Player(
        this.canvas,
        this.screenWidth / 2,
        this.imgPlayer2.height / 2,
        this.imgPlayer2
      )
      this.hp1 = this.player1.hp
      this.hp2 = this.player2.hp
    },
    attachListener: function () {
      if (typeof window.addEventListener !== 'undefined') {
        window.addEventListener('keydown', this.onKeydown)
        window.addEventListener('keyup', this.onKeyup)
      } else {
        alert('The version of your browser is too low.')
      }
    },
    updateHp1: function (hp) {
      this.hp1 += hp
      if (this.hp1 < 0) {
        this.hp1 = 0
      }
    },
    updateHp2: function (hp) {
      this.hp2 += hp
      if (this.hp2 < 0) {
        this.hp2 = 0
      }
    },
    onKeydown: function (e) {
      // 兼容Firefox
      e = e || event
      let code = e.witch || e.keyCode
      if (code === 27) { // esc
        this.changeState()
      } else if (!this.isPause) {
        switch (code) {
          case 70:// f
            this.isShotting1 = true
            break
          case 87:// w
            this.player1.setUp(true)
            break
          case 65:// a
            this.player1.setLeft(true)
            break
          case 83:// s
            this.player1.setDown(true)
            break
          case 68:// d
            this.player1.setRight(true)
            break
          case 191:// /
            this.isShotting2 = true
            break
          case 38:// up
            this.player2.setUp(true)
            break
          case 37:// left
            this.player2.setLeft(true)
            break
          case 40:// down
            this.player2.setDown(true)
            break
          case 39:// right
            this.player2.setRight(true)
            break
          default:
            break
        }
      }
    },
    onKeyup: function (e) {
      // 兼容Firefox
      e = e || event
      switch (e.witch || e.keyCode) {
        case 70:// f
          this.isShotting1 = false
          break
        case 87:// w
          this.player1.setUp(false)
          break
        case 65:// a
          this.player1.setLeft(false)
          break
        case 83:// s
          this.player1.setDown(false)
          break
        case 68:// d
          this.player1.setRight(false)
          break
        case 191:// /
          this.isShotting2 = false
          break
        case 38:// up
          this.player2.setUp(false)
          break
        case 37:// left
          this.player2.setLeft(false)
          break
        case 40:// down
          this.player2.setDown(false)
          break
        case 39:// right
          this.player2.setRight(false)
          break
        default:
          break
      }
    },
    onShot: function () {
      if (this.isShotting1 && this.bullets1.length < mBullet.BulletConsts.maxCount) {
        var bullet1 = new mBullet.Bullet(
          this.canvas,
          this.player1.x,
          this.player1.y - this.imgPlayer1.height / 2,
          0,
          -1,
          mBullet.BulletConsts.color1
        )
        this.bullets1.push(bullet1)
      }
      if (this.isShotting2 && this.bullets2.length < mBullet.BulletConsts.maxCount) {
        var bullet2 = new mBullet.Bullet(
          this.canvas,
          this.player2.x,
          this.player2.y + this.imgPlayer2.height / 2,
          0,
          1,
          mBullet.BulletConsts.color2
        )
        this.bullets2.push(bullet2)
      }
    },
    onBullets: function () {
      for (var i = this.bullets1.length - 1; i >= 0; i--) {
        if (this.bullets1[i].show === true) {
          this.bullets1[i].update()
          this.bullets1[i].draw()
        } else {
          this.bullets1.splice(i, 1)
        }
      }
      for (var j = this.bullets2.length - 1; j >= 0; j--) {
        if (this.bullets2[j].show === true) {
          this.bullets2[j].update()
          this.bullets2[j].draw()
        } else {
          this.bullets2.splice(j, 1)
        }
      }
    },
    loop: function () {
      this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight)
      this.player1.update()
      this.player2.update()
      this.player1.draw()
      this.player2.draw()
      this.onShot()
      this.onBullets()
      this.handlerId = requestAnimationFrame(this.loop)
    },
    checkCollision: function () {
      // TODO
    },
    changeState: function () {
      if (this.isPause) {
        this.resume()
      } else {
        this.pause()
      }
    },
    start: function () {
      this.isPause = true
    },
    pause: function () {
      cancelAnimationFrame(this.handlerId)
      this.isShotting1 = false
      this.isShotting2 = false
      this.player1.setUp(false)
      this.player1.setLeft(false)
      this.player1.setDown(false)
      this.player1.setRight(false)
      this.player2.setUp(false)
      this.player2.setLeft(false)
      this.player2.setDown(false)
      this.player2.setRight(false)
      this.isPause = true
    },
    resume: function () {
      this.isPause = false
      this.loop()
    }
  }
}
</script>

<style scoped>
#canvas_game {
  width: 100%;
  z-index: -1;
}
</style>
