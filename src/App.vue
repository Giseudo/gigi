<template>
  <div class="g-app">
    <router-view  v-if="!state.isLoading" />

    <div class="viewport" ref="viewport">
      <g-touch-axis @move="onTouchChange" />
    </div>
  </div>
</template>

<script>
import GEngine from '@GEngine'
import { GTouchAxis } from '@UI'
import { defineComponent, markRaw, reactive } from 'vue'
import { publish } from '@GMessenger'
import { START, RESIZE } from '@GEvents'
import { PRIMARY_AXIS } from '@GInput'

export default defineComponent({
  components: { GTouchAxis },

  provide () {
    this.engine = new GEngine()

    return {
      resources: this.engine.resources,
      renderer: this.engine.renderer,
      camera: this.engine.camera,
      input: this.engine.input,
      scene: this.engine.scene,
      navMesh: this.engine.navMesh,
      world: this.engine.world,
      entityFactory: this.engine.world.entityFactory
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
    this.engine.destroy()
    window.removeEventListener('resize', this.onResize)
  },

  methods: {
    async init () {
      await this.engine.init(this.$refs.viewport)

      this.state.isLoading = false

      publish(START)
    },

    onResize () {
      const width = window.innerWidth
      const height = window.innerHeight

      publish(RESIZE, { width, height })
    },

    onTouchChange (direction) {
      this.input.setAxis(PRIMARY_AXIS, direction)
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

body, html, #app { height: 100%; }

.g-app {
  position: relative;
  height: 100%;
  overflow: hidden;
  & > .viewport {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    touch-action: none;
  }
}
</style>
