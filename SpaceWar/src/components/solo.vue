<template>
  <div>
    <canvas id="canvas_game">
      <img class="img_plane" id="img_player" src="../assets/player.svg" />
      <img class="img_plane" id="img_explose" src="../assets/explose.svg" />
    </canvas>
    <!-- <div id="div_infos">
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
    </div> -->
    <comMenu></comMenu>
    <comAlert v-show="alertPause"></comAlert>
    <Modal :closable="false" :mask-closable="false" v-model="modalHelp">
      <h1 slot="header" class="h1_modal">Help</h1>
      <div>
        <p class="p_modal">1. Destroy enemies to win score.</p>
        <p class="p_modal">2. The game ends when any player's HP return to 0.</p>
        <p class="p_modal">3. Press ESC to pause or continue game.</p>
        <Table border :columns="colController" :data="dataController"></Table>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="onStart">OK</Button>
      </div>
    </Modal>
    <Modal :closable="false" :mask-closable="false" v-model="modalResult">
      <h1 slot="header" class="h1_modal">Game Over</h1>
      <div>
        <p class="p_modal">You got {{score}} score.</p>
        <p class="p_modal">Do you want to start a new game?</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" @click="onResult(false)">No</Button>
        <Button type="success" size="large" @click="onResult(true)">Yes</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import comMenu from './component-menu.vue'
import comAlert from './component-alert.vue'
import mPlayer from '../res/Player'
import mBullet from '../res/Bullet'
import mGame from '../res/Game'

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
      hp: 0,
      score: 0,
      imgPlayer: null,
      imgExplose: null,
      player: null,
      playerBullets: [],
      isShotting: false,
      isLaser: false,
      isNuclear: false,
      isShield: false,
      handlerId: 0,
      timeoutId: 0,
      gameState: -1,
      alertPause: false,
      modalHelp: false,
      modalResult: false,
      colController: [
        {
          title: 'Direction',
          key: 'direction'
        },
        {
          title: 'Key',
          key: 'keyDir'
        },
        {
          title: 'Skill',
          key: 'skill'
        },
        {
          title: 'Key',
          key: 'keySkill'
        }
      ],
      dataController: [
        {
          direction: 'Move up',
          keyDir: 'W',
          skill: 'Shot',
          keySkill: 'J'
        },
        {
          direction: 'Move down',
          keyDir: 'S',
          skill: 'Laser',
          keySkill: 'K'
        },
        {
          direction: 'Move left',
          keyDir: 'A',
          skill: 'Nuclear',
          keySkill: 'L'
        },
        {
          direction: 'Move right',
          keyDir: 'D',
          skill: 'Shield',
          keySkill: 'I'
        }
      ]
    }
  },
  mounted () {
    this.onPrepare()
  },
  methods: {
    /** Lifecycle */
    onPrepare: function () {
      this.prepareEnv()
      this.prepareSrc()
      this.attachListener()
      if (this.gameState === -1) {
        this.modalHelp = true
      }
      this.gameState = mGame.GameState.PREPARE
    },
    onStart: function () {
      this.modalHelp = false
      if (this.gameState === mGame.GameState.PREPARE) {
        this.gameState = mGame.GameState.START
        this.onResume()
      }
    },
    onResume: function () {
      this.alertPause = false
      this.gameState = mGame.GameState.RUN
      this.loop()
    },
    onPause: function () {
      this.isShotting = false
      this.player.resetStates()
      cancelAnimationFrame(this.handlerId)
      this.alertPause = true
      this.gameState = mGame.GameState.PAUSE
    },
    onStop: function () {
      this.isShotting = false
      this.player.resetStates()
      this.timeoutId = setTimeout(() => {
        cancelAnimationFrame(this.handlerId)
        this.gameState = mGame.GameState.STOP
        this.modalResult = true
      }, 2000)
    },
    /** Custom */
    prepareEnv: function () {
      this.canvas = document.getElementById('canvas_game')
      this.ctx = this.canvas.getContext('2d')
      this.screenWidth = this.canvas.width = window.innerWidth
      this.screenHeight = this.canvas.height = window.innerHeight
    },
    prepareSrc: function () {
      this.imgPlayer = document.getElementById('img_player')
      this.imgExplose = document.getElementById('img_explose')
      this.player = new mPlayer.Player(
        this.canvas,
        this.screenWidth / 2,
        this.screenHeight - this.imgPlayer.height / 2,
        this.imgPlayer,
        this.imgExplose
      )
      this.hp = this.player.hp
    },
    attachListener: function () {
      document.getElementById('button_help').onclick = this.onHelp
      document.getElementById('button_restart').onclick = this.restart
      if (typeof window.addEventListener !== 'undefined') {
        window.addEventListener('resize', this.reload)
        window.addEventListener('keydown', this.onKeydown)
        window.addEventListener('keyup', this.onKeyup)
      } else {
        alert('The version of your browser is too low.')
      }
    },
    onKeydown: function (e) {
      if (this.gameState !== mGame.GameState.RUN && this.gameState !== mGame.GameState.PAUSE) return
      // 兼容Firefox
      e = e || event
      let code = e.witch || e.keyCode
      switch (code) {
        case 27:// esc
          this.changeState()
          break
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
    },
    onKeyup: function (e) {
      // 兼容Firefox
      e = e || event
      let code = e.witch || e.keyCode
      switch (code) {
        case 74:// j
          this.isShotting = false
          break
        case 75:// k
          this.onLaser()
          break
        case 76:// l
          this.onNuclear()
          break
        case 73:// i
          this.onShield()
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
    loop: function () {
      if (this.gameState !== mGame.GameState.RUN) return
      this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight)
      this.loopPlayerSrc()
      this.loopEnemiesSrc()
      this.loopPlayerAttack()
      this.loopEnemiesAttack()
      this.handlerId = requestAnimationFrame(this.loop)
    },
    loopPlayerSrc: function () {
      this.player.updateCoord()
      this.player.draw()
      if (this.hp > 0 && this.isShotting && this.playerBullets.length < mBullet.BulletConsts.MAX_COUNT) {
        var bullet = new mBullet.Bullet(
          this.canvas,
          this.player.x,
          this.player.y - this.player.getImg().height / 2,
          0,
          -1,
          mBullet.BulletConsts.COLOR1
        )
        this.playerBullets.push(bullet)
      }
    },
    loopEnemiesSrc: function () {
      // TODO
    },
    loopPlayerAttack: function () {
      // TODO laser
      for (var i = this.playerBullets.length - 1; i >= 0; i--) {
        if (this.playerBullets[i].show === true) {
          this.playerBullets[i].update()
          this.playerBullets[i].draw()
          // TODO checkCollision
        } else {
          this.playerBullets.splice(i, 1)
        }
      }
      // TODO nuclear
      // TODO shield
    },
    loopEnemiesAttack: function () {
      // TODO
    },
    onLaser: function () {
      // TODO
    },
    onNuclear: function () {
      // TODO
    },
    onShield: function () {
      // TODO
    },
    checkCollision: function (plane, bullet) {
      let distance = (plane.getImg().width + mBullet.BulletConsts.SIZE) / 2
      let deltaX = plane.x - bullet.x
      let deltaY = plane.y - bullet.y
      if (Math.pow(deltaX, 2) + Math.pow(deltaY, 2) > Math.pow(distance, 2)) {
        return false
      } else {
        return true
      }
    },
    updateHp: function (hp) {
      if (!this.player.alive) return
      this.player.updateHp(hp)
      if (!this.player.alive) this.onStop()
      return this.player.hp
    },
    changeState: function () {
      if (this.gameState === mGame.GameState.PAUSE) {
        this.onResume()
      } else if (this.gameState === mGame.GameState.RUN) {
        this.onPause()
      }
    },
    onHelp: function () {
      this.onPause()
      this.modalHelp = true
    },
    onResult: function (result) {
      this.modalResult = false
      if (result) {
        this.restart()
      } else {
        this.onResume()
      }
    },
    restart: function () {
      this.reset()
      this.onResume()
    },
    reset: function () {
      this.gameState = mGame.GameState.STOP
      cancelAnimationFrame(this.handlerId)
      clearTimeout(this.timeoutId)
      this.player.resetCoord()
      this.player.resetSource()
      this.hp = this.player.hp
      this.playerBullets = []
      // TODO
    },
    reload: function () {
      this.reset()
      this.onPrepare()
      this.onStart()
    }
  }
}
</script>

<style scoped>
#canvas_game {
  width: 100%;
  z-index: -1;
}

.h1_modal {
  color: #2db7f5;
  text-align: center;
  font-size: 30px;
}

.p_modal {
  margin: 8px;
  font-size: 18px;
  color: #515a6e;
}
/*
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
*/
</style>
