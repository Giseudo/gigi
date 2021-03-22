<template>
  <div class="g-app">
    <router-view  v-if="!isLoading" />
    <div ref="viewport" class="viewport" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Vector3 } from 'three'
import viewport from '@/viewport'
import input from '@/viewport/input'
import * as types from '@/viewport/types'

export default defineComponent({
  provide () {
    return { viewport, input }
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
      viewport.init({ el: this.$refs.viewport })
      input.init()

      viewport.subscribe(types.UPDATE, this.onUpdate)
      viewport.subscribe(types.DRAW, this.onDraw)

      this.isLoading = false
    },

    onUpdate (_, deltaTime) { },
    onDraw () { }
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
