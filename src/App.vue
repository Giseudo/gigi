<template>
  <div class="g-app">
    <div class="viewport" ref="viewport">
      <router-view  v-if="!state.isLoading" />
      <g-touch-axis @move="onTouchChange" />
      <g-dialogue v-if="state.showDialogue" />
    </div>
  </div>
</template>

<script lang="ts">
import { Engine, publish, START, RESIZE, PRIMARY_AXIS } from '@/engine'
import { GTouchAxis, GDialogue } from '@/ui'
import { defineComponent, markRaw, reactive } from 'vue'

export default defineComponent({
  components: {
    GTouchAxis,
    GDialogue
  },

  setup () {
    return {
      engine: new Engine()
    }
  },

  provide () {
    return {
      renderer: this.engine.renderer,
      camera: this.engine.camera,
      input: this.engine.input,
      world: this.engine.world,
      navMesh: this.engine.navMesh,
    }
  },

  data: () => markRaw({
    engine: Engine,
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
      await this.engine.init(this.$refs.viewport as HTMLElement)

      this.state.isLoading = false

      publish(START)
    },

    onResize () {
      const width = window.innerWidth
      const height = window.innerHeight

      publish(RESIZE, { width, height })
    },

    onTouchChange (direction: any) {
      this.engine.input.setAxis(PRIMARY_AXIS, direction)
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

body, html, #app {
  height: 100%;
  font-family: 'PressStart2P';
}

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
    & > .g-dialogue {
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
}
</style>
