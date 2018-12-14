<template>
  <div class="div_alert">
        <Card class="card_pause">
        <div>
            <img src="../assets/logo.png" class="img_icon">
            <h2>Pause</h2>
        </div>
    </Card>
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
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.card_pause{
  width: 240px;
  height: 120px;
  border-radius: 30px;
}

.img_icon{
  width: 50px;
  height: 50px;
}
</style>
