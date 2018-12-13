<template>
  <div>
    <canvas id="canvas_game">
      <img class="img_plane" id="img_player" src="../assets/player.svg" />
    </canvas>
    <div id="div_infos">
      <div class="div_info">
        <img class="img_info" src="../assets/level.svg" />
        <span class="span_info" id="span_level">{{ level }}</span>
      </div>

      <div class="div_info">
        <img class="img_info" src="../assets/hp.svg" />
        <span class="span_info" id="span_hp">{{ hp }}</span>
      </div>

      <div class="div_info">
        <img class="img_info" src="../assets/score.svg" />
        <span class="span_info" id="span_score">{{ score }}</span>
      </div>
    </div>
    <comAlert v-show="isPause"></comAlert>
    <comMenu></comMenu>
  </div>
</template>

<script>
import comMenu from './component-menu.vue'
import comAlert from './component-alert.vue'
import mPlayer from '../res/Player'
import mBullet from '../res/Bullet'

export default {
  name: 'solo',
  components: {
    comMenu,
    comAlert
  },
  data () {
    return {
      canvas: null,
      ctx: null,
      screenWidth: 0,
      screenHeight: 0,
      level: 0,
      hp: 0,
      score: 0,
      imgPlayer: null,
      player: null,
      playerBullets: [],
      isShotting: false,
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
      this.imgPlayer = document.getElementById('img_player')
      this.player = new mPlayer.Player(
        this.canvas,
        this.screenWidth / 2,
        this.screenHeight - this.imgPlayer.height / 2,
        this.imgPlayer
      )
      this.hp = this.player.hp
    },
    setLevel: function (level) {
      this.level = level
    },
    updateHp: function (hp) {
      this.hp += hp
      if (this.hp < 0) {
        this.hp = 0
      }
    },
    updateScore: function (score) {
      this.score += score
    },
    attachListener: function () {
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
          case 74:// j
            this.isShotting = true
            break
          case 87:// w
            this.player.setUp(true)
            break
          case 65:// a
            this.player.setLeft(true)
            break
          case 83:// s
            this.player.setDown(true)
            break
          case 68:// d
            this.player.setRight(true)
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
        case 74:// j
          this.isShotting = false
          break
        case 87:// w
          this.player.setUp(false)
          break
        case 65:// a
          this.player.setLeft(false)
          break
        case 83:// s
          this.player.setDown(false)
          break
        case 68:// d
          this.player.setRight(false)
          break
        default:
          break
      }
    },
    onPlayerShot: function () {
      if (this.isShotting && this.playerBullets.length < mBullet.BulletConsts.maxCount) {
        var bullet = new mBullet.Bullet(
          this.canvas,
          this.player.x,
          this.player.y - this.imgPlayer.height / 2,
          0,
          -1,
          mBullet.BulletConsts.color1
        )
        this.playerBullets.push(bullet)
      }
    },
    onPlayerBullets: function () {
      for (var i = this.playerBullets.length - 1; i >= 0; i--) {
        if (this.playerBullets[i].show === true) {
          this.playerBullets[i].update()
          this.playerBullets[i].draw()
        } else {
          this.playerBullets.splice(i, 1)
        }
      }
    },
    loop: function () {
      this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight)
      this.player.update()
      this.player.draw()
      this.onPlayerShot()
      this.onPlayerBullets()
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
      this.isShotting = false
      this.player.resetStates()
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

#div_infos {
  display: block;
  position: fixed;
  top: 10px;
  left: 10px;
  align-items: center;
  z-index: 9998;
}

.div_info {
  margin: 10px auto;
  padding: 3px 6px;
  width: 100px;
  height: auto;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  background-color: rgba(196, 196, 196, 0.3);
  border-radius: 10px;
  border: solid rgb(29, 138, 248) 2px;
}

.img_info {
  width: 25px;
  height: 25px;
}

.span_info {
  margin: 5px auto;
  align-items: center;
  font-size: 18px;
  font-family: sans-serif, Arial, Helvetica;
  cursor: default;
}

#span_level {
  color: #00ff00;
}

#span_hp {
  color: #FF0000;
}

#span_score {
  color: #FFFF00;
}
</style>
