<template>
<div>
    <div id="div_menu">
        <img class="img_menu" id="img_home" src="../assets/menu.svg" title="Home Page" @click="clickHome"/>
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
  display: block;
  position: fixed;
  top: 10px;
  right: 10px;
  width: 50px;
  height: 50px;
  align-items: center;
  z-index: 9998;
}

.img_menu {
  display: block;
  width: 50px;
  height: 50px;
  padding: 0;
  margin: auto;
  -webkit-transition-duration: 0.5s;
  transition-duration: 0.5s;
  cursor: pointer;
}

#img_home {
  opacity: 0.2;
}

#img_home:hover {
  opacity: 1;
}
</style>
