<template>
  <div class="g-app">
    <router-view  v-if="!state.isLoading" />
    <div ref="viewport" />
  </div>
</template>

<script>
import { defineComponent, markRaw, reactive } from 'vue'
import GRenderer from '@/engine/renderer'
import GCamera from '@/engine/camera'
import GInput from '@/engine/input'
import GScene from '@/engine/scene'
import * as types from '@/engine/types'

export default defineComponent({
  provide () {
    this.camera = new GCamera()
    this.scene = new GScene()
    this.renderer = new GRenderer(this.scene, this.camera.mainCamera)
    this.input = new GInput()

    return {
      renderer: this.renderer,
      camera: this.camera,
      input: this.input,
      scene: this.scene
    }
  },

  data: () => markRaw({
    state: reactive({
      isLoading: true,
    }),
    renderer: null,
    camera: null,
  }),

  mounted () {
    this.init()
  },

  beforeUnmount () {
    this.renderer.destroy()
    this.input.destroy()

    window.removeEventListener('resize', this.onResize)
  },

  methods: {
    init () {
      this.renderer.init(this.$refs.viewport)
      this.input.init()

      this.state.isLoading = false

      window.addEventListener('resize', this.onResize)
    },

    onResize () {
      const { mainCamera } = this.camera

      mainCamera.aspect = window.innerWidth / window.innerHeight
      mainCamera.updateProjectionMatrix()

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
