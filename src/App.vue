<template>
  <div class="g-app">
    <router-view />

    <div class="debug"></div>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import { Engine } from '@/engine'

export default ({

  provide() {
    return {
      renderer: this.engine.renderer,
      camera: this.engine.camera,
      input: this.engine.input,
      world: this.engine.world,
      navMesh: this.engine.navMesh,
      network: this.engine.network,
    }
  },

  data: () => ({
    engine: markRaw(new Engine()),
    isLoading: true
  }),

  mounted () {
    this.init()
  },

  beforeUnmount () {
    this.engine.destroy()
  },

  methods: {
    async init() {
      await this.engine.init(this.$el)

      this.isLoading = false
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
    touch-action: none;
    & > .g-dialogue {
      position: absolute;
      bottom: 0;
      left: 0;
    }
    & > .debug {
      position: absolute;
      bottom: 20px;
      left: 20px;
      padding: 20px;
      background: black;
      color: white;
      font-size: 14px;
      overflow: auto;
      line-height: 200%;
    }
  }
}
</style>
