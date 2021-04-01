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
import { World } from 'ape-ecs'
import { START, RESIZE } from '@Events'
import { PRIMARY_AXIS } from '@Input'

import GTouchAxis from '@/components/GTouchAxis'
import GRenderer from '@Renderer'
import GCamera from '@Camera'
import GInput from '@Input'
import GScene from '@Scene'
import GResources from '@Resources'
import GNavMesh from '@NavMesh'

import Transform from '@/components/Transform'
import Body from '@/components/Body'
import InputReader from '@/components/InputReader'
import MeshRenderer from '@/components/MeshRenderer'

import Movable from '@/systems/Movable'
import Controllable from '@/systems/Controllable'
import Drawable from '@/systems/Drawable'

export default defineComponent({
  components: { GTouchAxis },

  provide () {
    this.resources = new GResources()
    this.camera = new GCamera()
    this.scene = new GScene(this.camera)
    this.world = new World()
    this.renderer = new GRenderer(this.scene, this.camera.mainCamera, this.world)
    this.navMesh = new GNavMesh()
    this.input = new GInput()

    this.world.registerComponent(Transform)
    this.world.registerComponent(Body)
    this.world.registerComponent(InputReader)
    this.world.registerComponent(MeshRenderer)

    this.world.registerSystem('update', Movable)
    this.world.registerSystem('update', Controllable, [ this.camera ])
    this.world.registerSystem('draw', Drawable, [ this.scene ])

    return {
      resources: this.resources,
      renderer: this.renderer,
      camera: this.camera,
      input: this.input,
      scene: this.scene,
      navMesh: this.navMesh,
      world: this.world
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
    this.navMesh.destroy()

    window.removeEventListener('resize', this.onResize)
  },

  methods: {
    async init () {
      this.renderer.init(this.$refs.viewport)
      this.camera.init()
      this.input.init()
      this.navMesh.init(
        await this.resources.loadObject(require('@/assets/NavMesh.fbx').default)
      )

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
