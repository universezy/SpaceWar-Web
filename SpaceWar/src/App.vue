<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
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
    min-width: 600px;
    min-height: 800px;
    padding: 0;
    margin: 0;
}

body {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
}
</style>
