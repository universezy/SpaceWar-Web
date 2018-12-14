<template>
  <div>
    <canvas id="canvas_game">
      <img class="img_plane" id="img_player1" src="../assets/player.svg" />
      <img class="img_plane" id="img_player2" src="../assets/player2.png" />
      <img class="img_plane" id="img_explose" src="../assets/explose.svg" />
    </canvas>
    <div class="div_progress">
      <Progress class="progress_hp" :percent="hp2" :stroke-width="10" />
      <Progress class="progress_hp" :percent="hp1" :stroke-width="10" />
    </div>
    <comAlert v-show="showAlert"></comAlert>
    <comMenu></comMenu>
    <Modal :closable="false" :mask-closable="false" v-model="modalStop">
      <h1 slot="header" class="h1_modal_stop">Game Over</h1>
      <div>
        <p class="p_modal_stop">Player {{playerWin}} wins !</p>
        <p class="p_modal_stop">Do you want to start a new game?</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" @click="onClickStopModal(false)">No</Button>
        <Button type="success" size="large" @click="onClickStopModal(true)">Yes</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import comMenu from './component-menu.vue'
import comAlert from './component-alert.vue'
import mPlayer from '../res/Player'
import mBullet from '../res/Bullet'

export default {
  name: 'battle',
  components: {
    comMenu,
    comAlert
  },
  data () {
    return {
      imgSize: 50,
      canvas: null,
      ctx: null,
      screenWidth: 0,
      screenHeight: 0,
      hp1: 0,
      hp2: 0,
      imgPlayer1: null,
      imgPlayer2: null,
      imgExplose: null,
      player1: null,
      player2: null,
      bullets1: [],
      bullets2: [],
      isShotting1: false,
      isShotting2: false,
      handlerId: 0,
      timeoutId: 0,
      isPause: true,
      isEnd: false,
      showAlert: false,
      modalStop: false,
      playerWin: 'null'
    }
  },
  mounted () {
    this.prepare()
  },
  methods: {
    prepare: function () {
      this.prepareEnv()
      this.prepareSrc()
      this.showRule()
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
      this.imgExplose = document.getElementById('img_explose')
      this.player1 = new mPlayer.Player(
        this.canvas,
        this.screenWidth / 2,
        this.screenHeight - this.imgPlayer1.height / 2,
        this.imgPlayer1,
        this.imgExplose
      )
      this.player2 = new mPlayer.Player(
        this.canvas,
        this.screenWidth / 2,
        this.imgPlayer2.height / 2,
        this.imgPlayer2,
        this.imgExplose
      )
      this.hp1 = this.player1.hp
      this.hp2 = this.player2.hp
    },
    updateHp1: function (hp) {
      if (this.hp1 !== 0) {
        this.hp1 += hp
        if (this.hp1 <= 0) {
          this.hp1 = 0
          this.player1.alive = false
          this.playerWin = '2'
          this.stop()
        } else if (this.hp1 > 100) {
          this.hp1 = 100
        }
      }
    },
    updateHp2: function (hp) {
      if (this.hp2 !== 0) {
        this.hp2 += hp
        if (this.hp2 <= 0) {
          this.hp2 = 0
          this.player2.alive = false
          this.playerWin = '1'
          this.stop()
        } else if (this.hp2 > 100) {
          this.hp2 = 100
        }
      }
    },
    attachListener: function () {
      document.getElementById('img_new').onclick = this.reset
      if (typeof window.addEventListener !== 'undefined') {
        window.addEventListener('keydown', this.onKeydown)
        window.addEventListener('keyup', this.onKeyup)
      } else {
        alert('The version of your browser is too low.')
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
          case 76:// l
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
        case 76:// l
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
      if (this.hp1 > 0 && this.isShotting1 && this.bullets1.length < mBullet.BulletConsts.maxCount) {
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
      if (this.hp2 > 0 && this.isShotting2 && this.bullets2.length < mBullet.BulletConsts.maxCount) {
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
          if (this.checkCollision(this.bullets1[i].x, this.bullets1[i].y, this.player2.x, this.player2.y)) {
            this.bullets1[i].show = false
            this.updateHp2(0 - this.bullets1[i].attack)
          }
        } else {
          this.bullets1.splice(i, 1)
        }
      }
      for (var j = this.bullets2.length - 1; j >= 0; j--) {
        if (this.bullets2[j].show === true) {
          this.bullets2[j].update()
          this.bullets2[j].draw()
          if (this.checkCollision(this.bullets2[j].x, this.bullets2[j].y, this.player1.x, this.player1.y)) {
            this.bullets2[j].show = false
            this.updateHp1(0 - this.bullets2[j].attack)
          }
        } else {
          this.bullets2.splice(j, 1)
        }
      }
    },
    loop: function () {
      if (this.isPause) return
      this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight)
      this.player1.update()
      this.player2.update()
      this.player1.draw()
      this.player2.draw()
      this.onShot()
      this.onBullets()
      this.checkCollision()
      this.handlerId = requestAnimationFrame(this.loop)
    },
    checkCollision: function (x1, y1, x2, y2) {
      let distance = (this.imgSize + mBullet.BulletConsts.size) / 2
      let deltaX = x1 - x2
      let deltaY = y1 - y2
      if (Math.pow(deltaX, 2) + Math.pow(deltaY, 2) > Math.pow(distance, 2)) {
        return false
      } else {
        return true
      }
    },
    changeState: function () {
      if (this.isEnd) return
      if (this.isPause) {
        this.resume()
      } else {
        this.pause()
      }
    },
    start: function () {
      this.attachListener()
      this.changeState()
    },
    pause: function () {
      this.showAlert = true
      cancelAnimationFrame(this.handlerId)
      this.isShotting1 = false
      this.isShotting2 = false
      this.player1.resetStates()
      this.player2.resetStates()
      this.isPause = true
    },
    resume: function () {
      this.showAlert = false
      this.isPause = false
      this.loop()
    },
    stop: function () {
      this.isEnd = true
      this.isShotting1 = false
      this.isShotting2 = false
      this.player1.resetStates()
      this.player2.resetStates()
      this.timeoutId = setTimeout(() => {
        this.isPause = true
        cancelAnimationFrame(this.handlerId)
        this.modalStop = true
      }, 2000)
    },
    reset: function () {
      clearTimeout(this.timeoutId)
      this.hp1 = this.player1.hp
      this.hp2 = this.player2.hp
      this.player1.resetCoord()
      this.player2.resetCoord()
      this.player1.resetSource()
      this.player2.resetSource()
      this.bullets1 = []
      this.bullets2 = []
    },
    showRule: function () {
      let title = 'Rule'
      let content = '<p>1. Attack each other.</p><p>2. The game ends when the player\'s HP return to 0.</p><p>3. Press ESC to pause or continue game.</p>'
      let _this = this
      this.$Modal.info({
        title: title,
        content: content,
        okText: 'OK',
        onOk: () => {
          _this.start()
        }
      })
    },
    onClickStopModal: function (choose) {
      this.modalStop = false
      if (choose) {
        this.reset()
      }
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

.div_progress {
  width: auto;
  height: auto;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(0, -50%);
}

.progress_hp {
  width: 200px;
  margin: 5px 0;
  display: block;
  font-size: 16px;
  color: #ff0000;
  opacity: 0.8;
}

.h1_modal_stop{
  color:#2d8cf0;
  text-align:center;
  font-size: 30px;
}

.p_modal_stop{
  margin: 10px;
  font-size: 20px;
  text-align: center;
}
</style>
