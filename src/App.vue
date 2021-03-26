<template>
  <div class="g-app">
    <router-view  v-if="!isLoading" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import GRenderer from '@/engine/renderer'
import GCamera from '@/engine/camera'
import input from '@/engine/input'
import scene from '@/engine/scene'
import * as types from '@/engine/types'


export default defineComponent({
  provide () {
    this.viewport = document.createElement('div')
    this.camera = new GCamera()
    this.renderer = new GRenderer(this.viewport, scene, this.camera.mainCamera)

    return {
      renderer: this.renderer,
      camera: this.camera,
      input,
      scene
    }
  },

  data: () => ({
    isLoading: true,
    viewport: null,
    renderer: null,
    camera: null,
  }),

  mounted () {
    this.init()
  },

  beforeUnmount () {
    input.destroy()
      window.removeEventListener('resize', this.onResize)
  },

  methods: {
    init () {
      this.$el.appendChild(this.viewport)
      input.init()

      this.isLoading = false
      window.addEventListener('resize', this.onResize)
    },

    onResize () {
      camera.mainCamera.aspect = window.innerWidth / window.innerHeight
      camera.mainCamera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
  }
})
</script>

<style lang="scss">
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.g-app {
  & > .viewport {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
</style>
