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
    <comMenu></comMenu>
    <comAlert v-show="alertPause"></comAlert>
    <Modal :closable="false" :mask-closable="false" v-model="modalHelp">
      <h1 slot="header" class="h1_modal">Help</h1>
      <div>
        <p class="p_modal">1. Attack each other.</p>
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
        <p class="p_modal">Player {{playerWin}} wins !</p>
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
  name: 'battle',
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
      gameState: -1,
      alertPause: false,
      modalHelp: false,
      modalResult: false,
      playerWin: -1,
      colController: [
        {
          title: 'Operation',
          key: 'operation'
        },
        {
          title: 'Player1',
          key: 'player1'
        },
        {
          title: 'Player2',
          key: 'player2'
        }
      ],
      dataController: [
        {
          operation: 'Move up',
          player1: 'W',
          player2: 'Up'
        },
        {
          operation: 'Move down',
          player1: 'S',
          player2: 'Down'
        },
        {
          operation: 'Move left',
          player1: 'A',
          player2: 'Left'
        },
        {
          operation: 'Move right',
          player1: 'D',
          player2: 'Right'
        },
        {
          operation: 'Shot',
          player1: 'F',
          player2: 'L'
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
      this.isShotting1 = false
      this.isShotting2 = false
      this.player1.resetStates()
      this.player2.resetStates()
      cancelAnimationFrame(this.handlerId)
      this.alertPause = true
      this.gameState = mGame.GameState.PAUSE
    },
    onStop: function () {
      this.isShotting1 = false
      this.isShotting2 = false
      this.player1.resetStates()
      this.player2.resetStates()
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
    loop: function () {
      if (this.gameState !== mGame.GameState.RUN) return
      this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight)
      this.player1.updateCoord()
      this.player2.updateCoord()
      this.player1.draw()
      this.player2.draw()
      this.onShot()
      this.onBullets()
      this.handlerId = requestAnimationFrame(this.loop)
    },
    onShot: function () {
      if (this.hp1 > 0 && this.isShotting1 && this.bullets1.length < mBullet.BulletConsts.MAX_COUNT) {
        var bullet1 = new mBullet.Bullet(
          this.canvas,
          this.player1.x,
          this.player1.y - this.player1.getImg().height / 2,
          0,
          -1,
          mBullet.BulletConsts.COLOR1
        )
        this.bullets1.push(bullet1)
      }
      if (this.hp2 > 0 && this.isShotting2 && this.bullets2.length < mBullet.BulletConsts.MAX_COUNT) {
        var bullet2 = new mBullet.Bullet(
          this.canvas,
          this.player2.x,
          this.player2.y + this.player2.getImg().height / 2,
          0,
          1,
          mBullet.BulletConsts.COLOR2
        )
        this.bullets2.push(bullet2)
      }
    },
    onBullets: function () {
      for (var i = this.bullets1.length - 1; i >= 0; i--) {
        if (this.bullets1[i].show === true) {
          this.bullets1[i].update()
          this.bullets1[i].draw()
          if (this.checkCollision(this.player2, this.bullets1[i])) {
            this.bullets1[i].show = false
            this.hp2 = this.updateHp(this.player2, 0 - this.bullets1[i].attack, 1)
          }
        } else {
          this.bullets1.splice(i, 1)
        }
      }
      for (var j = this.bullets2.length - 1; j >= 0; j--) {
        if (this.bullets2[j].show === true) {
          this.bullets2[j].update()
          this.bullets2[j].draw()
          if (this.checkCollision(this.player1, this.bullets2[j])) {
            this.bullets2[j].show = false
            this.hp1 = this.updateHp(this.player1, 0 - this.bullets2[j].attack, 2)
          }
        } else {
          this.bullets2.splice(j, 1)
        }
      }
    },
    checkCollision: function (player, bullet) {
      let distance = (player.getImg().width + mBullet.BulletConsts.SIZE) / 2
      let deltaX = player.x - bullet.x
      let deltaY = player.y - bullet.y
      if (Math.pow(deltaX, 2) + Math.pow(deltaY, 2) > Math.pow(distance, 2)) {
        return false
      } else {
        return true
      }
    },
    updateHp: function (player, hp, winner) {
      if (!player.alive) return
      player.updateHp(hp)
      if (!player.alive) {
        this.playerWin = winner
        this.onStop()
      }
      return player.hp
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
      this.player1.resetCoord()
      this.player2.resetCoord()
      this.player1.resetSource()
      this.player2.resetSource()
      this.hp1 = this.player1.hp
      this.hp2 = this.player2.hp
      this.bullets1 = []
      this.bullets2 = []
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
</style>
