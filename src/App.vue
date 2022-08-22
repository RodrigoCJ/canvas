<template>
<Canvas ref="canva"/>
</template>

<script>
import Canvas from './components/Canvas.vue'

export default {
  name: 'App',
  components: {
    Canvas
  },
  mounted(){
    this.$refs.canva.value.inicia("https://user-images.githubusercontent.com/168927/183423599-66d9504d-f6f0-45d9-b78b-e4c60eb9ee06.png",800,800)
  }

}
</script>

