<template>
  <div id="app">
    <router-view/>
    <comBackground></comBackground>
  </div>
</template>

<script>
import comBackground from './components/component-background.vue'

export default {
  name: 'App',
  components: {
    comBackground
  },
  created () {
    document.body.parentNode.style.overflow = 'hidden'
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

html {
  height: 100%;
  min-width: 600px;
  min-height: 800px;
  padding: 0;
  margin: 0;
}

body {
  width: 100%;
  height: 100%;
  min-width: 600px;
  min-height: 800px;
  padding: 0;
  margin: 0;
  overflow: auto;
}
</style>
