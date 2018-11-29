<template>
<div>
  <div class="div_main">
    <div class="div_button" id="button_challenge" @click="clickChallenge">
      <img class="img_button" src="../assets/challenge.svg" />
      <section>Challenge</section>
    </div>

    <div class="div_button" id="button_battle" @click="clickBattle">
      <img class="img_button" src="../assets/battle.svg" />
      <section>Battle</section>
    </div>

    <div class="div_button" id="button_about" @click="clickAbout">
      <img class="img_button" src="../assets/about.svg" />
      <section>About</section>
    </div>
  </div>
  <footer id="footer">
    <span class="span_footer">Powered by ZengYu - Copyright &copy;2018 All Rights Reserved</span>
  </footer>
  <Background></Background>
</div>
</template>

<script>
import Background from './Background.vue'
import About from './About.vue'

export default {
  name: 'Main',
  data () {
    return {
    }
  },
  components: {
    Background,
    About
  },
  onload () {
    var buttonChallenge = document.getElementById('button_challenge')
    var buttonBattle = document.getElementById('button_battle')
    var buttonAbout = document.getElementById('button_about')
    buttonChallenge.addEventListener('click', function (event) {
      this.$router.push('/Challenge')
    })

    buttonBattle.addEventListener('click', function (event) {
      this.$router.push('/Battle')
    })

    buttonAbout.addEventListener('click', function (event) {
      // TODO
    })
  }
}
</script>

<style scoped>
.div_main {
    width: auto;
    position: relative;
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
}

.div_button:hover {
    background-color: rgba(0, 0, 0, 0.5);
}

.img_button {
    width: 50px;
    height: 50px;
}

section {
    margin: 5px auto;
    align-items: center;
    font-size: 20px;
    font-family: sans-serif, Arial, Helvetica;
    word-wrap: break-word;
    -webkit-transition-duration: 0.5s;
    transition-duration: 0.5s;
}

#footer {
    height: 30px;
    width: 500px;
    display: block;
    position: absolute;
    bottom: 10px;
    left: 50%;
    margin-left: -250px;
    -webkit-transition-duration: 0.5s;
    transition-duration: 0.5s;
    color: rgba(255, 255, 255, 0.3);
}

.span_footer {
    text-align: center;
    font-size: 16px;
}

footer:hover {
    color: rgba(255, 255, 255, 0.8);
}
</style>
