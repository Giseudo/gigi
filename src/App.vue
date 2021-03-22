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
  },

  methods: {
    init () {
      renderer.init(this.$refs.viewport)
      input.init()

      this.isLoading = false
    }
  }
})
</script>

<style lang="scss">
body,
html {
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
