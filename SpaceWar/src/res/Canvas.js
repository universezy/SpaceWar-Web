function Canvas () {
  this.canvas = document.querySelector('canvas')
  this.ctx = this.canvas.getContext('2d')
  this.screenWidth = this.canvas.width = window.innerWidth
  this.screenHeight = this.canvas.height = window.innerHeight
}

export default {
  Canvas
}
