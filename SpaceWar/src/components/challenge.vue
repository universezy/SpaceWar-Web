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
  <alertCom v-show="isPause"></alertCom>
  <menuCom></menuCom>
  <backgroundCom></backgroundCom>
</div>
</template>

<script>
import menuCom from './component-menu.vue'
import alertCom from './component-alert.vue'
import backgroundCom from './component-background.vue'
import mPlayer from '../res/Player'
import mBullet from '../res/Bullet'

export default {
  name: 'challenge',
  components: {
    menuCom,
    alertCom,
    backgroundCom
  },
  data () {
    return {
      level: 0,
      hp: 0,
      score: 0,
      canvas: null,
      ctx: null,
      screenWidth: 0,
      screenHeight: 0,
      imgPlayer: null,
      player: null,
      playerBullets: [],
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
        this.screenWidth / 2 - this.imgPlayer.width / 2,
        this.screenHeight - this.imgPlayer.height,
        this.imgPlayer
      )
    },
    attachListener: function () {
      if (typeof window.addEventListener !== 'undefined') {
        window.addEventListener('keydown', this.callbackPlayer)
        window.addEventListener('keydown', this.callbackControl)
        window.addEventListener('keydown', this.callbackGame)
      } else {
        alert('The version of your browser is too low.')
      }
    },
    callbackPlayer: function (e) {
      // 兼容Firefox
      e = e || event
      switch (e.witch || e.keyCode) {
        case 87:// w
          this.player.move(0, -1)
          break
        case 65:// a
          this.player.move(-1, 0)
          break
        case 83:// s
          this.player.move(0, 1)
          break
        case 68:// d
          this.player.move(1, 0)
          break
        default:
          break
      }
    },
    callbackControl: function (e) {
      e = e || event
      switch (e.witch || e.keyCode) {
        case 74:// j
          this.playerShot()
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
    playerShot: function () {
      if (this.playerBullets.length < mBullet.BulletConsts.maxCount) {
        var bullet = new mBullet.Bullet(
          this.canvas,
          this.player.x + this.imgPlayer.width / 2,
          this.player.y,
          mBullet.BulletConsts.color1,
          this.imgPlayer
        )
        this.playerBullets.push(bullet)
      }
    },
    checkCollision: function () {
      // TODO
    },
    loop: function () {
      this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight)
      this.player.draw()
      for (var i = this.playerBullets.length - 1; i >= 0; i--) {
        if (this.playerBullets[i].show === true) {
          this.playerBullets[i].draw()
          this.playerBullets[i].move(0, -1)
        } else {
          this.playerBullets.splice(i, 1)
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
