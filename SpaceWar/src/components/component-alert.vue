<template>
  <div>
    <div class="div_alert">PAUSE</div>
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
.div_alert {
  width: auto;
  height: auto;
  padding: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  align-items: center;
  font-family: sans-serif, Arial, Helvetica;
  font-size: 40px;
  color: #f78504;
  background: #ffffff;
  border-radius: 15px;
  z-index: 9999;
}
</style>
