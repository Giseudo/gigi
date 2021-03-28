<template>
  <div class="g-app">

    <router-view  v-if="!state.isLoading" />

    <div class="viewport" ref="viewport">
      <g-touch-axis @move="onTouchChange" />
    </div>
  </div>
</template>

<script>
import { defineComponent, markRaw, reactive } from 'vue'
import { publish } from '@Messenger'
import { START, RESIZE } from '@Events'
import { PRIMARY_AXIS } from '@Engine/input'
import GRenderer from '@Engine/renderer'
import GCamera from '@Engine/camera'
import GInput from '@Engine/input'
import GScene from '@Engine/scene'
import GResources from '@Engine/resources'
import GNavMesh from '@Engine/nav-mesh'
import GTouchAxis from '@/components/GTouchAxis'

export default defineComponent({
  components: { GTouchAxis },

  provide () {
    this.resources = new GResources()
    this.camera = new GCamera()
    this.scene = new GScene()
    this.renderer = new GRenderer(this.scene, this.camera.mainCamera)
    this.navMesh = new GNavMesh()
    this.input = new GInput()

    return {
      resources: this.resources,
      renderer: this.renderer,
      camera: this.camera,
      input: this.input,
      scene: this.scene,
      navMesh: this.navMesh
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
    async init () {
      this.renderer.init(this.$refs.viewport)
      this.camera.init()
      this.input.init()

      const navMeshGeometry = await this.resources.loadObject(require('@/assets/NavMesh.fbx').default)
      this.navMesh.init(navMeshGeometry)

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
