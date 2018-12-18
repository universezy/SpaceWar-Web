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
      imgNuclear: null,
      imgNuclearExplosion: null,
      imgLaser: null,
      imgShield: null,
      imgsEnemy: [],
      imgsBoss: [],
      imgsBlock: [],
      player: null,
      playerBullets: [],
      nuclears: [],
      enemies: [],
      blocks: [],
      bosses: [],
      maxCountEnemy: 10,
      maxCountBoss: 2,
      countEnemy: 7,
      countBoss: 5,
      countBlock: 6,
      isShotting: false,
      handlerIdLoop: 0,
      timeoutIdLaser: 0,
      timeoutIdNuclear: 0,
      timeoutIdShield: 0,
      timeoutIdStop: 0,
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
      cancelAnimationFrame(this.handlerIdLoop)
      this.alertPause = true
      this.gameState = mGame.GameState.PAUSE
    },
    onStop: function () {
      this.isShotting = false
      this.player.resetStates()
      this.timeoutIdStop = setTimeout(() => {
        cancelAnimationFrame(this.handlerIdLoop)
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

      /** Player Src */
      this.player = this.createPlayer()
      this.hp = this.player.hp

      /** Enemy List */
      for (var l = 0; l < this.maxCountEnemy; l++) {
        var enemy = this.cerateRandomEnemy()
        this.enemies.push(enemy)
      }
      setInterval(() => {
        if (this.enemies.length < this.maxCountEnemy) {
          var enemy = this.cerateRandomEnemy()
          this.enemies.push(enemy)
        }
      }, 2 * 1000)

      /** Boss List */
      setInterval(() => {
        if (this.bosses.length < this.maxCountBoss) {
          var boss = this.cerateRandomBoss()
          this.bosses.push(boss)
        }
      }, 20 * 1000)

      /** Block List */
      setInterval(() => {
        var block = this.cerateRandomBlock()
        this.blocks.push(block)
      }, 8 * 1000)
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
      this.loopPlayerAttack()
      this.loopOthersSrc()
      this.loopOthersAttack()
      this.handlerIdLoop = requestAnimationFrame(this.loop)
    },
    loopPlayerSrc: function () {
      this.player.updateCoord()
      this.player.draw()
      if (this.hp > 0 && this.isShotting && !this.player.laser && this.playerBullets.length < mBullet.BulletConsts.MAX_COUNT) {
        var bullet = this.createPlayerBullet()
        this.playerBullets.push(bullet)
      }
    },
    loopPlayerAttack: function () {
      /** Bullet */
      for (let i = this.playerBullets.length - 1; i >= 0; i--) {
        if (this.playerBullets[i].show) {
          this.playerBullets[i].update()
          this.playerBullets[i].draw()
          let collision = false
          /** Enemy */
          for (let k = this.enemies.length - 1; k >= 0; k--) {
            if (this.checkCollision(this.enemies[k], this.playerBullets[i])) {
              this.playerBullets[i].show = false
              this.enemies[k].updateHp(0 - this.playerBullets[i].attack)
              collision = true
              break
            }
          }
          /** Block */
          if (!collision) {
            for (let l = this.blocks.length - 1; l >= 0; l--) {
              if (this.checkCollision(this.blocks[l], this.playerBullets[i])) {
                this.playerBullets[i].show = false
                this.blocks[l].updateHp(0 - this.playerBullets[i].attack)
                collision = true
                break
              }
            }
          } else {
            continue
          }
          /** Boss */
          if (!collision) {
            for (let m = this.bosses.length - 1; m >= 0; m--) {
              if (this.checkCollision(this.bosses[m], this.playerBullets[i])) {
                this.playerBullets[i].show = false
                this.bosses[m].updateHp(0 - this.playerBullets[i].attack)
                break
              }
            }
          }
        } else {
          this.playerBullets.splice(i, 1)
        }
      }
      /** Laser */
      if (this.player.laser) {
        /** Enemy */
        for (let r = this.enemies.length - 1; r >= 0; r--) {
          if (this.checkLaserAttack(this.enemies[r])) {
            this.enemies[r].updateHp(0 - this.player.attackLaser)
          }
        }
        /** Block */
        for (let s = this.blocks.length - 1; s >= 0; s--) {
          if (this.checkLaserAttack(this.blocks[s])) {
            this.blocks[s].updateHp(0 - this.player.attackLaser)
          }
        }
        /** Boss */
        for (let t = this.bosses.length - 1; t >= 0; t--) {
          if (this.checkLaserAttack(this.bosses[t])) {
            this.bosses[t].updateHp(0 - this.player.attackLaser)
          }
        }
      }
    },
    loopOthersSrc: function () {
      for (let i = this.enemies.length - 1; i >= 0; i--) {
        if (this.enemies[i].show) {
          this.enemies[i].updateCoord()
          this.enemies[i].draw()
          // TODO shot
        } else {
          this.enemies.splice(i, 1)
        }
      }
      for (let j = this.blocks.length - 1; j >= 0; j--) {
        if (this.blocks[j].show) {
          this.blocks[j].updateCoord()
          this.blocks[j].draw()
        } else {
          this.blocks.splice(j, 1)
        }
      }
      for (let k = this.bosses.length - 1; k >= 0; k--) {
        if (this.bosses[k].show) {
          this.bosses[k].updateCoord()
          this.bosses[k].draw()
          // TODO shot
        } else {
          this.bosses.splice(k, 1)
        }
      }
    },
    loopOthersAttack: function () {
      // TODO
      /** Nuclear */
      for (let j = this.nuclears.length - 1; j >= 0; j--) {
        if (this.nuclears[j].show) {
          this.nuclears[j].updateCoord()
          this.nuclears[j].draw()
          if (!this.nuclears[j].alive) {
            /** Enemy */
            for (let o = this.enemies.length - 1; o >= 0; o--) {
              if (this.checkCollision(this.enemies[o], this.nuclears[j])) {
                this.enemies[o].updateHp(0 - this.nuclears[j].attack)
              }
            }
            /** Block */
            for (let p = this.blocks.length - 1; p >= 0; p--) {
              if (this.checkCollision(this.blocks[p], this.nuclears[j])) {
                this.blocks[p].updateHp(0 - this.nuclears[j].attack)
              }
            }
            /** Boss */
            for (let q = this.bosses.length - 1; q >= 0; q--) {
              if (this.checkCollision(this.bosses[q], this.nuclears[j])) {
                this.bosses[q].updateHp(0 - this.nuclears[j].attack)
              }
            }
            /** Player */
            if (this.checkCollision(this.player, this.nuclears[j])) {
              this.player.updateHp(0 - this.nuclears[j].attack)
            }
          }
        } else {
          this.nuclears.splice(j, 1)
        }
      }
    },
    onLaser: function () {
      if (this.laser === 100) {
        this.laser = 0
        this.player.onLaser()
        this.timeoutIdLaser = setInterval(() => {
          this.laser += 2
          if (this.laser >= 100) {
            this.laser = 100
            clearInterval(this.timeoutIdLaser)
          }
        }, 1000)
      }
    },
    onNuclear: function () {
      if (this.nuclears.length > 0) {
        for (var i = 0; i < this.nuclears.length; i++) {
          if (this.nuclears[i].alive) {
            this.nuclears[i].detonate()
            return
          }
        }
      }
      if (this.nuclear === 100) {
        this.nuclear = 0
        var nuclear = this.createNuclear()
        this.nuclears.push(nuclear)
        this.timeoutIdNuclear = setInterval(() => {
          this.nuclear += 2
          if (this.nuclear >= 100) {
            this.nuclear = 100
            clearInterval(this.timeoutIdNuclear)
          }
        }, 1000)
      }
    },
    onShield: function () {
      if (this.shield === 100) {
        this.shield = 0
        this.player.onShield()
        this.timeoutIdShield = setInterval(() => {
          this.shield += 2
          if (this.shield >= 100) {
            this.shield = 100
            clearInterval(this.timeoutIdShield)
          }
        }, 1000)
      }
    },
    checkCollision: function (target, bullet) {
      let distance = (target.getImg().height + bullet.size) / 2
      let deltaX = target.x - bullet.x
      let deltaY = target.y - bullet.y
      if (Math.pow(deltaX, 2) + Math.pow(deltaY, 2) > Math.pow(distance, 2)) {
        return false
      } else {
        return true
      }
    },
    checkLaserAttack: function (target) {
      let targetXLeft = target.x - target.getImg().width / 2
      let targetXRight = target.x + target.getImg().width / 2
      let targetYTop = target.y - target.getImg().height / 2
      let laserXLeft = this.player.x - this.player.laserWidth / 2
      let laserXRight = this.player.x + this.player.laserWidth / 2
      let laserYBottom = this.player.y - this.imgPlayer.height / 2 - this.imgLaser.height
      if (targetYTop < laserYBottom && targetXLeft < laserXRight && targetXRight > laserXLeft) {
        console.log('check = true')
        return true
      } else {
        console.log('check = false')
        return false
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
      cancelAnimationFrame(this.handlerIdLoop)
      clearTimeout(this.timeoutIdStop)
      this.player.resetCoord()
      this.player.resetSource()
      this.hp = this.player.hp
      this.playerBullets = []
      // TODO
    },
    reload: function () {
      this.$router.push('/solo')
      // this.reset()
      // this.onPrepare()
      // this.onStart()
    },
    createPlayer: function () {
      var player = new mPlayer.Player(
        this.canvas,
        this.screenWidth / 2,
        this.screenHeight - this.imgPlayer.height / 2,
        this.imgPlayer,
        this.imgExplosion,
        this.imgLaser,
        this.imgShield
      )
      return player
    },
    createPlayerBullet: function () {
      var bullet = new mBullet.Bullet(
        this.canvas,
        this.player.x,
        this.player.y - this.player.getImg().height / 2,
        0,
        -1,
        mBullet.BulletConsts.COLOR1
      )
      return bullet
    },
    createEnemyBullet: function (enemy) {
      var bullet = new mBullet.Bullet(
        this.canvas,
        this.enemy.x,
        this.enemy.y + this.enemy.getImg().height / 2,
        0,
        1,
        mBullet.BulletConsts.COLOR2
      )
      return bullet
    },
    cerateRandomEnemy: function () {
      let randomX = this.screenWidth * Math.random()
      let randomY = 100 * Math.random() - 200
      let randomDx = Math.sin(2 * Math.PI * Math.random()) / 5 + 1
      let randomDy = Math.cos(2 * Math.PI * Math.random()) / 5 + 0.3
      let randomNum = Math.floor(this.countEnemy * Math.random())
      var enemy = new mEnemy.Enemy(
        this.canvas,
        randomX,
        randomY,
        randomDx,
        randomDy,
        this.imgsEnemy[randomNum],
        this.imgExplosion
      )
      return enemy
    },
    cerateRandomBoss: function () {
      let randomX = this.screenWidth * Math.random()
      let randomY = 100 * Math.random() - 200
      let randomDx = Math.sin(2 * Math.PI * Math.random()) / 5 + 0.5
      let randomDy = Math.cos(2 * Math.PI * Math.random()) / 5 + 0.3
      let randomNum = Math.floor(this.countBoss * Math.random())
      var boss = new mBoss.Boss(
        this.canvas,
        randomX,
        randomY,
        randomDx,
        randomDy,
        this.imgsBoss[randomNum],
        this.imgExplosion
      )
      return boss
    },
    cerateRandomBlock: function () {
      let randomX = this.screenWidth * Math.random()
      let randomY = 20 * Math.random() - 100
      let randomNum = Math.floor(this.countBlock * Math.random())
      var block = new mBlock.Block(
        this.canvas,
        randomX,
        randomY,
        0,
        1,
        this.imgsBlock[randomNum],
        this.imgExplosion
      )
      return block
    },
    createNuclear: function () {
      var nuclear = new mNuclear.Nuclear(
        this.canvas,
        this.player.x,
        this.player.y,
        0,
        -1,
        this.imgNuclear,
        this.imgNuclearExplosion
      )
      return nuclear
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
