<template>
  <div class="g-app">
    <router-view  v-if="!state.isLoading" />
    <div class="viewport" ref="viewport" />
  </div>
</template>

<script>
import { defineComponent, markRaw, reactive } from 'vue'
import { publish } from '@Messenger'
import { START, RESIZE } from '@Events'
import GRenderer from '@Engine/renderer'
import GCamera from '@Engine/camera'
import GInput from '@Engine/input'
import GScene from '@Engine/scene'

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
      scene: this.scene,
    }
  },

  data: () => markRaw({
    state: reactive({
      isLoading: true,
    })
  }),

  mounted () {
    this.init()
    window.addEventListener('resize', this.onResize)
  },

  beforeUnmount () {
    this.renderer.destroy()
    this.camera.destroy()
    this.input.destroy()

    window.removeEventListener('resize', this.onResize)
  },

  methods: {
    init () {
      this.renderer.init(this.$refs.viewport)
      this.camera.init()
      this.input.init()

      this.state.isLoading = false

      publish(START)
    },

    onResize () {
      const width = window.innerWidth
      const height = window.innerHeight

      publish(RESIZE, { width, height })
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
