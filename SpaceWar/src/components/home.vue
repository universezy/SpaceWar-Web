<template>
  <div>
    <div class="div_home">
      <div class="div_button" id="button_challenge">
        <img class="img_button" src="../assets/challenge.svg">
        <section class="sec_button">Challenge</section>
      </div>

      <div class="div_button" id="button_battle">
        <img class="img_button" src="../assets/battle.svg">
        <section class="sec_button">Battle</section>
      </div>

      <div class="div_button" id="button_about">
        <img class="img_button" src="../assets/about.svg">
        <section class="sec_button">About</section>
      </div>
    </div>
    <footer id="footer">
      <span class="span_footer">Powered by ZengYu - Copyright &copy;2018 All Rights Reserved</span>
    </footer>
    <aboutCom></aboutCom>
  </div>
</template>

<script>
import aboutCom from './component-about.vue'

export default {
  name: 'home',
  data () {
    return {}
  },
  components: {
    aboutCom
  },
  mounted () {
    this.attachListener()
  },
  methods: {
    attachListener: function () {
      var buttonChallenge = document.getElementById('button_challenge')
      var buttonBattle = document.getElementById('button_battle')
      var buttonAbout = document.getElementById('button_about')
      let _this = this
      buttonChallenge.addEventListener('click', function (event) {
        _this.$router.push('/challenge')
      })

      buttonBattle.addEventListener('click', function (event) {
        _this.$router.push('/battle')
      })

      buttonAbout.addEventListener('click', function (event) {
        // TODO
      })
    }
  }
}
</script>

<style scoped>
.div_home {
    width: 100%;
    display: block;
    position: fixed;
    top: 30%;
}

.div_button {
  margin: 20px auto;
  padding: 10px 20px;
  width: 200px;
  height: auto;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  color: white;
  background-color: rgba(196, 196, 196, 0.2);
  border-radius: 30px;
  -webkit-transition-duration: 0.5s;
  /* Safari */
  transition-duration: 0.5s;
  cursor: pointer;
}

.div_button:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.img_button {
  width: 50px;
  height: 50px;
}

.sec_button {
  margin: 5px auto;
  align-items: center;
  font-size: 24px;
  font-family: sans-serif, Arial, Helvetica;
  word-wrap: break-word;
  -webkit-transition-duration: 0.5s;
  transition-duration: 0.5s;
}

#footer {
  height: 30px;
  width: 100%;
  display: block;
  position: fixed;
  bottom: 10px;
  align-items: center;
  -webkit-transition-duration: 0.5s;
  transition-duration: 0.5s;
  color: rgba(255, 255, 255, 0.3);
}

footer:hover {
  color: rgba(255, 255, 255, 0.8);
}

.span_footer {
  text-align: center;
  font-size: 16px;
}
</style>
