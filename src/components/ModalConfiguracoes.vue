<template>
  <div class="fixed right-0 left-0 top-0 z-50 justify-center items-center">
    <div class="relative px-4 w-full max-w-2xl h-full md:h-auto">
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700 border-black border-4">
        <div class="flex justify-center items-start p-5 rounded-t">
          <h3 class="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">
            drawConfigs
          </h3>
        </div>

        <!-- SEGMENTATION CONFIGURATIONS -->
        <div class="p-6 space-y-6" v-if="segmentationStatus">
          <div class="relative bg-transparent pt-1">
            <label for="rangeCircleRadius" class="form-label">circleRadiusConfig}</label>
            <input type="range" min="3" max="20" style="background-color: #4aa9b6" v-model="props.configuracao.value?.raioCirculo" class="
                form-range
                appearance-none
                w-full
                h-1
                p-0
                rounded-xl
                focus:outline-none focus:ring-0 focus:shadow-none
              " id="rangeCircleRadius" />
            <p>{{ props.configuracao.value?.raioCirculo }}</p>
          </div>
        </div>

        <!-- CIRCLE RADIUS TRANSPARENCY -->
        <div class="p-6 space-y-6" v-if="segmentationStatus">
          <div class="relative bg-transparent pt-1">
            <label for="alphaCircleRadius" class="form-label">circleRadiusTransparency</label>
            <input type="range" min="0.05" step="0.01" max="1" style="background-color: #4aa9b6"
              v-model="props.configuracao.value?.alphaCirculo" class="
                form-range
                appearance-none
                w-full
                h-1
                p-0
                rounded-xl
                focus:outline-none focus:ring-0 focus:shadow-none
              " id="alphaCircleRadius" />
            <p>{{ props.configuracao.value?.alphaCirculo }}</p>
          </div>
        </div>

        <!-- LINE TRANSPARENCY -->
        <div class="p-6 space-y-6">
          <div class="relative bg-transparent pt-1">
            <label for="alphaCircleRadius" class="form-label">lineWidthTransparency</label>
            <input type="range" min="0.05" step="0.01" max="1" style="background-color: #4aa9b6"
              v-model="props.configuracao.value?.alphaLinha" class="
                form-range
                appearance-none
                w-full
                h-1
                p-0
                rounded-xl
                focus:outline-none focus:ring-0 focus:shadow-none
              " id="alphaCircleRadius" />
            <p>{{ props.configuracao.value?.alphaLinha }}</p>
          </div>
        </div>

        <!-- LINE WIDTH (FOR VALIDATION AND SEGMENTATION PHASES) -->
        <div class="p-6 space-y-6">
          <div class="relative bg-transparent pt-1">
            <label for="rangeLineWidth" class="form-label">lineWidthConfig</label>
            <input type="range" min="0" max="20" style="background-color: #4aa9b6" v-model="props.configuracao.value?.grossura" class="
                form-range
                appearance-none
                w-full
                h-1
                p-0
                rounded-xl
                focus:outline-none focus:ring-0 focus:shadow-none
              " id="rangeLineWidth" />
            <p>{{ props.configuracao.value?.grossura }}</p>
          </div>
        </div>

        <!-- SHADOW BLUR (FOR VALIDATION AND SEGMENTATION PHASES) -->
        <div class="p-6 space-y-6">
          <div class="relative bg-transparent pt-1">
            <label for="rangeShadowBlur" class="form-label"> shadowBlurConfig</label>
            <input type="range" min="0" max="30" style="background-color: #4aa9b6" v-model="props.configuracao.value?.sombra" class="
                form-range
                appearance-none
                w-full
                h-1
                p-0
                rounded-xl
                focus:outline-none focus:ring-0 focus:shadow-none
              " id="rangeShadowBlur" />
            <p>{{ props.configuracao.value?.sombra }}</p>
          </div>
        </div>

        <div class="flex justify-center items-center p-6 space-x-2">
          <button @click="sendConfigs" class="
              text-white
              bg-blue-700
              hover:bg-blue-800
              focus:ring-4 focus:ring-blue-300
              font-medium
              rounded-lg
              text-sm
              px-5
              py-2.5
              text-center
              w-40
              dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800
            ">
            SALVAR
          </button>
          <button @click="$emit('close')" class="
              text-white
              bg-blue-700
              hover:bg-blue-800
              focus:ring-4 focus:ring-blue-300
              font-medium
              w-40
              rounded-lg
              text-sm
              px-5
              py-2.5
              text-center
              dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800
            ">
            CANVELAR
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {Configuracao} from "../type/CanvasType";

const emit = defineEmits([
  "drawConfigs",
  "close"
])

const props = defineProps({
  configuracao:{
    type: ref<Configuracao>,
    default: {tipo:"linha",cor:"#000000",grossura:3,corSombra:"",sombra:10,raioCirculo:5,alphaCirculo:1,alphaLinha:1,habilitaConf:true,habilitaZoom: true,exibeID:true}
  },
  segmentationStatus:{
    type:Boolean,
    default: false,
  }
})
const sendConfigs = () =>{
  emit("drawConfigs",props.configuracao)
  emit("close")
}

</script>
