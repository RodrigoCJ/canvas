<template>
  <div>
    <div class="flex justify-center align-middle mb-5" v-if="habilitaZoom==true">
      <div class="text-right text-sm">
        <button
          @click="zoomOut"
          class="
            p-4
            bg-transparent
            border-2 border-green-500
            text-green-500 text-lg
            rounded-full
            hover:bg-green-500 hover:text-gray-100
          "
        >
          <span class="flex justify-center align-middle">
            <ZoomInIcon class="w-6 h-6" />
          </span>
        </button>
      </div>
      <div class="text-right text-sm">
        <button
          @click="zoomRedefinir"
          v-if="escala > 1.0"
          class="
            p-4
            mx-4
            bg-transparent
            border-2 border-green-500
            text-green-500 text-lg
            rounded-lg
            hover:bg-green-500 hover:text-gray-100
            focus:border-4 focus:border-green-300
          "
        >
          <span class="flex px-2 justify-center align-middle">
           reset
          </span>
        </button>
      </div>
      <div class="text-right text-sm" v-if="escala > 1.0">
        <button
          @click="zoomIn"
          class="
            p-4
            bg-transparent
            border-2 border-green-500
            text-green-500 text-lg
            rounded-full
            hover:bg-green-500 hover:text-gray-100
          "
        >
          <span class="flex justify-center align-middle">
            <ZoomOutIcon class="w-6 h-6" />
          </span>
        </button>
      </div>
    </div>

    <!-- canvas -->
    <div id="baseDiv" class="baseDiv" style="overflow: none; width: 600px; height: 600px">
      <div
        id="principal"
        style="position: relative; display: inline-block; transform-origin: 0% 0%"
      >
        <img id="img" :src="dados.urlImage" style="grid-column: 1; grid-row: 1" alt="" />
        <canvas id="myCanvasTemp" style="position: absolute; top: 0; left: 0" />
        <canvas
          id="myCanvas"
          style="position: absolute; top: 0; left: 0"
          @mousedown="mouseClick($event)"
          @mousemove="mouveMove($event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { CanvasDados,Config,Forma } from "../type/CanvasType";
import { ZoomInIcon, ZoomOutIcon } from "@heroicons/vue/solid";

const escala = ref(1.0)
const proporcaoZomm = ref(0.5)
const habilitaZoom = ref(true)
const dados: CanvasDados = reactive({urlImage:"",width:0,height:0,widthRes:0,heightRes:0})
const formas: Forma = reactive([])
const configuracao: Config = reactive({tipo:1,cor:"",grossura:3,corSombra:"",sombra:10,raioCirculo:5,alpha:0})
const canvas:any = ref()
const canvasTemp:any = ref()
const formaDesenha: Forma = reactive({tipo:0,cor:"",inicio:[],fim:[],referencia:0})


onMounted(() => {
  let c:any = document.getElementById("myCanvas");
  canvas.value = c.getContext("2d");
  let ct:any = document.getElementById("myCanvasTemp");
  canvasTemp.value = ct.getContext("2d");

})


//diminui o zoom do componente canvas
const zoomOut = () => {
    escala.value /= proporcaoZomm.value;
    atualizaEscala()
}

//diminui o zoom do componente canvas
const zoomIn = () => {
    escala.value *= proporcaoZomm.value;
    atualizaEscala()
}

//redefine o zoom do componente canvas
const zoomRedefinir = () => {
    escala.value = 1.0;
    atualizaEscala()
}

//atualiza a escala do form principal
const atualizaEscala = () => {
    let a = document.getElementById("principal");
    if(a){
        a.style["transform"] = `scale(` + escala.value + `)`;
    }
}

//desenha um linha no canvas, recebe como paramentro o componente canvas em qual a linha deve ser desenhada, um coordenada inicial [x,y], uma coordenada final [x,y] e a cor da linha
const linha = (forma: Forma, canva:any) => {
    var ctx = canva;
    ctx.beginPath();
    ctx.globalAlpha = configuracao.alpha;
    ctx.moveTo(forma.inicio[0], forma.inicio[1]);
    ctx.lineTo(forma.fim[0], forma.fim[1]);
    ctx.strokeStyle = forma.cor;
    ctx.lineWidth = configuracao.grossura;
    ctx.shadowColor = configuracao.corSombra;
    ctx.shadowBlur = configuracao.sombra;
    ctx.stroke();
    ctx.closePath();
}

//desenha um circulo no canvas, recebe como paramentro o componente canvas em qual o circulo deve ser desenhado, a coordenada [x,y], e a cor do circulo
const circulo = (forma: Forma, canva:any) => {
    var ctx = canva;
    ctx.beginPath();
    ctx.globalAlpha = configuracao.alpha;
    ctx.arc(forma.inicio[0], forma.inicio[1], configuracao.raioCirculo, 0, 2 * Math.PI);
    ctx.shadowColor = configuracao.corSombra;
    ctx.shadowBlur = configuracao.sombra;
    ctx.fillStyle = forma.cor;
    ctx.fill();
}

//desenha um quadrado(bbox) no canvas, recebe como paramentro o componente canvas em qual o boox deve ser desenhado, um coordenada inicial [x,y], uma coordenada final [x,y] e a cor do bbox
const quadrado = (forma: Forma, canva:any) => {
    var ctx = canva;
    ctx.beginPath();
    ctx.globalAlpha = configuracao.alpha;
    ctx.rect(forma.inicio[0], forma.inicio[1], forma.fim[0] - forma.inicio[0], forma.fim[1] - forma.inicio[1]);
    ctx.fillStyle = forma.cor;
    ctx.strokeStyle = forma.cor;
    ctx.shadowColor = configuracao.corSombra;
    ctx.shadowBlur = configuracao.sombra;
    ctx.lineWidth = configuracao.grossura;
    ctx.stroke();
    ctx.closePath();
}

const mouseClick = (ev: MouseEvent) => {
    console.log("mouse click ",ev)
    switch(configuracao.tipo){
      case 1:
      case 3:
        if (formaDesenha.tipo==0){
          formaDesenha.cor="";
          formaDesenha.inicio.push(ev.offsetX)
          formaDesenha.inicio.push(ev.offsetY)
          formaDesenha.tipo=configuracao.tipo
          formaDesenha.referencia=1
        }
        else{
          formaDesenha.fim.push(ev.offsetX)
          formaDesenha.fim.push(ev.offsetY)
        }
        console.log("forma desenha ",formaDesenha)
      break;
      case 2:
      break;
    }

}

const mouveMove = (ev: MouseEvent) => {
console.log("mouse move ",ev)
}

const desenhaTemp = () => {

}

const desenhaPerm = () => {

}

const configuraCanvas = () => {
  var myCanvas: any = document.getElementById("myCanvas")
  if(myCanvas){
    myCanvas.width = dados.widthRes
    myCanvas.height = dados.heightRes;
  }
  var myCanvasTemp: any = document.getElementById("myCanvasTemp")
  if(myCanvas){
    myCanvasTemp.width = dados.widthRes
    myCanvasTemp.height = dados.heightRes;
  }
  var img: any = document.getElementById("img")
  if(myCanvas){
    img.style.width = dados.widthRes + "px";
    img.style.height = dados.heightRes + "px";
  }  
  var principal: any = document.getElementById("principal")
  if(myCanvas){
    principal.style.width = dados.widthRes + "px";
    principal.style.height = dados.heightRes + "px";
  }
  var baseDiv: any = document.getElementById("baseDiv")
  if(myCanvas){
    baseDiv.style.width = dados.widthRes + "px";
    baseDiv.style.height = dados.heightRes + "px";
  }

}

const inicia = (url:string, width: number, height: number) => {
  dados.urlImage = url;
  var img = new Image();
  img.src = url;
  img.onload = () => {
  dados.width = img.width;
  dados.height = img.height;
  var ftConv = dados.width / dados.height

  if(dados.width>=dados.height){
    dados.widthRes=width;
    dados.heightRes = Math.round(height/ftConv)
  }
  else if(dados.height>dados.width){
    dados.heightRes=height;
    dados.widthRes = Math.round(width*ftConv)
  }

  configuraCanvas()
  }
}

    

</script>