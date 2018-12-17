<template>
  <div>
    <canvas id="canvas_game">
      <!--Player-->
      <img class="img_src" id="img_player" src="../assets/player.svg" />
      <img class="img_src" id="img_explosion" src="../assets/explosion.svg" />
      <img class="img_src" id="img_laser" src="../assets/laser.svg" />
      <img class="img_src" id="img_shield" src="../assets/shield.svg" />
      <img class="img_src" id="img_nuclear" src="../assets/nuclear.svg" />

      <!--Enemy Normal-->
      <img class="img_src" id="img_enemy0" src="../assets/enemy0.svg" />
      <img class="img_src" id="img_enemy1" src="../assets/enemy1.svg" />
      <img class="img_src" id="img_enemy2" src="../assets/enemy2.svg" />
      <img class="img_src" id="img_enemy3" src="../assets/enemy3.svg" />
      <img class="img_src" id="img_enemy4" src="../assets/enemy4.svg" />
      <img class="img_src" id="img_enemy5" src="../assets/enemy5.svg" />
      <img class="img_src" id="img_enemy6" src="../assets/enemy6.svg" />

      <!--Enemy Boss-->
      <img class="img_src" id="img_boss0" src="../assets/boss0.svg" />
      <img class="img_src" id="img_boss1" src="../assets/boss1.svg" />
      <img class="img_src" id="img_boss2" src="../assets/boss2.svg" />
      <img class="img_src" id="img_boss3" src="../assets/boss3.svg" />
      <img class="img_src" id="img_boss4" src="../assets/boss4.svg" />

      <!--Block-->
      <img class="img_src" id="img_block0" src="../assets/block0.svg" />
      <img class="img_src" id="img_block1" src="../assets/block1.svg" />
      <img class="img_src" id="img_block2" src="../assets/block2.svg" />
      <img class="img_src" id="img_block3" src="../assets/block3.svg" />
      <img class="img_src" id="img_block4" src="../assets/block4.svg" />
      <img class="img_src" id="img_block5" src="../assets/block5.svg" />

    </canvas>

    <div class="div_info">
      <Card class="card_info">
        <Row class="row_score">
          <Icon type="md-trophy" size="25"></Icon><span class="span_score">{{score}}</span>
        </Row>
        <Divider />
        <Row class="row_hp">
          <Icon type="md-heart" size="25"></Icon>
          <Progress class="progress_info" :percent="hp" :stroke-width="10" />
        </Row>
        <Divider />
        <Row class="row_laser">
          <Icon type="md-flash" size="25"></Icon>
          <Progress class="progress_info" :percent="laser" :stroke-width="10" />
        </Row>
        <Row class="row_nuclear">
          <Icon type="ios-nuclear" size="25"></Icon>
          <Progress class="progress_info" :percent="nuclear" :stroke-width="10" />
        </Row>
        <Row class="row_shield">
          <Icon type="md-radio-button-off" size="25"></Icon>
          <Progress class="progress_info" :percent="shield" :stroke-width="10" />
        </Row>
      </Card>
    </div>

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
      score: 0,
      hp: 100,
      laser: 100,
      nuclear: 100,
      shield: 100,
      imgPlayer: null,
      imgExplosion: null,
      player: null,
      playerBullets: [],
      enemies: [],
      bosses: [],
      blocks: [],
      countEnemy: 7,
      countBoss: 5,
      countBlock: 6,
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
      /** Player */
      this.imgPlayer = document.getElementById('img_player')
      this.imgExplosion = document.getElementById('img_explosion')
      this.imgLaser = document.getElementById('img_laser')
      this.imgNuclear = document.getElementById('img_nuclear')
      this.imgShield = document.getElementById('img_shield')
      this.player = new mPlayer.Player(
        this.canvas,
        this.screenWidth / 2,
        this.screenHeight - this.imgPlayer.height / 2,
        this.imgPlayer,
        this.imgExplosion,
        this.imgLaser,
        this.imgShield
      )
      this.hp = this.player.hp

      /** Enemy Normal */
      for (var i = 0; i < this.countEnemy; i ++) {
        var imgEnemy = document.getElementById('img_enemy' + i)
        // TODO
        var enemy
        this.enemies.push(enemy)
      }

      /** Enemy Boss */
      for (var j = 0; j < this.countBoss; j ++) {
        var imgBoss = document.getElementById('img_boss' + j)
        // TODO
        var boss
        this.bosses.push(boss)
      }

      /** Block */
      for (var k = 0; k < this.countBlock; k ++) {
        var imgBlock = document.getElementById('img_block' + k)
        // TODO
        var block
        this.blocks.push(block)
      }
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

.div_info {
  width: auto;
  height: auto;
  position: absolute;
  left: 15px;
  top: 15px;
  text-align: left;
  z-index: 1;
}

.card_info {
  background: rgba(0, 0, 0, 0);
}

.row_score {
  color: gold;
}

.row_hp {
  color: red;
}

.row_laser {
  color: yellow;
}

.row_nuclear {
  color: darkorange;
}

.row_shield {
  color: lightskyblue;
}

.span_score {
  margin-left: 10px;
  font-size: 16px;
}

.progress_info {
  width: 150px;
  margin-left: 5px;
  margin-right: -20px;
  font-size: 16px;
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
