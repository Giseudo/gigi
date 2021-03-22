<template>
  <div class="g-app">
    <router-view  v-if="!isLoading" />
    <div ref="viewport" class="viewport" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Vector3 } from 'three'
import viewport from './viewport'

export default defineComponent({
  provide () {
    return { viewport }
  },

  data: () => ({
    isLoading: true,
  }),

  mounted () {
    this.init()
  },

  methods: {
    init () {
      viewport.init({ el: this.$refs.viewport })
      viewport.animate(this.update, this.draw)
      viewport.moveCamera(Vector3.Forward, 20)

      this.isLoading = false
    },

    update (deltaTime) {
      this.$emit('update', deltaTime)
    },

    draw () {
      this.$emit('draw')
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
