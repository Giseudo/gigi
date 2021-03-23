<template>
  <div class="g-app">
    <router-view  v-if="!isLoading" />
    <div ref="viewport" class="viewport" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import renderer from '@/engine/renderer'
import input from '@/engine/input'
import camera from '@/engine/camera'
import scene from '@/engine/scene'
import * as types from '@/engine/types'


export default defineComponent({
  provide () {
    return { renderer, input, camera, scene }
  },

  data: () => ({
    isLoading: true,
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
      renderer.init(this.$refs.viewport)
      input.init()

      this.isLoading = false
      window.addEventListener('resize', this.onResize)
    },

    onResize () {
      camera.mainCamera.aspect = window.innerWidth / window.innerHeight
      camera.mainCamera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
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
