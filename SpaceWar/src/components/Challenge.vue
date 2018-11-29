<template>
<div>
  <div class="div_menu">
    <div class="div_item">
      <img class="img_item" src="../assets/level.svg" />
      <span class="span_item" id="span_level">LEVEL</span>
    </div>

    <div class="div_item">
      <img class="img_item" src="../assets/hp.svg" />
      <span class="span_item" id="span_hp">HP</span>
    </div>

    <div class="div_item">
      <img class="img_item" src="../assets/score.svg" />
      <span class="span_item" id="span_score">SCORE</span>
    </div>
  </div>
  <canvas id="canvas_game">
    <img class="img_plane" id="img_player" src="../assets/player.svg" />
  </canvas>
  <Background></Background>
</div>
</template>

<script>
import Background from './Background.vue'

export default {
  name: 'Challenge',
  create () {
    var spanLevel = document.getElementById('span_level')
    var spanHp = document.getElementById('span_hp')
    var spanScore = document.getElementById('span_score')
    var imgPlayer = document.getElementById('img_player')
  },
  data () {
    return {
    }
  },
  components: {
    Background
  }
}
</script>

<style scoped>
#div_menu {
    width: auto;
    margin: 0;
    position: absolute;
    top: 5px;
    left: 15px;
    display: none;
}

.div_item {
    width: 120px;
    margin: 10px auto;
    padding: 5px 10px;
    height: auto;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    background-color: rgba(196, 196, 196, 0.8);
    border-radius: 10px;
    border: solid #1E90FF 1px;
}

.img_item {
    width: 25px;
    height: 25px;
}

.span_item {
    margin: 5px auto;
    align-items: center;
    font-size: 18px;
    font-family: sans-serif, Arial, Helvetica;
}

#span_level {
    color: #008000;
}

#span_hp {
    color: #FF0000;
}

#span_score {
    color: #FFFF00;
}

</style>
