<template>
  <div>
    <div id="baseDiv" class="baseDiv" style="overflow: auto; position: relative" >
      <div id="principal" style="position: relative; display: inline-block; transform-origin: 0% 0%">
        <img id="img" :src="dados.urlImage" style="grid-column: 1; grid-row: 1" alt="" />
        <canvas id="myCanvasTemp" style="position: absolute; top: 0; left: 0" />
        <canvas
          id="myCanvas"
          style="position: absolute; top: 0; left: 0"
          @mousedown="mouseClick($event)"
          @mousemove="desenhaTemp($event)"/>
      </div>

      <!-- incones de confs -->
        <div class="absolute bottom-0 right-0 grid grid-cols-1">
          <button class="w-6 bg-white rounded-full mb-2 mr-2 p-1" v-if="configuracao.habilitaZoom" @click="zoomIn()">
            <MinusIcon></MinusIcon>
          </button>
          <button class="w-6 bg-white rounded-full mb-2 mr-2 p-1" v-if="configuracao.habilitaZoom" @click="zoomOut()">
            <PlusIcon></PlusIcon>
          </button>
          <button class="w-6 bg-white rounded-full mb-2 mr-2 p-1" v-if="configuracao.habilitaConf" @click="showConf =! showConf">
            <CogIcon></CogIcon>
          </button>
        </div>

        <!-- exibe as configuracoes -->
        <div class="absolute bottom-2 right-10 bg-white p-5" v-if="showConf">
          <!-- grossura traco -->
          <label class="form-label">grossura</label>
          <input type="range" min="0" max="20" style="background-color: #4aa9b6" v-model="configuracao.grossura" class="
                form-range
                appearance-none
                w-full
                h-1
                p-0
                rounded-xl
                focus:outline-none focus:ring-0 focus:shadow-none
              " id="rangeCircleRadius" />
            <p>{{ configuracao.grossura }}</p>

          <!-- raio circulo -->
          <label class="form-label">raio circulo</label>
          <input type="range" in="3" max="20" style="background-color: #4aa9b6" v-model="configuracao.raioCirculo" class="
                form-range
                appearance-none
                w-full
                h-1
                p-0
                rounded-xl
                focus:outline-none focus:ring-0 focus:shadow-none
              " id="rangeCircleRadius" />
            <p>{{ configuracao.raioCirculo }}</p>

          <!-- sombra -->
          <label for="alphaCircleRadius" class="form-label">sombra</label>
          <input type="range" min="0" max="30" style="background-color: #4aa9b6" v-model="configuracao.sombra" class="
                form-range
                appearance-none
                w-full
                h-1
                p-0
                rounded-xl
                focus:outline-none focus:ring-0 focus:shadow-none
              " id="rangeCircleRadius" />
            <p>{{ configuracao.sombra }}</p>

          <!-- transparencia circulo -->
          <label for="alphaCircleRadius" class="form-label">transparencia circulo</label>
          <input type="range" min="0.05" step="0.01" max="1" style="background-color: #4aa9b6" v-model="configuracao.alphaCirculo" class="
                form-range
                appearance-none
                w-full
                h-1
                p-0
                rounded-xl
                focus:outline-none focus:ring-0 focus:shadow-none
              " id="rangeCircleRadius" />
            <p>{{ configuracao.alphaCirculo }}</p>  

          <!-- transparencia linha -->
          <label for="alphaCircleRadius" class="form-label">transparencia linha</label>
          <input type="range" min="0.05" step="0.01" max="1" style="background-color: #4aa9b6" v-model="configuracao.alphaLinha" class="
                form-range
                appearance-none
                w-full
                h-1
                p-0
                rounded-xl
                focus:outline-none focus:ring-0 focus:shadow-none
              " id="rangeCircleRadius" />
            <p>{{ configuracao.alphaLinha }}</p>                                 
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Dados,Configuracao,Forma,FormaDado } from "../type/CanvasType";
import { CogIcon,PlusIcon,MinusIcon } from "@heroicons/vue/solid";

const escala = ref(1.0) 
const proporcaoZomm = ref(0.5)
const showConf = ref(false)
const showZoom = ref(false)
let formaCont = 0
const dados: Dados = reactive({urlImage:"",width:0,height:0,widthRes:0,heightRes:0,ftConv:0})
const formas = ref<Forma[]>([]) 
const configuracao: Configuracao = reactive({tipo:"linha",cor:"#0000FF",grossura:3,corSombra:"",sombra:10,raioCirculo:5,alphaCirculo:1,alphaLinha:1,habilitaConf:true,habilitaZoom: true,exibeID:true})
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
    if (escala.value>1){
      escala.value *= proporcaoZomm.value;
    }
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

//escreve na coordenada inicial da forma, a referencia dela
const escreve = (forma: Forma,canva:CanvasRenderingContext2D) => {
  var ctx = canva;
  ctx.font = "15px Arial";
  ctx.fillText(""+forma.referencia, forma.inicio[0], forma.inicio[1]-5);
}

//trata o evento do clic do mouse, o que vai ser desenhado na tela
const mouseClick = (ev: MouseEvent) => {
    switch(configuracao.tipo){
      case "linha":
      case "quadrado":
        let pontos: number[] =[ev.offsetX,ev.offsetY]
        if(formaDesenha.value == undefined || formaDesenha.value.fim == []){
          const formaN = {
            cor: configuracao.cor,
            referencia: formaCont,
            tipo: configuracao.tipo,
            fim: [],
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
            referencia: formaCont,
            tipo: configuracao.tipo,
            inicio:formaDesenha.value.fim,
            fim: [],
          } as Forma
          formaDesenha.value = formaN
          }else{
            formaDesenha.value = undefined
            exportaFormas(formaCont-1)
          }
          clearCanvas(canvasTemp)
          desenhaPerm(formas.value)
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
const desenhaPerm = (frm: Forma[]) => {
  clearCanvas(canvas)
  var oldForm = -1
  for(let value of frm){
    switch(value.tipo){
      case "linha":
        circulo(value,canvas)
        linha(value,canvas)
        if(configuracao.exibeID && oldForm != value.referencia){
          oldForm = value.referencia
          escreve(value,canvas)
        }
      break;
      case "quadrado":
        quadrado(value,canvas)
        if(configuracao.exibeID && oldForm != value.referencia){
          oldForm = value.referencia  
          escreve(value,canvas)
        } 
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

//limpa os dados do canvasformas.value
const clearCanvas = (cv: any) => {
  cv.clearRect(0, 0, dados.widthRes, dados.heightRes);
}

//verifica se deve continuar o desenho atual, caso quadrado -> nao, caso linha se o clic for no mesmo que o do ponto inicial -> nao, caso contrario -> sim
const continuaDesen = () => {
    switch(configuracao.tipo){
      case "linha":
        let formaTot: Forma[] = formas.value.filter(e => e.referencia == formaCont)
        if (
            formaDesenha.value != null &&
            formaDesenha.value.fim[0] >= formaTot[0].inicio[0] - configuracao.raioCirculo &&
            formaDesenha.value.fim[0] <= formaTot[0].inicio[0] + configuracao.raioCirculo &&
            formaDesenha.value.fim[1] >= formaTot[0].inicio[1] - configuracao.raioCirculo &&
            formaDesenha.value.fim[1] <= formaTot[0].inicio[1] + configuracao.raioCirculo
          ) {
            formaCont++ 
            return false
          } else {
            return true
          }
      break;
      case "quadrado":
        formaCont++
        return false
      break;
    }
}

//trata o evento on clic do teclado
const tecladoEvent = (event: any) => {
  //ctrl + z
    //TODO: tratar
  if (event.ctrlKey && event.key === "z") {
    if (formas.value[formas.value.length-1].referencia==formaCont){
      var temp = formas.value.pop()
      temp.fim = [] 
      formaDesenha.value = temp
      desenhaPerm(formas.value)
    }
  }
}

//importa formas do componente pai para o canvas
const importaFormas = (form: FormaDado[]) =>{
  //TODO: fazer a importacao de formas, e converter os pontos
  formas.value.concat(dadoToForma(form))
}

//exporta as formas do canvas para o componente pai
const exportaFormas = (refer?: number) =>{
  //TODO: reconverter os pontos
  if(refer){
    let formaTot: Forma[] = formas.value.filter(e => e.referencia == refer)
    emit("formas",formaToDado(formaTot))
  }
  else{
    emit("formas",formaToDado(formas.value))
  }
}

//apaga uma forma da lista de formas
const deletaForma = (refer: number) => {
  var i = -1
  while ((i = formas.value.map(e => e.referencia).indexOf(parseInt(refer))) != -1){
    formas.value.splice(i,1)
  }
  desenhaPerm(formas.value)
}

//recebe as confs e aplica
const configuraCanvas = (confs: Configuracao) => {
  configuracao.tipo = confs.tipo
  configuracao.cor = confs.cor
  configuracao.grossura = confs.grossura
  configuracao.corSombra = confs.corSombra
  configuracao.sombra = confs.sombra
  configuracao.raioCirculo = confs.raioCirculo
  configuracao.alpha = confs.alpha
  configuracao.habilitaZoom = confs.habilitaZoom
  configuracao.habilitaConf = confs.habilitaConf
  configuracao.exibeID = confs.exibeID
}

//desta uma forma expecifica em vermelho
const destacaForma = (refer: number) => {
  console.log("arrar formas antes ",formas.value)
  let formaTot: Forma[] = formas.value.map(x => Object.assign({}, x));
  for(let value of formaTot){
    if(value.referencia == refer){
      value.cor = "#fc0703"
    }
  }
  desenhaPerm(formaTot)
  console.log("arrar formas depois ",formas.value)
}

//desenha uma forma expecifica, ou todas as formas
const desenhaForma = (refer:number) => {
  if(refer){
    let formaTot: Forma[] = formas.value.filter(e => e.referencia == refer)
    desenhaPerm(formaTot)
  }
  else{
    desenhaPerm(formas.value)
  }
}

const converteOrigin = (valor: number[]) => {
  let ftX = dados.width/dados.widthRes
  let ftY = dados.height/dados.heightRes
  return [Math.round(valor[0] * ftX), Math.round(valor[1] * ftY)];
}

const converteResize = (valor: number[]) => {
  let ftX = dados.width/dados.widthRes
  let ftY = dados.height/dados.heightRes
  return [Math.round(valor[0] / ftX), Math.round(valor[1] / ftY)];
}

const formaToDado = (forma: Forma[]) =>{
  let dadosEx: FormaDado[] = new Array()
  let referencias = forma.map(x => x.referencia).filter(function(elem, index, self) {
    return index === self.indexOf(elem);
  })
  console.log("lista formas ",forma)
  console.log("lista referencia unica ",referencias)

  for( let value of referencias){
    let form = forma.filter(e => e.referencia == value)
    console.log("lista forma especifica ",form)

    let dado: FormaDado = {tipo: form[0].tipo, cor: form[0].cor, coordenadas: []}

    for (let values of form){
      dado.coordenadas.push(converteOrigin(values.inicio))
    }
    dadosEx.push(dado)
  }

  return dadosEx
}

const dadoToForma = (dado: FormaDado[]) => {
  let formaEX: Forma[] = new Array()
  let ref = formaCont+1
  for(let value of dado){
    for(let i = 1; i < value.coordenadas.length; i++ ){
      let forma: Forma = {tipo: value.tipo, cor:value.cor, inicio: converteResize(value.coordenadas[i-1]), fim: converteResize(value.coordenadas[i]),referencia: ref}
      formaEX.push(forma)
    }
    ref++
  }

  return formaEX
}


defineExpose({
  inicia,
  importaFormas,
  exportaFormas,
  deletaForma,
  configuraCanvas,
  destacaForma,
  desenhaForma,
})

const emit = defineEmits([
  "formas"
])
</script>