<template>
  <div>
    <div class="flex justify-center align-middle mb-5" v-if="configuracao.habilitaZoom==true">
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
          @mousemove="desenhaTemp($event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Dados,Configuracao,Forma } from "../type/CanvasType";
import { ZoomInIcon, ZoomOutIcon } from "@heroicons/vue/solid";

const escala = ref(1.0) 
const proporcaoZomm = ref(0.5)
const dados: Dados = reactive({urlImage:"",width:0,height:0,widthRes:0,heightRes:0,ftConv:0})
const formas = ref<Forma[]>([]) 
const configuracao: Configuracao = reactive({tipo:"linha",cor:"#0000FF",grossura:3,corSombra:"",sombra:10,raioCirculo:5,alpha:1,habilitaConf:true,habilitaZoom: true})
let canvas: CanvasRenderingContext2D
let canvasTemp:CanvasRenderingContext2D
const formaDesenha = ref<Forma>() 

//pega as refencias dos canvas, e registra o listener do teclado
onMounted(() => {
  let c:any = document.getElementById("myCanvas");
  canvas = c.getContext("2d");
  let ct:any = document.getElementById("myCanvasTemp");
  canvasTemp = ct.getContext("2d");
  document.addEventListener("keyup", tecladoEvent);
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
const linha = (forma: Forma, canva:CanvasRenderingContext2D) => {
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
const circulo = (forma: Forma, canva:CanvasRenderingContext2D) => {
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
const quadrado = (forma: Forma, canva:CanvasRenderingContext2D) => {
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

//trata o evento do clic do mouse, o que vai ser desenhado na tela
const mouseClick = (ev: MouseEvent) => {
    switch(configuracao.tipo){
      case "linha":
      case "quadrado":
        let pontos: number[] =[ev.offsetX,ev.offsetY]
        if(formaDesenha.value == undefined || formaDesenha.value.fim == undefined){
          const formaN = {
            cor: configuracao.cor,
            referencia:1,     //TODO: mecher
            tipo: configuracao.tipo,
            inicio:pontos
          } as Forma
          formaDesenha.value = formaN
        }
        else{
          formaDesenha.value.fim=pontos
          formas.value.push(formaDesenha.value)
          if (continuaDesen()){
            const formaN = {
            cor: configuracao.cor,
            referencia:1,     //TODO: mecher
            tipo: configuracao.tipo,
            inicio:formaDesenha.value.fim
          } as Forma
          formaDesenha.value = formaN
          }else{
            formaDesenha.value = undefined
          }
          clearCanvas(canvasTemp)
          desenhaPerm()
        }
      break; 
    }

}

//desenha no canvas temporario, o preview da forma, evento onMove do mouse
const desenhaTemp = (ev: MouseEvent) => {
  if(formaDesenha.value != undefined){
    let pontos: number[] =[ev.offsetX,ev.offsetY]
    switch (formaDesenha.value.tipo){
      case "linha":
        clearCanvas(canvasTemp)
        circulo(formaDesenha.value,canvasTemp)
        formaDesenha.value.fim = pontos
        linha(formaDesenha.value,canvasTemp)
      break;
      case "quadrado":
        clearCanvas(canvasTemp)
        formaDesenha.value.fim = pontos
        quadrado(formaDesenha.value,canvasTemp)
      break;
  }
  }
}

//desenha no canvas permanente a lista de formas
const desenhaPerm = () => {
  for(let value of formas.value){
    switch(value.tipo){
      case "linha":
        circulo(value,canvas)
        linha(value,canvas)
      break;
      case "quadrado":
        quadrado(value,canvas)
      break;
    }
  }

}

const configura = () => {
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

//configura o canvas, ajustando a imagem, e calculando o tamanho do componente, e definindo o tamanho da imagem e do componente de acordo com o parametro, mantendo a proporcao
const inicia = (url:string, width: number, height: number) => {
  dados.urlImage = url;
  var img = new Image();
  img.src = url;
  img.onload = () => {
  dados.width = img.width;
  dados.height = img.height;
  dados.ftConv= dados.width / dados.height

  if(dados.width>=dados.height){
    dados.widthRes=width;
    dados.heightRes = Math.round(height/dados.ftConv)
  }
  else if(dados.height>dados.width){
    dados.heightRes=height;
    dados.widthRes = Math.round(width*dados.ftConv)
  }

  configura()
  }
}

//limpa os dados do canvas
const clearCanvas = (cv: any) => {
  cv.clearRect(0, 0, dados.widthRes, dados.heightRes);
}

//verifica se deve continuar o desenho atual, caso quadrado -> nao, caso linha se o clic for no mesmo que o do ponto inicial -> nao, caso contrario -> sim
const continuaDesen = () => {
    switch(configuracao.tipo){
      case "linha":
        
        return true
      break;
      case "quadrado":
        return false
      break;
    }
}

//trata o evento on clic do teclado
const tecladoEvent = (event: any) => {
  //ctrl + z
  if (event.ctrlKey && event.key === "z") {
    console.log("ctrl + z")
    //TODO: tratar
  }
}

//importa formas do componente pai para o canvas
const importaFormas = () =>{
  //TODO: fazer a importacao de formas
}

//exporta as formas do canvas para o componente pai
const exportaFormas = () =>{
  //TODO: fazer a exportacao de formas
}

//apaga uma forma da lista de formas
const deletaForma = (referencia: number) => {
  //TODO: fazer a deleção de forma
}

const configuraCanvas = (confs: Configuracao) => {
  //TODO: receber as confs
}

defineExpose({
  inicia,
  importaFormas,
  exportaFormas,
  deletaForma,
  configuraCanvas
})

</script>