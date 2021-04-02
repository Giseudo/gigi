<template>
  <div class="g-home" />
</template>

<script>
import { defineComponent, markRaw } from 'vue'
import { Vector3 } from 'three'
import { BLOOM_LAYER } from '@GScene/layers'

import vertexShader from '@UI/GBox/box.vert.glsl'
import fragmentShader from '@UI/GBox/box.frag.glsl'

export default defineComponent({
  name: 'Home',

  inject: ['camera', 'entityFactory'],

  data: () => markRaw({
    protagonist: null,
    warning: null,
    ground: null,
  }),

  async mounted () {
    this.ground = await this.entityFactory.create('Environment')

    this.warning = await this.entityFactory.create('Warning', {
      position: new Vector3(-2, 3.8, -2),
      radius: 10
    })

    this.protagonist = await this.entityFactory.create('Protagonist', {
      position: new Vector3(0, 2, 10),
      radius: 2,
      height: 2,
      orientation: this.camera.mainCamera
    })

    const transform = this.protagonist.getOne('Transform')

    this.camera.mainCamera.position.set(0, 15, 30)
    this.camera.mainCamera.lookAt(transform.position)
    this.camera.follow(transform)
  },

  beforeUnmount () {
    this.ground.destroy()
    this.warning.destroy()
    this.protagonist.destroy()
  },
})
</script>
