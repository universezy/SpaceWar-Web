<template>
  <div>
    <canvas id="canvas_game">
      <!--Player-->
      <img class="img_src" id="img_player" src="../assets/player.svg" />
      <img class="img_src" id="img_explosion" src="../assets/explosion.svg" />
      <img class="img_src" id="img_laser" src="../assets/laser.svg" />
      <img class="img_src" id="img_shield" src="../assets/shield.svg" />
      <img class="img_src" id="img_nuclear" src="../assets/nuclear.svg" />
      <img class="img_src" id="img_nuclear_explosion" src="../assets/nuclear_explosion.svg" />

      <!--Enemy-->
      <img class="img_src" id="img_enemy0" src="../assets/enemy0.svg" />
      <img class="img_src" id="img_enemy1" src="../assets/enemy1.svg" />
      <img class="img_src" id="img_enemy2" src="../assets/enemy2.svg" />
      <img class="img_src" id="img_enemy3" src="../assets/enemy3.svg" />
      <img class="img_src" id="img_enemy4" src="../assets/enemy4.svg" />
      <img class="img_src" id="img_enemy5" src="../assets/enemy5.svg" />
      <img class="img_src" id="img_enemy6" src="../assets/enemy6.svg" />

      <!--Boss-->
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
          <Icon type="md-trophy" size="25"></Icon><span class="span_score">{{binderScore}}</span>
        </Row>
        <Divider />
        <Row class="row_hp">
          <Icon type="md-heart" size="25"></Icon>
          <Progress class="progress_info" :percent="binderHp" :stroke-width="10" />
        </Row>
        <Divider />
        <Row class="row_laser">
          <Icon type="md-flash" size="25"></Icon>
          <Progress class="progress_info" :percent="binderLaser" :stroke-width="10" />
        </Row>
        <Row class="row_nuclear">
          <Icon type="ios-nuclear" size="25"></Icon>
          <Progress class="progress_info" :percent="binderNuclear" :stroke-width="10" />
        </Row>
        <Row class="row_shield">
          <Icon type="md-radio-button-off" size="25"></Icon>
          <Progress class="progress_info" :percent="binderShield" :stroke-width="10" />
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
        <p class="p_modal">You got {{binderScore}} score.</p>
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
import mEnemy from '../res/Enemy'
import mBoss from '../res/Boss'
import mBlock from '../res/Block'
import mNuclear from '../res/Nuclear'
import mGame from '../res/Game'

export default {
  name: 'solo',
  components: {
    comMenu,
    comAlert
  },
  data () {
    return {
      /** Env */
      canvas: null,
      ctx: null,
      screenWidth: 0,
      screenHeight: 0,
      /** Binder */
      binderScore: 0,
      binderHp: 100,
      binderLaser: 100,
      binderNuclear: 100,
      binderShield: 100,
      /** Img */
      imgPlayer: null,
      imgExplosion: null,
      imgNuclear: null,
      imgNuclearExplosion: null,
      imgLaser: null,
      imgShield: null,
      imgsEnemy: [],
      imgsBoss: [],
      imgsBlock: [],
      /** Src */
      player: null,
      nuclear: null,
      enemies: [],
      blocks: [],
      bosses: [],
      playerBullets: [],
      enemyBullets: [],
      countEnemy: 7,
      countBoss: 5,
      countBlock: 6,
      maxCountEnemy: 10,
      maxCountBoss: 2,
      /** Flag */
      gameState: -1,
      isShotting: false,
      alertPause: false,
      modalHelp: false,
      modalResult: false,
      /** Handler */
      animationIdLoop: 0,
      timeoutIdEnemy: 0,
      timeoutIdBlock: 0,
      timeoutIdBoss: 0,
      timeoutIdLaser: 0,
      timeoutIdNuclear: 0,
      timeoutIdShield: 0,
      timeoutIdStop: 0,
      /** Table */
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
        },
        {
          title: 'Tips',
          key: 'tip'
        }
      ],
      dataController: [
        {
          direction: 'Move up',
          keyDir: 'W',
          skill: 'Shot',
          keySkill: 'J',
          tip: 'Count limited.'
        },
        {
          direction: 'Move down',
          keyDir: 'S',
          skill: 'Laser',
          keySkill: 'K',
          tip: 'Better attack.'
        },
        {
          direction: 'Move left',
          keyDir: 'A',
          skill: 'Nuclear',
          keySkill: 'L',
          tip: 'Most dangerous.'
        },
        {
          direction: 'Move right',
          keyDir: 'D',
          skill: 'Shield',
          keySkill: 'I',
          tip: 'Save life.'
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
      if (this.gameState === mGame.GameState.CREATE) {
        this.prepareEnv()
        this.prepareImg()
        this.prepareSrc()
        this.attachListener()
        this.modalHelp = true
      } else {
        this.prepareEnv()
        this.prepareSrc()
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
      this.startSrcTasks()
      this.loop()
    },
    onPause: function () {
      this.isShotting = false
      this.player.resetStates()
      this.clearSrcTasks()
      this.alertPause = true
      this.gameState = mGame.GameState.PAUSE
    },
    onStop: function () {
      this.isShotting = false
      this.player.resetStates()
      this.timeoutIdStop = setTimeout(() => {
        this.clearSrcTasks()
        this.clearGameTasks()
        this.gameState = mGame.GameState.STOP
        this.modalResult = true
      }, 2000)
    },
    /** Prepare */
    prepareEnv: function () {
      this.canvas = document.getElementById('canvas_game')
      this.ctx = this.canvas.getContext('2d')
      this.screenWidth = this.canvas.width = window.innerWidth
      this.screenHeight = this.canvas.height = window.innerHeight
    },
    prepareImg: function () {
      /** Player Img */
      this.imgPlayer = document.getElementById('img_player')
      this.imgExplosion = document.getElementById('img_explosion')
      this.imgNuclear = document.getElementById('img_nuclear')
      this.imgNuclearExplosion = document.getElementById('img_nuclear_explosion')
      this.imgLaser = document.getElementById('img_laser')
      this.imgShield = document.getElementById('img_shield')

      /** Enemy Img */
      for (var i = 0; i < this.countEnemy; i++) {
        var imgEnemy = document.getElementById('img_enemy' + i)
        this.imgsEnemy.push(imgEnemy)
      }

      /** Boss Img */
      for (var j = 0; j < this.countBoss; j++) {
        var imgBoss = document.getElementById('img_boss' + j)
        this.imgsBoss.push(imgBoss)
      }

      /** Block Img */
      for (var k = 0; k < this.countBlock; k++) {
        var imgBlock = document.getElementById('img_block' + k)
        this.imgsBlock.push(imgBlock)
      }
    },
    prepareSrc: function () {
      /** Player Src */
      this.player = this.createPlayer()
      this.binderHp = this.player.hp

      /** Enemy List */
      for (var l = 0; l < this.maxCountEnemy; l++) {
        var enemy = this.cerateRandomEnemy()
        this.enemies.push(enemy)
      }
    },
    attachListener: function () {
      document.getElementById('button_home').onclick = this.onHome
      document.getElementById('button_help').onclick = this.onHelp
      document.getElementById('button_restart').onclick = this.reload
      if (typeof window.addEventListener !== 'undefined') {
        window.addEventListener('resize', this.reload)
        window.addEventListener('keydown', this.onKeydown)
        window.addEventListener('keyup', this.onKeyup)
      } else {
        alert('The version of your browser is too low.')
      }
    },
    dettachListener: function () {
      document.getElementById('button_home').onclick = null
      document.getElementById('button_help').onclick = null
      document.getElementById('button_restart').onclick = null
      if (typeof window.addEventListener !== 'undefined') {
        window.removeEventListener('resize', this.reload)
        window.removeEventListener('keydown', this.onKeydown)
        window.removeEventListener('keyup', this.onKeyup)
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
    /** Resource Loader */
    createPlayer: function () {
      return new mPlayer.Player(
        this.canvas,
        this.screenWidth / 2,
        this.screenHeight - this.imgPlayer.height / 2,
        this.imgPlayer,
        this.imgExplosion,
        this.imgLaser,
        this.imgShield
      )
    },
    createPlayerBullet: function () {
      return new mBullet.Bullet(
        this.canvas,
        this.player.x,
        this.player.y - this.player.getImg().height / 2,
        0,
        -1,
        mBullet.BulletConsts.COLOR1
      )
    },
    createEnemyBullet: function (enemy) {
      return new mBullet.Bullet(
        this.canvas,
        enemy.x,
        enemy.y + enemy.getImg().height / 2,
        0,
        0.1,
        mBullet.BulletConsts.COLOR2
      )
    },
    cerateRandomEnemy: function () {
      let randomX = this.screenWidth * Math.random()
      let randomY = 200 * Math.random() - 500
      let randomDx = Math.sin(2 * Math.PI * Math.random()) / 5 + 0.5
      let randomDy = Math.cos(2 * Math.PI * Math.random()) / 5 + 0.25
      let randomNum = Math.floor(this.countEnemy * Math.random())
      return new mEnemy.Enemy(
        this.canvas,
        randomX,
        randomY,
        randomDx,
        randomDy,
        this.imgsEnemy[randomNum],
        this.imgExplosion
      )
    },
    cerateRandomBoss: function () {
      let randomX = this.screenWidth * Math.random()
      let randomY = 100 * Math.random() - 200
      let randomDx = Math.sin(2 * Math.PI * Math.random()) / 5 + 0.5
      let randomDy = Math.cos(2 * Math.PI * Math.random()) / 5 + 0.3
      let randomNum = Math.floor(this.countBoss * Math.random())
      return new mBoss.Boss(
        this.canvas,
        randomX,
        randomY,
        randomDx,
        randomDy,
        this.imgsBoss[randomNum],
        this.imgExplosion
      )
    },
    cerateRandomBlock: function () {
      let randomX = this.screenWidth * Math.random()
      let randomY = 20 * Math.random() - 100
      let randomNum = Math.floor(this.countBlock * Math.random())
      return new mBlock.Block(
        this.canvas,
        randomX,
        randomY,
        0,
        1,
        this.imgsBlock[randomNum],
        this.imgExplosion
      )
    },
    createNuclear: function () {
      return new mNuclear.Nuclear(
        this.canvas,
        this.player.x,
        this.player.y,
        -1,
        this.imgNuclear,
        this.imgNuclearExplosion
      )
    },
    /** Draw */
    loop: function () {
      if (this.gameState !== mGame.GameState.RUN) return
      this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight)
      this.loopPlayerSrc()
      this.loopOthersSrc()
      this.loopPlayerAttack()
      this.loopOthersAttack()
      this.animationIdLoop = requestAnimationFrame(this.loop)
    },
    loopPlayerSrc: function () {
      /** Nuclear */
      if (this.nuclear !== null) {
        if (this.nuclear.show) {
          this.nuclear.updateCoord()
          this.nuclear.draw()
        } else {
          this.nuclear.release()
          this.nuclear = null
        }
      }

      /** Player */
      if (this.player !== null) {
        this.player.updateCoord()
        this.player.draw()
      }
      if (this.binderHp > 0 &&
        this.isShotting &&
        !this.player.laser &&
        this.playerBullets.length < mBullet.BulletConsts.MAX_COUNT) {
        var bullet = this.createPlayerBullet()
        this.playerBullets.push(bullet)
      }
    },
    loopPlayerAttack: function () {
      /** Bullet */
      for (var i = this.playerBullets.length - 1; i >= 0; i--) {
        if (this.playerBullets[i].show) {
          this.playerBullets[i].updateCoord()
          this.playerBullets[i].draw()
          /** Enemy */
          for (var k = this.enemies.length - 1; k >= 0; k--) {
            if (this.checkCollision(this.enemies[k], this.playerBullets[i], mBullet.BulletConsts.SIZE)) {
              this.playerBullets[i].show = false
              if (this.enemies[k].updateHp(0 - mBullet.BulletConsts.ATTACK)) {
                this.binderScore += mEnemy.EnemyConsts.SCORE
              }
              break
            }
          }
          if (this.playerBullets[i].show) {
            /** Block */
            for (var l = this.blocks.length - 1; l >= 0; l--) {
              if (this.checkCollision(this.blocks[l], this.playerBullets[i], mBullet.BulletConsts.SIZE)) {
                this.playerBullets[i].show = false
                if (this.blocks[l].updateHp(0 - mBullet.BulletConsts.ATTACK)) {
                  this.binderScore += mBlock.BlockConsts.SCORE
                }
                break
              }
            }
            if (this.playerBullets[i].show) {
              /** Boss */
              for (var m = this.bosses.length - 1; m >= 0; m--) {
                if (this.checkCollision(this.bosses[m], this.playerBullets[i], mBullet.BulletConsts.SIZE)) {
                  this.playerBullets[i].show = false
                  if (this.bosses[m].updateHp(0 - mBullet.BulletConsts.ATTACK)) {
                    this.binderScore += mBoss.BossConsts.SCORE
                  }
                  break
                }
              }
            }
          }
        } else {
          this.playerBullets[i].release()
          this.playerBullets.splice(i, 1)
        }
      }

      /** Laser */
      if (this.player.laser) {
        /** Enemy */
        for (var r = this.enemies.length - 1; r >= 0; r--) {
          if (this.checkLaserAttack(this.enemies[r])) {
            if (this.enemies[r].updateHp(0 - mPlayer.PlayerConsts.ATTACK_LASER)) {
              this.binderScore += mEnemy.EnemyConsts.SCORE
            }
          }
        }
        /** Block */
        for (var s = this.blocks.length - 1; s >= 0; s--) {
          if (this.checkLaserAttack(this.blocks[s])) {
            if (this.blocks[s].updateHp(0 - mPlayer.PlayerConsts.ATTACK_LASER)) {
              this.binderScore += mBlock.BlockConsts.SCORE
            }
          }
        }
        /** Boss */
        for (var t = this.bosses.length - 1; t >= 0; t--) {
          if (this.checkLaserAttack(this.bosses[t])) {
            if (this.bosses[t].updateHp(0 - mPlayer.PlayerConsts.ATTACK_LASER)) {
              this.binderScore += mBoss.BossConsts.SCORE
            }
          }
        }
      }
    },
    loopOthersSrc: function () {
      /** Enemy */
      for (var i = this.enemies.length - 1; i >= 0; i--) {
        if (this.enemies[i].show) {
          this.enemies[i].updateCoord()
          this.enemies[i].draw()
          if (this.enemies[i].frequence === 0) {
            var enemyBullet = this.createEnemyBullet(this.enemies[i])
            this.enemyBullets.push(enemyBullet)
          }
        } else {
          this.enemies[i].release()
          this.enemies.splice(i, 1)
        }
      }

      /** Block */
      for (var j = this.blocks.length - 1; j >= 0; j--) {
        if (this.blocks[j].show) {
          this.blocks[j].updateCoord()
          this.blocks[j].draw()
        } else {
          this.blocks[j].release()
          this.blocks.splice(j, 1)
        }
      }

      /** Boss */
      for (var k = this.bosses.length - 1; k >= 0; k--) {
        if (this.bosses[k].show) {
          this.bosses[k].updateCoord()
          this.bosses[k].draw()
          if (this.bosses[k].frequence === 0) {
            var bossBullet = this.createEnemyBullet(this.bosses[k])
            this.enemyBullets.push(bossBullet)
          }
        } else {
          this.bosses[k].release()
          this.bosses.splice(k, 1)
        }
      }
    },
    loopOthersAttack: function () {
      /** Bullet */
      for (var i = this.enemyBullets.length - 1; i >= 0; i--) {
        if (this.enemyBullets[i].show) {
          this.enemyBullets[i].updateCoord()
          this.enemyBullets[i].draw()
          /** Player */
          if (this.player !== null && this.checkCollision(this.player, this.enemyBullets[i], mBullet.BulletConsts.SIZE)) {
            this.enemyBullets[i].show = false
            this.updateHp(0 - mBullet.BulletConsts.ATTACK)
          } else if (this.nuclear !== null && this.checkCollision(this.nuclear, this.enemyBullets[i], mBullet.BulletConsts.SIZE)) {
            /** Nuclear */
            if (this.nuclear !== null && this.checkCollision(this.nuclear, this.enemyBullets[i], mBullet.BulletConsts.SIZE)) {
              this.enemyBullets[i].show = false
              this.nuclear.updateHp(0 - mBullet.BulletConsts.ATTACK)
            }
          } else {
            /** Block */
            for (var l = this.blocks.length - 1; l >= 0; l--) {
              if (this.checkCollision(this.blocks[l], this.enemyBullets[i], mBullet.BulletConsts.SIZE)) {
                this.enemyBullets[i].show = false
                this.blocks[l].updateHp(0 - mBullet.BulletConsts.ATTACK)
                break
              }
            }
          }
        } else {
          this.enemyBullets[i].release()
          this.enemyBullets.splice(i, 1)
        }
      }

      /** Nuclear */
      if (this.nuclear !== null && this.nuclear.show && !this.nuclear.alive) {
        /** Enemy */
        for (var o = this.enemies.length - 1; o >= 0; o--) {
          if (this.checkCollision(this.enemies[o], this.nuclear, this.nuclear.size)) {
            this.enemies[o].updateHp(0 - mNuclear.NuclearConsts.ATTACK)
          }
        }
        /** Block */
        for (var p = this.blocks.length - 1; p >= 0; p--) {
          if (this.checkCollision(this.blocks[p], this.nuclear, this.nuclear.size)) {
            this.blocks[p].updateHp(0 - mNuclear.NuclearConsts.ATTACK)
          }
        }
        /** Boss */
        for (var q = this.bosses.length - 1; q >= 0; q--) {
          if (this.checkCollision(this.bosses[q], this.nuclear, this.nuclear.size)) {
            this.bosses[q].updateHp(0 - mNuclear.NuclearConsts.ATTACK)
          }
        }
        /** Player */
        if (this.player !== null && this.checkCollision(this.player, this.nuclear, this.nuclear.size)) {
          this.updateHp(0 - mNuclear.NuclearConsts.ATTACK)
        }
      }
    },
    /** Task Scheduler */
    startEnemyTask: function () {
      this.timeoutIdEnemy = setInterval(() => {
        if (this.enemies.length < this.maxCountEnemy) {
          var enemy = this.cerateRandomEnemy()
          this.enemies.push(enemy)
        }
      }, 2 * 1000)
    },
    startBlockTask: function () {
      this.timeoutIdBlock = setInterval(() => {
        var block = this.cerateRandomBlock()
        this.blocks.push(block)
      }, 8 * 1000)
    },
    startBossTask: function () {
      this.timeoutIdBoss = setInterval(() => {
        if (this.bosses.length < this.maxCountBoss) {
          var boss = this.cerateRandomBoss()
          this.bosses.push(boss)
        }
      }, 20 * 1000)
    },
    startLaserTask: function () {
      this.timeoutIdLaser = setInterval(() => {
        this.binderLaser += 2
        if (this.binderLaser >= 100) {
          this.binderLaser = 100
          clearInterval(this.timeoutIdLaser)
        }
      }, 1000)
    },
    startNuclearTask: function () {
      this.timeoutIdNuclear = setInterval(() => {
        this.binderNuclear += 2
        if (this.binderNuclear >= 100) {
          this.binderNuclear = 100
          clearInterval(this.timeoutIdNuclear)
        }
      }, 1000)
    },
    startShieldTask: function () {
      this.timeoutIdShield = setInterval(() => {
        this.binderShield += 2
        if (this.binderShield >= 100) {
          this.binderShield = 100
          clearInterval(this.timeoutIdShield)
        }
      }, 1000)
    },
    startSrcTasks: function () {
      this.startEnemyTask()
      this.startBlockTask()
      this.startBossTask()
      this.startLaserTask()
      this.startNuclearTask()
      this.startShieldTask()
    },
    clearSrcTasks: function () {
      clearInterval(this.timeoutIdEnemy)
      clearInterval(this.timeoutIdBlock)
      clearInterval(this.timeoutIdBoss)
      clearInterval(this.timeoutIdLaser)
      clearInterval(this.timeoutIdNuclear)
      clearInterval(this.timeoutIdShield)
    },
    clearGameTasks: function () {
      cancelAnimationFrame(this.animationIdLoop)
      clearInterval(this.timeoutIdStop)
    },
    /** Player Event */
    onLaser: function () {
      if (this.binderLaser === 100) {
        this.binderLaser = 0
        this.player.onLaser()
        this.startLaserTask()
      }
    },
    onNuclear: function () {
      if (this.nuclear !== null && this.nuclear.alive) {
        this.nuclear.detonate()
      } else if (this.binderNuclear === 100) {
        this.binderNuclear = 0
        this.nuclear = this.createNuclear()
        this.startNuclearTask()
      }
    },
    onShield: function () {
      if (this.binderShield === 100) {
        this.binderShield = 0
        this.player.onShield()
        this.startShieldTask()
      }
    },
    /** Game Helper */
    checkCollision: function (target, bullet, size) {
      let distance = (target.getImg().height + size) / 2
      let deltaX = target.x - bullet.x
      let deltaY = target.y - bullet.y
      return Math.pow(deltaX, 2) + Math.pow(deltaY, 2) <= Math.pow(distance, 2)
    },
    checkLaserAttack: function (target) {
      let targetXLeft = target.x - target.getImg().width / 2
      let targetXRight = target.x + target.getImg().width / 2
      let targetYTop = target.y - target.getImg().height / 2
      let targetYBottom = target.y + target.getImg().height / 2
      let laserXLeft = this.player.x - this.player.laserWidth / 2
      let laserXRight = this.player.x + this.player.laserWidth / 2
      let laserYBottom = this.player.y - this.imgPlayer.height / 2 - this.imgLaser.height
      return targetYBottom > 0 && targetYTop < laserYBottom && targetXLeft < laserXRight && targetXRight > laserXLeft
    },
    updateHp: function (hp) {
      if (!this.player.alive) return
      this.player.updateHp(hp)
      this.binderHp = this.player.hp
      if (!this.player.alive) this.onStop()
    },
    /** Game Event */
    changeState: function () {
      if (this.gameState === mGame.GameState.PAUSE) {
        this.onResume()
      } else if (this.gameState === mGame.GameState.RUN) {
        this.onPause()
      }
    },
    clear: function () {
      this.gameState = mGame.GameState.STOP
      /** Handler */
      this.clearGameTasks()
      this.clearSrcTasks()
      /** Flag */
      this.isShotting = false
      /** Src */
      if (this.player !== null) {
        this.player.release()
        this.player = null
      }
      if (this.nuclear !== null) {
        this.nuclear.release()
        this.nuclear = null
      }
      for (var i = 0; i < this.playerBullets.length; i++) {
        this.playerBullets[i].release()
      }
      this.playerBullets = []
      for (var j = 0; j < this.enemyBullets.length; j++) {
        this.enemyBullets[j].release()
      }
      this.enemyBullets = []
      for (var k = 0; k < this.enemies.length; k++) {
        this.enemies[k].release()
      }
      this.enemies = []
      for (var l = 0; l < this.blocks.length; l++) {
        this.blocks[l].release()
      }
      this.blocks = []
      for (var m = 0; m < this.bosses.length; m++) {
        this.bosses[m].release()
      }
      this.bosses = []
      /** Binder */
      this.binderScore = 0
      this.binderLaser = 100
      this.binderNuclear = 100
      this.binderShield = 100
      /** Env */
      this.canvas = null
      this.ctx = null
    },
    reload: function () {
      this.clear()
      this.onPrepare()
      this.onStart()
    },
    /** Menu */
    onHome: function () {
      this.dettachListener()
      this.clear()
      this.$router.push('/')
    },
    onHelp: function () {
      this.onPause()
      this.modalHelp = true
    },
    onResult: function (result) {
      this.modalResult = false
      if (result) {
        this.reload()
      } else {
        this.onResume()
      }
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
