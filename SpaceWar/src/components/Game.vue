<template>
  <div>
    <div id="div_alert">
      <div id="div_alert_container">
        <span class="span_alert">PAUSE</span>
        <span class="span_alert">Press ESC to resume</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Game',
  data () {
    return {
    }
  }
}
</script>

<style scoped>
#div_alert {
    width: 100%;
    display: block;
    position: absolute;
    top: 30%;
    align-items: center;
    z-index: 9999;
}

#div_alert_container {
    width: 500px;
    margin: 0 auto;
    padding: 50px 20px;
    position: relative;
    align-items: center;
    background: #ffffff;
    border-radius: 15px;
}

.span_alert {
    margin: 10px;
    display: block;
    font-family: sans-serif, Arial, Helvetica;
    font-size: 40px;
    color: #000;
}

#canvas_game {
    z-index: -1;
}
</style>
