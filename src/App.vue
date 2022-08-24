<template>
<Canvas ref="canva" @formas="formaRecebida"/>
<input v-model="deletaV" placeholder="codigo deleta"/>
<button @click="deleta">DELETA</button>
<input v-model="exportaV" placeholder="codigo exporta"/>
<button @click="exporta">EXPORTA</button>
<input v-model="destacaV" placeholder="codigo destaca"/>
<button @click="destaca">DESTACA</button>
<input v-model="desenhaV" placeholder="codigo desenha"/>
<button @click="desenha">DESENHA</button>

</template>

<script>
import Canvas from './components/Canvas.vue'

export default {
  name: 'App',
  components: {
    Canvas
  },
  data () {
    return{
      exportado:[],
    };
  },
  mounted(){
    this.$refs.canva.inicia("https://user-images.githubusercontent.com/168927/183423599-66d9504d-f6f0-45d9-b78b-e4c60eb9ee06.png",600,600)
  },
  methods: {
    deleta(){
      this.$refs.canva.deletaForma(this.deletaV)
    },
    exporta(){
      this.$refs.canva.exportaFormas(this.exportaV)
    },
    destaca(){
      this.$refs.canva.destacaForma(this.destacaV)
    },
    desenha(){
      this.$refs.canva.desenhaForma(this.desenhaV)
    },
    formaRecebida(value){
      this.exportado = value
      console.log("exportado",this.exportado)
    }
  }

}
</script>
