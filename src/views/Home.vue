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
    objects: []
  }),

  async mounted () {
    const protagonist = await this.entityFactory.create('Protagonist', {
      position: new Vector3(0, 2, 10),
      radius: 2,
      height: 2,
      orientation: this.camera.mainCamera
    })

    this.objects.push(protagonist)

    const transform = protagonist.getOne('Transform')

    this.camera.mainCamera.position.set(0, 15, 30)
    this.camera.mainCamera.lookAt(transform.position)
    this.camera.follow(transform)

    this.objects.push(await this.entityFactory.create('Environment'))

    this.objects.push(
      await this.entityFactory.create('Warning', {
        position: new Vector3(-2, 6, -2),
        radius: 8,
        height: 5
      })
    )

    this.objects.push(
      await this.entityFactory.create('Line', {
        origin: transform.position,
        end: new Vector3(0, 2, -50).add(transform.position)
      })
    )
  },

  beforeUnmount () {
    this.objects.forEach(obj => obj.destroy())
  },
})
</script>
