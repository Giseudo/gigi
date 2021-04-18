<template>
  <div class="g-app">
    <router-view  v-if="!isLoading" />
    <g-touch-axis @move="onTouchChange" />
    <g-dialogue v-if="showDialogue" />
  </div>
</template>

<script lang="ts">
import { Engine, publish, START, RESIZE, PRIMARY_AXIS } from '@/engine'
import { GTouchAxis, GDialogue } from '@/ui'
import { defineComponent, markRaw, reactive } from 'vue'

export default defineComponent({
  components: { GTouchAxis, GDialogue },

  setup: () => ({
    engine: new Engine()
  }),

  provide() {
    return {
      renderer: this.engine.renderer,
      camera: this.engine.camera,
      input: this.engine.input,
      world: this.engine.world,
      navMesh: this.engine.navMesh,
    }
  },

  data: () => ({
    engine: Engine,
    isLoading: true,
    showDialogue: false
  }),

  mounted() {
    this.init()
  },

  beforeUnmount() {
    this.destroy()
  },

  methods: {
    async init() {
      await this.engine.init(this.$el)

      this.isLoading = false
    },

    destroy() {
      this.engine.destroy()
    },

    onTouchChange(direction: any) {
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
</style>
