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
  name: 'component-alert',
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
  position: fixed;
  top: 40%;
  align-items: center;
  z-index: 9999;
}

#div_alert_container {
  width: 500px;
  display: block;
  padding: 10px;
  margin: auto;
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
</style>
