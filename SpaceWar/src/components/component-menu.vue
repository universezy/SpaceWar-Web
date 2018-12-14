<template>
  <div>
    <div id="div_menu">
      <img class="img_menu" id="img_new" src="../assets/retry.svg" title="New Game" />
      <img class="img_menu" id="img_home" src="../assets/home.svg" title="Home Page" @click="clickHome" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'component-menu',
  data () {
    return {
    }
  },
  methods: {
    clickHome: function () {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
#div_menu {
  width: auto;
  height: auto;
  display: block;
  position: absolute;
  top: 10px;
  right: 10px;
  align-items: center;
  z-index: 1;
}

.img_menu {
  display: inline-block;
  width: 50px;
  height: 50px;
  padding: 0;
  margin: 10px;
  -webkit-transition-duration: 0.5s;
  transition-duration: 0.5s;
  opacity: 0.8;
  cursor: pointer;
}

.img_menu:hover {
  opacity: 1;
}
</style>
